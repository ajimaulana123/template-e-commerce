import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Truck, Package, Clock, MapPin, CreditCard, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DeliveryInfoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        <div className="text-center mb-8">
          <Truck className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Informasi Pengiriman</h1>
          <p className="text-gray-600">
            Layanan pengiriman cepat dan aman untuk wilayah Tokyo dan sekitarnya
          </p>
        </div>

        {/* Delivery Areas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Area Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-green-600 pl-4">
                <h3 className="font-semibold text-lg mb-1">Same Day Delivery</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Pesan sebelum jam 14:00, dikirim hari yang sama
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Shinjuku, Shibuya, Minato</li>
                  <li>• Chiyoda, Chuo, Meguro</li>
                  <li>• Setagaya, Nakano, Suginami</li>
                </ul>
                <p className="text-sm font-semibold text-green-600 mt-2">Biaya: ¥500</p>
              </div>

              <div className="border-l-4 border-blue-600 pl-4">
                <h3 className="font-semibold text-lg mb-1">Next Day Delivery</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Pengiriman keesokan hari untuk area Tokyo
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Seluruh area Tokyo 23 Ward</li>
                  <li>• Kawasaki, Yokohama</li>
                  <li>• Saitama, Chiba (area tertentu)</li>
                </ul>
                <p className="text-sm font-semibold text-blue-600 mt-2">Biaya: ¥300</p>
              </div>

              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="font-semibold text-lg mb-1">Standard Delivery (2-3 hari)</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Pengiriman ke seluruh Jepang
                </p>
                <p className="text-sm font-semibold text-purple-600 mt-2">
                  Biaya: ¥800 - ¥1,500 (tergantung lokasi)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Free Shipping */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Package className="w-5 h-5 text-green-600" />
              Gratis Ongkir!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 mb-3">
              Dapatkan gratis ongkir untuk pembelian minimal:
            </p>
            <ul className="space-y-2 text-green-800">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span><strong>¥5,000</strong> - Gratis Same Day Delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                <span><strong>¥3,000</strong> - Gratis Next Day Delivery</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Delivery Time Slots */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              Pilihan Waktu Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="border rounded-lg p-3">
                <p className="font-semibold">08:00 - 12:00</p>
                <p className="text-sm text-gray-600">Pagi</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="font-semibold">12:00 - 14:00</p>
                <p className="text-sm text-gray-600">Siang</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="font-semibold">14:00 - 16:00</p>
                <p className="text-sm text-gray-600">Sore</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="font-semibold">16:00 - 18:00</p>
                <p className="text-sm text-gray-600">Sore Akhir</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="font-semibold">18:00 - 20:00</p>
                <p className="text-sm text-gray-600">Malam</p>
              </div>
              <div className="border rounded-lg p-3">
                <p className="font-semibold">20:00 - 21:00</p>
                <p className="text-sm text-gray-600">Malam Akhir</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-green-600" />
              Metode Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold">Credit Card / Debit Card</p>
                  <p className="text-sm text-gray-600">Visa, Mastercard, JCB, AMEX</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">Cash on Delivery (COD)</p>
                  <p className="text-sm text-gray-600">Bayar saat barang diterima (+¥300)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-semibold">Bank Transfer</p>
                  <p className="text-sm text-gray-600">Transfer ke rekening toko</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-semibold">E-Money</p>
                  <p className="text-sm text-gray-600">PayPay, Line Pay, Rakuten Pay</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Catatan Penting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-orange-900">
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Produk frozen/chilled memerlukan penanganan khusus (tambahan biaya ¥200)</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Pastikan ada yang menerima saat pengiriman untuk produk frozen</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Pengiriman tidak tersedia pada hari libur nasional Jepang</span>
              </li>
              <li className="flex gap-2">
                <span className="flex-shrink-0">•</span>
                <span>Untuk area di luar Tokyo, estimasi waktu dapat berbeda</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">
            Ada pertanyaan tentang pengiriman?
          </p>
          <a
            href="tel:+81-3-1234-5678"
            className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Hubungi Customer Service
          </a>
        </div>
      </div>
    </div>
  )
}
