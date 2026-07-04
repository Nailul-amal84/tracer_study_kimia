<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TracerStudy extends Model
{
    protected $table = 'tracer_studies';

    protected $fillable = [
        'jenis',
        'label',
        'google_form_url',
        'perlu_login',
        'terakhir_sync'
    ];

    public function hasilSurveys()
    {
        return $this->hasMany(HasilSurvey::class);
    }
}
