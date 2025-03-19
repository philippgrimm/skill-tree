<?php

use App\Models\Branch;
use App\Models\Leaf;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('unauthenticated users cannot toggle leaf completion', function () {
    $leaf = Leaf::factory()->create();

    $response = $this->postJson("/api/leaf-progress/{$leaf->id}/toggle");

    $response->assertStatus(401);
});

test('users can complete a leaf', function () {
    $user = User::factory()->create();
    $leaf = Leaf::factory()->create();

    $response = $this->actingAs($user)
        ->postJson("/api/leaf-progress/{$leaf->id}/toggle");

    $response->assertStatus(200)
        ->assertJson([
            'completed_leaves' => [$leaf->id],
        ]);

    $this->assertDatabaseHas('user_leaf_progress', [
        'user_id' => $user->id,
        'leaf_id' => $leaf->id,
        'completed' => true,
    ]);
});

test('users can uncomplete a leaf', function () {
    $user = User::factory()->create();
    $leaf = Leaf::factory()->create();

    // First complete the leaf
    $this->actingAs($user)
        ->postJson("/api/leaf-progress/{$leaf->id}/toggle");

    // Then uncomplete it
    $response = $this->actingAs($user)
        ->postJson("/api/leaf-progress/{$leaf->id}/toggle");

    $response->assertStatus(200)
        ->assertJson([
            'completed_leaves' => [],
        ]);

    $this->assertDatabaseMissing('user_leaf_progress', [
        'user_id' => $user->id,
        'leaf_id' => $leaf->id,
        'completed' => true,
    ]);
});

test('users cannot complete a leaf before completing previous leaves', function () {
    $user = User::factory()->create();
    $branch = Branch::factory()->create();

    // Create two leaves with different orders
    $firstLeaf = Leaf::factory()->create([
        'branch_id' => $branch->id,
        'order' => 1,
    ]);

    $secondLeaf = Leaf::factory()->create([
        'branch_id' => $branch->id,
        'order' => 2,
    ]);

    // Try to complete the second leaf without completing the first
    $response = $this->actingAs($user)
        ->postJson("/api/leaf-progress/{$secondLeaf->id}/toggle", [
            'validate_order' => true,
        ]);

    $response->assertStatus(422)
        ->assertJson([
            'error' => 'You must complete previous leaves first',
        ]);
});

test('users can reset their progress', function () {
    $user = User::factory()->create();
    $leaf = Leaf::factory()->create();

    // Complete a leaf
    $this->actingAs($user)
        ->postJson("/api/leaf-progress/{$leaf->id}/toggle");

    // Reset progress
    $response = $this->actingAs($user)
        ->postJson('/api/leaf-progress/reset');

    $response->assertStatus(200);

    // Verify the leaf is no longer completed
    $this->assertDatabaseMissing('user_leaf_progress', [
        'user_id' => $user->id,
        'leaf_id' => $leaf->id,
        'completed' => true,
    ]);
});

test('leaf completion is tracked per user', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();
    $leaf = Leaf::factory()->create();

    // User 1 completes the leaf
    $this->actingAs($user1)
        ->postJson("/api/leaf-progress/{$leaf->id}/toggle");

    // Verify user 1's progress
    $this->assertDatabaseHas('user_leaf_progress', [
        'user_id' => $user1->id,
        'leaf_id' => $leaf->id,
        'completed' => true,
    ]);

    // Verify user 2's progress (should not exist)
    $this->assertDatabaseMissing('user_leaf_progress', [
        'user_id' => $user2->id,
        'leaf_id' => $leaf->id,
    ]);
});
