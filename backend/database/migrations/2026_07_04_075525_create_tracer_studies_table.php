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
        Schema::create('tracer_studies', function (Blueprint $table) {
            $table->id();
            $table->string('jenis'); // pengguna_lulusan, mahasiswa, alumni
            $table->string('label'); // Tracer Pengguna Lulusan, dll
            $table->string('google_form_url')->nullable();
            $table->boolean('perlu_login')->default(false);
            $table->timestamp('terakhir_sync')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tracer_studies');
    }
};
