import { useState } from 'react';
import TabNavigation from '../components/TabNavigation';
import TareasTab from '../components/TareasTab';
import ProjectsTab from '../components/ProjectsTab';

/**
 * Dashboard Page - Main application view with tab navigation
 * Replicates legacy Task Manager layout
 */
export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('tareas');

  const tabs = [
    { id: 'tareas', label: 'Tareas' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'comentarios', label: 'Comentarios' },
    { id: 'historial', label: 'Historial' },
    { id: 'notificaciones', label: 'Notificaciones' },
    { id: 'busqueda', label: 'Búsqueda' },
    { id: 'reportes', label: 'Reportes' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tareas':
        return <TareasTab />;
      case 'proyectos':
        return <ProjectsTab />;
      case 'comentarios':
        return <PlaceholderTab title="Comentarios" />;
      case 'historial':
        return <PlaceholderTab title="Historial" />;
      case 'notificaciones':
        return <PlaceholderTab title="Notificaciones" />;
      case 'busqueda':
        return <PlaceholderTab title="Búsqueda" />;
      case 'reportes':
        return <PlaceholderTab title="Reportes" />;
      default:
        return <TareasTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
              <p className="text-sm text-gray-600">
                Usuario: <span className="font-medium">{user?.username || 'admin'}</span>
              </p>
            </div>
            <button
              onClick={onLogout}
              className="btn btn-secondary"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {renderTabContent()}
      </main>
    </div>
  );
}

/**
 * Placeholder component for unimplemented tabs
 */
function PlaceholderTab({ title }) {
  return (
    <div className="card text-center py-12">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">
        {title}
      </h2>
      <p className="text-gray-500">
        Esta funcionalidad estará disponible próximamente
      </p>
    </div>
  );
}
