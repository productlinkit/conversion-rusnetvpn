# RusnetVPN single-screen LP — versi bento

Campaign LP satu layar dengan flow yang sama seperti `singlelp-rusnetvpn`
(LP → email → pilih plan + kartu → pending / gagal → sukses → akses), tapi
tampilannya mengikuti desain `lp-rusnetvpn`: background blush, kartu foto hero
dengan overlay merah tua, widget koneksi glass, tile putih, tombol pill hitam
dengan chip panah merah, ringkasan order di tile merah tua, font Plus Jakarta Sans.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:4830
npm run build      # hasil di dist/
```

Deploy ke Vercel: import repo, framework Vite, build `npm run build`, output `dist`.

## Demo flow

- Email `active@...` → sudah berlangganan (langsung login), `registered@...` → akun lama, lainnya → akun baru.
- Kartu diawali `0000` → pembayaran gagal, `1111` → pending, lainnya → sukses.
- `?decline=1` membuat percobaan bayar pertama gagal, `?debug=1` menampilkan event log.

## Yang berubah dari versi pertama

- `src/index.css` — token warna/font bento, overlay hero, glass, tombol.
- `src/components/Landing.jsx` — hero foto satu layar + tile benefit (mockup HP dihapus).
- `src/components/ConnWidget.jsx` — widget koneksi dari LP utama.
- `Button.jsx`, `FlowShell.jsx`, `CheckoutStep.jsx` — gaya bento; logika funnel tidak diubah.
