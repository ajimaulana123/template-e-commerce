'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Question {
  id: string
  question: string
  answer: string | null
  answeredAt: string | null
  createdAt: string
  user: {
    email: string
  }
}

interface ProductQuestionsProps {
  productId: string
}

export default function ProductQuestions({ productId }: ProductQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unanswered'>('all')
  const [showAskForm, setShowAskForm] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const limit = 10

  useEffect(() => {
    fetchQuestions(1)
  }, [productId, filter])

  const fetchQuestions = async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true)
      } else {
        setLoadingMore(true)
      }
      
      const response = await fetch(`/api/questions?productId=${productId}&filter=${filter}&page=${pageNum}&limit=${limit}`)
      if (response.ok) {
        const data = await response.json()
        
        if (pageNum === 1) {
          setQuestions(data.questions || [])
        } else {
          setQuestions(prev => [...prev, ...(data.questions || [])])
        }
        
        setTotalCount(data.pagination?.totalCount || 0)
        setHasMore(data.pagination?.hasMore || false)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchQuestions(page + 1)
    }
  }

  const handleSubmitQuestion = async () => {
    if (!newQuestion.trim()) {
      setError('Please enter your question')
      return
    }

    if (newQuestion.length > 500) {
      setError('Question is too long (max 500 characters)')
      return
    }

    try {
      setSubmitting(true)
      setError('')

      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          question: newQuestion
        })
      })

      if (response.ok) {
        setNewQuestion('')
        setShowAskForm(false)
        fetchQuestions(1)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit question')
      }
    } catch (error) {
      setError('Failed to submit question')
    } finally {
      setSubmitting(false)
    }
  }

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@')
    if (username.length <= 2) return email
    return username[0] + '*'.repeat(username.length - 2) + username[username.length - 1] + '@' + domain
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <h3 className="text-lg sm:text-xl font-bold">Product Questions ({totalCount})</h3>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={`text-xs sm:text-sm h-8 ${filter === 'all' ? 'bg-blue-600 text-white' : ''}`}
            >
              All
            </Button>
            <Button
              variant={filter === 'unanswered' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unanswered')}
              className={`text-xs sm:text-sm h-8 ${filter === 'unanswered' ? 'bg-blue-600 text-white' : ''}`}
            >
              Unanswered
            </Button>
          </div>
        </div>
        <Button
          onClick={() => setShowAskForm(!showAskForm)}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-9 sm:h-auto w-full sm:w-auto"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask Question
        </Button>
      </div>

      {/* Ask Question Form */}
      {showAskForm && (
        <div className="border rounded-lg p-3 sm:p-4 bg-blue-50">
          <h4 className="font-semibold mb-3 text-sm sm:text-base">Ask a Question</h4>
          {error && (
            <div className="bg-red-50 text-red-600 text-xs sm:text-sm p-2 sm:p-3 rounded mb-3">
              {error}
            </div>
          )}
          <Textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="What would you like to know about this product?"
            rows={3}
            maxLength={500}
            className="mb-2 text-sm"
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-xs text-gray-500">
              {newQuestion.length}/500 characters
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowAskForm(false)
                  setNewQuestion('')
                  setError('')
                }}
                className="flex-1 sm:flex-none text-xs sm:text-sm h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitQuestion}
                disabled={submitting || !newQuestion.trim()}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-9"
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-8 sm:py-12 border rounded-lg">
          <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-sm sm:text-base text-gray-500">
            {filter === 'unanswered' ? 'No unanswered questions' : 'No questions yet'}
          </p>
          <p className="text-xs sm:text-sm text-gray-400">Be the first to ask about this product</p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="border rounded-lg p-3 sm:p-4 space-y-3">
              {/* Question */}
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                    <span className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                      {maskEmail(q.user.email)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{formatDate(q.createdAt)}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 break-words">{q.question}</p>
                </div>
              </div>

              {/* Answer */}
              {q.answer && (
                <div className="ml-7 sm:ml-11 pl-3 sm:pl-4 border-l-2 border-blue-200">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-green-600">S</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                        <span className="font-medium text-xs sm:text-sm text-green-600">Seller</span>
                        {q.answeredAt && (
                          <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{formatDate(q.answeredAt)}</span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-700 break-words">{q.answer}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Unanswered Badge */}
              {!q.answer && (
                <div className="ml-7 sm:ml-11">
                  <span className="text-[10px] sm:text-xs text-gray-500 italic">Waiting for seller's answer...</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            onClick={loadMore}
            disabled={loadingMore}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {loadingMore ? 'Loading...' : `Load More Questions (${totalCount - questions.length} remaining)`}
          </Button>
        </div>
      )}
    </div>
  )
}
