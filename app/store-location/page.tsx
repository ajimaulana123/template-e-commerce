import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Clock, Phone, Mail, Train } from 'lucide-react'

export default function StoreLocationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Lokasi Toko Kami</h1>

        {/* Main Store Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Halal Mart Tokyo - Main Store
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Alamat</h3>
              <p className="text-gray-600">
                〒160-0022<br />
                Tokyo, Shinjuku City, Shinjuku 3-chōme-1-26<br />
                Shinjuku Maynds Tower, 1st Floor
              </p>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Jam Operasional</h3>
                <p className="text-gray-600">
                  Senin - Minggu: 10:00 - 22:00<br />
                  <span className="text-sm text-green-600">Buka setiap hari termasuk hari libur</span>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Train className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Akses Transportasi</h3>
                <ul className="text-gray-600 space-y-1">
                  <li>• JR Shinjuku Station - 5 menit jalan kaki</li>
                  <li>• Tokyo Metro Marunouchi Line - 3 menit jalan kaki</li>
                  <li>• Toei Shinjuku Line - 7 menit jalan kaki</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Kontak</h3>
                <p className="text-gray-600">
                  Tel: +81-3-1234-5678<br />
                  WhatsApp: +81-90-1234-5678
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600">info@halalmart-tokyo.jp</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Peta Lokasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Google Maps akan ditampilkan di sini</p>
                <p className="text-sm mt-1">Koordinat: 35.6895° N, 139.7006° E</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 mb-2">Informasi Tambahan</h3>
          <ul className="text-sm text-green-800 space-y-1">
            <li>✓ Parkir tersedia (berbayar)</li>
            <li>✓ Musholla tersedia di lantai 2</li>
            <li>✓ Staf berbahasa Indonesia, Inggris, dan Jepang</li>
            <li>✓ Pembayaran: Cash, Credit Card, E-Money (Suica, Pasmo)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
