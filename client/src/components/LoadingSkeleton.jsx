export default function LoadingSkeleton({ type = 'card', count = 3 }) {
  const shimmerClass = "animate-pulse bg-gray-200 dark:bg-slate-700 rounded-xl";

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-200 dark:border-slate-700 space-y-4">
            <div className="flex justify-between items-start">
              <div className={`${shimmerClass} h-6 w-3/4`}></div>
              <div className={`${shimmerClass} h-5 w-12 rounded-full`}></div>
            </div>
            <div className="space-y-2">
              <div className={`${shimmerClass} h-4 w-full`}></div>
              <div className={`${shimmerClass} h-4 w-5/6`}></div>
            </div>
            <div className="flex gap-2 pt-2">
              <div className={`${shimmerClass} h-6 w-20 rounded-full`}></div>
              <div className={`${shimmerClass} h-6 w-24 rounded-full`}></div>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
              <div className={`${shimmerClass} h-4 w-24`}></div>
              <div className={`${shimmerClass} h-4 w-16`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-4">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className={`${shimmerClass} h-16 w-full opacity-60`}></div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="flex gap-3">
            <div className={`${shimmerClass} h-10 w-10 rounded-full flex-shrink-0`}></div>
            <div className="flex-1 space-y-2">
              <div className={`${shimmerClass} h-4 w-1/4`}></div>
              <div className={`${shimmerClass} h-4 w-full`}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
