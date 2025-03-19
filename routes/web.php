<?php

use App\Http\Controllers\TreeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Public route for the standalone tree page
Route::get('/tree', [TreeController::class, 'index'])->name('tree');

// Test route for Sanctum authentication
Route::get('/test-auth', function () {
    return file_get_contents(base_path('test-csrf.html'));
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('tree-admin', function () {
        return Inertia::render('tree-admin');
    })->name('tree-admin');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
