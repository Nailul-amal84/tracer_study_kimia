<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DataSurvey extends Model
{
    protected $table = 'data_surveys';

    protected $fillable = [
        'tracer_study_id',
        'periode',
        'tahun_lulus',
        'jumlah_lulusan',
        'jumlah_terlacak',
        'dipesan_sebelum_lulus',
        'wt_kurang_6_bulan',
        'wt_6_18_bulan',
        'wt_lebih_18_bulan',
    ];

    public function tracerStudy()
    {
        return $this->belongsTo(TracerStudy::class);
    }
}