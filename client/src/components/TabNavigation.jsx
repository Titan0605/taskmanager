import { useState } from 'react';

/**
 * Tab Navigation Component - Responsive with hamburger menu
 * Desktop: Horizontal tabs
 * Mobile: Hamburger menu with slide-out drawer
 */
export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  // Get current tab label for mobile display
  const currentTabLabel = tabs.find(t => t.id === activeTab)?.label || 'Menu';

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <nav className="hidden md:flex gap-1 py-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`tab-button rounded-t-lg ${
              activeTab === tab.id ? 'active' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Mobile Navigation - Visible only on mobile */}
      <div className="md:hidden">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-between w-full py-3 px-2 text-gray-700 dark:text-gray-200"
        >
          <span className="flex items-center gap-2">
            <span className="font-medium">{currentTabLabel}</span>
          </span>
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Mobile Dropdown Menu */}
        <div className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="py-2 border-t border-gray-200 dark:border-slate-600">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`
                  w-full text-left px-4 py-3 text-sm font-medium
                  transition-colors duration-150
                  ${activeTab === tab.id 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 border-l-4 border-transparent'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Overlay - when menu is open */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
