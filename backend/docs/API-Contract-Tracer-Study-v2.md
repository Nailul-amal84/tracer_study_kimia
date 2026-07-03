# API Contract v2 — Tracer Study Kimia UINAR
(disesuaikan dengan flow/sitemap yang sudah dibuat)

Base URL: `https://api-tracer.uinar.ac.id/api`
Semua response format JSON. Endpoint admin butuh header `Authorization: Bearer {token}`.

---

## 0. Ringkasan Halaman & Sumber Data

| Halaman | Akses | Sumber Data |
|---|---|---|
| Beranda/Home | Publik | Statis / dari DB (banner, dll) |
| Tentang (Struktur Organisasi, Surveyor, Peneliti) | Publik | DB, dikelola admin |
| Informasi (artikel) | Publik | DB, dikelola admin (CRUD) |
| Tracer Study (3 jenis) | Publik, sebagian perlu login (tergantung jenis) | Link Google Form (per jenis) |
| User Survey (rekap hasil per jenis) | Publik | Hasil sync dari Google Sheet API |
| FAQ | Publik | DB, dikelola admin |
| Laporan & Saran | Publik (kirim pesan) | DB |
| Profil Alumni | Publik | DB, dikelola admin (CRUD) |
| Login Admin | - | - |

---

## 1. Autentikasi (Admin)

### 1.1 Login
`POST /auth/login`
```json
// request
{ "email": "admin@uinar.ac.id", "password": "rahasia123" }
```
```json
// response 200
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "id": 1, "nama": "Admin Tracer", "role": "admin" }
}
```
Response gagal (401): `{ "success": false, "message": "Email atau password salah" }`

### 1.2 Logout
`POST /auth/logout` — header token wajib
Response: `{ "success": true, "message": "Berhasil logout" }`

---

## 2. Tracer Study (3 jenis: Pengguna Lulusan, Mahasiswa, Alumni)

### 2.1 Ambil Daftar Jenis Tracer & Link Google Form
`GET /tracer-study`

Response (200):
```json
{
  "success": true,
  "data": [
    {
      "jenis": "pengguna_lulusan",
      "label": "Tracer Pengguna Lulusan",
      "google_form_url": "https://forms.gle/xxxxxxx",
      "perlu_login": false
    },
    {
      "jenis": "mahasiswa",
      "label": "Tracer Mahasiswa",
      "google_form_url": "https://forms.gle/yyyyyyy",
      "perlu_login": true
    },
    {
      "jenis": "alumni",
      "label": "Tracer Alumni",
      "google_form_url": "https://forms.gle/zzzzzzz",
      "perlu_login": true
    }
  ]
}
```
> Status `perlu_login`: Pengguna Lulusan = **tidak perlu login**, Mahasiswa & Alumni = **wajib login**. Disimpan sebagai data di database (bukan hardcode di kode), jadi kalau ada perubahan kebijakan nanti, admin tinggal ubah lewat dashboard tanpa perlu ubah kode/deploy ulang.

### 2.2 Update Link Google Form per Jenis (admin only)
`PUT /tracer-study/{jenis}`
Header: token

Request:
```json
{ "google_form_url": "https://forms.gle/xxxxxxx" }
```
Response: `{ "success": true, "message": "Link berhasil diperbarui" }`

---

## 3. User Survey (Rekap Hasil — sinkron dari Google Sheet)

### 3.1 Trigger Sync Manual dari Google Sheet (admin only)
`POST /tracer-study/{jenis}/sync`
Header: token

Response (200):
```json
{
  "success": true,
  "message": "Sinkronisasi berhasil",
  "total_data_baru": 12,
  "terakhir_sync": "2026-06-30T09:00:00Z"
}
```
> Back end juga bisa jalankan sync ini otomatis pakai scheduler/cron (misal tiap 1 jam), tidak harus selalu dipicu manual oleh admin.

### 3.2 Lihat Rekap/Statistik Hasil Survey (publik)
`GET /tracer-study/{jenis}/hasil`

Contoh untuk jenis = alumni:
```json
{
  "success": true,
  "terakhir_update": "2026-06-30T09:00:00Z",
  "total_responden": 250,
  "data": {
    "status_pekerjaan": {
      "bekerja": 180,
      "belum_bekerja": 40,
      "wirausaha": 20,
      "melanjutkan_studi": 10
    },
    "rata_rata_lama_tunggu_bulan": 2.8,
    "kesesuaian_bidang": { "sesuai": 150, "tidak_sesuai": 30 },
    "per_tahun_lulus": [
      { "tahun_lulus": 2022, "total": 90, "bekerja": 75 },
      { "tahun_lulus": 2023, "total": 95, "bekerja": 60 }
    ]
  }
}
```
> ⚠️ **PERLU DIKONFIRMASI LEBIH LANJUT**: Struktur field di dalam "data" akan menyesuaikan kolom yang ada di Google Sheet masing-masing jenis tracer (karena pertanyaan tiap jenis beda-beda). Field-field di atas masih contoh/placeholder, harus disesuaikan lagi setelah melihat kolom asli di Google Sheet/Form punya kalian.

### 3.3 [OPSIONAL — INTERNAL/ADMIN SAJA] Lihat Data Mentah Hasil Survey dengan Pagination
`GET /tracer-study/{jenis}/hasil/data?page=1&limit=20`
Header: token (admin only)

> Sesuai keputusan tim: data mentah responden TIDAK ditampilkan ke publik. Endpoint ini hanya untuk keperluan internal admin (misal cross-check data), bukan dikonsumsi oleh halaman publik. Kalau tidak dibutuhkan sama sekali, endpoint ini boleh dihapus dari scope.

Response: list per baris jawaban.

---

## 4. Informasi (Artikel)

### 4.1 List Artikel (publik)
`GET /informasi?page=1&limit=10`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "judul": "Hasil Tracer Study 2025 Diumumkan",
      "ringkasan": "Tracer study tahun ini mencatat...",
      "thumbnail": "https://.../thumb1.jpg",
      "created_at": "2026-05-01T08:00:00Z"
    }
  ],
  "pagination": { "current_page": 1, "total_page": 3, "total_data": 25 }
}
```

### 4.2 Detail Artikel + Preview/Unduh (publik)
`GET /informasi/{id}`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "judul": "Hasil Tracer Study 2025 Diumumkan",
    "isi": "Konten lengkap artikel...",
    "file_url": "https://.../laporan-2025.pdf",
    "created_at": "2026-05-01T08:00:00Z"
  }
}
```

### 4.3 Tambah / Edit / Hapus Artikel (admin only)
`POST /informasi` | `PUT /informasi/{id}` | `DELETE /informasi/{id}`
Header: token
Request (POST/PUT): `judul`, `isi`, `file` (upload), `thumbnail` (upload)

---

## 5. Profil Alumni

### 5.1 List Profil Alumni (publik)
`GET /profil-alumni?tahun_lulus=2023&page=1&limit=12`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nama": "Budi Santoso",
      "foto_url": "https://.../foto1.jpg",
      "tahun_lulus": 2023,
      "deskripsi_profesi": "Software Engineer di PT Maju Jaya"
    }
  ],
  "pagination": { "current_page": 1, "total_page": 2, "total_data": 20 }
}
```

### 5.2 Tambah / Edit / Hapus Profil Alumni (admin only)
`POST /profil-alumni` | `PUT /profil-alumni/{id}` | `DELETE /profil-alumni/{id}`
Header: token
Request: `nama`, `foto` (upload), `tahun_lulus`, `deskripsi_profesi`

---

## 6. Tentang

### 6.1 Struktur Organisasi (publik)
`GET /tentang/struktur-organisasi`
```json
{
  "success": true,
  "data": [
    { "nama": "Dr. Ahmad", "jabatan": "Ketua Tracer", "foto_url": "https://.../foto.jpg" }
  ]
}
```

### 6.2 Surveyor (publik)
`GET /tentang/surveyor` — struktur response sama seperti 6.1

### 6.3 Peneliti (publik)
`GET /tentang/peneliti` — struktur response sama seperti 6.1

### 6.4 Update Data Tentang (admin only)
`PUT /tentang/{jenis}` — jenis: `struktur-organisasi` | `surveyor` | `peneliti`
Header: token

---

## 7. FAQ

### 7.1 List FAQ (publik)
`GET /faq`
```json
{
  "success": true,
  "data": [
    { "id": 1, "pertanyaan": "Apa itu tracer study?", "jawaban": "Tracer study adalah..." }
  ]
}
```

### 7.2 Tambah / Edit / Hapus FAQ (admin only)
`POST /faq` | `PUT /faq/{id}` | `DELETE /faq/{id}`
Header: token

---

## 8. Laporan & Saran

### 8.1 Kirim Pesan/Saran (publik)
`POST /laporan-saran`
```json
// request
{
  "nama": "Budi Santoso",
  "email": "budi@email.com",
  "pesan": "Mohon update link Google Form-nya, sudah expired."
}
```
```json
// response 201
{ "success": true, "message": "Terima kasih, masukan Anda sudah kami terima" }
```

### 8.2 Lihat Semua Pesan (admin only)
`GET /laporan-saran?page=1&limit=20`
Header: token
```json
{
  "success": true,
  "data": [
    { "id": 1, "nama": "Budi Santoso", "email": "budi@email.com", "pesan": "...", "created_at": "..." }
  ],
  "pagination": { "current_page": 1, "total_page": 2, "total_data": 30 }
}
```

---

## 9. Kode Status HTTP

| Kode | Arti |
|---|---|
| 200 | Sukses |
| 201 | Sukses, data dibuat |
| 401 | Belum login / token salah |
| 403 | Tidak punya akses |
| 404 | Data tidak ditemukan |
| 422 | Validasi gagal |
| 500 | Error server |

---

## 10. Hal yang Masih Perlu Dikonfirmasi
- ⚠️ **PERLU DIKONFIRMASI LEBIH LANJUT**: Field/kolom pasti di tiap Google Sheet (untuk struktur response endpoint 3.2), karena pertanyaan tiap jenis tracer berbeda.
- Jenis tracer mana saja yang `perlu_login = true`, dan sistem login-nya pakai apa (akun mahasiswa/SSO kampus, atau bikin akun sendiri). → **SUDAH DIPUTUSKAN: Pengguna Lulusan = tidak perlu login, Mahasiswa & Alumni = wajib login.** ⚠️ **PERLU DIKONFIRMASI LEBIH LANJUT**: sistem login user (pakai akun mahasiswa/SSO kampus yang sudah ada, atau bikin sistem akun baru khusus dari nol).
- ~~Data mentah vs rekap~~ → **SUDAH DIPUTUSKAN: hanya rekap/statistik yang ditampilkan ke publik (Opsi A), data mentah responden tidak ditampilkan.** Endpoint 3.3 (data mentah) sebaiknya dihapus dari contract atau dijadikan admin-only saja kalau memang dibutuhkan untuk keperluan internal.
- ~~Frekuensi sync~~ → **SUDAH DIPUTUSKAN: sync berkala (bukan real-time/manual).** Interval pastinya (per jam/hari) belum ditentukan — sebaiknya dibuat **configurable** di back end (misal lewat config/env variable atau tabel pengaturan), default sementara bisa pakai cron tiap 6 jam, nanti tinggal diubah tanpa perlu ubah banyak kode.

---

## 11. Mapping ke Front End (rekomendasi halaman)
1. Beranda/Home
2. Tentang → tab/sub-halaman: Struktur Organisasi, Surveyor, Peneliti
3. Informasi → list artikel → detail (preview + tombol unduh)
4. Tracer Study → pilih jenis → tombol "Isi Kuisioner" (redirect ke Google Form) + tab "Lihat Hasil Survey" (rekap statistik + grafik)
5. FAQ → accordion list
6. Laporan & Saran → form kirim pesan → notifikasi sukses
7. Profil Alumni → grid/list card alumni dengan filter tahun lulus
8. Login Admin → form login
9. Dashboard Admin → kelola artikel, profil alumni, FAQ, struktur organisasi, link Google Form, lihat pesan masuk
