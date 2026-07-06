const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Data dummy — sementara backend belum online
// Bentuknya dibuat SAMA PERSIS seperti response asli di kontrak API
const dummyFaq = {
  success: true,
  data: [
    { id: 1, pertanyaan: "Apa itu tracer study?", jawaban: "Tracer study adalah survei untuk melacak alumni." },
    { id: 2, pertanyaan: "Siapa yang wajib mengisi?", jawaban: "Semua alumni dan mahasiswa aktif." },
  ],
};

export async function getFaq() {
  // --- Versi ASLI (aktifkan nanti kalau backend sudah online) ---
  // const response = await fetch(`${BASE_URL}/faq`);
  // const result = await response.json();
  // return result;

  // --- Versi DUMMY (dipakai sementara) ---
  return new Promise((resolve) => {
    setTimeout(() => resolve(dummyFaq), 500); // pura-pura delay 0.5 detik kayak network asli
  });
}