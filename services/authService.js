// services/authService.js
import { auth } from '../core/auth.js';
import { handleError, showNotification } from '../utils/errorHandler.js';

class AuthService {
  constructor() {
    // In production, replace with actual API endpoint
    this.API_URL = 'http://localhost:3000/api/auth';
    // For MVP demo, use localStorage to simulate backend
    this.DEMO_MODE = true;
  }

  // Register new user
  async register(userData) {
    try {
      if (this.DEMO_MODE) {
        return this.demoRegister(userData);
      }

      const response = await fetch(`${this.API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const data = await response.json();
      auth.login(data.user, data.token);
      showNotification(
        'Registration successful! Welcome to ShopNow.',
        'success'
      );
      return data;
    } catch (error) {
      handleError(error, 'Registration failed. Please try again.');
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      if (this.DEMO_MODE) {
        return this.demoLogin(credentials);
      }

      const response = await fetch(`${this.API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data = await response.json();
      auth.login(data.user, data.token);
      showNotification(`Welcome back, ${data.user.firstName}!`, 'success');
      return data;
    } catch (error) {
      handleError(error, 'Login failed. Please check your credentials.');
      throw error;
    }
  }

  // Logout user
  logout() {
    auth.logout();
    showNotification('You have been logged out.', 'info');
    window.location.href = '/index.html';
  }

  // Reset password
  async resetPassword(email) {
    try {
      if (this.DEMO_MODE) {
        showNotification('Password reset link sent to your email.', 'success');
        return { success: true };
      }

      const response = await fetch(`${this.API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      showNotification('Password reset link sent to your email.', 'success');
      return await response.json();
    } catch (error) {
      handleError(error, 'Failed to send reset email.');
      throw error;
    }
  }

  // Verify token
  async verifyToken() {
    try {
      if (this.DEMO_MODE) {
        return auth.isAuthenticated();
      }

      const token = auth.getToken();
      if (!token) return false;

      const response = await fetch(`${this.API_URL}/verify`, {
        method: 'GET',
        headers: auth.getAuthHeaders(),
      });

      return response.ok;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  // DEMO MODE METHODS (Remove in production)
  demoRegister(userData) {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('demo-users') || '[]');

        // Check if email exists
        if (users.find((u) => u.email === userData.email)) {
          throw new Error('Email already registered');
        }

        const newUser = {
          id: Date.now().toString(),
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone || '',
          role: 'customer',
          addresses: [],
          createdAt: new Date().toISOString(),
        };

        // Store password separately (in production, this would be hashed on backend)
        const credentials = JSON.parse(
          localStorage.getItem('demo-credentials') || '{}'
        );
        credentials[userData.email] = userData.password;
        localStorage.setItem('demo-credentials', JSON.stringify(credentials));

        users.push(newUser);
        localStorage.setItem('demo-users', JSON.stringify(users));

        const token = btoa(
          JSON.stringify({ userId: newUser.id, exp: Date.now() + 86400000 })
        );

        resolve({ user: newUser, token });
      }, 500);
    });
  }

  demoLogin(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('demo-users') || '[]');
        const storedCredentials = JSON.parse(
          localStorage.getItem('demo-credentials') || '{}'
        );

        // Check demo admin account
        if (
          credentials.email === 'admin@shopnow.co' &&
          credentials.password === 'admin123'
        ) {
          const adminUser = {
            id: 'admin-1',
            email: 'admin@shopnow.co',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            createdAt: new Date().toISOString(),
          };

          const token = btoa(
            JSON.stringify({ userId: adminUser.id, exp: Date.now() + 86400000 })
          );
          resolve({ user: adminUser, token });
          return;
        }

        const user = users.find((u) => u.email === credentials.email);

        if (!user) {
          reject(new Error('Invalid email or password'));
          return;
        }

        if (storedCredentials[credentials.email] !== credentials.password) {
          reject(new Error('Invalid email or password'));
          return;
        }

        const token = btoa(
          JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 })
        );
        resolve({ user, token });
      }, 500);
    });
  }
}

export const authService = new AuthService();
