<?php

namespace Tests\Unit\Models;

use App\Models\Branch;
use App\Models\Leaf;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BranchTest extends TestCase
{
    use RefreshDatabase;

    public function test_branch_has_correct_fillable_attributes()
    {
        $branch = new Branch;
        $this->assertEquals([
            'name',
            'description',
            'branch_id',
        ], $branch->getFillable());
    }

    public function test_branch_can_have_leaves()
    {
        // Create a branch
        $branch = Branch::factory()->create();

        // Create leaves for the branch
        $leaves = Leaf::factory()->count(3)->create([
            'branch_id' => $branch->id,
        ]);

        // Assert that the branch has the correct number of leaves
        $this->assertCount(3, $branch->leafs);

        // Assert that each leaf belongs to the branch
        foreach ($leaves as $leaf) {
            $this->assertTrue($branch->leafs->contains($leaf));
        }
    }

    public function test_branch_can_have_parent_branch()
    {
        // Create parent branch
        $parentBranch = Branch::factory()->create([
            'name' => 'Parent Branch',
        ]);

        // Create child branch with parent
        $childBranch = Branch::factory()->create([
            'name' => 'Child Branch',
            'branch_id' => $parentBranch->id,
        ]);

        // Assert that the child branch has the correct parent
        $this->assertEquals($parentBranch->id, $childBranch->parent->id);
        $this->assertEquals('Parent Branch', $childBranch->parent->name);
    }

    public function test_branch_can_have_children_branches()
    {
        // Create parent branch
        $parentBranch = Branch::factory()->create();

        // Create child branches
        $childBranches = Branch::factory()->count(2)->create([
            'branch_id' => $parentBranch->id,
        ]);

        // Assert that the parent branch has the correct number of children
        $this->assertCount(2, $parentBranch->children);

        // Assert that each child belongs to the parent
        foreach ($childBranches as $child) {
            $this->assertTrue($parentBranch->children->contains($child));
        }
    }
}
