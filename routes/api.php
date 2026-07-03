<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FaqController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/faq', [FaqController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Khusus admin
    Route::middleware('role:admin')->group(function () {
        Route::post('/faq', [FaqController::class, 'store']);
        Route::put('/faq/{id}', [FaqController::class, 'update']);
        Route::delete('/faq/{id}', [FaqController::class, 'destroy']);
    });
});