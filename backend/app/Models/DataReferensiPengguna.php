<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataReferensiPengguna extends Model
{
    protected $table = 'data_referensi_pengguna';

    protected $fillable = [
        'tracer_study_id',
        'periode',
        'tahun_lulus',
        'jumlah_lulusan',
        'jumlah_terlacak',
    ];

    public function tracerStudy()
    {
        return $this->belongsTo(TracerStudy::class);
    }
}