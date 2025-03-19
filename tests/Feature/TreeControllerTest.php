<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Leaf;
use App\Models\User;
use App\Models\UserLeafProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TreeControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_tree_page_can_be_rendered()
    {
        $response = $this->get(route('tree'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert->component('Tree'));
    }

    public function test_tree_contains_branches_and_leaves()
    {
        // Create test branches and leaves
        $branch = Branch::factory()->create(['name' => 'Test Branch']);
        $leaf1 = Leaf::factory()->create([
            'branch_id' => $branch->id,
            'name' => 'Leaf 1',
            'order' => 1,
        ]);
        $leaf2 = Leaf::factory()->create([
            'branch_id' => $branch->id,
            'name' => 'Leaf 2',
            'order' => 2,
        ]);

        $response = $this->get(route('tree'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert
            ->component('Tree')
            ->has('branches', 1)
            ->where('branches.0.name', 'Test Branch')
            ->has('branches.0.leaves', 2)
            ->where('branches.0.leaves.0.name', 'Leaf 1')
            ->where('branches.0.leaves.1.name', 'Leaf 2')
        );
    }

    public function test_tree_shows_completed_leaves_for_authenticated_user()
    {
        // Create user, branch, leaf, and mark leaf as completed
        $user = User::factory()->create();
        $branch = Branch::factory()->create();
        $leaf = Leaf::factory()->create(['branch_id' => $branch->id]);

        UserLeafProgress::create([
            'user_id' => $user->id,
            'leaf_id' => $leaf->id,
            'completed' => true,
        ]);

        // Test as unauthenticated user first
        $response = $this->get(route('tree'));
        $response->assertInertia(fn ($assert) => $assert
            ->where('isAuthenticated', false)
            ->where('completedLeaves', [])
        );

        // Test as authenticated user
        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response = $this->get(route('tree'));
        $response->assertInertia(fn ($assert) => $assert
            ->where('isAuthenticated', true)
            ->where('completedLeaves', [$leaf->id])
        );
    }

    public function test_tree_displays_nested_branches()
    {
        // Create parent branch
        $parentBranch = Branch::factory()->create(['name' => 'Parent Branch']);

        // Create child branch
        $childBranch = Branch::factory()->create([
            'name' => 'Child Branch',
            'branch_id' => $parentBranch->id,
        ]);

        // Create leaves for both branches
        $parentLeaf = Leaf::factory()->create([
            'branch_id' => $parentBranch->id,
            'name' => 'Parent Leaf',
        ]);

        $childLeaf = Leaf::factory()->create([
            'branch_id' => $childBranch->id,
            'name' => 'Child Leaf',
        ]);

        $response = $this->get(route('tree'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($assert) => $assert
            ->component('Tree')
            ->has('branches', 1)
            ->where('branches.0.name', 'Parent Branch')
            ->has('branches.0.leaves', 1)
            ->where('branches.0.leaves.0.name', 'Parent Leaf')
            ->has('branches.0.children', 1)
            ->where('branches.0.children.0.name', 'Child Branch')
            ->has('branches.0.children.0.leaves', 1)
            ->where('branches.0.children.0.leaves.0.name', 'Child Leaf')
        );
    }
}
