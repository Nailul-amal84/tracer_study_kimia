<?php

namespace App\Http\Controllers;

use App\Models\DataReferensiPengguna;
use App\Models\TracerStudy;
use Illuminate\Http\Request;

class DataReferensiPenggunaController extends Controller
{
    public function index($jenis, Request $request)
    {
        $tracer = TracerStudy::where('jenis', $jenis)->first();

        if (!$tracer) {
            return response()->json(['success' => false, 'message' => 'Jenis tracer tidak ditemukan'], 404);
        }

        $periodeList = DataReferensiPengguna::where('tracer_study_id', $tracer->id)
            ->distinct()->orderByDesc('periode')->pluck('periode');

        $periode = $request->query('periode', $periodeList->first());

        $data = DataReferensiPengguna::where('tracer_study_id', $tracer->id)
            ->where('periode', $periode)
            ->orderBy('tahun_lulus', 'asc')
            ->get();

        $total = [
            'tahun_lulus'     => 'Jumlah',
            'jumlah_lulusan'  => $data->sum('jumlah_lulusan'),
            'jumlah_terlacak' => $data->sum('jumlah_terlacak'),
        ];

        return response()->json([
            'success'      => true,
            'jenis'        => $jenis,
            'periode'      => $periode,
            'periode_list' => $periodeList,
            'data'         => $data,
            'total'        => $total
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tracer_study_id' => 'required|exists:tracer_studies,id',
            'periode'         => 'required|string',
            'tahun_lulus'     => 'required|string',
            'jumlah_lulusan'  => 'required|integer|min:0',
            'jumlah_terlacak' => 'required|integer|min:0',
        ]);

        $data = DataReferensiPengguna::create($validated);

        return response()->json(['success' => true, 'message' => 'Data berhasil ditambahkan', 'data' => $data], 201);
    }

    public function update(Request $request, $id)
    {
        $data = DataReferensiPengguna::find($id);

        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'periode'         => 'required|string',
            'tahun_lulus'     => 'required|string',
            'jumlah_lulusan'  => 'required|integer|min:0',
            'jumlah_terlacak' => 'required|integer|min:0',
        ]);

        $data->update($validated);

        return response()->json(['success' => true, 'message' => 'Data berhasil diperbarui', 'data' => $data]);
    }

    public function destroy($id)
    {
        $data = DataReferensiPengguna::find($id);

        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $data->delete();

        return response()->json(['success' => true, 'message' => 'Data berhasil dihapus']);
    }
}