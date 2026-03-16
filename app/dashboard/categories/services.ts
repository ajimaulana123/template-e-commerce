import { 
  Category, 
  CreateCategoryData, 
  UpdateCategoryData, 
  CategoryApiResponse, 
  CategoriesApiResponse 
} from './types'
import { ERROR_MESSAGES } from './constants'

// Base API configuration
const API_BASE = '/api/categories'
const REQUEST_TIMEOUT = 10000 // 10 seconds

// HTTP client with security headers
class ApiClient {
  private async request<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT)
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // CSRF protection
          ...options.headers,
        },
      })
      
      clearTimeout(timeoutId)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout')
        }
        throw error
      }
      
      throw new Error('Unknown error occurred')
    }
  }
  
  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' })
  }
  
  async post<T>(url: string, data: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  
  async put<T>(url: string, data: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
  
  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' })
  }
}

const apiClient = new ApiClient()

// Category service class
export class CategoryService {
  // Get all categories
  static async getCategories(): Promise<Category[]> {
    try {
      // API returns categories array directly
      const categories = await apiClient.get<Category[]>(API_BASE)
      return categories
    } catch (error) {
      console.error('CategoryService.getCategories:', error)
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
  }
  
  // Get single category
  static async getCategory(id: string): Promise<Category> {
    try {
      // API returns category object directly
      const category = await apiClient.get<Category>(`${API_BASE}/${id}`)
      return category
    } catch (error) {
      console.error('CategoryService.getCategory:', error)
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR)
    }
  }
  
  // Create category
  static async createCategory(data: CreateCategoryData): Promise<Category> {
    try {
      console.log('CategoryService.createCategory - Request data:', data)
      
      // API returns created category directly
      const category = await apiClient.post<Category>(API_BASE, data)
      
      console.log('CategoryService.createCategory - Response:', category)
      return category
    } catch (error) {
      console.error('CategoryService.createCategory - Error:', error)
      
      if (error instanceof Error) {
        console.error('CategoryService.createCategory - Error message:', error.message)
        
        // Handle specific error cases
        if (error.message.includes('duplicate') || error.message.includes('unique') || error.message.includes('already exists')) {
          throw new Error(ERROR_MESSAGES.DUPLICATE_NAME)
        }
        
        if (error.message.includes('validation') || error.message.includes('required')) {
          throw new Error('Data tidak valid: ' + error.message)
        }
        
        // Return the actual error message from API
        throw new Error(error.message)
      }
      
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }
  }
  
  // Update category
  static async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    try {
      // API returns updated category directly
      const category = await apiClient.put<Category>(`${API_BASE}/${id}`, data)
      return category
    } catch (error) {
      console.error('CategoryService.updateCategory:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('duplicate') || error.message.includes('unique')) {
          throw new Error(ERROR_MESSAGES.DUPLICATE_NAME)
        }
        
        if (error.message.includes('validation')) {
          throw new Error('Data tidak valid')
        }
        
        if (error.message.includes('not found')) {
          throw new Error('Kategori tidak ditemukan')
        }
        
        // Return the actual error message from API
        throw new Error(error.message)
      }
      
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }
  }
  
  // Delete category
  static async deleteCategory(id: string): Promise<void> {
    try {
      // API returns success message or throws error
      await apiClient.delete(`${API_BASE}/${id}`)
    } catch (error) {
      console.error('CategoryService.deleteCategory:', error)
      
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new Error('Kategori tidak ditemukan')
        }
        
        if (error.message.includes('constraint') || error.message.includes('foreign key')) {
          throw new Error('Kategori tidak dapat dihapus karena masih memiliki produk')
        }
        
        // Return the actual error message from API
        throw new Error(error.message)
      }
      
      throw new Error(ERROR_MESSAGES.SERVER_ERROR)
    }
  }
  
  // Check if category name exists
  static async checkNameExists(name: string, excludeId?: string): Promise<boolean> {
    try {
      const categories = await this.getCategories()
      return categories.some(cat => 
        cat.name.toLowerCase() === name.toLowerCase() && 
        cat.id !== excludeId
      )
    } catch (error) {
      console.error('CategoryService.checkNameExists:', error)
      // If we can't check, assume it doesn't exist to allow the API to handle duplicates
      return false
    }
  }
  
  // Check if slug exists
  static async checkSlugExists(slug: string, excludeId?: string): Promise<boolean> {
    try {
      const categories = await this.getCategories()
      return categories.some(cat => 
        cat.slug === slug.toLowerCase() && 
        cat.id !== excludeId
      )
    } catch (error) {
      console.error('CategoryService.checkSlugExists:', error)
      // If we can't check, assume it doesn't exist to allow the API to handle duplicates
      return false
    }
  }
}

// Error handling utility
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  
  return ERROR_MESSAGES.SERVER_ERROR
}