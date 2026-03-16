import { IconOption } from './types'

// Icon categories for better organization
export const ICON_CATEGORIES = {
  TECHNOLOGY: 'Technology',
  FASHION: 'Fashion & Beauty',
  HOME: 'Home & Garden',
  SPORTS: 'Sports & Recreation',
  ENTERTAINMENT: 'Entertainment',
  HEALTH: 'Health & Wellness',
  AUTOMOTIVE: 'Automotive',
  GENERAL: 'General'
} as const

// Available icons organized by category
export const DEFAULT_ICONS: IconOption[] = [
  // Technology
  { value: 'fas fa-laptop', label: 'Laptop', category: ICON_CATEGORIES.TECHNOLOGY },
  { value: 'fas fa-mobile-alt', label: 'Mobile', category: ICON_CATEGORIES.TECHNOLOGY },
  { value: 'fas fa-plug', label: 'Electronic', category: ICON_CATEGORIES.TECHNOLOGY },
  { value: 'fas fa-camera', label: 'Camera', category: ICON_CATEGORIES.TECHNOLOGY },
  { value: 'fas fa-gamepad', label: 'Gaming', category: ICON_CATEGORIES.TECHNOLOGY },
  { value: 'fas fa-headphones', label: 'Audio', category: ICON_CATEGORIES.TECHNOLOGY },
  { value: 'fas fa-tv', label: 'Television', category: ICON_CATEGORIES.TECHNOLOGY },
  
  // Fashion & Beauty
  { value: 'fas fa-tshirt', label: 'Fashion', category: ICON_CATEGORIES.FASHION },
  { value: 'fas fa-gem', label: 'Jewelry', category: ICON_CATEGORIES.FASHION },
  { value: 'fas fa-shoe-prints', label: 'Shoes', category: ICON_CATEGORIES.FASHION },
  { value: 'fas fa-glasses', label: 'Accessories', category: ICON_CATEGORIES.FASHION },
  
  // Home & Garden
  { value: 'fas fa-home', label: 'Home', category: ICON_CATEGORIES.HOME },
  { value: 'fas fa-couch', label: 'Furniture', category: ICON_CATEGORIES.HOME },
  { value: 'fas fa-utensils', label: 'Kitchen', category: ICON_CATEGORIES.HOME },
  { value: 'fas fa-seedling', label: 'Garden', category: ICON_CATEGORIES.HOME },
  { value: 'fas fa-tools', label: 'Tools', category: ICON_CATEGORIES.HOME },
  
  // Sports & Recreation
  { value: 'fas fa-dumbbell', label: 'Fitness', category: ICON_CATEGORIES.SPORTS },
  { value: 'fas fa-bicycle', label: 'Cycling', category: ICON_CATEGORIES.SPORTS },
  { value: 'fas fa-football-ball', label: 'Sports', category: ICON_CATEGORIES.SPORTS },
  { value: 'fas fa-swimming-pool', label: 'Swimming', category: ICON_CATEGORIES.SPORTS },
  
  // Entertainment
  { value: 'fas fa-book', label: 'Books', category: ICON_CATEGORIES.ENTERTAINMENT },
  { value: 'fas fa-music', label: 'Music', category: ICON_CATEGORIES.ENTERTAINMENT },
  { value: 'fas fa-film', label: 'Movies', category: ICON_CATEGORIES.ENTERTAINMENT },
  { value: 'fas fa-puzzle-piece', label: 'Games', category: ICON_CATEGORIES.ENTERTAINMENT },
  
  // Health & Wellness
  { value: 'fas fa-medkit', label: 'Health', category: ICON_CATEGORIES.HEALTH },
  { value: 'fas fa-pills', label: 'Medicine', category: ICON_CATEGORIES.HEALTH },
  { value: 'fas fa-heartbeat', label: 'Wellness', category: ICON_CATEGORIES.HEALTH },
  
  // Automotive
  { value: 'fas fa-car', label: 'Automotive', category: ICON_CATEGORIES.AUTOMOTIVE },
  { value: 'fas fa-motorcycle', label: 'Motorcycle', category: ICON_CATEGORIES.AUTOMOTIVE },
  { value: 'fas fa-truck', label: 'Truck', category: ICON_CATEGORIES.AUTOMOTIVE },
  
  // General
  { value: 'fas fa-th', label: 'General', category: ICON_CATEGORIES.GENERAL },
  { value: 'fas fa-gift', label: 'Gifts', category: ICON_CATEGORIES.GENERAL },
  { value: 'fas fa-baby', label: 'Baby', category: ICON_CATEGORIES.GENERAL },
  { value: 'fas fa-paw', label: 'Pets', category: ICON_CATEGORIES.GENERAL }
]

// Validation constants
export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9\s\-&]+$/
  },
  SLUG: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-z0-9\-]+$/
  }
} as const

// UI constants
export const UI_CONFIG = {
  ITEMS_PER_PAGE: 12,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 200,
  MAX_SEARCH_LENGTH: 100
} as const

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Field ini wajib diisi',
  INVALID_NAME: 'Nama kategori hanya boleh mengandung huruf, angka, spasi, dan tanda hubung',
  INVALID_SLUG: 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung',
  NAME_TOO_SHORT: `Nama kategori minimal ${VALIDATION_RULES.NAME.MIN_LENGTH} karakter`,
  NAME_TOO_LONG: `Nama kategori maksimal ${VALIDATION_RULES.NAME.MAX_LENGTH} karakter`,
  SLUG_TOO_SHORT: `Slug minimal ${VALIDATION_RULES.SLUG.MIN_LENGTH} karakter`,
  SLUG_TOO_LONG: `Slug maksimal ${VALIDATION_RULES.SLUG.MAX_LENGTH} karakter`,
  DUPLICATE_NAME: 'Nama kategori sudah digunakan',
  DUPLICATE_SLUG: 'Slug sudah digunakan',
  NETWORK_ERROR: 'Terjadi kesalahan jaringan. Silakan coba lagi.',
  SERVER_ERROR: 'Terjadi kesalahan server. Silakan coba lagi.',
  DELETE_CONFIRMATION: 'Apakah Anda yakin ingin menghapus kategori ini?',
  DELETE_WITH_PRODUCTS: 'Kategori ini memiliki produk. Semua produk akan ikut terhapus.'
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  CATEGORY_CREATED: 'Kategori berhasil dibuat',
  CATEGORY_UPDATED: 'Kategori berhasil diperbarui',
  CATEGORY_DELETED: 'Kategori berhasil dihapus'
} as const