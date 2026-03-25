import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, CheckCircle, FileText, Award, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function HalalCertificatePage() {
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
          <Shield className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sertifikasi Halal</h1>
          <p className="text-gray-600">
            Komitmen kami menyediakan produk halal yang terpercaya dan tersertifikasi
          </p>
        </div>

        {/* Certification Bodies */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Lembaga Sertifikasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">MUI (Indonesia)</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Majelis Ulama Indonesia - Lembaga sertifikasi halal terpercaya dari Indonesia
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sertifikat Valid</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">JAKIM (Malaysia)</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Jabatan Kemajuan Islam Malaysia - Standar halal internasional
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sertifikat Valid</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">JMHC (Japan)</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Japan Muslim Halal Certification - Sertifikasi lokal Jepang
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sertifikat Valid</span>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">IFANCA (USA)</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Islamic Food and Nutrition Council of America
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Sertifikat Valid</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Commitment */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Komitmen Kami</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">100% Produk Halal</h3>
                  <p className="text-sm text-gray-600">
                    Semua produk yang kami jual telah tersertifikasi halal dari lembaga yang diakui
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Verifikasi Berkala</h3>
                  <p className="text-sm text-gray-600">
                    Kami melakukan audit dan verifikasi sertifikat halal secara berkala
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Transparansi Penuh</h3>
                  <p className="text-sm text-gray-600">
                    Informasi sertifikat halal dapat diakses untuk setiap produk
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Rantai Pasok Halal</h3>
                  <p className="text-sm text-gray-600">
                    Dari supplier hingga ke tangan Anda, kami jaga kehalalannya
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Verify */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Cara Verifikasi Sertifikat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span>Cek logo halal pada kemasan produk</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <span>Scan QR code pada produk untuk melihat detail sertifikat</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span>Atau tanyakan kepada staf kami untuk informasi lebih lanjut</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Contact for Questions */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h3 className="font-semibold text-green-900 mb-2">Ada Pertanyaan tentang Halal?</h3>
          <p className="text-sm text-green-800 mb-4">
            Tim kami siap membantu menjawab pertanyaan Anda tentang sertifikasi halal
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:halal@halalmart-tokyo.jp"
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Email Kami
            </a>
            <a
              href="tel:+81-3-1234-5678"
              className="px-6 py-2 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              Hubungi Kami
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
