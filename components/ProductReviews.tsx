'use client'

import { useState, useEffect } from 'react'
import { Star, User, Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Review {
  id: string
  rating: number
  review: string | null
  images: string[]
  createdAt: string
  userId: string
  user: {
    email: string
    profile: {
      fotoProfil: string | null
    } | null
  }
}

interface ProductReviewsProps {
  productId: string
  currentUserId?: string
  onEditReview?: (review: Review) => void
}

export default function ProductReviews({ productId, currentUserId, onEditReview }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const limit = 10

  useEffect(() => {
    fetchReviews(1)
  }, [productId])

  const fetchReviews = async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      
      const response = await fetch(`/api/reviews?productId=${productId}&page=${pageNum}&limit=${limit}`)
      if (response.ok) {
        const data = await response.json()
        
        if (pageNum === 1) {
          setReviews(data.reviews || [])
        } else {
          setReviews(prev => [...prev, ...(data.reviews || [])])
        }
        
        setTotalCount(data.pagination?.totalCount || 0)
        setHasMore(data.pagination?.hasMore || false)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchReviews(page + 1)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) {
      return
    }

    try {
      setDeleting(reviewId)
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        // Refresh reviews from page 1
        fetchReviews(1)
      } else {
        alert('Failed to delete review')
      }
    } catch (error) {
      alert('Failed to delete review')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        <div className="text-center py-8 border rounded-lg">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No reviews yet</p>
          <p className="text-sm text-gray-400">Be the first to review this product</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Customer Reviews ({totalCount})</h3>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4 space-y-3">
            {/* User Info */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {review.user.profile?.fotoProfil ? (
                    <img
                      src={review.user.profile.fotoProfil}
                      alt={review.user.email}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {review.user.email.split('@')[0]}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                </div>
              </div>

              {/* Edit/Delete Buttons for Own Review */}
              {currentUserId && review.userId === currentUserId && (
                <div className="flex space-x-2">
                  {onEditReview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onEditReview(review)
                      }}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDeleteReview(review.id)
                    }}
                    disabled={deleting === review.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
            </div>

            {/* Review Text */}
            {review.review && (
              <p className="text-gray-700">{review.review}</p>
            )}

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex space-x-2 overflow-x-auto">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            onClick={loadMore}
            disabled={loadingMore}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {loadingMore ? 'Loading...' : `Load More Reviews (${totalCount - reviews.length} remaining)`}
          </Button>
        </div>
      )}
    </div>
  )
}
