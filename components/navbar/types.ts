// Navbar types
export interface User {
  id: string
  email: string
  role: 'ADMIN' | 'USER'
  profile?: {
    fotoProfil: string | null
  }
}

export interface NavbarProps {
  bannerVisible?: boolean
}
