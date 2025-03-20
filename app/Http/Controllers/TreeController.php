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
    public function index(): \Inertia\Response
    {
        // Get top-level branches
        $branches = Branch::whereNull('branch_id')
            ->with(['leafs' => function ($query) {
                $query->orderBy('order');
            }, 'children.leafs' => function ($query) {
                $query->orderBy('order');
            }])
            ->orderBy('name')
            ->get();

        // Transform the branches into the expected format
        $formattedBranches = $branches->map(function ($branch) {
            $branchData = [
                'id' => $branch->id,
                'name' => $branch->name,
                'description' => $branch->description,
                'branch_id' => $branch->branch_id,
                'leaves' => $branch->leafs->toArray(),
                'children' => [],
            ];

            // Add child branches with their leaves
            foreach ($branch->children as $childBranch) {
                $branchData['children'][] = [
                    'id' => $childBranch->id,
                    'name' => $childBranch->name,
                    'description' => $childBranch->description,
                    'branch_id' => $childBranch->branch_id,
                    'leaves' => $childBranch->leafs->toArray(),
                    'children' => [], // Child branches don't have their own children in the frontend
                ];
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
