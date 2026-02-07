import { useState } from 'react';
import TabNavigation from '../components/TabNavigation';
import TareasTab from '../components/TareasTab';
import ProjectsTab from '../components/ProjectsTab';
import NotificationBell from '../components/NotificationBell';

/**
 * Dashboard Page - Main application view with responsive navigation
 * Mobile-first design with hamburger menu
 */
export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('tareas');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs = [
    { id: 'tareas', label: 'Tareas', icon: '📋' },
    { id: 'proyectos', label: 'Proyectos', icon: '📁' },
    { id: 'comentarios', label: 'Comentarios', icon: '💬' },
    { id: 'historial', label: 'Historial', icon: '📜' },
    { id: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
    { id: 'busqueda', label: 'Búsqueda', icon: '🔍' },
    { id: 'reportes', label: 'Reportes', icon: '📊' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tareas':
        return <TareasTab />;
      case 'proyectos':
        return <ProjectsTab />;
      case 'comentarios':
        return <PlaceholderTab title="Comentarios" icon="💬" />;
      case 'historial':
        return <PlaceholderTab title="Historial" icon="📜" />;
      case 'notificaciones':
        return <PlaceholderTab title="Notificaciones" icon="🔔" />;
      case 'busqueda':
        return <PlaceholderTab title="Búsqueda" icon="🔍" />;
      case 'reportes':
        return <PlaceholderTab title="Reportes" icon="📊" />;
      default:
        return <TareasTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Logo & User (Desktop) / Hamburger (Mobile) */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                <svg 
                  className={`w-6 h-6 text-gray-600 transition-transform duration-200 ${isSidebarOpen ? 'rotate-90' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isSidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Logo & Title */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-800">Task Manager</h1>
                <p className="text-xs md:text-sm text-gray-600 hidden sm:block">
                  Usuario: <span className="font-medium">{user?.username || 'admin'}</span>
                </p>
              </div>
            </div>

            {/* Right side - Notifications, User info & Logout */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Notification Bell */}
              <NotificationBell />
              
              {/* Mobile user badge */}
              <span className="sm:hidden text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                {user?.username || 'admin'}
              </span>
              <button
                onClick={onLogout}
                className="btn btn-secondary text-sm md:text-base px-3 md:px-4 py-1.5 md:py-2"
              >
                <span className="hidden sm:inline">Salir</span>
                <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-xl
        transform transition-transform duration-300 ease-in-out md:hidden
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-800">Task Manager</h2>
            <p className="text-xs text-gray-500">Enterprise Edition</p>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 text-left
                transition-colors duration-150
                ${activeTab === tab.id 
                  ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-xl">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {(user?.username || 'A')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{user?.username || 'admin'}</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Desktop Tab Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">
        {renderTabContent()}
      </main>
    </div>
  );
}

/**
 * Placeholder component for unimplemented tabs
 */
function PlaceholderTab({ title, icon }) {
  return (
    <div className="card text-center py-8 md:py-12">
      <div className="text-5xl md:text-6xl mb-4">{icon || '🚧'}</div>
      <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
        {title}
      </h2>
      <p className="text-gray-500 text-sm md:text-base">
        Esta funcionalidad estará disponible próximamente
      </p>
    </div>
  );
}
