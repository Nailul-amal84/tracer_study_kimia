<?php

namespace App\Http\Controllers;

use App\Models\ProfilAlumni;
use App\Models\TracerStudy;
use App\Models\DataSurvey;
use App\Models\DataReferensiPengguna;

class StatsController extends Controller
{
    public function index()
    {
        $tracers = TracerStudy::all();
        $partisipasiPerJenis = [];

        foreach ($tracers as $tracer) {
            if ($tracer->jenis === 'alumni') {
                $rows = DataSurvey::where('tracer_study_id', $tracer->id)->get();
            } elseif ($tracer->jenis === 'pengguna_lulusan') {
                $rows = DataReferensiPengguna::where('tracer_study_id', $tracer->id)->get();
            } else {
                // mahasiswa ditunda dulu, belum ada rumus partisipasinya
                continue;
            }

            $periodeData = [];
            foreach ($rows->groupBy('periode') as $periode => $group) {
                $totalLulusan  = $group->sum('jumlah_lulusan');
                $totalTerlacak = $group->sum('jumlah_terlacak');
                $persen = $totalLulusan > 0 ? round(($totalTerlacak / $totalLulusan) * 100) : 0;
                $periodeData[] = ['periode' => $periode, 'persen' => $persen];
            }
            usort($periodeData, fn($a, $b) => strcmp($b['periode'], $a['periode']));

            $partisipasiPerJenis[] = [
                'jenis'        => $tracer->jenis,
                'label'        => $tracer->label,
                'periode_data' => $periodeData,
            ];
        }

        $periodeAlumni  = DataSurvey::max('periode');
        $periodePengguna = DataReferensiPengguna::max('periode');
        $periodeTerakhir = collect([$periodeAlumni, $periodePengguna])->filter()->sort()->last();

        return response()->json([
            'success'               => true,
            'alumni_terdaftar'      => ProfilAlumni::count(),
            'jenis_tracer'          => TracerStudy::count(),
            'periode_terakhir'      => $periodeTerakhir ?: '-',
            'partisipasi_per_jenis' => $partisipasiPerJenis,
        ]);
    }
}