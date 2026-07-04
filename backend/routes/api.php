<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ArtikelController;
use App\Http\Controllers\ProfilAlumniController;
use App\Http\Controllers\LaporanSaranController;
use App\Http\Controllers\TentangController;
use App\Http\Controllers\TracerStudyController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/faq', [FaqController::class, 'index']);
Route::get('/informasi', [ArtikelController::class, 'index']);
Route::get('/informasi/{id}', [ArtikelController::class, 'show']);
Route::get('/profil-alumni', [ProfilAlumniController::class, 'index']);
Route::post('/laporan-saran', [LaporanSaranController::class, 'store']);
Route::get('/tentang/{jenis}', [TentangController::class, 'index']);
Route::get('/tracer-study', [TracerStudyController::class, 'index']);
Route::get('/tracer-study/{jenis}/hasil', [TracerStudyController::class, 'hasilSurvey']);

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

        Route::get('/laporan-saran', [LaporanSaranController::class, 'index']);
        Route::delete('/laporan-saran/{id}', [LaporanSaranController::class, 'destroy']);

        Route::post('/tentang', [TentangController::class, 'store']);
        Route::put('/tentang/{id}', [TentangController::class, 'update']);
        Route::delete('/tentang/{id}', [TentangController::class, 'destroy']);

        Route::put('/tracer-study/{jenis}/link', [TracerStudyController::class, 'updateLink']);
        Route::post('/tracer-study/{jenis}/sync', [TracerStudyController::class, 'sync']);
    });
});