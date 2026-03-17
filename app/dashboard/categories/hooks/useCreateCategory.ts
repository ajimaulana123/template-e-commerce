import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CreateCategoryData, 
  CategoryFormErrors,
  CreateCategoryState
} from '../types'
import { CategoryService, handleApiError } from '../services'
import { 
  validateCategoryForm, 
  sanitizeFormData, 
  generateSlug, 
  checkRateLimit 
} from '../validation'
import { SUCCESS_MESSAGES } from '../constants'
import { useCategoryContext } from '../CategoryContext'
import { logger } from '@/lib/logger'

export const useCreateCategory = () => {
  const router = useRouter()
  const { actions: categoryActions } = useCategoryContext()
  const [state, setState] = useState<CreateCategoryState>({
    loading: false,
    error: null,
    success: null
  })
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
    icon: 'fas fa-th',
    slug: ''
  })
  const [errors, setErrors] = useState<CategoryFormErrors>({})

  // Update state helper
  const updateState = useCallback((updates: Partial<CreateCategoryState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  // Form handlers
  const updateFormData = useCallback((updates: Partial<CreateCategoryData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    
    // Auto-generate slug when name changes
    if (updates.name !== undefined) {
      const newSlug = generateSlug(updates.name)
      setFormData(prev => ({ ...prev, slug: newSlug }))
    }
    
    // Clear errors when user types
    if (Object.keys(errors).length > 0) {
      setErrors({})
    }
  }, [errors])

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      icon: 'fas fa-th',
      slug: ''
    })
    setErrors({})
    updateState({ error: null, success: null })
  }, [updateState])

  // Submit handler with optimistic update
  const submitForm = useCallback(async () => {
    logger.debug('Category creation started')
    
    if (!checkRateLimit()) {
      updateState({ error: 'Terlalu banyak permintaan. Silakan tunggu sebentar.' })
      return false
    }

    updateState({ loading: true, error: null, success: null })

    try {
      const sanitizedData = sanitizeFormData(formData)
      
      const validationErrors = validateCategoryForm(sanitizedData)
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        updateState({ error: 'Mohon perbaiki kesalahan pada form' })
        logger.warn('Category validation failed', { errorCount: Object.keys(validationErrors).length })
        return false
      }

      logger.debug('Creating category')
      const newCategory = await CategoryService.createCategory(sanitizedData)
      logger.info('Category created successfully', { categoryId: newCategory.id, categoryName: newCategory.name })
      
      // Optimistic update - add to context immediately
      categoryActions.addCategory(newCategory)
      
      resetForm()
      updateState({ success: SUCCESS_MESSAGES.CATEGORY_CREATED })
      
      // Optional: Still refresh router for server-side consistency
      // But UI is already updated via context
      setTimeout(() => router.refresh(), 100)
      
      return true
    } catch (error) {
      logger.error('Category creation failed', error)
      
      // Handle specific API errors
      if (error instanceof Error) {
        if (error.message.includes('already exists')) {
          if (error.message.includes('name')) {
            setErrors({ name: 'Nama kategori sudah digunakan' })
          } else if (error.message.includes('slug')) {
            setErrors({ slug: 'Slug sudah digunakan' })
          }
        }
      }
      
      updateState({ error: handleApiError(error) })
      return false
    } finally {
      updateState({ loading: false })
    }
  }, [formData, updateState, resetForm, router, categoryActions])

  return {
    formData,
    errors,
    state,
    actions: {
      updateFormData,
      resetForm,
      submitForm
    }
  }
}