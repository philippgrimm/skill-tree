<?php

namespace App\Http\Controllers;

use App\Models\Leaf;
use App\Models\LeafProgress;
use Illuminate\Http\Request;

class LeafProgressController extends Controller
{
    public function toggle(Request $request, Leaf $leaf)
    {
        $validateOrder = $request->boolean('validate_order', false);

        if ($validateOrder) {
            // Get all leaves in the same branch with lower order
            $previousLeaves = Leaf::where('branch_id', $leaf->branch_id)
                ->where('order', '<', $leaf->order)
                ->get();

            // Check if all previous leaves are completed
            $allPreviousCompleted = $previousLeaves->every(function ($previousLeaf) {
                return LeafProgress::where('user_id', auth()->id())
                    ->where('leaf_id', $previousLeaf->id)
                    ->where('completed', true)
                    ->exists();
            });

            if (! $allPreviousCompleted && ! $this->isLeafCompleted($leaf)) {
                return response()->json([
                    'error' => 'You must complete previous leaves first',
                ], 422);
            }
        }

        // Toggle completion status
        $progress = LeafProgress::where('user_id', auth()->id())
            ->where('leaf_id', $leaf->id)
            ->first();

        if ($progress) {
            $progress->delete();
        } else {
            LeafProgress::create([
                'user_id' => auth()->id(),
                'leaf_id' => $leaf->id,
                'completed' => true,
                'completed_at' => now(),
            ]);
        }

        // Return updated list of completed leaves
        $completedLeaves = LeafProgress::where('user_id', auth()->id())
            ->where('completed', true)
            ->pluck('leaf_id')
            ->toArray();

        return response()->json([
            'completed_leaves' => $completedLeaves,
        ]);
    }

    public function reset()
    {
        LeafProgress::where('user_id', auth()->id())->delete();

        return response()->json([
            'message' => 'Progress reset successfully',
        ]);
    }

    private function isLeafCompleted(Leaf $leaf): bool
    {
        return LeafProgress::where('user_id', auth()->id())
            ->where('leaf_id', $leaf->id)
            ->where('completed', true)
            ->exists();
    }

    private function canCompleteLead(Leaf $leaf): bool
    {
        // Implementation of canCompleteLead method
        return true; // Placeholder return, actual implementation needed
    }

    private function getCompletedLeafIds()
    {
        return LeafProgress::where('user_id', auth()->id())
            ->where('completed', true)
            ->pluck('leaf_id')
            ->toArray();
    }
}
