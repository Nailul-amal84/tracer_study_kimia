<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TracerStudySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('tracer_studies')->insert([
            [
                'jenis'           => 'pengguna_lulusan',
                'label'           => 'Tracer Pengguna Lulusan',
                'google_form_url' => null,
                'perlu_login'     => false,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'jenis'           => 'mahasiswa',
                'label'           => 'Tracer Mahasiswa',
                'google_form_url' => null,
                'perlu_login'     => true,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
            [
                'jenis'           => 'alumni',
                'label'           => 'Tracer Alumni',
                'google_form_url' => null,
                'perlu_login'     => true,
                'created_at'      => now(),
                'updated_at'      => now(),
            ],
        ]);
    }
}