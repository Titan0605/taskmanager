import { useState, useEffect } from 'react';
import { tareasApi, projectsApi } from '../services/api';

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

      {/* Tasks Table */}
      <div className="card overflow-hidden p-0">
        <h3 className="font-semibold text-gray-700 px-6 py-4 border-b bg-gray-50">
          Lista de Tareas
        </h3>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando tareas...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Proyecto</th>
                  <th>Asignado</th>
                  <th>Vencimiento</th>
                </tr>
              </thead>
              <tbody>
                {tareas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-8">
                      No hay tareas registradas
                    </td>
                  </tr>
                ) : (
                  tareas.map((tarea, index) => (
                    <tr
                      key={tarea.id}
                      onClick={() => handleEdit(tarea)}
                      className={`cursor-pointer ${selectedId === tarea.id ? 'bg-blue-50' : ''}`}
                    >
                      <td className="font-mono text-gray-500">{index + 1}</td>
                      <td className="font-medium">{tarea.titulo}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          tarea.estado === 'Completada' ? 'bg-green-100 text-green-700' :
                          tarea.estado === 'En Progreso' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {tarea.estado}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          tarea.prioridad === 'Alta' ? 'bg-red-100 text-red-700' :
                          tarea.prioridad === 'Media' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {tarea.prioridad}
                        </span>
                      </td>
                      <td>{tarea.proyectoNombre || '-'}</td>
                      <td>{tarea.asignadoA}</td>
                      <td>{tarea.fechaVencimiento?.split('T')[0] || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistics Bar */}
      <div className="stats-bar">
        <span className="font-semibold text-gray-700">Estadísticas:</span>
        <span className="stat-item">Total: <span className="stat-value">{estadisticas.total}</span></span>
        <span className="stat-item">| Completadas: <span className="stat-value text-green-600">{estadisticas.completadas}</span></span>
        <span className="stat-item">| Pendientes: <span className="stat-value">{estadisticas.pendientes}</span></span>
        <span className="stat-item">| Alta Prioridad: <span className="stat-value text-red-600">{estadisticas.altaPrioridad}</span></span>
        <span className="stat-item">| Vencidas: <span className="stat-value text-orange-600">{estadisticas.vencidas}</span></span>
      </div>
    </div>
  );
}
