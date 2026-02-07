/**
 * API Service - Reads configuration from environment variables
 * This is the centralized API client for the Task Manager frontend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }
  
  return response.json();
}

// ============ AUTH API ============

export const authApi = {
  login: async (username, password) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },
  
  logout: async () => {
    return fetchApi('/auth/logout', { method: 'POST' });
  },
};

// ============ PROJECTS API ============

export const projectsApi = {
  getAll: async () => {
    return fetchApi('/projects');
  },
  
  getById: async (id) => {
    return fetchApi(`/projects/${id}`);
  },
  
  create: async (project) => {
    return fetchApi('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  },
  
  update: async (id, project) => {
    return fetchApi(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    });
  },
  
  delete: async (id) => {
    return fetchApi(`/projects/${id}`, { method: 'DELETE' });
  },
};

// ============ TAREAS API ============

export const tareasApi = {
  getAll: async () => {
    return fetchApi('/tareas');
  },
  
  getById: async (id) => {
    return fetchApi(`/tareas/${id}`);
  },
  
  create: async (tarea) => {
    return fetchApi('/tareas', {
      method: 'POST',
      body: JSON.stringify(tarea),
    });
  },
  
  update: async (id, tarea) => {
    return fetchApi(`/tareas/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tarea),
    });
  },
  
  delete: async (id) => {
    return fetchApi(`/tareas/${id}`, { method: 'DELETE' });
  },

  addComment: async (tareaId, texto, autor) => {
    return fetchApi(`/tareas/${tareaId}/comentarios`, {
      method: 'POST',
      body: JSON.stringify({ texto, autor }),
    });
  },
};

export default { authApi, projectsApi, tareasApi };
