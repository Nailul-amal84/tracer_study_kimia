<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class laporansaran extends Model
{
     protected $table = 'laporan_sarans';

    protected $fillable = [
        'nama',
        'email',
        'pesan'
    ];
}
