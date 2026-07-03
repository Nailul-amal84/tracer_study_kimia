<?php

namespace App\Http\Controllers;

use App\Models\LaporanSaran;
use Illuminate\Http\Request;

class LaporanSaranController extends Controller
{
    // Kirim pesan/saran (publik, tidak butuh login)
    public function store(Request $request)
    {
        $request->validate([
            'nama'  => 'required|string',
            'email' => 'required|email',
            'pesan' => 'required|string',
        ]);

        LaporanSaran::create($request->only('nama', 'email', 'pesan'));

        return response()->json([
            'success' => true,
            'message' => 'Terima kasih, masukan Anda sudah kami terima',
        ], 201);
    }

    // Lihat semua pesan (admin only)
    public function index()
    {
        $laporan = LaporanSaran::orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data'    => $laporan
        ], 200);
    }

    // Hapus pesan (admin only)
    public function destroy($id)
    {
        $laporan = LaporanSaran::find($id);

        if (!$laporan) {
            return response()->json([
                'success' => false,
                'message' => 'Pesan tidak ditemukan'
            ], 404);
        }

        $laporan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pesan berhasil dihapus'
        ], 200);
    }
}