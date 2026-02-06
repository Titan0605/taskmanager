/**
 * TaskCard Component - Modern card layout for tasks
 * Features: border, shadow, hover effects, edit/delete actions inside
 */
export default function TaskCard({ tarea, isSelected, onEdit, onDelete }) {
  // Determine status styling
  const getStatusStyles = (estado) => {
    switch (estado) {
      case 'Completada':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'En Progreso':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Determine priority styling
  const getPriorityStyles = (prioridad) => {
    switch (prioridad) {
      case 'Alta':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Media':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  // Check if task is overdue
  const isOverdue = tarea.fechaVencimiento && 
    new Date(tarea.fechaVencimiento) < new Date() && 
    tarea.estado !== 'Completada';

  return (
    <div
      className={`
        group relative bg-white rounded-xl border-2 p-5
        shadow-sm hover:shadow-lg transition-all duration-300
        hover:border-blue-300 hover:-translate-y-1
        ${isSelected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}
        ${isOverdue ? 'border-l-4 border-l-red-500' : ''}
      `}
    >
      {/* Priority Badge - Top Right */}
      <div className="absolute top-3 right-3">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityStyles(tarea.prioridad)}`}>
          {tarea.prioridad}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-lg font-semibold text-gray-800 pr-20 mb-2 line-clamp-1">
        {tarea.titulo}
      </h4>

      {/* Description */}
      {tarea.descripcion && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {tarea.descripcion}
        </p>
      )}

      {/* Status Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(tarea.estado)}`}>
          <span className={`w-2 h-2 rounded-full mr-2 ${
            tarea.estado === 'Completada' ? 'bg-green-500' :
            tarea.estado === 'En Progreso' ? 'bg-yellow-500' : 'bg-gray-400'
          }`}></span>
          {tarea.estado}
        </span>
      </div>

      {/* Meta Information */}
      <div className="space-y-2 text-sm text-gray-500">
        {/* Project */}
        {tarea.proyectoNombre && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span>{tarea.proyectoNombre}</span>
          </div>
        )}

        {/* Assigned To */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{tarea.asignadoA}</span>
        </div>

        {/* Due Date */}
        {tarea.fechaVencimiento && (
          <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{tarea.fechaVencimiento.split('T')[0]}</span>
            {isOverdue && <span className="text-xs">(Vencida)</span>}
          </div>
        )}

        {/* Estimated Hours */}
        {tarea.horasEstimadas > 0 && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{tarea.horasEstimadas}h estimadas</span>
          </div>
        )}
      </div>

      {/* Action Buttons - Visible on hover */}
      <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(tarea); }}
          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
          title="Editar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(tarea.id); }}
          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          title="Eliminar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
