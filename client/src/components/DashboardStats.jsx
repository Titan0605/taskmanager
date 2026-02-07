import { useState, useEffect } from 'react';
import { tareasApi, projectsApi } from '../services/api';
import StatCard from './StatCard';

/**
 * DashboardStats Component - Executive KPI widgets
 * Displays key metrics and project overview
 */
export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completadas: 0,
    pendientes: 0,
    enProgreso: 0,
    altaPrioridad: 0,
    vencidas: 0,
    totalProjects: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [tareasRes, projectsRes] = await Promise.all([
        tareasApi.getAll(),
        projectsApi.getAll(),
      ]);
      
      const tareas = tareasRes.tareas || [];
      const projects = projectsRes.projects || [];
      const estadisticas = tareasRes.estadisticas || {};
      
      const completadas = estadisticas.completadas || 0;
      const total = estadisticas.total || tareas.length;
      const completionRate = total > 0 ? Math.round((completadas / total) * 100) : 0;

      setStats({
        totalTasks: total,
        completadas: completadas,
        pendientes: estadisticas.pendientes || 0,
        enProgreso: tareas.filter(t => t.estado === 'En Progreso').length,
        altaPrioridad: estadisticas.altaPrioridad || 0,
        vencidas: estadisticas.vencidas || 0,
        totalProjects: projects.length,
        completionRate: completionRate,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 dark:bg-slate-700 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon="📋"
          value={stats.totalTasks}
          label="Total Tareas"
          sublabel="En el sistema"
          color="blue"
        />
        <StatCard
          icon="✅"
          value={`${stats.completionRate}%`}
          label="Tasa de Completado"
          sublabel={`${stats.completadas} de ${stats.totalTasks}`}
          color="green"
        />
        <StatCard
          icon="🔥"
          value={stats.altaPrioridad}
          label="Alta Prioridad"
          sublabel="Requieren atención"
          color="red"
        />
        <StatCard
          icon="📁"
          value={stats.totalProjects}
          label="Proyectos"
          sublabel="Activos"
          color="purple"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 text-center">
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendientes}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Pendientes</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.enProgreso}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">En Progreso</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completadas}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Completadas</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 text-center col-span-3 md:col-span-1">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.vencidas}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Vencidas</div>
        </div>
        
        {/* Progress Bar - Full width on mobile, spans 2 on desktop */}
        <div className="col-span-3 md:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Progreso General</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">{stats.completionRate}%</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
