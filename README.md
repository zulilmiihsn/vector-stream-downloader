# 🎨 Vectorizer.io SVG Downloader

**Chrome Extension untuk download SVG dari vectorizer.io dengan mudah (Bypass Download Button).**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-green.svg)

## ✨ Fitur Utama

- **Auto-Detect**: Tombol download muncul otomatis ketika konversi selesai.
- **Preview Bypass**: Mengambil data SVG langsung dari preview element di DOM.
- **1-Click Download**: Simpan SVG langsung ke folder Downloads.
- **Smart Draggable Button**: Geser tombol kemana saja tanpa download accidental.
- **Keyboard Shortcut**: `Alt + Shift + D` untuk download instan.
- **Smart Naming**: Nama file otomatis sesuai judul gambar.

---

## 🚀 Cara Install (2 Menit)

1. **Buka Chrome Extensions**

   - Ketik `chrome://extensions/` di address bar.
   - Atau klik Menu (⋮) → Extensions → Manage Extensions.

2. **Aktifkan Developer Mode**

   - Nyalakan toggle **"Developer mode"** di pojok kanan atas.

3. **Load Extension**

   - Klik tombol **"Load unpacked"** (kiri atas).
   - Pilih folder project ini: `vectorizer-downloader`.

4. **Selesai!**
   - Pastikan extension muncul dan toggle-nya **On**.
   - (Opsional) Pin extension ke toolbar untuk akses cepat.

---

## 🎮 Cara Menggunakan

### Cara 1: Floating Button (Paling Mudah)

1. Buka [vectorizer.io](https://www.vectorizer.io).
2. Upload gambar kamu.
3. Tunggu proses konversi selesai.
4. Klik tombol **"Download SVG"** berwarna biru di pojok kanan atas (atau posisi terakhir drop).

### Cara 2: Keyboard Shortcut (Paling Cepat)

- Tekan **`Alt + Shift + D`** (Windows/Linux)

---

## 📂 Struktur File

Extension ini berjalan dengan file-file berikut:

```text
vectorizer-downloader/
├── manifest.json      # Konfigurasi utama extension
├── content.js         # Script yang berjalan di web (Extract SVG & UI)
├── background.js      # Script background (Handle download file)
├── styles.css         # Styling UI (Tombol & Notifikasi)
├── popup.html         # Tampilan saat icon extension diklik
├── popup.js           # Logic untuk popup
└── icons/             # Folder icon extension
```

---

## ❓ Troubleshooting

| Masalah                   | Solusi                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Tombol tidak muncul?**  | Pastikan kamu ada di halaman hasil (`/images/...`), tunggu SVG selesai loading, atau refresh halaman.       |
| **Icon tidak muncul?**    | Hapus extension (Remove) lalu pilih "Load unpacked" lagi untuk refresh cache icon.                          |
| **Download tidak jalan?** | Cek permission download Chrome, pastikan folder Downloads bisa diakses.                                     |
| **Shortcut tidak jalan?** | Cek konflik shortcut di `chrome://extensions/shortcuts`. Pastikan Alt+Shift+D tidak dipakai extension lain. |

---

## ⚠️ Disclaimer

Extension ini dibuat untuk **Personal & Educational Use**. Tool ini bekerja dengan mengambil data SVG yang sudah di-render browser (publicly accessible DOM). Gunakan dengan bijak.

---

**Made with ❤️ for easy vectorization**
