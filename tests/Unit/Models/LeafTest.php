<?php

namespace Tests\Unit\Models;

use App\Models\Branch;
use App\Models\Leaf;
use App\Models\User;
use App\Models\UserLeafProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeafTest extends TestCase
{
    use RefreshDatabase;

    public function test_leaf_has_correct_fillable_attributes()
    {
        $leaf = new Leaf;
        $this->assertEquals([
            'name',
            'content',
            'order',
            'branch_id',
        ], $leaf->getFillable());
    }

    public function test_leaf_belongs_to_branch()
    {
        // Create a branch
        $branch = Branch::factory()->create([
            'name' => 'Test Branch',
        ]);

        // Create a leaf for the branch
        $leaf = Leaf::factory()->create([
            'branch_id' => $branch->id,
            'name' => 'Test Leaf',
        ]);

        // Assert that the leaf belongs to the branch
        $this->assertEquals($branch->id, $leaf->branch->id);
        $this->assertEquals('Test Branch', $leaf->branch->name);
    }

    public function test_leaf_can_have_user_progress()
    {
        // Create a leaf
        $leaf = Leaf::factory()->create();

        // Create a user
        $user = User::factory()->create();

        // Create progress for the user and leaf
        UserLeafProgress::create([
            'user_id' => $user->id,
            'leaf_id' => $leaf->id,
            'completed' => true,
        ]);

        // Check if the leaf has user progress
        $progress = UserLeafProgress::where('leaf_id', $leaf->id)->first();
        $this->assertNotNull($progress);
        $this->assertEquals($user->id, $progress->user_id);
        $this->assertTrue($progress->completed);
    }

    public function test_leaf_ordering_works_correctly()
    {
        // Create a branch
        $branch = Branch::factory()->create();

        // Create leaves with different orders
        $leaf3 = Leaf::factory()->create([
            'branch_id' => $branch->id,
            'order' => 3,
            'name' => 'Leaf 3',
        ]);

        $leaf1 = Leaf::factory()->create([
            'branch_id' => $branch->id,
            'order' => 1,
            'name' => 'Leaf 1',
        ]);

        $leaf2 = Leaf::factory()->create([
            'branch_id' => $branch->id,
            'order' => 2,
            'name' => 'Leaf 2',
        ]);

        // Get leaves ordered by 'order'
        $orderedLeaves = Leaf::where('branch_id', $branch->id)
            ->orderBy('order')
            ->get();

        // Assert that leaves are returned in the correct order
        $this->assertEquals('Leaf 1', $orderedLeaves[0]->name);
        $this->assertEquals('Leaf 2', $orderedLeaves[1]->name);
        $this->assertEquals('Leaf 3', $orderedLeaves[2]->name);
    }
}
