<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BranchController extends Controller
{
    /**
     * Display a listing of the branches.
     *
     * @param  Request  $request  Can include 'parent_id' query param to filter by parent
     */
    public function index(Request $request): JsonResponse
    {
        $query = Branch::query()->orderBy('name');

        // If parent_id is provided, filter by that parent
        if ($request->has('parent_id')) {
            $query->where('branch_id', $request->input('parent_id'));
        } else {
            // By default, return only top-level branches (null parent)
            $query->whereNull('branch_id');
        }

        $branches = $query->get();

        return response()->json($branches);
    }

    /**
     * Store a newly created branch in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $branch = Branch::create($validated);

        return response()->json($branch, 201);
    }

    /**
     * Display the specified branch.
     */
    public function show(Branch $branch): JsonResponse
    {
        return response()->json($branch);
    }

    /**
     * Update the specified branch in storage.
     */
    public function update(Request $request, Branch $branch): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'branch_id' => 'nullable|exists:branches,id',
        ]);

        $branch->update($validated);

        return response()->json($branch);
    }

    /**
     * Remove the specified branch from storage.
     */
    public function destroy(Branch $branch): JsonResponse
    {
        // Delete all associated leaves
        $branch->leafs()->delete();

        // Delete the branch
        $branch->delete();

        return response()->json(null, 204);
    }
}
