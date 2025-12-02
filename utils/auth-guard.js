// utils/auth-guard.js - Route Protection
import { auth } from '../core/auth.js';
import { showNotification } from './errorHandler.js';

export class AuthGuard {
  // Protect customer routes (requires authentication)
  static requireAuth(redirectUrl = '/customer/login.html') {
    if (!auth.isAuthenticated()) {
      showNotification('Please login to continue.', 'warning');
      window.location.href = redirectUrl;
      return false;
    }
    return true;
  }

  // Protect admin routes (requires admin role)
  static requireAdmin(redirectUrl = '/customer/login.html') {
    if (!auth.isAuthenticated()) {
      showNotification('Please login to continue.', 'warning');
      window.location.href = redirectUrl;
      return false;
    }

    if (!auth.isAdmin()) {
      showNotification('Access denied. Admin privileges required.', 'error');
      window.location.href = '/index.html';
      return false;
    }

    return true;
  }

  // Redirect if already authenticated (for login/register pages)
  static redirectIfAuthenticated(redirectUrl = '/customer/profile.html') {
    if (auth.isAuthenticated()) {
      if (auth.isAdmin()) {
        window.location.href = '/admin/index.html';
      } else {
        window.location.href = redirectUrl;
      }
      return true;
    }
    return false;
  }

  // Check if user can access checkout
  static canCheckout() {
    return auth.isAuthenticated();
  }

  // Get redirect URL after login
  static getRedirectAfterLogin() {
    const urlParams = new URLSearchParams(window.location.search);
    const redirect = urlParams.get('redirect');

    if (redirect) {
      return decodeURIComponent(redirect);
    }

    if (auth.isAdmin()) {
      return '/admin/index.html';
    }

    return '/customer/profile.html';
  }

  // Set redirect URL for after login
  static setRedirectUrl(url) {
    const loginUrl = new URL('/customer/login.html', window.location.origin);
    loginUrl.searchParams.set('redirect', encodeURIComponent(url));
    return loginUrl.toString();
  }
}

// Auto-check auth on protected pages
export function initAuthGuard(pageType = 'customer') {
  if (pageType === 'admin') {
    return AuthGuard.requireAdmin();
  } else if (pageType === 'customer') {
    return AuthGuard.requireAuth();
  }
  return true;
}
