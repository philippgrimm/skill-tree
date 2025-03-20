<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\UserLeafProgress;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TreeController extends Controller
{
    /**
     * Display the tree page with all branches and leaves.
     */
    public function index()
    {
        // Get top-level branches
        $branches = Branch::whereNull('branch_id')
            ->orderBy('name')
            ->get();

        // Add leaves to each branch
        foreach ($branches as $branch) {
            // Get direct leaves for this branch
            $leaves = $branch->leafs()->orderBy('order')->get();
            $branch->setAttribute('leaves', $leaves);

            // Get child branches
            $childBranches = $branch->children()->orderBy('name')->get();
            $branch->setAttribute('children', $childBranches);

            // Set leaves for each child branch
            foreach ($childBranches as $childBranch) {
                // Get leaves for the child branch
                $childLeaves = $childBranch->leafs()->orderBy('order')->get();
                $childBranch->setAttribute('leaves', $childLeaves);
            }
        }

        // Prepare the data in a format compatible with the frontend
        $formattedBranches = $branches->map(function ($branch) {
            $branchData = $branch->toArray();

            // Ensure leaves are present in the data
            if (! isset($branchData['leaves'])) {
                $branchData['leaves'] = [];
            }

            if (isset($branchData['children']) && is_array($branchData['children'])) {
                foreach ($branchData['children'] as &$child) {
                    $childBranch = $branch->children()->where('id', $child['id'])->first();
                    if ($childBranch) {
                        // Get leaves array from the attribute we set earlier
                        $leaves = $childBranch->getAttribute('leaves');
                        $child['leaves'] = $leaves ? $leaves->toArray() : [];
                    } else {
                        $child['leaves'] = [];
                    }
                    $child['children'] = []; // Ensure child branches have empty children array
                }
            } else {
                $branchData['children'] = []; // Ensure branches have empty children array if none exist
            }

            return $branchData;
        });

        // Get user's completed leaves if authenticated
        $completedLeaves = [];
        $isAuthenticated = Auth::check();

        if ($isAuthenticated) {
            $user = Auth::user();
            $completedLeaves = UserLeafProgress::where('user_id', $user->id)
                ->where('completed', true)
                ->pluck('leaf_id')
                ->toArray();
        }

        return Inertia::render('Tree', [
            'branches' => $formattedBranches,
            'completedLeaves' => $completedLeaves,
            'isAuthenticated' => $isAuthenticated,
        ]);
    }
}
