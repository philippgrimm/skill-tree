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
        // Get top-level branches with their children
        $branches = Branch::whereNull('branch_id')
            ->orderBy('name')
            ->with(['children' => function ($query) {
                $query->orderBy('name');
            }])
            ->get();

        // Add leaves to each branch
        foreach ($branches as $branch) {
            // Get direct leaves for this branch
            $branch->leaves = $branch->leafs()->orderBy('order')->get();

            // Get leaves for each child branch
            if ($branch->children && count($branch->children) > 0) {
                foreach ($branch->children as $childBranch) {
                    // Get leaves for the child branch
                    $childBranch->leaves = $childBranch->leafs()->orderBy('order')->get();
                }
            }
        }

        // Prepare the data in a format compatible with the frontend
        $formattedBranches = $branches->map(function ($branch) {
            $branchData = $branch->toArray();
            $branchData['leaves'] = $branch->leaves->toArray();

            if (isset($branchData['children']) && is_array($branchData['children'])) {
                foreach ($branchData['children'] as &$child) {
                    $childBranch = $branch->children->firstWhere('id', $child['id']);
                    $child['leaves'] = $childBranch->leaves->toArray();
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
