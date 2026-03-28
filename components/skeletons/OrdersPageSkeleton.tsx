import { Skeleton } from '@/components/ui/skeleton'

export default function OrdersPageSkeleton() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="h-8 w-20 flex-shrink-0" />
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left">
                    <Skeleton className="h-3 w-16" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-8 w-16" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}