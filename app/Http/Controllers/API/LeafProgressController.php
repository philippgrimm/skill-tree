<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Leaf;
use App\Models\UserLeafProgress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeafProgressController extends Controller
{
    /**
     * Get the logged-in user's progress on all leaves.
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $progress = UserLeafProgress::where('user_id', $user->id)
            ->where('completed', true)
            ->pluck('leaf_id')
            ->toArray();

        return response()->json([
            'completed_leaves' => $progress,
        ]);
    }

    /**
     * Toggle the completion status of a leaf for the logged-in user.
     */
    public function toggle(Request $request, Leaf $leaf): JsonResponse
    {
        $user = Auth::user();

        // Check if the user can complete this leaf (all previous leaves must be completed)
        if ($request->has('validate_order') && $request->input('validate_order')) {
            $previousLeaves = Leaf::where('branch_id', $leaf->branch_id)
                ->where('order', '<', $leaf->order)
                ->pluck('id');

            // Check if all previous leaves are completed
            if ($previousLeaves->count() > 0) {
                $completedCount = UserLeafProgress::where('user_id', $user->id)
                    ->where('completed', true)
                    ->whereIn('leaf_id', $previousLeaves)
                    ->count();

                if ($completedCount < $previousLeaves->count()) {
                    return response()->json([
                        'error' => 'You must complete previous leaves first',
                    ], 422);
                }
            }
        }

        // Find or create progress record
        $progress = UserLeafProgress::firstOrNew([
            'user_id' => $user->id,
            'leaf_id' => $leaf->id,
        ]);

        // Toggle completion status
        $progress->completed = ! $progress->completed;

        // Set completion timestamp if completing
        if ($progress->completed) {
            $progress->completed_at = now();
        } else {
            $progress->completed_at = null;
        }

        $progress->save();

        // Get all completed leaves
        $completedLeaves = UserLeafProgress::where('user_id', $user->id)
            ->where('completed', true)
            ->pluck('leaf_id')
            ->toArray();

        return response()->json([
            'leaf_id' => $leaf->id,
            'completed' => $progress->completed,
            'completed_leaves' => $completedLeaves,
        ]);
    }

    /**
     * Reset progress for the logged-in user.
     */
    public function reset(): JsonResponse
    {
        $user = Auth::user();

        // Delete all progress records for this user
        UserLeafProgress::where('user_id', $user->id)->delete();

        return response()->json([
            'message' => 'Progress reset successfully',
            'completed_leaves' => [],
        ]);
    }
}
