'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreateCategory } from './hooks'
import IconSelector from './components/IconSelector'

export default function CreateCategoryForm() {
  const { formData, errors, state, actions } = useCreateCategory()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await actions.submitForm()
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <i className="fas fa-plus-circle mr-2 text-blue-600" />
          Buat Kategori Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Success Message */}
          {state.success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center text-green-800">
                <i className="fas fa-check-circle mr-2" />
                <span className="text-sm font-medium">{state.success}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {state.error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center text-red-800">
                <i className="fas fa-exclamation-triangle mr-2" />
                <span className="text-sm font-medium">{state.error}</span>
              </div>
            </div>
          )}

          {/* Name and Slug Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="category-name" className="text-sm font-medium text-gray-700">
                Nama Kategori *
              </label>
              <Input
                id="category-name"
                name="name"
                value={formData.name}
                onChange={(e) => actions.updateFormData({ name: e.target.value })}
                placeholder="Contoh: Fashion & Beauty"
                disabled={state.loading}
                className={errors.name ? 'border-red-300' : ''}
                required
                maxLength={50}
              />
              {errors.name && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <i className="fas fa-exclamation-circle mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="category-slug" className="text-sm font-medium text-gray-700">
                Slug *
              </label>
              <Input
                id="category-slug"
                name="slug"
                value={formData.slug}
                onChange={(e) => actions.updateFormData({ slug: e.target.value })}
                placeholder="fashion-beauty"
                disabled={state.loading}
                className={`font-mono text-sm ${errors.slug ? 'border-red-300' : ''}`}
                required
                maxLength={50}
              />
              {errors.slug && (
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <i className="fas fa-exclamation-circle mr-1" />
                  {errors.slug}
                </p>
              )}
            </div>
          </div>

          {/* Icon Selector */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Icon *
            </label>
            <IconSelector
              value={formData.icon}
              onChange={(value) => actions.updateFormData({ icon: value })}
              error={errors.icon}
              disabled={state.loading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={state.loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {state.loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  Membuat Kategori...
                </>
              ) : (
                <>
                  <i className="fas fa-plus mr-2" />
                  Buat Kategori
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={actions.resetForm}
              disabled={state.loading}
              className="px-4"
            >
              <i className="fas fa-undo" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}