<?php

namespace App\Http\Controllers;

use App\Models\TracerStudy;
use App\Models\HasilSurvey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TracerStudyController extends Controller
{
    // Lihat semua jenis tracer + link Google Form (publik)
    public function index()
    {
        $data = TracerStudy::all();

        return response()->json([
            'success' => true,
            'data'    => $data
        ], 200);
    }

    // Update link Google Form per jenis (admin)
    public function updateLink(Request $request, $jenis)
    {
        $tracer = TracerStudy::where('jenis', $jenis)->first();

        if (!$tracer) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis tracer tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'google_form_url' => 'required|url',
            'perlu_login'     => 'boolean',
        ]);

        $tracer->google_form_url = $request->google_form_url;
        if ($request->has('perlu_login')) {
            $tracer->perlu_login = $request->perlu_login;
        }
        $tracer->save();

        return response()->json([
            'success' => true,
            'message' => 'Link Google Form berhasil diperbarui',
            'data'    => $tracer
        ], 200);
    }

    // Lihat hasil rekap survey per jenis (publik)
    public function hasilSurvey($jenis)
    {
        $tracer = TracerStudy::where('jenis', $jenis)->first();

        if (!$tracer) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis tracer tidak ditemukan'
            ], 404);
        }

        $hasil = HasilSurvey::where('tracer_study_id', $tracer->id)
                            ->orderBy('sync_at', 'desc')
                            ->first();

        if (!$hasil) {
            return response()->json([
                'success' => true,
                'message' => 'Belum ada data hasil survey',
                'data'    => null
            ], 200);
        }

        return response()->json([
            'success'         => true,
            'terakhir_update' => $hasil->sync_at,
            'data'            => $hasil->data
        ], 200);
    }

    // Sync data dari Google Sheet (admin, trigger manual)
    public function sync($jenis)
    {
        $tracer = TracerStudy::where('jenis', $jenis)->first();

        if (!$tracer) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis tracer tidak ditemukan'
            ], 404);
        }

        // ⚠️ PERLU DIKONFIRMASI LEBIH LANJUT:
        // URL Google Sheet API disesuaikan dengan Sheet ID milik kampus
        // Format: https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values/{RANGE}?key={API_KEY}
        // Untuk sekarang endpoint ini dibuat tapi belum bisa dijalankan
        // sampai Sheet ID dan API Key dari Google dikonfirmasi

        return response()->json([
            'success' => false,
            'message' => 'Sync Google Sheet belum dikonfigurasi. Sheet ID dan API Key Google belum tersedia.'
        ], 503);
    }
}