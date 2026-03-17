import Link from 'next/link'

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="text-xl xl:text-2xl font-bold">
        <span className="text-blue-600">jakarta</span>
        <span className="text-orange-500">notebook</span>
      </div>
      <div className="text-xs text-gray-500 hidden lg:block">
        <div>Gudang Gadget Murahnya</div>
      </div>
    </Link>
  )
}

export const MobileLogo = () => {
  return (
    <Link href="/" className="flex items-center space-x-1">
      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xs">JN</span>
      </div>
      <div className="text-sm font-bold">
        <span className="text-blue-600">jakarta</span>
        <span className="text-orange-500">notebook</span>
      </div>
    </Link>
  )
}
