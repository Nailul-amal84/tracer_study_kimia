<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tentang extends Model
{
    protected $fillable = [
        'nama',
        'jabatan',
        'foto',
        'jenis'
    ];
}
