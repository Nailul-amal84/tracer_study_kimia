<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Artikel;
use App\Models\Faq;
use App\Models\ProfilAlumni;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json([
                'success' => true,
                'data' => []
            ]);
        }

        $keyword = '%' . $query . '%';

        // Search artikel
        $artikels = Artikel::where('judul', 'LIKE', $keyword)
            ->orWhere('ringkasan', 'LIKE', $keyword)
            ->orWhere('isi', 'LIKE', $keyword)
            ->select('id', 'judul', 'ringkasan')
            ->limit(4)
            ->get()
            ->map(function ($item) {
                return [
                    'type'  => 'artikel',
                    'id'    => $item->id,
                    'judul' => $item->judul,
                    'deskripsi' => $item->ringkasan,
                    'url'   => '/informasi/' . $item->id,
                ];
            });

        // Search FAQ
        $faqs = Faq::where('pertanyaan', 'LIKE', $keyword)
            ->orWhere('jawaban', 'LIKE', $keyword)
            ->select('id', 'pertanyaan', 'jawaban')
            ->limit(3)
            ->get()
            ->map(function ($item) {
                return [
                    'type'  => 'faq',
                    'id'    => $item->id,
                    'judul' => $item->pertanyaan,
                    'deskripsi' => $item->jawaban,
                    'url'   => '/faq',
                ];
            });

        // Search Profil Alumni
        $alumnis = ProfilAlumni::where('nama', 'LIKE', $keyword)
            ->orWhere('deskripsi_profesi', 'LIKE', $keyword)
            ->select('id', 'nama', 'deskripsi_profesi')
            ->limit(3)
            ->get()
            ->map(function ($item) {
                return [
                    'type'  => 'alumni',
                    'id'    => $item->id,
                    'judul' => $item->nama,
                    'deskripsi' => $item->deskripsi_profesi,
                    'url'   => '/profil-alumni',
                ];
            });

        $hasil = collect()
            ->merge($artikels)
            ->merge($faqs)
            ->merge($alumnis)
            ->values();

        return response()->json([
            'success' => true,
            'query'   => $query,
            'total'   => $hasil->count(),
            'data'    => $hasil
        ]);
    }
}