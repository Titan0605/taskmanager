import { useState, useEffect } from 'react';
import { tareasApi, projectsApi } from '../services/api';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';
import { exportTareasToCSV } from '../utils/exportUtils';
import { useToast } from '../context/ToastContext';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';
import TaskFormModal from './TaskFormModal';

/**
 * Tareas Tab Component - Matches legacy "Gestión de Tareas" view
 * Includes form, table, and statistics bar
 */
export default function TareasTab() {
  const toast = useToast();
  const [tareas, setTareas] = useState([]);
  const [projects, setProjects] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    total: 0,
    completadas: 0,
    pendientes: 0,
    altaPrioridad: 0,
    vencidas: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [detailTask, setDetailTask] = useState(null);
  
  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tareasRes, projectsRes] = await Promise.all([
        tareasApi.getAll(),
        projectsApi.getAll(),
      ]);
      setTareas(tareasRes.tareas || []);
      setEstadisticas(tareasRes.estadisticas || {});
      setProjects(projectsRes.projects || []);
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data) => {
    try {
      if (selectedId) {
        await tareasApi.update(selectedId, data);
        toast.success('Tarea actualizada correctamente');
      } else {
        await tareasApi.create(data);
        toast.success('Tarea creada correctamente');
      }
      handleCloseForm();
      fetchData();
    } catch (err) {
      const errorMsg = 'Error al guardar: ' + err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleCreate = () => {
    setSelectedId(null);
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEdit = (tarea) => {
    setSelectedId(tarea.id);
    setEditingTask(tarea);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await tareasApi.delete(selectedId);
      toast.success('Tarea eliminada correctamente');
      clearForm();
      fetchData();
    } catch (err) {
      const errorMsg = 'Error al eliminar: ' + err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Direct delete from card (without needing to select first)
  const handleDeleteDirect = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
    try {
      await tareasApi.delete(id);
      toast.success('Tarea eliminada correctamente');
      await tareasApi.delete(id);
      toast.success('Tarea eliminada correctamente');
      if (selectedId === id) handleCloseForm();
      fetchData();
    } catch (err) {
      const errorMsg = 'Error al eliminar: ' + err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
    setSelectedId(null);
    setError('');
  };

  // Filter tasks based on search query (client-side for instant feedback)
  const filteredTareas = tareas.filter((tarea) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      tarea.titulo?.toLowerCase().includes(query) ||
      tarea.descripcion?.toLowerCase().includes(query) ||
      tarea.asignadoA?.toLowerCase().includes(query) ||
      tarea.proyectoNombre?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gestión de Tareas</h2>
        <div className="flex gap-2">
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Tarea
          </button>
          <button
            onClick={() => exportTareasToCSV(tareas)}
            disabled={tareas.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tareas por título, descripción, asignado o proyecto..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {filteredTareas.length} resultado{filteredTareas.length !== 1 ? 's' : ''} para "{searchQuery}"
          </div>
        )}
      </div>

      {/* Tasks Card Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
            Lista de Tareas
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTareas.length} tarea{filteredTareas.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <LoadingSkeleton type="card" count={6} />
        ) : tareas.length === 0 ? (
          <EmptyState 
            title="No hay tareas registradas"
            message="Crea una nueva tarea usando el formulario de arriba para comenzar a organizarte."
            icon={
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
        ) : filteredTareas.length === 0 ? (
          <EmptyState 
            title="No se encontraron resultados"
            message={`No hay tareas que coincidan con "${searchQuery}". Intenta con otros términos.`}
            actionLabel="Limpiar búsqueda"
            onAction={() => setSearchQuery('')}
            icon={
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTareas.map((tarea) => (
              <TaskCard
                key={tarea.id}
                tarea={tarea}
                isSelected={selectedId === tarea.id}
                onEdit={handleEdit}
                onDelete={handleDeleteDirect}
                onViewDetails={(t) => setDetailTask(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Statistics Bar - Responsive */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-4 shadow-sm">
        <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 text-sm">📊 Estadísticas</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{estadisticas.total}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{estadisticas.completadas}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Completadas</div>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{estadisticas.pendientes}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pendientes</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{estadisticas.altaPrioridad}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Alta Prioridad</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3 text-center col-span-2 sm:col-span-1">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{estadisticas.vencidas}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vencidas</div>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {detailTask && (
        <TaskDetailModal
          tarea={detailTask}
          onClose={() => setDetailTask(null)}
          onUpdate={fetchData}
          currentUser="admin"
        />
      )}

      {/* Task Form Modal */}
      {isFormOpen && (
        <TaskFormModal
          tarea={editingTask}
          projects={projects}
          onClose={handleCloseForm}
          onSave={handleSave}
          loading={loading}
        />
      )}
    </div>
  );
}
