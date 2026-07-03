<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class artikel extends Model
{
    protected $fillable = [
        'judul',
        'ringkasan',
        'isi',
        'cover_artikel',
        'file_url'
    ];
}
