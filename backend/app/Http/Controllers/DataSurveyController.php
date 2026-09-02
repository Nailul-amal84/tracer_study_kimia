<?php

namespace App\Http\Controllers;

use App\Models\DataSurvey;
use App\Models\TracerStudy;
use Illuminate\Http\Request;

class DataSurveyController extends Controller
{
    public function index($jenis, Request $request)
    {
        $tracer = TracerStudy::where('jenis', $jenis)->first();

        if (!$tracer) {
            return response()->json(['success' => false, 'message' => 'Jenis tracer tidak ditemukan'], 404);
        }

        $periodeList = DataSurvey::where('tracer_study_id', $tracer->id)
            ->distinct()->orderByDesc('periode')->pluck('periode');

        $periode = $request->query('periode', $periodeList->first());

        $data = DataSurvey::where('tracer_study_id', $tracer->id)
            ->where('periode', $periode)
            ->orderBy('tahun_lulus', 'asc')
            ->get();

        $total = [
            'tahun_lulus'           => 'Jumlah',
            'jumlah_lulusan'        => $data->sum('jumlah_lulusan'),
            'jumlah_terlacak'       => $data->sum('jumlah_terlacak'),
            'dipesan_sebelum_lulus' => $data->sum('dipesan_sebelum_lulus'),
            'wt_kurang_6_bulan'     => $data->sum('wt_kurang_6_bulan'),
            'wt_6_18_bulan'         => $data->sum('wt_6_18_bulan'),
            'wt_lebih_18_bulan'     => $data->sum('wt_lebih_18_bulan'),
        ];

        return response()->json([
            'success'      => true,
            'jenis'        => $jenis,
            'label'        => $tracer->label,
            'periode'      => $periode,
            'periode_list' => $periodeList,
            'data'         => $data,
            'total'        => $total
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tracer_study_id'       => 'required|exists:tracer_studies,id',
            'periode'               => 'required|string',
            'tahun_lulus'           => 'required|string',
            'jumlah_lulusan'        => 'required|integer|min:0',
            'jumlah_terlacak'       => 'required|integer|min:0',
            'dipesan_sebelum_lulus' => 'required|integer|min:0',
            'wt_kurang_6_bulan'     => 'required|integer|min:0',
            'wt_6_18_bulan'         => 'required|integer|min:0',
            'wt_lebih_18_bulan'     => 'required|integer|min:0',
        ]);

        $data = DataSurvey::create($validated);

        return response()->json(['success' => true, 'message' => 'Data survey berhasil ditambahkan', 'data' => $data], 201);
    }

    public function update(Request $request, $id)
    {
        $data = DataSurvey::find($id);

        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'periode'               => 'required|string',
            'tahun_lulus'           => 'required|string',
            'jumlah_lulusan'        => 'required|integer|min:0',
            'jumlah_terlacak'       => 'required|integer|min:0',
            'dipesan_sebelum_lulus' => 'required|integer|min:0',
            'wt_kurang_6_bulan'     => 'required|integer|min:0',
            'wt_6_18_bulan'         => 'required|integer|min:0',
            'wt_lebih_18_bulan'     => 'required|integer|min:0',
        ]);

        $data->update($validated);

        return response()->json(['success' => true, 'message' => 'Data survey berhasil diperbarui', 'data' => $data]);
    }

    public function destroy($id)
    {
        $data = DataSurvey::find($id);

        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $data->delete();

        return response()->json(['success' => true, 'message' => 'Data survey berhasil dihapus']);
    }
}