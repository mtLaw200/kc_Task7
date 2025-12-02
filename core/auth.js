// core/auth.js - Authentication Handler
import { CONFIG } from './constants.js';

class AuthManager {
  constructor() {
    this.currentUser = this.loadUser();
    this.TOKEN_KEY = 'shop-now-token';
    this.USER_KEY = 'shop-now-user';
  }

  // Load user from localStorage
  loadUser() {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.error('Failed to load user:', e);
      return null;
    }
  }

  // Save user to localStorage
  saveUser(user) {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUser = user;
    } catch (e) {
      console.error('Failed to save user:', e);
    }
  }

  // Get auth token
  getToken() {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Save auth token
  saveToken(token) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Login user
  login(user, token) {
    this.saveUser(user);
    this.saveToken(token);
    this.notifyAuthChange('login', user);
  }

  // Logout user
  logout() {
    const user = this.currentUser;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUser = null;
    this.notifyAuthChange('logout', user);
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null && this.getToken() !== null;
  }

  // Check if user is admin
  isAdmin() {
    return this.currentUser?.role === 'admin';
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Update current user
  updateUser(updates) {
    if (this.currentUser) {
      this.currentUser = { ...this.currentUser, ...updates };
      this.saveUser(this.currentUser);
      this.notifyAuthChange('update', this.currentUser);
    }
  }

  // Notify auth state change
  notifyAuthChange(action, user) {
    window.dispatchEvent(
      new CustomEvent('authChanged', {
        detail: { action, user },
      })
    );
  }

  // Get auth headers for API calls
  getAuthHeaders() {
    const token = this.getToken();
    return token
      ? {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      : {
          'Content-Type': 'application/json',
        };
  }
}

export const auth = new AuthManager();
