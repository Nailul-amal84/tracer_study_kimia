<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataKepuasanPengguna extends Model
{
    protected $table = 'data_kepuasan_pengguna';

    protected $fillable = [
        'tracer_study_id',
        'perode',
        'jenis_kemampuan',
        'sangat_baik',
        'baik',
        'cukup',
        'kurang',
    ];

    public function tracerStudy()
    {
        return $this->belongsTo(TracerStudy::class);
    }
}