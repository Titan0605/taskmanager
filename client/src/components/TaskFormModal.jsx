import { useState, useEffect } from 'react';

export default function TaskFormModal({ tarea, projects, onClose, onSave, loading }) {
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
    if (tarea) {
      setFormData({
        titulo: tarea.titulo,
        descripcion: tarea.descripcion || '',
        estado: tarea.estado,
        prioridad: tarea.prioridad,
        proyectoId: tarea.proyectoId || '',
        asignadoA: tarea.asignadoA,
        fechaVencimiento: tarea.fechaVencimiento?.split('T')[0] || '',
        horasEstimadas: tarea.horasEstimadas,
      });
    } else {
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
    }
  }, [tarea]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {tarea ? 'Editar Tarea' : 'Nueva Tarea'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div className="space-y-1">
            <label className="font-medium text-gray-700 dark:text-gray-300">Título</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
              placeholder="Ej. Implementar autenticación"
            />
          </div>

          {/* Descripción */}
          <div className="space-y-1">
            <label className="font-medium text-gray-700 dark:text-gray-300">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              rows={3}
              placeholder="Detalles de la tarea..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estado */}
            <div className="space-y-1">
              <label className="font-medium text-gray-700 dark:text-gray-300">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
              </select>
            </div>

            {/* Prioridad */}
            <div className="space-y-1">
              <label className="font-medium text-gray-700 dark:text-gray-300">Prioridad</label>
              <select
                value={formData.prioridad}
                onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Proyecto */}
            <div className="space-y-1">
              <label className="font-medium text-gray-700 dark:text-gray-300">Proyecto</label>
              <select
                value={formData.proyectoId}
                onChange={(e) => setFormData({ ...formData, proyectoId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">Sin proyecto</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            {/* Asignado */}
            <div className="space-y-1">
              <label className="font-medium text-gray-700 dark:text-gray-300">Asignado a</label>
              <input
                type="text"
                value={formData.asignadoA}
                onChange={(e) => setFormData({ ...formData, asignadoA: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vencimiento */}
            <div className="space-y-1">
              <label className="font-medium text-gray-700 dark:text-gray-300">Vencimiento</label>
              <input
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) => setFormData({ ...formData, fechaVencimiento: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Horas */}
            <div className="space-y-1">
              <label className="font-medium text-gray-700 dark:text-gray-300">Horas Estimadas</label>
              <input
                type="number"
                value={formData.horasEstimadas}
                onChange={(e) => setFormData({ ...formData, horasEstimadas: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-slate-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              {tarea ? 'Actualizar Tarea' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
