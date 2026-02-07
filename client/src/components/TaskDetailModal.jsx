import { useState } from 'react';
import { tareasApi } from '../services/api';

/**
 * Task Detail Modal - Shows task details with comments section
 * Allows viewing and adding comments to a task
 */
export default function TaskDetailModal({ tarea, onClose, onUpdate, currentUser = 'admin' }) {
  const [comentarios, setComentarios] = useState(tarea.comentarios || []);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    setLoading(true);
    setError('');

    try {
      const newComment = await tareasApi.addComment(tarea.id, nuevoComentario, currentUser);
      setComentarios([...comentarios, newComment]);
      setNuevoComentario('');
      if (onUpdate) onUpdate();
    } catch (err) {
      setError('Error al agregar comentario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-gray-800 truncate">{tarea.titulo}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tarea.estado === 'Completada' ? 'bg-green-100 text-green-700' :
                tarea.estado === 'En Progreso' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {tarea.estado}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                tarea.prioridad === 'Alta' ? 'bg-red-100 text-red-700' :
                tarea.prioridad === 'Media' ? 'bg-orange-100 text-orange-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {tarea.prioridad}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          {tarea.descripcion && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Descripción</h3>
              <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">
                {tarea.descripcion}
              </p>
            </div>
          )}

          {/* Task Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">Asignado a</span>
              <p className="font-medium text-gray-800">{tarea.asignadoA}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">Proyecto</span>
              <p className="font-medium text-gray-800">{tarea.proyectoNombre || 'Sin proyecto'}</p>
            </div>
            {tarea.fechaVencimiento && (
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-500">Vencimiento</span>
                <p className="font-medium text-gray-800">{tarea.fechaVencimiento.split('T')[0]}</p>
              </div>
            )}
            {tarea.horasEstimadas > 0 && (
              <div className="bg-gray-50 rounded-lg p-3">
                <span className="text-gray-500">Horas estimadas</span>
                <p className="font-medium text-gray-800">{tarea.horasEstimadas}h</p>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Comentarios ({comentarios.length})
            </h3>

            {/* Comments List */}
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {comentarios.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </p>
              ) : (
                comentarios.map((comentario, index) => (
                  <div key={comentario.id || index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800 text-sm flex items-center gap-2">
                        <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          {comentario.autor?.[0]?.toUpperCase() || 'U'}
                        </span>
                        {comentario.autor}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(comentario.fechaCreacion)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm ml-8">{comentario.texto}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="Escribe un comentario..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !nuevoComentario.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '...' : 'Enviar'}
              </button>
            </form>

            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
