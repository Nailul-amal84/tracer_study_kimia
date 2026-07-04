<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HasilSurvey extends Model
{
    protected $table = 'hasil_surveys';

    protected $fillable = [
        'tracer_study_id',
        'data',
        'sync_at'
    ];

    protected $casts = [
        'data' => 'array'
    ];

    public function tracerStudy()
    {
        return $this->belongsTo(TracerStudy::class);
    }
}
