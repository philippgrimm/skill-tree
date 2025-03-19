<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Leaf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LeafController extends Controller
{
    /**
     * Display a listing of the leaves for a branch.
     */
    public function index(Branch $branch): JsonResponse
    {
        $leaves = $branch->leafs()->orderBy('order')->get();

        return response()->json($leaves);
    }

    /**
     * Store a newly created leaf in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'nullable|string',
            'branch_id' => 'required|exists:branches,id',
        ]);

        // Set order to be the last in the sequence for this branch
        $lastOrder = Leaf::where('branch_id', $validated['branch_id'])->max('order') ?? 0;
        $validated['order'] = $lastOrder + 1;

        $leaf = Leaf::create($validated);

        return response()->json($leaf, 201);
    }

    /**
     * Display the specified leaf.
     */
    public function show(Leaf $leaf): JsonResponse
    {
        return response()->json($leaf);
    }

    /**
     * Update the specified leaf in storage.
     */
    public function update(Request $request, Leaf $leaf): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'content' => 'nullable|string',
            'branch_id' => 'required|exists:branches,id',
        ]);

        $leaf->update($validated);

        return response()->json($leaf);
    }

    /**
     * Remove the specified leaf from storage.
     */
    public function destroy(Leaf $leaf): JsonResponse
    {
        $leaf->delete();

        return response()->json(null, 204);
    }

    /**
     * Reorder leaves within a branch.
     */
    public function reorder(Request $request, Branch $branch): JsonResponse
    {
        $request->validate([
            'leafIds' => 'required|array',
            'leafIds.*' => 'required|exists:leaves,id',
        ]);

        $leafIds = $request->input('leafIds');

        // Begin transaction to ensure all updates are completed or none
        DB::beginTransaction();

        try {
            foreach ($leafIds as $index => $id) {
                Leaf::where('id', $id)->update(['order' => $index]);
            }

            DB::commit();

            return response()->json(['message' => 'Leaves reordered successfully']);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['message' => 'Failed to reorder leaves'], 500);
        }
    }
}
