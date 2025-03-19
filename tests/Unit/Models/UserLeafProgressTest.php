<?php

namespace Tests\Unit\Models;

use App\Models\Leaf;
use App\Models\User;
use App\Models\UserLeafProgress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserLeafProgressTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_leaf_progress_has_correct_fillable_attributes()
    {
        $progress = new UserLeafProgress;
        $this->assertEquals([
            'user_id',
            'leaf_id',
            'completed',
            'completed_at',
        ], $progress->getFillable());
    }

    public function test_user_leaf_progress_belongs_to_user()
    {
        // Create a user
        $user = User::factory()->create([
            'name' => 'Test User',
        ]);

        // Create a leaf
        $leaf = Leaf::factory()->create();

        // Create progress
        $progress = UserLeafProgress::create([
            'user_id' => $user->id,
            'leaf_id' => $leaf->id,
            'completed' => true,
        ]);

        // Assert that the progress belongs to the user
        $this->assertEquals($user->id, $progress->user->id);
        $this->assertEquals('Test User', $progress->user->name);
    }

    public function test_user_leaf_progress_belongs_to_leaf()
    {
        // Create a user
        $user = User::factory()->create();

        // Create a leaf
        $leaf = Leaf::factory()->create([
            'name' => 'Test Leaf',
        ]);

        // Create progress
        $progress = UserLeafProgress::create([
            'user_id' => $user->id,
            'leaf_id' => $leaf->id,
            'completed' => true,
        ]);

        // Assert that the progress belongs to the leaf
        $this->assertEquals($leaf->id, $progress->leaf->id);
        $this->assertEquals('Test Leaf', $progress->leaf->name);
    }

    public function test_user_leaf_progress_tracks_completion_status()
    {
        // Create a user
        $user = User::factory()->create();

        // Create a leaf
        $leaf = Leaf::factory()->create();

        // Create progress (completed)
        $progress = UserLeafProgress::create([
            'user_id' => $user->id,
            'leaf_id' => $leaf->id,
            'completed' => true,
        ]);

        // Assert that the progress is marked as completed
        $this->assertTrue($progress->completed);

        // Update progress to uncompleted
        $progress->update(['completed' => false]);
        $progress->refresh();

        // Assert that the progress is now marked as uncompleted
        $this->assertFalse($progress->completed);
    }

    public function test_user_leaf_progress_tracks_completion_time()
    {
        // Create a user and leaf
        $user = User::factory()->create();
        $leaf = Leaf::factory()->create();

        // Create progress with completion time
        $now = now();
        $progress = UserLeafProgress::create([
            'user_id' => $user->id,
            'leaf_id' => $leaf->id,
            'completed' => true,
            'completed_at' => $now,
        ]);

        // Assert that the completion time is tracked
        $this->assertNotNull($progress->completed_at);
        $this->assertEquals($now->toDateTimeString(), $progress->completed_at->toDateTimeString());
    }
}
