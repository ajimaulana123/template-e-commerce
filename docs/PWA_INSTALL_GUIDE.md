# Panduan Install PWA (Progressive Web App)

Web dashboard kamu sekarang bisa di-install sebagai aplikasi di Android, iOS, dan Desktop!

## ✅ Yang Sudah Dikonfigurasi

- Service Worker untuk offline support
- Manifest.json dengan metadata aplikasi
- Icons (192x192 dan 512x512)
- Install prompt otomatis
- Offline fallback page

## 📱 Cara Install di Android

1. Buka web di **Chrome** browser
2. Tunggu beberapa detik, popup "Install app" akan muncul otomatis
3. Atau buka menu (⋮) → **"Install app"** atau **"Add to Home screen"**
4. Klik **Install**
5. Aplikasi akan muncul di home screen seperti app native

## 💻 Cara Install di Desktop (Windows/Mac/Linux)

### Chrome/Edge:
1. Buka web di browser
2. Lihat **icon install** (⊕ atau ⬇) di address bar (kanan atas)
3. Klik icon tersebut
4. Klik **Install**
5. Aplikasi akan terbuka di window terpisah

### Alternatif:
- Menu (⋮) → **"Install Dashboard Template..."**
- Atau tekan `Ctrl+Shift+A` (Windows) / `Cmd+Shift+A` (Mac)

## 🍎 Cara Install di iOS (iPhone/iPad)

1. Buka web di **Safari** (harus Safari, bukan Chrome)
2. Tap tombol **Share** (kotak dengan panah ke atas)
3. Scroll dan pilih **"Add to Home Screen"**
4. Edit nama jika perlu
5. Tap **Add**
6. Icon akan muncul di home screen

## 🔍 Troubleshooting

### Icon install tidak muncul?

**Pastikan:**
- Menggunakan **HTTPS** (atau localhost untuk testing)
- Browser support PWA (Chrome, Edge, Safari)
- Manifest.json accessible di `/manifest.json`
- Service worker berhasil register (cek di DevTools → Application → Service Workers)

**Cek di Browser DevTools:**
1. Buka DevTools (F12)
2. Tab **Application** (Chrome) atau **Storage** (Firefox)
3. Lihat **Manifest** - pastikan tidak ada error
4. Lihat **Service Workers** - pastikan status "activated"

### Testing PWA di Development:

Saat ini PWA **enabled di semua environment** untuk testing. Jika mau disable di development:

Edit `next.config.mjs`:
```javascript
disable: process.env.NODE_ENV === 'development',
```

### Verifikasi PWA:

1. Buka Chrome DevTools (F12)
2. Tab **Lighthouse**
3. Pilih **Progressive Web App**
4. Klik **Analyze page load**
5. Lihat score dan rekomendasi

## 🎨 Customize Icons

Untuk ganti icon dengan logo sendiri:

1. Siapkan logo PNG/SVG minimal 512x512px
2. Edit file `scripts/generate-pwa-icons.js`
3. Ganti SVG content dengan logo kamu
4. Run: `npm run icons:generate`

Atau gunakan online tool:
- https://realfavicongenerator.net
- https://www.pwabuilder.com/imageGenerator

## 🚀 Deploy ke Production

Setelah deploy (Vercel/Netlify/dll), PWA akan otomatis aktif karena menggunakan HTTPS.

**Vercel:**
```bash
vercel --prod
```

**Manual:**
```bash
npm run build
npm start
```

## 📊 Fitur PWA yang Aktif

✅ Install ke home screen/desktop
✅ Offline support dengan fallback page
✅ App-like experience (no browser UI)
✅ Fast loading dengan caching
✅ Auto-update saat ada versi baru
✅ Splash screen otomatis (Android)
✅ Shortcuts ke halaman penting

## 🔗 Resources

- [Next PWA Docs](https://ducanh-next-pwa.vercel.app/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
