<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Admin lama (dibiarkan)
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@uinar.ac.id'],
            [
                'name'       => 'Admin Tracer',
                'password'   => Hash::make('admin123'),
                'role'       => 'admin',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );

        // Admin asli (baru)
        DB::table('users')->updateOrInsert(
            ['email' => 'fst.prodikimia@ar-raniry.ac.id'],
            [
                'name'       => 'Admin Tracer Prodi Kimia',
                'password'   => Hash::make('Unggul26'),
                'role'       => 'admin',
                'updated_at' => now(),
                'created_at' => now(),
            ]
        );
    }
}