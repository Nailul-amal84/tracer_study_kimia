<?php

namespace App\Http\Controllers;

use App\Models\DataKepuasanPengguna;
use App\Models\TracerStudy;
use Illuminate\Http\Request;

class DataKepuasanPenggunaController extends Controller
{
    public function index($jenis, Request $request)
    {
        $tracer = TracerStudy::where('jenis', $jenis)->first();

        if (!$tracer) {
            return response()->json(['success' => false, 'message' => 'Jenis tracer tidak ditemukan'], 404);
        }

        $periodeList = DataKepuasanPengguna::where('tracer_study_id', $tracer->id)
            ->distinct()->orderByDesc('periode')->pluck('periode');

        $periode = $request->query('periode', $periodeList->first());

        $data = DataKepuasanPengguna::where('tracer_study_id', $tracer->id)
            ->where('periode', $periode)
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'success'      => true,
            'jenis'        => $jenis,
            'periode'      => $periode,
            'periode_list' => $periodeList,
            'data'         => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tracer_study_id' => 'required|exists:tracer_studies,id',
            'periode'         => 'required|string',
            'jenis_kemampuan' => 'required|string',
            'sangat_baik'     => 'required|numeric|min:0|max:100',
            'baik'            => 'required|numeric|min:0|max:100',
            'cukup'           => 'required|numeric|min:0|max:100',
            'kurang'          => 'required|numeric|min:0|max:100',
        ]);

        $data = DataKepuasanPengguna::create($validated);

        return response()->json(['success' => true, 'message' => 'Data berhasil ditambahkan', 'data' => $data], 201);
    }

    public function update(Request $request, $id)
    {
        $data = DataKepuasanPengguna::find($id);

        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'periode'         => 'required|string',
            'jenis_kemampuan' => 'required|string',
            'sangat_baik'     => 'required|numeric|min:0|max:100',
            'baik'            => 'required|numeric|min:0|max:100',
            'cukup'           => 'required|numeric|min:0|max:100',
            'kurang'          => 'required|numeric|min:0|max:100',
        ]);

        $data->update($validated);

        return response()->json(['success' => true, 'message' => 'Data berhasil diperbarui', 'data' => $data]);
    }

    public function destroy($id)
    {
        $data = DataKepuasanPengguna::find($id);

        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $data->delete();

        return response()->json(['success' => true, 'message' => 'Data berhasil dihapus']);
    }
}