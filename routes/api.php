<?php

use App\Http\Controllers\API\BranchController;
use App\Http\Controllers\API\LeafController;
use App\Http\Controllers\API\LeafProgressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware([
    EnsureFrontendRequestsAreStateful::class,
    'auth:sanctum',
])->get('/user', function (Request $request) {
    return $request->user();
});

// Branch routes
// Using public routes for testing - add auth middleware later
Route::get('/branches', [BranchController::class, 'index']);
Route::post('/branches', [BranchController::class, 'store']);
Route::get('/branches/{branch}', [BranchController::class, 'show']);
Route::put('/branches/{branch}', [BranchController::class, 'update']);
Route::delete('/branches/{branch}', [BranchController::class, 'destroy']);

// Leaf routes
Route::get('/branches/{branch}/leaves', [LeafController::class, 'index']);
Route::post('/branches/{branch}/reorder-leaves', [LeafController::class, 'reorder']);
Route::post('/leaves', [LeafController::class, 'store']);
Route::get('/leaves/{leaf}', [LeafController::class, 'show']);
Route::put('/leaves/{leaf}', [LeafController::class, 'update']);
Route::delete('/leaves/{leaf}', [LeafController::class, 'destroy']);

// Leaf progress routes (requires authentication)
Route::middleware([
    EnsureFrontendRequestsAreStateful::class,
    'auth:sanctum',
])->group(function () {
    Route::get('/leaf-progress', [LeafProgressController::class, 'index']);
    Route::post('/leaf-progress/{leaf}/toggle', [LeafProgressController::class, 'toggle']);
    Route::post('/leaf-progress/reset', [LeafProgressController::class, 'reset']);
});
