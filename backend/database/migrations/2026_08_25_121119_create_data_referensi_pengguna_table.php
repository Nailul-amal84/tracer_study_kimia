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
        Schema::create('data_referensi_pengguna', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracer_study_id')->constrained('tracer_studies')->onDelete('cascade');
            $table->string('tahun_lulus');
            $table->integer('jumlah_lulusan')->default(0);
            $table->integer('jumlah_terlacak')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('data_referensi_pengguna');
    }
};