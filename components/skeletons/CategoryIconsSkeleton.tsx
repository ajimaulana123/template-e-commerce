import { Skeleton } from "@/components/ui/skeleton"

export default function CategoryIconsSkeleton() {
  return (
    <section className="bg-white py-6 mb-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[72px] p-2">
              <Skeleton className="w-14 h-14 rounded-full bg-gray-200" />
              <Skeleton className="h-3 w-16 bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}