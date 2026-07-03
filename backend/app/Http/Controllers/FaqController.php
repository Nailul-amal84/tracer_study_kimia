<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    // Lihat semua FAQ (publik)
    public function index()
    {
        $faqs = Faq::all();
        return response()->json([
            'success' => true,
            'data'    => $faqs
        ], 200);
    }

    // Tambah FAQ (admin only)
    public function store(Request $request)
    {
        $request->validate([
            'pertanyaan' => 'required|string',
            'jawaban'    => 'required|string',
        ]);

        $faq = Faq::create($request->only('pertanyaan', 'jawaban'));

        return response()->json([
            'success' => true,
            'message' => 'FAQ berhasil ditambahkan',
            'data'    => $faq
        ], 201);
    }

    // Update FAQ (admin only)
    public function update(Request $request, $id)
    {
        $faq = Faq::find($id);

        if (!$faq) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ tidak ditemukan'
            ], 404);
        }

        $request->validate([
            'pertanyaan' => 'required|string',
            'jawaban'    => 'required|string',
        ]);

        $faq->update($request->only('pertanyaan', 'jawaban'));

        return response()->json([
            'success' => true,
            'message' => 'FAQ berhasil diperbarui',
            'data'    => $faq
        ], 200);
    }

    // Hapus FAQ (admin only)
    public function destroy($id)
    {
        $faq = Faq::find($id);

        if (!$faq) {
            return response()->json([
                'success' => false,
                'message' => 'FAQ tidak ditemukan'
            ], 404);
        }

        $faq->delete();

        return response()->json([
            'success' => true,
            'message' => 'FAQ berhasil dihapus'
        ], 200);
    }
}