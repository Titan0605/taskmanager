/**
 * StatCard Component - Executive-style KPI card
 * Displays a metric with icon, value, label, and optional trend indicator
 */
export default function StatCard({ 
  icon, 
  value, 
  label, 
  sublabel,
  color = 'blue',
  trend,
  trendValue,
  size = 'default'
}) {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/30',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      iconText: 'text-blue-600',
      value: 'text-blue-700 dark:text-blue-400',
      ring: 'ring-blue-200 dark:ring-blue-700'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      iconBg: 'bg-green-100 dark:bg-green-900/50',
      iconText: 'text-green-600',
      value: 'text-green-700 dark:text-green-400',
      ring: 'ring-green-200 dark:ring-green-700'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      iconBg: 'bg-red-100 dark:bg-red-900/50',
      iconText: 'text-red-600',
      value: 'text-red-700 dark:text-red-400',
      ring: 'ring-red-200 dark:ring-red-700'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/30',
      iconBg: 'bg-orange-100 dark:bg-orange-900/50',
      iconText: 'text-orange-600',
      value: 'text-orange-700 dark:text-orange-400',
      ring: 'ring-orange-200 dark:ring-orange-700'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      iconBg: 'bg-purple-100 dark:bg-purple-900/50',
      iconText: 'text-purple-600',
      value: 'text-purple-700 dark:text-purple-400',
      ring: 'ring-purple-200 dark:ring-purple-700'
    },
    gray: {
      bg: 'bg-gray-50 dark:bg-gray-800',
      iconBg: 'bg-gray-100 dark:bg-gray-700',
      iconText: 'text-gray-600',
      value: 'text-gray-700 dark:text-gray-300',
      ring: 'ring-gray-200 dark:ring-gray-600'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-5 
      bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm
      hover:shadow-md transition-all duration-300
      hover:ring-2 ${colors.ring}
    `}>
      {/* Background decoration */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${colors.bg} opacity-50`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          {/* Label */}
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
          
          {/* Value */}
          <p className={`text-3xl font-bold ${colors.value} mb-1`}>
            {value}
          </p>
          
          {/* Sublabel or Trend */}
          {sublabel && (
            <p className="text-xs text-gray-400 dark:text-gray-500">{sublabel}</p>
          )}
          
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${
              trend === 'up' ? 'text-green-600 dark:text-green-400' : 
              trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
            }`}>
              {trend === 'up' && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
              {trend === 'down' && (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        {/* Icon */}
        <div className={`p-3 rounded-xl ${colors.iconBg}`}>
          <span className={`text-2xl`}>{icon}</span>
        </div>
      </div>
    </div>
  );
}
