import { useState, useEffect } from 'react';
import { tareasApi, projectsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';
import { exportTareasToCSV } from '../utils/exportUtils';

export default function ReportsTab() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    tasksByPriority: { high: 0, medium: 0, low: 0 },
    tasksByProject: []
  });
  const [rawTasks, setRawTasks] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData] = await Promise.all([
        tareasApi.getAll(),
        projectsApi.getAll()
      ]);

      const tasks = tasksData.tareas || [];
      const projects = projectsData.projects || [];
      setRawTasks(tasks);

      // Calculate Stats
      const total = tasks.length;
      
      const normalize = (str) => str ? str.toString().toLowerCase() : '';

      const completed = tasks.filter(t => normalize(t.estado) === 'completada').length;
      const pending = tasks.filter(t => normalize(t.estado) === 'pendiente').length;
      const inProgress = tasks.filter(t => ['en progreso', 'en_progreso'].includes(normalize(t.estado))).length;
      
      const now = new Date();
      const overdue = tasks.filter(t => 
        t.fechaVencimiento && 
        new Date(t.fechaVencimiento) < now && 
        normalize(t.estado) !== 'completada'
      ).length;

      const priorityCounts = {
        high: tasks.filter(t => normalize(t.prioridad) === 'alta').length,
        medium: tasks.filter(t => normalize(t.prioridad) === 'media').length,
        low: tasks.filter(t => normalize(t.prioridad) === 'baja').length
      };

      // Tasks by Project
      const projectStats = projects.map(p => {
        const projectTasks = tasks.filter(t => t.proyectoId === p.id);
        const done = projectTasks.filter(t => normalize(t.estado) === 'completada').length;
        return {
          name: p.nombre,
          total: projectTasks.length,
          completed: done,
          rate: projectTasks.length > 0 ? Math.round((done / projectTasks.length) * 100) : 0
        };
      }).sort((a, b) => b.total - a.total);

      setStats({
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: pending + inProgress,
        overdueTasks: overdue,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
        tasksByPriority: priorityCounts,
        tasksByProject: projectStats
      });

    } catch (err) {
      console.error('Error fetching report data:', err);
      toast.error('Error al generar reportes');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton type="card" count={4} />;

  if (stats.totalTasks === 0) {
    return (
      <EmptyState
        title="Sin suficientes datos"
        message="Crea tareas y proyectos para ver el análisis de estadísticas."
        icon={
          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Panel de Reportes</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Análisis de rendimiento y progreso</p>
        </div>
        <button
          onClick={() => exportTareasToCSV(rawTasks)}
          className="btn btn-secondary flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar CSV
        </button>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title="Tasa de Finalización" 
          value={`${stats.completionRate}%`} 
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KPICard 
          title="Tareas Vencidas" 
          value={stats.overdueTasks} 
          color="red"
          subtext="Requieren atención inmediata"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <KPICard 
          title="Alta Prioridad" 
          value={stats.tasksByPriority.high} 
          color="orange"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C13 5 16.08 5.5 13.75 10c2.833 2.5 4 4.8 2 8 1.902 2.973 4.375 2.06 4.407 3-.256-.475-1.1-.92-1.5-1.343z" />
            </svg>
          }
        />
        <KPICard 
          title="Proyectos Activos" 
          value={stats.tasksByProject.filter(p => p.total > 0).length} 
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
        />
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Priority Distribution */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Distribución por Prioridad</h3>
          <div className="space-y-4">
            <ProgressBar label="Alta" count={stats.tasksByPriority.high} total={stats.totalTasks} color="bg-orange-500" />
            <ProgressBar label="Media" count={stats.tasksByPriority.medium} total={stats.totalTasks} color="bg-blue-500" />
            <ProgressBar label="Baja" count={stats.tasksByPriority.low} total={stats.totalTasks} color="bg-green-500" />
          </div>
        </div>

        {/* Project Performance */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Rendimiento por Proyecto</h3>
          <div className="overflow-y-auto max-h-60 space-y-3 pr-2 scrollbar-thin">
            {stats.tasksByProject.map((proj, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300 font-medium truncate max-w-[60%]">{proj.name}</span>
                  <span className="text-gray-500 dark:text-gray-400">{proj.completed}/{proj.total} ({proj.rate}%)</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${proj.rate === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${proj.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  );
}

// Sub-components for internal use
function KPICard({ title, value, color, icon, subtext }) {
  const colors = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    red: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{value}</h3>
        {subtext && <p className="text-xs text-red-500 mt-2 font-medium">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colors[color] || colors.blue}`}>
        {icon}
      </div>
    </div>
  );
}

function ProgressBar({ label, count, total, color }) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{count} ({percentage}%)</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${color} transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
