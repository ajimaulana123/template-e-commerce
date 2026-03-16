import { CreateCategoryData, UpdateCategoryData, CategoryFormErrors } from './types'
import { VALIDATION_RULES, ERROR_MESSAGES, DEFAULT_ICONS } from './constants'

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[<>]/g, '') // Remove potential XSS characters
}

// Slug generation with security
export const generateSlug = (name: string): string => {
  return sanitizeInput(name)
    .toLowerCase()
    .normalize('NFD') // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s\-]/g, '') // Keep only alphanumeric, spaces, and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Validate category name
export const validateName = (name: string): string | null => {
  const sanitized = sanitizeInput(name)
  
  if (!sanitized) {
    return ERROR_MESSAGES.REQUIRED_FIELD
  }
  
  if (sanitized.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return ERROR_MESSAGES.NAME_TOO_SHORT
  }
  
  if (sanitized.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return ERROR_MESSAGES.NAME_TOO_LONG
  }
  
  if (!VALIDATION_RULES.NAME.PATTERN.test(sanitized)) {
    return ERROR_MESSAGES.INVALID_NAME
  }
  
  return null
}

// Validate slug
export const validateSlug = (slug: string): string | null => {
  const sanitized = sanitizeInput(slug)
  
  if (!sanitized) {
    return ERROR_MESSAGES.REQUIRED_FIELD
  }
  
  if (sanitized.length < VALIDATION_RULES.SLUG.MIN_LENGTH) {
    return ERROR_MESSAGES.SLUG_TOO_SHORT
  }
  
  if (sanitized.length > VALIDATION_RULES.SLUG.MAX_LENGTH) {
    return ERROR_MESSAGES.SLUG_TOO_LONG
  }
  
  if (!VALIDATION_RULES.SLUG.PATTERN.test(sanitized)) {
    return ERROR_MESSAGES.INVALID_SLUG
  }
  
  return null
}

// Validate icon
export const validateIcon = (icon: string): string | null => {
  if (!icon) {
    return ERROR_MESSAGES.REQUIRED_FIELD
  }
  
  const isValidIcon = DEFAULT_ICONS.some(iconOption => iconOption.value === icon)
  if (!isValidIcon) {
    return 'Icon tidak valid'
  }
  
  return null
}

// Comprehensive form validation
export const validateCategoryForm = (data: CreateCategoryData): CategoryFormErrors => {
  const errors: CategoryFormErrors = {}
  
  // Validate name
  const nameError = validateName(data.name)
  if (nameError) {
    errors.name = nameError
  }
  
  // Validate slug
  const slugError = validateSlug(data.slug)
  if (slugError) {
    errors.slug = slugError
  }
  
  // Validate icon
  const iconError = validateIcon(data.icon)
  if (iconError) {
    errors.icon = iconError
  }
  
  return errors
}

// Check if form has errors
export const hasFormErrors = (errors: CategoryFormErrors): boolean => {
  return Object.keys(errors).length > 0
}

// Sanitize form data before submission
export const sanitizeFormData = (data: CreateCategoryData): CreateCategoryData => {
  return {
    name: sanitizeInput(data.name),
    slug: sanitizeInput(data.slug.toLowerCase()),
    icon: data.icon.trim()
  }
}

// Validate update data
export const validateUpdateData = (data: UpdateCategoryData): CategoryFormErrors => {
  return validateCategoryForm(data)
}

// Rate limiting validation (client-side)
const requestTimestamps: number[] = []
const RATE_LIMIT = 5 // 5 requests
const TIME_WINDOW = 60000 // per minute

export const checkRateLimit = (): boolean => {
  const now = Date.now()
  
  // Remove old timestamps
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - TIME_WINDOW) {
    requestTimestamps.shift()
  }
  
  // Check if rate limit exceeded
  if (requestTimestamps.length >= RATE_LIMIT) {
    return false
  }
  
  // Add current timestamp
  requestTimestamps.push(now)
  return true
}

// CSRF token validation (if implemented)
export const validateCSRFToken = (token: string): boolean => {
  // This would validate against a server-generated CSRF token
  // For now, just check if token exists and has proper format
  return Boolean(token && token.length > 10)
}