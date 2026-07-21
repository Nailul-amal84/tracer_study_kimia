const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ===== FAQ ===== //
export async function getFaq() {
  const response = await fetch(`${BASE_URL}/faq`);
  const result = await response.json();
  return result;
}

// ===== Laporan & Saran ===== //
export async function kirimLaporanSaran(data) {
  const response = await fetch(`${BASE_URL}/laporan-saran`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  return result;
}

// ===== Tentang ===== //
export async function getTentang(jenis) {
  const response = await fetch(`${BASE_URL}/tentang/${jenis}`);
  const result = await response.json();
  return result;
}

// ===== Profil Alumni ===== //
export async function getProfilAlumni() {
  const response = await fetch(`${BASE_URL}/profil-alumni`);
  const result = await response.json();
  return result;
}