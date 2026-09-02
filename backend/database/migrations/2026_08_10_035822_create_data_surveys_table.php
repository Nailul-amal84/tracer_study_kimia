<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('data_surveys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracer_study_id')->constrained('tracer_studies')->onDelete('cascade');
            $table->string('tahun_lulus'); // TS-4, TS-3, TS-2, dll
            $table->integer('jumlah_lulusan')->default(0);
            $table->integer('jumlah_terlacak')->default(0);
            $table->integer('dipesan_sebelum_lulus')->default(0);
            $table->integer('wt_kurang_6_bulan')->default(0);
            $table->integer('wt_6_18_bulan')->default(0);
            $table->integer('wt_lebih_18_bulan')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_surveys');
    }
};
