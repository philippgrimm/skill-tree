<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeafProgress extends Model
{
    protected $table = 'user_leaf_progress';

    protected $fillable = [
        'user_id',
        'leaf_id',
        'completed',
        'completed_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the user that owns the progress.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\User, \App\Models\LeafProgress>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the leaf that this progress is for.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Leaf, \App\Models\LeafProgress>
     */
    public function leaf(): BelongsTo
    {
        return $this->belongsTo(Leaf::class);
    }
}
