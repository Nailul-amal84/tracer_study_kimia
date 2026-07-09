const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ===== FAQ =====
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
    setTimeout(() => resolve(dummyFaq), 500);
  });
}

// ===== Laporan & Saran =====
export async function kirimLaporanSaran(data) {
  // --- Versi ASLI (aktifkan nanti kalau backend sudah online) ---
  // const response = await fetch(`${BASE_URL}/laporan-saran`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  // const result = await response.json();
  // return result;

  // --- Versi DUMMY (dipakai sementara) ---
  console.log('Data yang dikirim (dummy):', data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'Terima kasih, masukan Anda sudah kami terima' });
    }, 500);
  });
}
// ===== Tentang =====
const dummyTentang = {
  "struktur-organisasi": [
    { id: 1, nama: "Dr. Ahmad", jabatan: "Ketua Tracer", foto_url: "" },
    { id: 2, nama: "Siti Aminah, M.Si", jabatan: "Sekretaris", foto_url: "" },
  ],
  "surveyor": [
    { id: 1, nama: "Budi Santoso", jabatan: "Surveyor Lapangan", foto_url: "" },
  ],
  "peneliti": [
    { id: 1, nama: "Dr. Rina Wulandari", jabatan: "Peneliti Utama", foto_url: "" },
  ],
};

export async function getTentang(jenis) {
  // --- Versi ASLI (aktifkan nanti kalau backend sudah online) ---
  // const response = await fetch(`${BASE_URL}/tentang/${jenis}`);
  // const result = await response.json();
  // return result;

  // --- Versi DUMMY ---
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, data: dummyTentang[jenis] || [] });
    }, 500);
  });
}