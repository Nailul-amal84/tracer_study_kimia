<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfilAlumni extends Model
{
     protected $table = 'profil_alumnis';

    protected $fillable = [
        'nama',
        'foto',
        'tahun_lulus',
        'deskripsi_profesi'
    ];
}
