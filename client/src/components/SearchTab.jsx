import { useState, useEffect } from 'react';
import { tareasApi, projectsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

import TaskFormModal from './TaskFormModal';

import ConfirmationModal from './ConfirmationModal';

export default function SearchTab() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  // Modal & Action States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [operationLoading, setOperationLoading] = useState(false);

  // Filter States
  const [filters, setFilters] = useState({
    text: '',
    status: 'all',
    priority: 'all',
    project: 'all'
  });

  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, projectsRes] = await Promise.all([
        tareasApi.getAll(),
        projectsApi.getAll()
      ]);

      // Handle potentially different response structures
      const tasksData = Array.isArray(tasksRes) ? tasksRes : (tasksRes.tareas || []);
      const projectsData = Array.isArray(projectsRes) ? projectsRes : (projectsRes.projects || []);

      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      console.error('Error loading search data:', err);
      toast.error('Error al cargar datos para búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...tasks];

    // Text Filter (Title or Description)
    if (filters.text) {
      const lowerText = filters.text.toLowerCase();
      result = result.filter(t => 
        (t.titulo && t.titulo.toLowerCase().includes(lowerText)) || 
        (t.descripcion && t.descripcion.toLowerCase().includes(lowerText))
      );
    }

    // Status Filter
    if (filters.status !== 'all') {
      result = result.filter(t => t.estado && t.estado.toLowerCase() === filters.status.toLowerCase());
    }

    // Priority Filter
    if (filters.priority !== 'all') {
      result = result.filter(t => t.prioridad && t.prioridad.toLowerCase() === filters.priority.toLowerCase());
    }

    // Project Filter
    if (filters.project !== 'all') {
      result = result.filter(t => t.proyectoId === filters.project);
    }

    setFilteredTasks(result);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    const resetFilters = {
      text: '',
      status: 'all',
      priority: 'all',
      project: 'all'
    };
    setFilters(resetFilters);
    setFilteredTasks(tasks); 
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      setOperationLoading(true);
      await tareasApi.delete(taskToDelete.id);
      setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
      toast.success('Tarea eliminada correctamente');
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Error al eliminar tarea');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleSaveTask = async (formData) => {
    try {
      setOperationLoading(true);
      const updatedTask = await tareasApi.update(editingTask.id, formData);
      setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
      toast.success('Tarea actualizada correctamente');
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Error al actualizar tarea');
    } finally {
      setOperationLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      alta: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      media: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      baja: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    };
    const key = priority?.toLowerCase() || 'baja';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[key] || styles.baja}`}>
        {priority || 'Baja'}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      completada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      'en progreso': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      pendiente: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    const key = status?.toLowerCase() || 'pendiente';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[key] || styles.pendiente}`}>
        {status || 'Pendiente'}
      </span>
    );
  };

  if (loading) return <LoadingSkeleton type="table" count={5} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Búsqueda Avanzada</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Filtra y encuentra tareas específicas</p>
      </div>

      {/* Filters Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Text Search */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Texto
            </label>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={filters.text}
              onChange={(e) => handleFilterChange('text', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="all">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="completada">Completada</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Prioridad
            </label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="all">Todas</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          {/* Project Filter */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Proyecto
            </label>
            <select
              value={filters.project}
              onChange={(e) => handleFilterChange('project', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="all">Todos</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 dark:border-slate-700 pt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Limpiar Filtros
          </button>
          
          <button
            onClick={applyFilters}
            className="btn btn-primary flex items-center gap-2 px-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar
          </button>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
        {filteredTasks.length === 0 ? (
          <EmptyState 
            title="No se encontraron resultados"
            message="Intenta ajustar los filtros para encontrar lo que buscas."
            icon={
              <svg className="w-16 h-16 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-slate-700 text-xs uppercase text-gray-500 dark:text-gray-400">
                  <th className="p-4 font-semibold">Título</th>
                  <th className="p-4 font-semibold">Estado</th>
                  <th className="p-4 font-semibold">Prioridad</th>
                  <th className="p-4 font-semibold">Proyecto</th>
                  <th className="p-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-gray-900 dark:text-white">{task.titulo}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {task.descripcion || 'Sin descripción'}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(task.estado)}
                    </td>
                    <td className="p-4">
                      {getPriorityBadge(task.prioridad)}
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">
                      {projects.find(p => p.id === task.proyectoId)?.nombre || 'Sin Proyecto'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(task)}
                          className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                          title="Editar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(task)}
                          className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                          title="Eliminar"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <TaskFormModal
          tarea={editingTask}
          projects={projects}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
          loading={operationLoading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Tarea"
        message={`¿Estás seguro de que deseas eliminar permanentemente la tarea "${taskToDelete?.titulo}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDangerous={true}
        loading={operationLoading}
      />
    </div>
  );
}
