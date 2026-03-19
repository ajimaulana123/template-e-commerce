import { useState, useEffect } from 'react'

export function useProductReview(productId: string) {
  const [canReview, setCanReview] = useState(false)
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null)
  const [existingReview, setExistingReview] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)

  useEffect(() => {
    checkReviewEligibility()
  }, [productId])

  const checkReviewEligibility = async () => {
    try {
      const response = await fetch(`/api/reviews/check?productId=${productId}`)
      if (response.ok) {
        const data = await response.json()
        setCanReview(data.canReview)
        setReviewOrderId(data.orderId || null)
        setExistingReview(data.review || null)
        setCurrentUserId(data.userId || null)
      }
    } catch (error) {
      // Silent fail
    }
  }

  const openReviewModal = () => setShowReviewModal(true)
  const closeReviewModal = () => {
    setShowReviewModal(false)
    setExistingReview(null)
  }

  const handleEditReview = (review: any) => {
    setExistingReview(review)
    setShowReviewModal(true)
  }

  return {
    canReview,
    reviewOrderId,
    existingReview,
    currentUserId,
    showReviewModal,
    openReviewModal,
    closeReviewModal,
    handleEditReview
  }
}
