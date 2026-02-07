import { useState, useEffect } from 'react';
import { projectsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

/**
 * Projects Tab Component - Functional CRUD for projects
 * Matches legacy "Gestión de Proyectos" view
 */
export default function ProjectsTab() {
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
  const [selectedId, setSelectedId] = useState(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getAll();
      setProjects(response.projects || []);
    } catch (err) {
      setError('Error al cargar proyectos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedId) {
        await projectsApi.update(selectedId, formData);
        toast.success('Proyecto actualizado correctamente');
      } else {
        await projectsApi.create(formData);
        toast.success('Proyecto creado correctamente');
      }
      clearForm();
      fetchProjects();
    } catch (err) {
      const errorMsg = 'Error al guardar: ' + err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const handleEdit = (project) => {
    setSelectedId(project.id);
    setFormData({ nombre: project.nombre, descripcion: project.descripcion });
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await projectsApi.delete(selectedId);
      toast.success('Proyecto eliminado correctamente');
      clearForm();
      fetchProjects();
    } catch (err) {
      const errorMsg = 'Error al eliminar: ' + err.message;
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  const clearForm = () => {
    setSelectedId(null);
    setFormData({ nombre: '', descripcion: '' });
    setError('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Gestión de Proyectos</h2>

      {/* Form Card */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <label className="font-medium text-gray-700 dark:text-gray-300 pt-2">Nombre:</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="form-input md:col-span-3"
              required
            />
          </div>

          {/* Descripción */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
            <label className="font-medium text-gray-700 dark:text-gray-300 pt-2">Descripción:</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="form-input md:col-span-3"
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
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
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Projects Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <div className="p-4">
            <LoadingSkeleton type="table" count={5} />
          </div>
        ) : projects.length === 0 ? (
          <div className="p-8">
            <EmptyState 
              title="No hay proyectos registrados"
              message="Registra un nuevo proyecto usando el formulario de arriba."
              icon={
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              }
            />
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-20">ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={project.id}
                  onClick={() => handleEdit(project)}
                  className={`cursor-pointer ${
                    selectedId === project.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  <td className="font-mono text-gray-500 dark:text-gray-400">{index + 1}</td>
                  <td className="font-medium dark:text-white">{project.nombre}</td>
                  <td className="text-gray-600 dark:text-gray-400">{project.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
