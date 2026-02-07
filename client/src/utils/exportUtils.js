/**
 * CSV Export Utility
 * Converts data arrays to CSV format and triggers download
 */

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @param {Array} columns - Column configuration [{key, label}]
 * @returns {string} CSV formatted string
 */
export function convertToCSV(data, columns) {
  if (!data || data.length === 0) return '';

  // Header row
  const header = columns.map(col => `"${col.label}"`).join(',');

  // Data rows
  const rows = data.map(item => {
    return columns.map(col => {
      let value = item[col.key];
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        value = '';
      }
      
      // Format dates
      if (col.key.toLowerCase().includes('fecha') && value) {
        value = new Date(value).toLocaleDateString('es-ES');
      }
      
      // Escape quotes and wrap in quotes
      value = String(value).replace(/"/g, '""');
      return `"${value}"`;
    }).join(',');
  });

  return [header, ...rows].join('\n');
}

/**
 * Trigger browser file download
 * @param {string} content - File content
 * @param {string} filename - Name of the file to download
 * @param {string} mimeType - MIME type of the file
 */
export function downloadFile(content, filename, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob(['\ufeff' + content], { type: mimeType }); // BOM for Excel UTF-8
  const link = document.createElement('a');
  
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    // Modern browsers
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Export tasks to CSV file
 * @param {Array} tareas - Array of task objects
 */
export function exportTareasToCSV(tareas) {
  const columns = [
    { key: 'titulo', label: 'Título' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'estado', label: 'Estado' },
    { key: 'prioridad', label: 'Prioridad' },
    { key: 'asignadoA', label: 'Asignado A' },
    { key: 'proyectoNombre', label: 'Proyecto' },
    { key: 'fechaVencimiento', label: 'Fecha Vencimiento' },
    { key: 'horasEstimadas', label: 'Horas Estimadas' },
  ];

  const csv = convertToCSV(tareas, columns);
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `Project_Report_${date}.csv`;
  
  downloadFile(csv, filename);
}
