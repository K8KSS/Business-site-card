import { projectId, publicAnonKey } from './info';

// Base URL for API requests
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-322de762`;

// Helper function to make API requests
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Authorization': `Bearer ${publicAnonKey}`,
    'Content-Type': 'application/json',
  };
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `Request failed: ${response.statusText}`);
  }
  
  return response.json();
}

// Helper function to upload files
export async function uploadFile(file: File): Promise<{ url: string; path: string }> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(error.error || 'Failed to upload file');
  }
  
  return response.json();
}

// Publications API
export const publicationsApi = {
  getAll: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/api/publications${query}`);
  },
  
  getById: (id: string) => apiRequest(`/api/publications/${id}`),
  
  create: (data: any) => apiRequest('/api/publications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiRequest(`/api/publications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest(`/api/publications/${id}`, {
    method: 'DELETE',
  }),
};

// Albums API
export const albumsApi = {
  getAll: () => apiRequest('/api/albums'),
  
  create: (data: any) => apiRequest('/api/albums', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  addPhoto: (albumId: string, url: string) => apiRequest(`/api/albums/${albumId}/photos`, {
    method: 'POST',
    body: JSON.stringify({ url }),
  }),
  
  delete: (id: string) => apiRequest(`/api/albums/${id}`, {
    method: 'DELETE',
  }),
};

// Achievements API
export const achievementsApi = {
  getAll: () => apiRequest('/api/achievements'),
  
  create: (data: any) => apiRequest('/api/achievements', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest(`/api/achievements/${id}`, {
    method: 'DELETE',
  }),
};

// Portfolio API
export const portfolioApi = {
  getAll: () => apiRequest('/api/portfolio'),
  
  create: (data: any) => apiRequest('/api/portfolio', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest(`/api/portfolio/${id}`, {
    method: 'DELETE',
  }),
};

// Reviews API
export const reviewsApi = {
  getAll: (status?: string) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest(`/api/reviews${query}`);
  },
  
  create: (data: any) => apiRequest('/api/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  approve: (id: string) => apiRequest(`/api/reviews/${id}/approve`, {
    method: 'PUT',
  }),
  
  like: (id: string) => apiRequest(`/api/reviews/${id}/like`, {
    method: 'PUT',
  }),
  
  delete: (id: string) => apiRequest(`/api/reviews/${id}`, {
    method: 'DELETE',
  }),
};

// Messages API
export const messagesApi = {
  getAll: () => apiRequest('/api/messages'),
  
  create: (data: any) => apiRequest('/api/messages', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  markAsRead: (id: string) => apiRequest(`/api/messages/${id}/read`, {
    method: 'PUT',
  }),
  
  delete: (id: string) => apiRequest(`/api/messages/${id}`, {
    method: 'DELETE',
  }),
};

// Audio API
export const audioApi = {
  getAll: () => apiRequest('/api/audio'),
  
  create: (data: any) => apiRequest('/api/audio', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest(`/api/audio/${id}`, {
    method: 'DELETE',
  }),
};

// Videos API
export const videosApi = {
  getAll: () => apiRequest('/api/videos'),
  
  create: (data: any) => apiRequest('/api/videos', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  incrementViews: (id: string) => apiRequest(`/api/videos/${id}/view`, {
    method: 'PUT',
  }),
  
  delete: (id: string) => apiRequest(`/api/videos/${id}`, {
    method: 'DELETE',
  }),
};

// Admin API
export const adminApi = {
  login: (password: string) => apiRequest('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  }),
  
  getStats: () => apiRequest('/api/stats'),
};
