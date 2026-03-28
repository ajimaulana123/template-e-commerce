import CategoriesPageSkeleton from '@/components/skeletons/CategoriesPageSkeleton'

export default function CategoriesLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <CategoriesPageSkeleton />
      </div>
    </div>
  )
}