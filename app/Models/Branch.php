<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    /** @use HasFactory<\Database\Factories\BranchFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
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
     */
    public function leafs()
    {
        return $this->hasMany(Leaf::class);
    }

    /**
     * Get the parent branch.
     */
    public function parent()
    {
        return $this->belongsTo(Branch::class, 'branch_id');
    }

    /**
     * Get the child branches.
     */
    public function children()
    {
        return $this->hasMany(Branch::class, 'branch_id');
    }
}
