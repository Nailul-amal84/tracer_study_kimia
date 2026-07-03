<?php

namespace App\Http\Controllers;

use App\Models\ProfilAlumni;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfilAlumniController extends Controller
{
    // List semua profil alumni (publik)
    public function index(Request $request)
    {
        $query = ProfilAlumni::orderBy('tahun_lulus', 'desc');

        // Filter by tahun lulus (opsional)
        if ($request->tahun_lulus) {
            $query->where('tahun_lulus', $request->tahun_lulus);
        }

        $alumnis = $query->paginate(12);

        return response()->json([
            'success' => true,
            'data'    => $alumnis
        ], 200);
    }

    // Tambah profil alumni (admin)
    public function store(Request $request)
    {
        $request->validate([
            'nama'             => 'required|string',
            'foto'             => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'tahun_lulus'      => 'required|integer|min:2000|max:2099',
            'deskripsi_profesi'=> 'required|string',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('foto-alumni', 'public');
        }

        $alumni = ProfilAlumni::create([
            'nama'             => $request->nama,
            'foto'             => $fotoPath,
            'tahun_lulus'      => $request->tahun_lulus,
            'deskripsi_profesi'=> $request->deskripsi_profesi,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Profil alumni berhasil ditambahkan',
            'data'    => $alumni
        ], 201);
    }

    // Update profil alumni (admin)
    public function update(Request $request, $id)
    {
        $alumni = ProfilAlumni::find($id);

        if (!$alumni) {
            return response()->json([
                'success' => false,
                'message' => 'Profil alumni tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'nama'             => 'required|string',
            'foto'             => 'nullable|image|mimes:jpg,jpeg,png|max:5120',
            'tahun_lulus'      => 'required|integer|min:2000|max:2099',
            'deskripsi_profesi'=> 'required|string',
        ]);

        if ($request->hasFile('foto')) {
            if ($alumni->foto) Storage::disk('public')->delete($alumni->foto);
            $alumni->foto = $request->file('foto')->store('foto-alumni', 'public');
        }

        $alumni->nama              = $request->nama;
        $alumni->tahun_lulus       = $request->tahun_lulus;
        $alumni->deskripsi_profesi = $request->deskripsi_profesi;
        $alumni->save();

        return response()->json([
            'success' => true,
            'message' => 'Profil alumni berhasil diperbarui',
            'data'    => $alumni
        ], 200);
    }

    // Hapus profil alumni (admin)
    public function destroy($id)
    {
        $alumni = ProfilAlumni::find($id);

        if (!$alumni) {
            return response()->json([
                'success' => false,
                'message' => 'Profil alumni tidak ditemukan'
            ], 404);
        }

        if ($alumni->foto) Storage::disk('public')->delete($alumni->foto);
        $alumni->delete();

        return response()->json([
            'success' => true,
            'message' => 'Profil alumni berhasil dihapus'
        ], 200);
    }
}