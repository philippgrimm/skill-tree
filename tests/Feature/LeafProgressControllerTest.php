<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Leaf;
use App\Models\LeafProgress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeafProgressControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticateUser($user)
    {
        $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        return $this;
    }

    public function test_toggle_creates_leaf_progress_when_none_exists()
    {
        // Create a user
        $user = User::factory()->create();

        // Create a branch and leaf
        $branch = Branch::factory()->create();
        $leaf = Leaf::factory()->create([
            'branch_id' => $branch->id,
            'order' => 1,
        ]);

        // Act as the user and toggle leaf completion
        $this->authenticateUser($user);
        $response = $this->postJson("/api/leaf-progress/{$leaf->id}/toggle");

        // Check response
        $response->assertOk();
        $response->assertJsonStructure(['completed_leaves']);

        // Check database
        $this->assertDatabaseHas('user_leaf_progress', [
            'user_id' => $user->id,
            'leaf_id' => $leaf->id,
            'completed' => true,
        ]);
    }

    public function test_toggle_deletes_leaf_progress_when_already_exists()
    {
        // Create a user
        $user = User::factory()->create();

        // Create a branch and leaf
        $branch = Branch::factory()->create();
        $leaf = Leaf::factory()->create([
            'branch_id' => $branch->id,
        ]);

        // Create leaf progress
        LeafProgress::create([
            'user_id' => $user->id,
            'leaf_id' => $leaf->id,
            'completed' => true,
            'completed_at' => now(),
        ]);

        // Act as the user and toggle leaf completion
        $this->authenticateUser($user);
        $response = $this->postJson("/api/leaf-progress/{$leaf->id}/toggle");

        // Check response
        $response->assertOk();
        $response->assertJsonStructure(['completed_leaves']);

        // Get the completed leaves from the response
        $completedLeaves = $response->json('completed_leaves');

        // Assert that the leaf ID is not in the completed leaves
        $this->assertNotContains($leaf->id, $completedLeaves);
    }

    public function test_validate_order_prevents_completing_leaves_out_of_order()
    {
        // Create a user
        $user = User::factory()->create();

        // Create a branch
        $branch = Branch::factory()->create();

        // Create leaves in order
        $leaf1 = Leaf::factory()->create([
            'branch_id' => $branch->id,
            'order' => 1,
        ]);

        $leaf2 = Leaf::factory()->create([
            'branch_id' => $branch->id,
            'order' => 2,
        ]);

        // Try to complete leaf2 without completing leaf1 first
        $this->authenticateUser($user);
        $response = $this->postJson("/api/leaf-progress/{$leaf2->id}/toggle", [
            'validate_order' => true,
        ]);

        // Check response
        $response->assertStatus(422);
        $response->assertJson([
            'error' => 'You must complete previous leaves first',
        ]);

        // Now complete leaf1
        $response = $this->postJson("/api/leaf-progress/{$leaf1->id}/toggle");

        // Now we should be able to complete leaf2
        $response = $this->postJson("/api/leaf-progress/{$leaf2->id}/toggle", [
            'validate_order' => true,
        ]);

        $response->assertOk();
    }

    public function test_reset_progress_deletes_all_user_progress()
    {
        // Create a user
        $user = User::factory()->create();

        // Create some branches and leaves
        $branch = Branch::factory()->create();
        $leaves = Leaf::factory()->count(3)->create([
            'branch_id' => $branch->id,
        ]);

        // Complete all leaves
        foreach ($leaves as $leaf) {
            LeafProgress::create([
                'user_id' => $user->id,
                'leaf_id' => $leaf->id,
                'completed' => true,
                'completed_at' => now(),
            ]);
        }

        // Verify we have 3 completed leaves in the database
        $this->assertDatabaseCount('user_leaf_progress', 3);

        // Reset progress
        $this->authenticateUser($user);
        $response = $this->postJson('/api/leaf-progress/reset');

        // Check response
        $response->assertOk();
        $response->assertJson([
            'message' => 'Progress reset successfully',
        ]);

        // Check database
        $this->assertDatabaseCount('user_leaf_progress', 0);
    }
}
