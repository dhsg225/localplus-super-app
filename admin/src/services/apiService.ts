// [2024-09-26] - API service for Admin app - replaces shared dependencies
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.localplus.city';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('auth_token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  async logout() {
    return this.request('/api/auth', {
      method: 'DELETE',
    });
  }

  // Business endpoints
  async getBusinesses(status?: string, limit = 50, offset = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    if (status) {
      params.append('status', status);
    }

    return this.request(`/api/businesses?${params}`);
  }

  async getBusinessById(id: string) {
    return this.request(`/api/businesses/${id}`);
  }

  async createBusiness(businessData: any) {
    return this.request('/api/businesses', {
      method: 'POST',
      body: JSON.stringify(businessData),
    });
  }

  async updateBusiness(id: string, businessData: any) {
    return this.request(`/api/businesses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(businessData),
    });
  }

  async deleteBusiness(id: string) {
    return this.request(`/api/businesses/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
