import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

// Setup axios with CSRF token
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    axios.defaults.headers.common['X-CSRF-TOKEN'] = token.getAttribute('content');
}

// Types
interface Leaf {
  id: number;
  name: string;
  content: string;
  order: number;
  branch_id: number;
  completed?: boolean; // For tracking progress
}

interface Branch {
  id: number;
  name: string;
  description: string | null;
  branch_id: number | null;
  children: Branch[];
  leaves: Leaf[];
}

interface TreeProps {
  branches: Branch[];
  completedLeaves: number[]; // IDs of leaves completed by the authenticated user
  isAuthenticated: boolean;
}

/**
 * Tree View Component
 *
 * A standalone page for displaying the skill tree and tracking user progress.
 */
export default function Tree({ branches, completedLeaves, isAuthenticated }: TreeProps) {
  // State to track completed leaves
  const [completed, setCompleted] = useState<Record<number, boolean>>(() => {
    // If authenticated, use server-provided completedLeaves
    if (isAuthenticated) {
      const completedMap: Record<number, boolean> = {};
      completedLeaves.forEach(leafId => {
        completedMap[leafId] = true;
      });
      return completedMap;
    }

    // If not authenticated, use localStorage
    return JSON.parse(localStorage.getItem('skillTreeProgress') || '{}');
  });

  // Toggle leaf completion status
  const toggleLeafCompletion = async (leaf: Leaf, branchLeaves: Leaf[]) => {
    if (isAuthenticated) {
      try {
        // Check if leaf can be completed (all previous leaves with lower order must be completed)
        const canBeCompleted = canCompleteLeaf(leaf, branchLeaves);
        if (!canBeCompleted && !completed[leaf.id]) {
          alert('You need to complete previous leaves first');
          return;
        }

        // Call API to toggle completion
        const response = await axios.post(`/api/leaf-progress/${leaf.id}/toggle`, {
          validate_order: true
        });

        // Update state with the new completion data
        const newCompletedMap: Record<number, boolean> = {};
        response.data.completed_leaves.forEach((id: number) => {
          newCompletedMap[id] = true;
        });

        setCompleted(newCompletedMap);
      } catch (error) {
        console.error('Error toggling leaf completion:', error);
        if (axios.isAxiosError(error) && error.response?.status === 422) {
          alert(error.response.data.error || 'You need to complete previous leaves first');
        } else {
          alert('Failed to update progress. Please try again.');
        }
      }
    } else {
      // Use localStorage for non-authenticated users
      const newCompleted = {
        ...completed,
        [leaf.id]: !completed[leaf.id]
      };
      setCompleted(newCompleted);
      localStorage.setItem('skillTreeProgress', JSON.stringify(newCompleted));
    }
  };

  // Get completion percentage for a branch
  const getBranchProgress = (branch: Branch): number => {
    // Count all leaves in this branch and its children
    let totalLeaves = branch.leaves?.length || 0;
    let completedCount = branch.leaves?.filter(leaf => completed[leaf.id])?.length || 0;

    // Include leaves from child branches - safely handle potentially undefined children
    if (branch.children && Array.isArray(branch.children)) {
      branch.children.forEach(child => {
        if (child.leaves) {
          totalLeaves += child.leaves.length;
          completedCount += child.leaves.filter(leaf => completed[leaf.id]).length;
        }
      });
    }

    return totalLeaves > 0 ? Math.round((completedCount / totalLeaves) * 100) : 0;
  };

  // Check if a leaf can be completed (all previous leaves in order must be completed)
  const canCompleteLeaf = (leaf: Leaf, branchLeaves: Leaf[]): boolean => {
    // Find all leaves with lower order in the same branch
    const previousLeaves = branchLeaves.filter(l => l.order < leaf.order);

    // If all previous leaves are completed, this leaf can be completed
    return previousLeaves.every(l => completed[l.id]);
  };

  // Render a branch with its leaves
  const renderBranch = (branch: Branch, isChild = false, level = 0) => {
    const progress = getBranchProgress(branch);

    // Ensure branch has leaves and children properties
    const leaves = branch.leaves || [];
    const children = branch.children || [];

    return (
      <div key={branch.id} className="relative mb-6">
        {/* Branch header with connector */}
        <div className="relative flex items-start">
          {/* Vertical trunk line */}
          <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-gray-200 dark:bg-gray-700" />

          {/* Horizontal connector line */}
          <div className="absolute left-3 top-4 w-3 h-[1px] bg-gray-200 dark:bg-gray-700" />

          {/* Branch header - aligned with horizontal spacing */}
          <div className="ml-8 flex-grow">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                {branch.name}
              </h2>

              {/* Progress percentage badge */}
              <span className="text-sm text-gray-500">
                {progress}% complete
              </span>
            </div>

            {branch.description && (
              <p className="text-sm text-gray-500 mb-2">{branch.description}</p>
            )}

            {/* Progress bar */}
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-0.5 overflow-hidden">
              <div
                className={`h-0.5 transition-all duration-500 ${
                  progress === 100
                    ? 'bg-green-500'
                    : 'bg-blue-500'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Content container */}
        <div className="relative mt-4">
          {/* Render branch leaves */}
          {leaves.length > 0 && (
            <div className="space-y-2">
              {leaves.map((leaf) => renderLeaf(leaf, leaves))}
            </div>
          )}

          {/* Render child branches */}
          {children.length > 0 && (
            <div className="mt-6 space-y-6">
              {children.map((child) => (
                <div key={child.id}>
                  {renderBranch(child, true, level + 1)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render a leaf
  const renderLeaf = (leaf: Leaf, branchLeaves: Leaf[]) => {
    const isCompleted = !!completed[leaf.id];
    const canBeCompleted = canCompleteLeaf(leaf, branchLeaves);

    return (
      <div key={leaf.id} className="relative flex items-center group">
        {/* Horizontal connector line */}
        <div className="absolute left-3 top-1/2 w-3 h-[1px] bg-gray-200 dark:bg-gray-700" />

        {/* Leaf bullet/node */}
        <div className={`
          absolute left-[11px] top-1/2 -mt-[3px] z-10 w-1.5 h-1.5 rounded-full
          ${isCompleted
            ? 'bg-green-500'
            : canBeCompleted
              ? 'bg-blue-400'
              : 'bg-gray-300'
          }
        `}></div>

        {/* Leaf card */}
        <div
          className={`
            ml-8 py-2 px-3 rounded w-full transition-all duration-200
            ${isCompleted
              ? 'bg-green-50/50 dark:bg-green-900/10'
              : canBeCompleted
                ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer'
                : 'opacity-75'
            }
          `}
          onClick={() => canBeCompleted || isCompleted ? toggleLeafCompletion(leaf, branchLeaves) : null}
        >
          <div className="flex items-center">
            <div className="w-full">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {leaf.name}
                {isCompleted && (
                  <span className="ml-2 text-green-600 dark:text-green-400">✓</span>
                )}
              </h3>
              <p className="text-sm text-gray-500">{leaf.content}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Reset progress
  const resetProgress = async () => {
    if (!confirm('Are you sure you want to reset your progress?')) {
      return;
    }

    if (isAuthenticated) {
      try {
        // Call API to reset progress
        await axios.post('/api/leaf-progress/reset');
        setCompleted({});
      } catch (error) {
        console.error('Error resetting progress:', error);
        alert('Failed to reset progress. Please try again.');
      }
    } else {
      // Reset localStorage for non-authenticated users
      setCompleted({});
      localStorage.removeItem('skillTreeProgress');
    }
  };

  return (
    <>
      <Head title="Skill Tree" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Skill Tree 🌳</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your progress and see your learning path
              </p>
            </div>
            <div className="space-x-4 flex items-center">
              {!isAuthenticated && (
                <div className="text-sm text-amber-600 dark:text-amber-400">
                  <span className="bg-amber-100 dark:bg-amber-900 p-2 rounded">
                    ⚠️ Login to save your progress across devices
                  </span>
                </div>
              )}
              <button
                onClick={resetProgress}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Reset Progress
              </button>
            </div>
          </div>

          {branches.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600 dark:text-gray-400">No skills available yet. Check back later!</p>
            </div>
          ) : (
            <div className="space-y-12">
              {branches.map(branch => renderBranch(branch))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
