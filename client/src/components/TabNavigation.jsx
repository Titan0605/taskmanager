/**
 * Tab Navigation Component
 * Replicates legacy Task Manager tab bar
 */
export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="flex gap-1 py-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-button rounded-t-lg ${
            activeTab === tab.id ? 'active' : 'text-gray-600'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
