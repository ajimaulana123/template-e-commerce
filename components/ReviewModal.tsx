'use client'

import { useState } from 'react'
import { Star, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface ReviewModalProps {
  productId: string
  productName: string
  orderId: string
  existingReview?: {
    id: string
    rating: number
    review: string | null
  } | null
  onClose: () => void
  onSuccess: () => void
}

export default function ReviewModal({ 
  productId, 
  productName, 
  orderId,
  existingReview,
  onClose, 
  onSuccess 
}: ReviewModalProps) {
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [review, setReview] = useState(existingReview?.review || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const isEditMode = !!existingReview

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const url = isEditMode ? `/api/reviews/${existingReview.id}` : '/api/reviews'
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          orderId,
          rating,
          review: review.trim() || null,
          images: []
        })
      })

      if (response.ok) {
        onSuccess()
        onClose()
      } else {
        const data = await response.json()
        setError(data.error || `Failed to ${isEditMode ? 'update' : 'submit'} review`)
      }
    } catch (error) {
      setError(`Failed to ${isEditMode ? 'update' : 'submit'} review`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            {isEditMode ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Name */}
        <p className="text-sm text-gray-600">{productName}</p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded">
            {error}
          </div>
        )}

        {/* Rating Stars */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating</label>
          <div className="flex items-center space-x-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoveredRating(i + 1)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    i < (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Review (Optional)</label>
          <Textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 text-right">
            {review.length}/500
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || rating === 0}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {submitting ? (isEditMode ? 'Updating...' : 'Submitting...') : (isEditMode ? 'Update Review' : 'Submit Review')}
          </Button>
        </div>
      </div>
    </div>
  )
}
