<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Leaf extends Model
{
    /** @use HasFactory<\Database\Factories\LeafFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'content',
        'order',
        'branch_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'content' => 'string',
        'order' => 'integer',
        'branch_id' => 'integer',
    ];

    /**
     * Get the branch that owns the leaf.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Branch, \App\Models\Leaf>
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }
}
