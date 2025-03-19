<?php

namespace App\Guards;

use Illuminate\Support\Facades\Auth;

class AdminGuard
{
    /**
     * Check if the current user is an admin.
     *
     * @return bool
     */
    public static function check(): bool
    {
        return Auth::check() && Auth::user()->is_admin;
    }
}
