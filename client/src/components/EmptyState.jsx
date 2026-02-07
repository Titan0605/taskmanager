export default function EmptyState({ 
  icon, 
  title = "No hay datos disponibles", 
  message = "No se encontraron elementos para mostrar en esta sección.", 
  actionLabel, 
  onAction 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300">
      <div className="bg-gray-50 dark:bg-slate-700/50 p-6 rounded-full mb-4">
        {icon ? (
          <div className="text-gray-400 dark:text-gray-500 w-12 h-12 flex items-center justify-center">
            {icon}
          </div>
        ) : (
          <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6 text-sm">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
