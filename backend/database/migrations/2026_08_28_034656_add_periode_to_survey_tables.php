<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('data_surveys', function (Blueprint $table) {
            $table->string('periode')->default('2026/2027')->after('tracer_study_id');
        });
        Schema::table('data_referensi_pengguna', function (Blueprint $table) {
            $table->string('periode')->default('2026/2027')->after('tracer_study_id');
        });
        Schema::table('data_kepuasan_pengguna', function (Blueprint $table) {
            $table->string('periode')->default('2026/2027')->after('tracer_study_id');
        });
    }

    public function down(): void
    {
        Schema::table('data_surveys', function (Blueprint $table) {
            $table->dropColumn('periode');
        });
        Schema::table('data_referensi_pengguna', function (Blueprint $table) {
            $table->dropColumn('periode');
        });
        Schema::table('data_kepuasan_pengguna', function (Blueprint $table) {
            $table->dropColumn('periode');
        });
    }
};