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
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      value: 'text-blue-700',
      ring: 'ring-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      value: 'text-green-700',
      ring: 'ring-green-200'
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      value: 'text-red-700',
      ring: 'ring-red-200'
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      value: 'text-orange-700',
      ring: 'ring-orange-200'
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      value: 'text-purple-700',
      ring: 'ring-purple-200'
    },
    gray: {
      bg: 'bg-gray-50',
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-600',
      value: 'text-gray-700',
      ring: 'ring-gray-200'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-5 
      bg-white border border-gray-200 shadow-sm
      hover:shadow-md transition-all duration-300
      hover:ring-2 ${colors.ring}
    `}>
      {/* Background decoration */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${colors.bg} opacity-50`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          {/* Label */}
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          
          {/* Value */}
          <p className={`text-3xl font-bold ${colors.value} mb-1`}>
            {value}
          </p>
          
          {/* Sublabel or Trend */}
          {sublabel && (
            <p className="text-xs text-gray-400">{sublabel}</p>
          )}
          
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-gray-500'
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
