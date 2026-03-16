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

          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="category-name" className="text-sm font-medium text-gray-700">
              Nama Kategori *
            </label>
            <Input
              id="category-name"
              name="name"
              value={formData.name}
              onChange={(e) => actions.updateFormData({ name: e.target.value })}
              placeholder="Contoh: Electronics"
              disabled={state.loading}
              className={errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
              required
              maxLength={50}
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center">
                <i className="fas fa-exclamation-circle mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Slug Field */}
          <div className="space-y-2">
            <label htmlFor="category-slug" className="text-sm font-medium text-gray-700">
              Slug *
            </label>
            <Input
              id="category-slug"
              name="slug"
              value={formData.slug}
              onChange={(e) => actions.updateFormData({ slug: e.target.value })}
              placeholder="electronics"
              disabled={state.loading}
              className={`font-mono text-sm ${errors.slug ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              required
              maxLength={50}
            />
            {errors.slug && (
              <p className="text-sm text-red-600 flex items-center">
                <i className="fas fa-exclamation-circle mr-1" />
                {errors.slug}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Otomatis dibuat dari nama, dapat diedit manual
            </p>
          </div>

          {/* Icon Selector */}
          <div className="space-y-2">
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
              className="flex-1"
            >
              {state.loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2" />
                  Membuat...
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
            >
              <i className="fas fa-undo mr-2" />
              Reset
            </Button>
          </div>

          {/* Form Info */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            <div className="flex items-start">
              <i className="fas fa-info-circle mr-2 mt-0.5 text-blue-500" />
              <div>
                <p className="font-medium mb-1">Tips:</p>
                <ul className="space-y-1">
                  <li>• Gunakan nama yang jelas dan mudah dipahami</li>
                  <li>• Slug akan otomatis dibuat dari nama kategori</li>
                  <li>• Pilih icon yang sesuai dengan kategori</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}