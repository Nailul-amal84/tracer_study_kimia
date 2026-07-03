<?php

namespace App\Http\Controllers;

use App\Models\Artikel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArtikelController extends Controller
{
    // List semua artikel (publik)
    public function index()
    {
        $artikels = Artikel::select('id', 'judul', 'ringkasan', 'cover_artikel', 'created_at')
                           ->orderBy('created_at', 'desc')
                           ->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $artikels
        ], 200);
    }

    // Detail artikel (publik)
    public function show($id)
    {
        $artikel = Artikel::find($id);

        if (!$artikel) {
            return response()->json([
                'success' => false,
                'message' => 'Artikel tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data'    => $artikel
        ], 200);
    }

    // Tambah artikel (admin)
    public function store(Request $request)
    {
        $request->validate([
            'judul'         => 'required|string',
            'ringkasan'     => 'required|string',
            'isi'           => 'required|string',
            'cover_artikel' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',  // max 5MB
            'file_url'      => 'nullable|mimes:pdf|max:20480',                // max 20MB
        ]);

        $coverPath = null;
        $filePath  = null;

        if ($request->hasFile('cover_artikel')) {
            $coverPath = $request->file('cover_artikel')->store('covers', 'public');
        }

        if ($request->hasFile('file_url')) {
            $filePath = $request->file('file_url')->store('files', 'public');
        }

        $artikel = Artikel::create([
            'judul'         => $request->judul,
            'ringkasan'     => $request->ringkasan,
            'isi'           => $request->isi,
            'cover_artikel' => $coverPath,
            'file_url'      => $filePath,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil ditambahkan',
            'data'    => $artikel
        ], 201);
    }

    // Update artikel (admin)
    public function update(Request $request, $id)
    {
        $artikel = Artikel::find($id);

        if (!$artikel) {
            return response()->json([
                'success' => false,
                'message' => 'Artikel tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'judul'         => 'required|string',
            'ringkasan'     => 'required|string',
            'isi'           => 'required|string',
            'cover_artikel' => 'nullable|image|mimes:jpg,jpeg,png|max:5120',  // max 5MB
            'file_url'      => 'nullable|mimes:pdf|max:20480',                // max 20MB
        ]);

        if ($request->hasFile('cover_artikel')) {
            if ($artikel->cover_artikel) Storage::disk('public')->delete($artikel->cover_artikel);
            $artikel->cover_artikel = $request->file('cover_artikel')->store('covers', 'public');
        }

        if ($request->hasFile('file_url')) {
            if ($artikel->file_url) Storage::disk('public')->delete($artikel->file_url);
            $artikel->file_url = $request->file('file_url')->store('files', 'public');
        }

        $artikel->judul     = $request->judul;
        $artikel->ringkasan = $request->ringkasan;
        $artikel->isi       = $request->isi;
        $artikel->save();

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil diperbarui',
            'data'    => $artikel
        ], 200);
    }

    // Hapus artikel (admin)
    public function destroy($id)
    {
        $artikel = Artikel::find($id);

        if (!$artikel) {
            return response()->json([
                'success' => false,
                'message' => 'Artikel tidak ditemukan'
            ], 404);
        }

        if ($artikel->cover_artikel) Storage::disk('public')->delete($artikel->cover_artikel);
        if ($artikel->file_url) Storage::disk('public')->delete($artikel->file_url);

        $artikel->delete();

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil dihapus'
        ], 200);
    }
}