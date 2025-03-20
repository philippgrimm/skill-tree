<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property-read Collection<int, Leaf> $leafs
 * @property-read Branch|null $parent
 * @property-read Collection<int, Branch> $children
 * @property Collection<int, Leaf>|null $leaves
 */
class Branch extends Model
{
    /** @use HasFactory<\Database\Factories\BranchFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'description',
        'branch_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'description' => 'string',
        'branch_id' => 'integer',
    ];

    /**
     * Get the leaves for the branch.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\Leaf, \App\Models\Branch>
     */
    public function leafs(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Leaf::class);
    }

    /**
     * Get the parent branch.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<\App\Models\Branch, \App\Models\Branch>
     */
    public function parent(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    /**
     * Get the child branches.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<\App\Models\Branch, \App\Models\Branch>
     */
    public function children(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Branch::class, 'branch_id');
    }
}
