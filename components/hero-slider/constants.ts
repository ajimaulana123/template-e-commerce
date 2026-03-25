export const MAIN_SLIDES = [
  {
    id: 1,
    title: "100% HALAL",
    subtitle: "Bersertifikat",
    hashtag: "#HalalMartJepang",
    description: "Semua produk bersertifikat halal resmi dari Japan Halal Association",
    period: "Belanja dengan tenang dan aman",
    bgColor: "bg-gradient-to-r from-green-600 to-emerald-700",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=500&fit=crop",
    cta: "JAMINAN HALAL 100% - BELANJA DENGAN TENANG!",
    link: "/products"
  },
  {
    id: 2,
    title: "FRESH DAILY",
    subtitle: "Kualitas Premium",
    hashtag: "#SegarSetiapHari",
    description: "Produk segar setiap hari langsung dari supplier terpercaya",
    period: "Dijamin segar dan berkualitas tinggi",
    bgColor: "bg-gradient-to-r from-blue-600 to-blue-700",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=500&fit=crop",
    cta: "DAPATKAN PRODUK SEGAR BERKUALITAS TINGGI!",
    link: "/products?sort=newest"
  },
  {
    id: 3,
    title: "GRAND OPENING",
    subtitle: "Diskon 30%",
    hashtag: "#PromoSpesial",
    description: "Promo spesial pembukaan untuk semua kategori produk",
    period: "Terbatas: 1-31 Maret 2026",
    bgColor: "bg-gradient-to-r from-red-500 to-red-600",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&h=500&fit=crop",
    cta: "BURUAN BELANJA SEBELUM PROMO BERAKHIR!",
    link: "/products?promo=true"
  }
]

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0
  }).format(price)
}
