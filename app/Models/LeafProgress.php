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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function leaf(): BelongsTo
    {
        return $this->belongsTo(Leaf::class);
    }
}
