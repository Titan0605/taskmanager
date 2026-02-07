import { useState, useEffect } from 'react';
import { tareasApi, projectsApi } from '../services/api';
import TaskCard from './TaskCard';
import TaskDetailModal from './TaskDetailModal';

/**
 * Tareas Tab Component - Matches legacy "Gestión de Tareas" view
 * Includes form, table, and statistics bar
 */
export default function TareasTab() {
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
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    estado: 'Pendiente',
    prioridad: 'Media',
    proyectoId: '',
    asignadoA: 'Sin asignar',
    fechaVencimiento: '',
    horasEstimadas: 0,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedId) {
        await tareasApi.update(selectedId, formData);
      } else {
        await tareasApi.create(formData);
      }
      clearForm();
      fetchData();
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    }
  };

  const handleEdit = (tarea) => {
    setSelectedId(tarea.id);
    setFormData({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      prioridad: tarea.prioridad,
      proyectoId: tarea.proyectoId || '',
      asignadoA: tarea.asignadoA,
      fechaVencimiento: tarea.fechaVencimiento?.split('T')[0] || '',
      horasEstimadas: tarea.horasEstimadas,
    });
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await tareasApi.delete(selectedId);
      clearForm();
      fetchData();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  // Direct delete from card (without needing to select first)
  const handleDeleteDirect = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta tarea?')) return;
    try {
      await tareasApi.delete(id);
      if (selectedId === id) clearForm();
      fetchData();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  const clearForm = () => {
    setSelectedId(null);
    setFormData({
      titulo: '',
      descripcion: '',
      estado: 'Pendiente',
      prioridad: 'Media',
      proyectoId: '',
      asignadoA: 'Sin asignar',
      fechaVencimiento: '',
      horasEstimadas: 0,
    });
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
      <h2 className="text-xl font-bold text-gray-800">Gestión de Tareas</h2>

      {/* Form Card */}
      <div className="card">
        <h3 className="font-semibold text-gray-700 mb-4 pb-2 border-b">
          {selectedId ? 'Editar Tarea' : 'Nueva Tarea'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Título */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
            <label className="font-medium text-gray-700">Título:</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="form-input md:col-span-5"
              required
            />
          </div>

          {/* Descripción */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-start">
            <label className="font-medium text-gray-700 pt-2">Descripción:</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="form-input md:col-span-5"
              rows={2}
            />
          </div>

          {/* Estado & Prioridad */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
            <label className="font-medium text-gray-700">Estado:</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="form-select md:col-span-2"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completada">Completada</option>
            </select>
            <label className="font-medium text-gray-700">Prioridad:</label>
            <select
              value={formData.prioridad}
              onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
              className="form-select md:col-span-2"
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
          </div>

          {/* Proyecto & Asignado */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
            <label className="font-medium text-gray-700">Proyecto:</label>
            <select
              value={formData.proyectoId}
              onChange={(e) => setFormData({ ...formData, proyectoId: e.target.value })}
              className="form-select md:col-span-2"
            >
              <option value="">Sin proyecto</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            <label className="font-medium text-gray-700">Asignado a:</label>
            <input
              type="text"
              value={formData.asignadoA}
              onChange={(e) => setFormData({ ...formData, asignadoA: e.target.value })}
              className="form-input md:col-span-2"
            />
          </div>

          {/* Fecha & Horas */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
            <label className="font-medium text-gray-700">Vencimiento:</label>
            <input
              type="date"
              value={formData.fechaVencimiento}
              onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
              className="form-input md:col-span-2"
            />
            <label className="font-medium text-gray-700">Horas Est.:</label>
            <input
              type="number"
              value={formData.horasEstimadas}
              onChange={(e) => setFormData({ ...formData, horasEstimadas: parseFloat(e.target.value) || 0 })}
              className="form-input md:col-span-2"
              min="0"
              step="0.5"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-3">
            <button type="submit" className="btn btn-primary">
              {selectedId ? 'Actualizar' : 'Agregar'}
            </button>
            {selectedId && (
              <>
                <button type="button" onClick={handleDelete} className="btn btn-danger">
                  Eliminar
                </button>
                <button type="button" onClick={clearForm} className="btn btn-secondary">
                  Limpiar
                </button>
              </>
            )}
          </div>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar tareas por título, descripción, asignado o proyecto..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-500">
            {filteredTareas.length} resultado{filteredTareas.length !== 1 ? 's' : ''} para "{searchQuery}"
          </div>
        )}
      </div>

      {/* Tasks Card Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-700 text-lg">
            Lista de Tareas
          </h3>
          <span className="text-sm text-gray-500">
            {filteredTareas.length} tarea{filteredTareas.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            Cargando tareas...
          </div>
        ) : tareas.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-lg font-medium">No hay tareas registradas</p>
            <p className="text-sm mt-1">Crea una nueva tarea usando el formulario de arriba</p>
          </div>
        ) : filteredTareas.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-xl border border-gray-200">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-medium">No se encontraron resultados</p>
            <p className="text-sm mt-1">Intenta con otros términos de búsqueda</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Limpiar búsqueda
            </button>
          </div>
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
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h4 className="font-semibold text-gray-700 mb-3 text-sm">📊 Estadísticas</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{estadisticas.total}</div>
            <div className="text-xs text-gray-500 mt-1">Total</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{estadisticas.completadas}</div>
            <div className="text-xs text-gray-500 mt-1">Completadas</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</div>
            <div className="text-xs text-gray-500 mt-1">Pendientes</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{estadisticas.altaPrioridad}</div>
            <div className="text-xs text-gray-500 mt-1">Alta Prioridad</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center col-span-2 sm:col-span-1">
            <div className="text-2xl font-bold text-orange-600">{estadisticas.vencidas}</div>
            <div className="text-xs text-gray-500 mt-1">Vencidas</div>
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
    </div>
  );
}
