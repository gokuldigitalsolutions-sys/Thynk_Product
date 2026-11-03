/**
 * Thynk Digital Solution - CRM & HRMS PHP/MySQL API Client
 * Connects frontend state seamlessly with backend MySQL database
 * Features: Session-based Auth, CSRF token handling, and Error resilience
 */

const API_BASE = 'api';

const API = {
  csrfToken: null,

  setCsrfToken(token) {
    if (token) {
      this.csrfToken = token;
    }
  },

  getCsrfToken() {
    return this.csrfToken;
  },

  /**
   * Helper for fetch requests with JSON parsing and CSRF token handling
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE}/${endpoint}`;
    const method = (options.method || 'GET').toUpperCase();
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Attach CSRF token on state-changing requests
    if (this.csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      defaultHeaders['X-CSRF-Token'] = this.csrfToken;
    }

    const config = {
      credentials: 'same-origin',
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      // If CSRF token exists, also embed it in JSON payload if appropriate
      if (this.csrfToken && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        if (!config.body.csrf_token && !config.body.csrfToken) {
          config.body.csrf_token = this.csrfToken;
        }
      }
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('API non-JSON response:', text);
        return { success: false, error: 'Invalid server response' };
      }

      // Capture CSRF token if returned in response
      if (data && data.csrf_token) {
        this.csrfToken = data.csrf_token;
      }

      return data;
    } catch (err) {
      console.warn(`API request to ${endpoint} failed:`, err);
      return { success: false, error: err.message || 'Network error' };
    }
  },

  // ================= AUTHENTICATION =================
  async login(username, password) {
    const res = await this.request('auth.php?action=login', {
      method: 'POST',
      body: { username, password }
    });
    if (res && res.csrf_token) {
      this.setCsrfToken(res.csrf_token);
    }
    return res;
  },

  async logout() {
    const res = await this.request('auth.php?action=logout', {
      method: 'POST'
    });
    this.csrfToken = null;
    return res;
  },

  async checkAuth() {
    const res = await this.request('auth.php?action=check', {
      method: 'GET'
    });
    if (res && res.csrf_token) {
      this.setCsrfToken(res.csrf_token);
    }
    return res;
  },

  async changePassword(currentPassword, newPassword) {
    return this.request('auth.php?action=change_password', {
      method: 'POST',
      body: { currentPassword, newPassword }
    });
  },

  async resetPassword(employeeId, newPassword) {
    return this.request('auth.php?action=reset_password', {
      method: 'POST',
      body: { employeeId, newPassword }
    });
  },

  // ================= STATE SYNC (Single Source of Truth) =================
  async getFullState() {
    const res = await this.request('sync.php', { method: 'GET' });
    if (res && res.success && res.data) {
      return res.data;
    }
    return null;
  },

  async migrateState(stateData) {
    return this.request('migrate.php', {
      method: 'POST',
      body: { state: stateData }
    });
  },

  // ================= ENTITY CRUD =================
  async create(entity, data) {
    const ep = this.getEntityEndpoint(entity);
    return this.request(ep, {
      method: 'POST',
      body: data
    });
  },

  async update(entity, id, data) {
    const ep = this.getEntityEndpoint(entity);
    const url = id ? `${ep}?id=${encodeURIComponent(id)}` : ep;
    return this.request(url, {
      method: 'PUT',
      body: { ...data, id }
    });
  },

  async delete(entity, id) {
    const ep = this.getEntityEndpoint(entity);
    return this.request(`${ep}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  },

  getEntityEndpoint(entity) {
    const map = {
      'clients': 'clients.php',
      'leads': 'leads.php',
      'employees': 'employees.php',
      'services': 'services.php',
      'domains': 'domains.php',
      'hostings': 'hostings.php',
      'attendance': 'attendance.php',
      'leaves': 'leaves.php',
      'tasks': 'tasks.php',
      'payments': 'payments.php',
      'invoices': 'invoices.php',
      'followups': 'followups.php',
      'reminders': 'reminders.php',
      'notes': 'notes.php',
      'metaAds': 'meta_ads.php',
      'googleAds': 'google_ads.php',
      'seo': 'seo.php',
      'projects': 'projects.php',
      'canva': 'canva.php',
      'billingSoftware': 'billing_software.php',
      'timeline': 'timeline.php',
      'notifications': 'notifications.php',
      'settings': 'settings.php'
    };
    return map[entity] || `${entity}.php`;
  },

  // Specific helpers
  async saveLeaveAllocation(employeeId, allocationType, allowance) {
    return this.request('leaves.php?action=allocations', {
      method: 'POST',
      body: { employeeId, allocationType, allowance }
    });
  },

  async saveSettings(settings) {
    return this.request('settings.php', {
      method: 'POST',
      body: { settings }
    });
  },

  async addTimeline(text, eventType = 'info', icon = 'fa-info-circle') {
    return this.request('timeline.php', {
      method: 'POST',
      body: { text, eventType, icon }
    });
  },

  async addNotification(title, message, type = 'info') {
    return this.request('notifications.php', {
      method: 'POST',
      body: { title, message, type, date: 'Just Now' }
    });
  }
};

window.API = API;
