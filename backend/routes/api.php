<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ArtikelController;
use App\Http\Controllers\ProfilAlumniController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/faq', [FaqController::class, 'index']);
Route::get('/informasi', [ArtikelController::class, 'index']);
Route::get('/informasi/{id}', [ArtikelController::class, 'show']);
Route::get('/profil-alumni', [ProfilAlumniController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Khusus admin
    Route::middleware('role:admin')->group(function () {
        Route::post('/faq', [FaqController::class, 'store']);
        Route::put('/faq/{id}', [FaqController::class, 'update']);
        Route::delete('/faq/{id}', [FaqController::class, 'destroy']);

        Route::post('/informasi', [ArtikelController::class, 'store']);
        Route::put('/informasi/{id}', [ArtikelController::class, 'update']);
        Route::delete('/informasi/{id}', [ArtikelController::class, 'destroy']);

        Route::post('/profil-alumni', [ProfilAlumniController::class, 'store']);
        Route::put('/profil-alumni/{id}', [ProfilAlumniController::class, 'update']);
        Route::delete('/profil-alumni/{id}', [ProfilAlumniController::class, 'destroy']);
    });
});