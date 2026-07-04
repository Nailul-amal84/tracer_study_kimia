<?php

namespace App\Http\Controllers;

use App\Models\Tentang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TentangController extends Controller
{
    // Lihat data per jenis (publik)
    // jenis: struktur_organisasi, surveyor, peneliti
    public function index($jenis)
    {
        $valid = ['struktur_organisasi', 'surveyor', 'peneliti'];

        if (!in_array($jenis, $valid)) {
            return response()->json([
                'success' => false,
                'message' => 'Jenis tidak valid'
            ], 422);
        }

        $data = Tentang::where('jenis', $jenis)->get();

        return response()->json([
            'success' => true,
            'data'    => $data
        ], 200);
    }

    // Tambah data (admin)
    public function store(Request $request)
    {
        $request->validate([
            'nama'    => 'required|string',
            'jabatan' => 'required|string',
            'foto'    => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'jenis'   => 'required|in:struktur_organisasi,surveyor,peneliti',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('foto-tentang', 'public');
        }

        $data = Tentang::create([
            'nama'    => $request->nama,
            'jabatan' => $request->jabatan,
            'foto'    => $fotoPath,
            'jenis'   => $request->jenis,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil ditambahkan',
            'data'    => $data
        ], 201);
    }

    // Update data (admin)
    public function update(Request $request, $id)
    {
        $data = Tentang::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'nama'    => 'required|string',
            'jabatan' => 'required|string',
            'foto'    => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'jenis'   => 'required|in:struktur_organisasi,surveyor,peneliti',
        ]);

        if ($request->hasFile('foto')) {
            if ($data->foto) Storage::disk('public')->delete($data->foto);
            $data->foto = $request->file('foto')->store('foto-tentang', 'public');
        }

        $data->nama    = $request->nama;
        $data->jabatan = $request->jabatan;
        $data->jenis   = $request->jenis;
        $data->save();

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diperbarui',
            'data'    => $data
        ], 200);
    }

    // Hapus data (admin)
    public function destroy($id)
    {
        $data = Tentang::find($id);

        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        if ($data->foto) Storage::disk('public')->delete($data->foto);
        $data->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil dihapus'
        ], 200);
    }
}