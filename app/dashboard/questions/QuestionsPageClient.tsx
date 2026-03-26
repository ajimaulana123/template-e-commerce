'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Question {
  id: string
  question: string
  answer: string | null
  answeredAt: string | null
  createdAt: string
  productId: string
  user: {
    email: string
  }
  product?: {
    name: string
    images: string[]
  }
}

export default function QuestionsPageClient() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unanswered'>('unanswered')
  const [answeringId, setAnsweringId] = useState<string | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [filter])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      // Fetch all questions from all products
      const response = await fetch(`/api/questions?filter=${filter}`)
      if (response.ok) {
        const data = await response.json()
        setQuestions(data)
      }
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerQuestion = async (questionId: string) => {
    if (!answerText.trim()) {
      alert('Please enter an answer')
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answerText })
      })

      if (response.ok) {
        setAnsweringId(null)
        setAnswerText('')
        fetchQuestions()
      } else {
        alert('Failed to submit answer')
      }
    } catch (error) {
      alert('Failed to submit answer')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return
    }

    try {
      const response = await fetch(`/api/questions/${questionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchQuestions()
      } else {
        alert('Failed to delete question')
      }
    } catch (error) {
      alert('Failed to delete question')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Product Questions</h1>
        </div>
        <Button onClick={fetchQuestions} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6">
        <Button
          variant={filter === 'unanswered' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unanswered')}
          className={filter === 'unanswered' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Unanswered
        </Button>
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
          className={filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          All Questions
        </Button>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            {filter === 'unanswered' ? 'No unanswered questions' : 'No questions yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
              {/* Product Info */}
              {q.product && (
                <Link 
                  href={`/products/${q.productId}`}
                  className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded -m-2"
                >
                  <img
                    src={q.product.images?.[0] || '/placeholder.png'}
                    alt={q.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{q.product.name}</p>
                  </div>
                </Link>
              )}

              {/* Question */}
              <div className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{q.user.email}</span>
                    <span className="text-xs text-gray-500">{formatDate(q.createdAt)}</span>
                  </div>
                  {!q.answer && (
                    <Badge className="bg-yellow-100 text-yellow-800">Unanswered</Badge>
                  )}
                </div>
                <p className="text-gray-700">{q.question}</p>
              </div>

              {/* Answer */}
              {q.answer ? (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-600">Your Answer</span>
                    {q.answeredAt && (
                      <span className="text-xs text-gray-500">{formatDate(q.answeredAt)}</span>
                    )}
                  </div>
                  <p className="text-gray-700">{q.answer}</p>
                </div>
              ) : answeringId === q.id ? (
                <div className="space-y-3">
                  <Textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={3}
                    maxLength={1000}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {answerText.length}/1000 characters
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setAnsweringId(null)
                          setAnswerText('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAnswerQuestion(q.id)}
                        disabled={submitting || !answerText.trim()}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {submitting ? 'Submitting...' : 'Submit Answer'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => setAnsweringId(q.id)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Answer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQuestion(q.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
