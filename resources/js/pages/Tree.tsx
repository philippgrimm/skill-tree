import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import ReactConfetti from 'react-confetti';

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

  // State for confetti
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  // State to track expanded/collapsed branches
  const [expandedBranches, setExpandedBranches] = useState<Record<number, boolean>>(() => {
    // Initialize all branches as expanded
    const expanded: Record<number, boolean> = {};
    const setBranchExpanded = (branch: Branch) => {
      expanded[branch.id] = true;
      branch.children?.forEach(setBranchExpanded);
    };
    branches.forEach(setBranchExpanded);
    return expanded;
  });

  // Toggle branch expansion
  const toggleBranch = (branchId: number) => {
    setExpandedBranches(prev => ({
      ...prev,
      [branchId]: !prev[branchId]
    }));
  };

  // Check if all leaves in a branch are completed
  const areAllLeavesCompleted = (branch: Branch, state: Record<number, boolean> = completed): boolean => {
    const branchLeaves = branch.leaves || [];
    const allLeavesCompleted = branchLeaves.every(leaf => state[leaf.id]);

    // Check child branches recursively
    const allChildrenCompleted = (branch.children || []).every(child => areAllLeavesCompleted(child, state));

    return allLeavesCompleted && allChildrenCompleted;
  };

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

        // Check if this completion completed all leaves in the branch
        const branch = findBranchContainingLeaf(leaf.id, branches);
        console.log('Debug confetti:', {
          branchFound: !!branch,
          branchName: branch?.name,
          allLeavesCompleted: branch ? areAllLeavesCompleted(branch, newCompletedMap) : false,
          leafWasCompleted: newCompletedMap[leaf.id],
          leafId: leaf.id,
          currentCompleted: completed[leaf.id],
          newCompletedMap: newCompletedMap[leaf.id]
        });

        if (branch && areAllLeavesCompleted(branch, newCompletedMap) && newCompletedMap[leaf.id]) {
          console.log('Triggering confetti!');
          setShowConfetti(true);
          setConfettiKey(prev => prev + 1);
          // Hide confetti after 5 seconds
          setTimeout(() => setShowConfetti(false), 5000);
        }
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

      // Check if this completion completed all leaves in the branch
      const branch = findBranchContainingLeaf(leaf.id, branches);
      console.log('Debug confetti (local):', {
        branchFound: !!branch,
        branchName: branch?.name,
        allLeavesCompleted: branch ? areAllLeavesCompleted(branch, newCompleted) : false,
        leafWasCompleted: newCompleted[leaf.id],
        leafId: leaf.id,
        currentCompleted: completed[leaf.id],
        newCompleted: newCompleted[leaf.id]
      });

      if (branch && areAllLeavesCompleted(branch, newCompleted) && newCompleted[leaf.id]) {
        console.log('Triggering confetti!');
        setShowConfetti(true);
        setConfettiKey(prev => prev + 1);
        // Hide confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  };

  // Helper function to find a branch containing a specific leaf
  const findBranchContainingLeaf = (leafId: number, branches: Branch[]): Branch | null => {
    for (const branch of branches) {
      if (branch.leaves?.some(leaf => leaf.id === leafId)) {
        return branch;
      }
      const found = findBranchContainingLeaf(leafId, branch.children || []);
      if (found) return found;
    }
    return null;
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
    return previousLeaves.every(l => completed[l.id]) || completed[leaf.id];
  };

  // Render a branch with its leaves
  const renderBranch = (branch: Branch) => {
    const progress = getBranchProgress(branch);
    const leaves = branch.leaves || [];
    const children = branch.children || [];
    const isExpanded = expandedBranches[branch.id];
    const hasChildren = children.length > 0;
    const hasLeaves = leaves.length > 0;

    return (
      <div key={branch.id} className="relative mb-8">
        {/* Main vertical line that runs through the entire branch and its children */}
        <div
          className={`absolute left-3 top-0 w-px bg-gray-200 dark:bg-gray-700 transition-all duration-300 ${
            isExpanded ? 'h-full' : 'h-12'
          }`}
        />

        {/* Branch header */}
        <div className="relative flex items-start">
          {/* Branch node */}
          <div className="absolute left-3 top-6 w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 z-10 -translate-x-[3px] -translate-y-[3px]" />

          {/* Horizontal connector */}
          <div className="absolute left-3 top-[24.5px] w-4 h-px bg-gray-200 dark:bg-gray-700" />

          {/* Branch content */}
          <div className="ml-8 flex-grow pt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                {(hasChildren || hasLeaves) && (
                  <button
                    onClick={() => toggleBranch(branch.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  {branch.name}
                </h2>
              </div>
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

            {/* Leaves list */}
            {isExpanded && hasLeaves && (
              <div className="mt-4 space-y-1">
                {leaves.map((leaf) => renderLeaf(leaf, leaves))}
              </div>
            )}
          </div>
        </div>

        {/* Child branches */}
        {isExpanded && hasChildren && (
          <div className="mt-4 ml-6 space-y-8">
            {children.map((child, index) => (
              <div key={child.id} className="relative">
                {/* Horizontal connector to child */}
                <div className="absolute left-[-12px] top-6 w-6 h-px bg-gray-200 dark:bg-gray-700" />
                {/* Vertical line for last child */}
                {index === children.length - 1 && (
                  <div className="absolute left-[-12px] top-6 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
                )}
                {renderBranch(child)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render a leaf
  const renderLeaf = (leaf: Leaf, branchLeaves: Leaf[]) => {
    const isCompleted = !!completed[leaf.id];
    const canBeCompleted = canCompleteLeaf(leaf, branchLeaves);

    return (
      <div
        key={leaf.id}
        onClick={() => canBeCompleted || isCompleted ? toggleLeafCompletion(leaf, branchLeaves) : null}
        className={`
          group relative flex items-center py-2

        `}
      >
        {/* Node marker with horizontal connector */}
        <div className="relative flex items-center mr-3 cursor-pointer">
          {/* Horizontal connector for all leaves */}
          <div className="absolute left-[-18px] w-4 h-px bg-gray-200 dark:bg-gray-700 ${canBeCompleted ? 'cursor-pointer' : 'opacity-60'}" />
          <div className={`
            absolute left-[-22.5px] w-1.5 h-1.5 rounded-full transition-colors duration-200

            ${isCompleted
              ? 'bg-green-500 ring-2 ring-green-500/30 ring-offset-2 dark:ring-offset-gray-800'
              : canBeCompleted
                ? 'bg-blue-400'
                : 'bg-gray-300'
            }
          `} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center">
            <h3 className={`
              text-sm font-medium truncate transition-colors duration-200
              ${isCompleted
                ? 'text-green-600 dark:text-green-400'
                : 'text-gray-900 dark:text-white'
              }
            `}>
              {leaf.name}
              {isCompleted && (
                <span className="ml-1.5 text-green-500">✓</span>
              )}
            </h3>
          </div>
          <p className="text-sm text-gray-500 truncate">{leaf.content}</p>
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
        {showConfetti && (
          <ReactConfetti
            key={confettiKey}
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
            onConfettiComplete={() => setShowConfetti(false)}
            style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none' }}
          />
        )}
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Learning Path 🚉</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your progress through skill stations
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
            <div className="relative space-y-4">
              {branches.map((branch) => renderBranch(branch))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
