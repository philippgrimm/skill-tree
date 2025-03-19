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

  // Render a leaf
  const renderLeaf = (leaf: Leaf, branchLeaves: Leaf[]) => {
    const isCompleted = !!completed[leaf.id];
    const canBeCompleted = canCompleteLeaf(leaf, branchLeaves);

    return (
      <div
        key={leaf.id}
        className={`
          p-3 my-2 rounded-lg border
          ${isCompleted ? 'bg-green-100 dark:bg-green-900 border-green-400' :
            canBeCompleted ? 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' :
            'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
          }
        `}
        onClick={() => canBeCompleted || isCompleted ? toggleLeafCompletion(leaf, branchLeaves) : null}
      >
        <div className="flex items-center">
          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
            {isCompleted && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-medium">{leaf.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{leaf.content}</p>
          </div>
        </div>
      </div>
    );
  };

  // Render a branch with its leaves
  const renderBranch = (branch: Branch, isChild = false) => {
    const progress = getBranchProgress(branch);

    // Ensure branch has leaves and children properties
    const leaves = branch.leaves || [];
    const children = branch.children || [];

    return (
      <div key={branch.id} className={`mb-8 ${isChild ? 'ml-8' : ''}`}>
        <div className="mb-2">
          <h2 className={`text-xl font-bold ${isChild ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
            {branch.name}
          </h2>
          {branch.description && (
            <p className="text-gray-600 dark:text-gray-400">{branch.description}</p>
          )}

          {/* Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {progress}% complete
          </div>
        </div>

        {/* Render branch leaves */}
        {leaves.length > 0 && (
          <div className="mb-4">
            {leaves.map(leaf => renderLeaf(leaf, leaves))}
          </div>
        )}

        {/* Render child branches */}
        {children.map(child => renderBranch(child, true))}
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
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Skill Tree 🌳</h1>
            <div className="space-x-4 flex items-center">
              {!isAuthenticated && (
                <div className="text-sm text-amber-600 dark:text-amber-400">
                  <span className="bg-amber-100 dark:bg-amber-900 p-1 rounded">
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
            <div className="space-y-6">
              {branches.map(branch => renderBranch(branch))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
