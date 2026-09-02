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
        Schema::create('data_kepuasan_pengguna', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tracer_study_id')->constrained('tracer_studies')->onDelete('cascade');
            $table->string('jenis_kemampuan');
            $table->decimal('sangat_baik', 5, 2)->default(0);
            $table->decimal('baik', 5, 2)->default(0);
            $table->decimal('cukup', 5, 2)->default(0);
            $table->decimal('kurang', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_kepuasan_pengguna');
    }
};
