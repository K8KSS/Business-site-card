import { projectId, publicAnonKey } from './info';
import { 
  demoPublications, 
  demoAlbums, 
  demoAchievements, 
  demoPortfolio, 
  demoReviews, 
  demoAudio, 
  demoVideos 
} from '../demo-data';

// Base URL for API requests
export const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-322de762`;

// Helper function to make API requests with fallback
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  try {
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
      const error = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      
      // For GET requests, return empty array instead of throwing
      if (options.method === undefined || options.method === 'GET') {
        console.warn(`⚠️ API ${endpoint} returned ${response.status}, using fallback data`);
        return [];
      }
      
      throw new Error(error.error || error.message || `Request failed: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error: any) {
    console.error('API Request Error:', error);
    
    // For GET requests, return empty array instead of throwing
    if (options.method === undefined || options.method === 'GET') {
      console.warn(`⚠️ API request failed, using fallback data`);
      return [];
    }
    
    throw new Error(error.message || 'Network request failed');
  }
}

// Helper function to upload files (with auto-initialization)
export async function uploadFile(file: File): Promise<{ url: string; path: string }> {
  try {
    console.log('📤 Starting file upload:', file.name, 'Size:', file.size, 'bytes');
    
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('🌐 Uploading to:', `${API_BASE_URL}/api/upload`);
    
    // First attempt
    let response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: formData,
    });
    
    console.log('📡 Upload response status:', response.status);
    
    // If 404, try to initialize storage and retry
    if (response.status === 404) {
      console.log('⚠️ Got 404, attempting to initialize storage...');
      
      try {
        const initResponse = await fetch(`${API_BASE_URL}/api/admin/init-storage`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (initResponse.ok) {
          console.log('✅ Storage initialized, retrying upload...');
          
          // Wait a moment for initialization to complete
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Retry upload
          response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
            body: formData,
          });
          
          console.log('📡 Retry upload response status:', response.status);
        }
      } catch (initError) {
        console.warn('⚠️ Could not initialize storage:', initError);
        // Continue with original response
      }
    }
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: `Upload failed with status ${response.status}` 
      }));
      console.error('❌ Upload failed:', error);
      throw new Error(error.error || error.message || 'Failed to upload file');
    }
    
    const result = await response.json();
    console.log('✅ Upload successful:', result);
    
    if (!result.url) {
      console.error('❌ No URL in response:', result);
      throw new Error('Server did not return file URL');
    }
    
    return result;
  } catch (error: any) {
    console.error('❌ Upload Error:', error);
    throw new Error(error.message || 'Network error during file upload');
  }
}

// Publications API
export const publicationsApi = {
  getAll: async (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    
    try {
      const data = await apiRequest(`/api/publications${query}`);
      return data.length > 0 ? data : demoPublications;
    } catch (error) {
      return demoPublications;
    }
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
  getAll: async () => {
    try {
      const data = await apiRequest('/api/albums');
      return data.length > 0 ? data : demoAlbums;
    } catch (error) {
      return demoAlbums;
    }
  },
  
  create: (data: any) => apiRequest('/api/albums', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiRequest(`/api/albums/${id}`, {
    method: 'PUT',
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
  getAll: async () => {
    try {
      const data = await apiRequest('/api/achievements');
      return data.length > 0 ? data : demoAchievements;
    } catch (error) {
      return demoAchievements;
    }
  },
  
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
  getAll: async () => {
    try {
      const data = await apiRequest('/api/portfolio');
      return data.length > 0 ? data : demoPortfolio;
    } catch (error) {
      return demoPortfolio;
    }
  },
  
  create: (data: any) => apiRequest('/api/portfolio', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  update: (id: string, data: any) => apiRequest(`/api/portfolio/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (id: string) => apiRequest(`/api/portfolio/${id}`, {
    method: 'DELETE',
  }),
};

// Reviews API
export const reviewsApi = {
  getAll: async (status?: string) => {
    const query = status ? `?status=${status}` : '';
    try {
      const data = await apiRequest(`/api/reviews${query}`);
      return data.length > 0 ? data : demoReviews;
    } catch (error) {
      return demoReviews;
    }
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
  getAll: async () => {
    try {
      const data = await apiRequest('/api/audio');
      return data.length > 0 ? data : demoAudio;
    } catch (error) {
      return demoAudio;
    }
  },
  
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
  getAll: async () => {
    try {
      const data = await apiRequest('/api/videos');
      return data.length > 0 ? data : demoVideos;
    } catch (error) {
      return demoVideos;
    }
  },
  
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

// Pages/Content API
export const pagesApi = {
  getPage: async (pageId: string) => {
    try {
      return await apiRequest(`/api/pages/${pageId}`);
    } catch (error) {
      console.warn(`⚠️ Failed to load page ${pageId}, using defaults`);
      return { id: pageId, title: '', content: '', image_url: null };
    }
  },
  
  updatePage: async (pageId: string, data: any) => {
    console.log(`📝 Updating page ${pageId} with data:`, data);
    try {
      const result = await apiRequest(`/api/pages/${pageId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      console.log('✅ Page updated successfully:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Error updating page:', error);
      throw new Error(error.message || 'Failed to update page');
    }
  },
};
