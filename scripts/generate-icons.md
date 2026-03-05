# Generate PWA Icons

Untuk membuat icon PWA yang proper, kamu bisa:

## Option 1: Online Generator (Paling Mudah)
1. Buka https://realfavicongenerator.net
2. Upload logo kamu (minimal 512x512px)
3. Download dan extract ke folder `public/`

## Option 2: Manual dengan Image Editor
1. Buat 2 file PNG:
   - `icon-192x192.png` (192x192 pixels)
   - `icon-512x512.png` (512x512 pixels)
2. Simpan di folder `public/`

## Option 3: Gunakan Placeholder
Untuk testing, kamu bisa pakai icon sederhana:
- Buat kotak biru dengan text "D" di tengah
- Export sebagai PNG 192x192 dan 512x512

## Rekomendasi Design:
- Background: Solid color (sesuai theme_color di manifest.json)
- Logo: Simple, recognizable
- Padding: 10-15% dari edge
- Format: PNG dengan transparency
