// pages/customer/login.js
import { authService } from '../../services/authService.js';
import { AuthGuard } from '../../utils/auth-guard.js';
import { Validators, FormValidator } from '../../utils/validators.js';

// Redirect if already logged in
AuthGuard.redirectIfAuthenticated();

class LoginPage {
  constructor() {
    this.form = document.getElementById('loginForm');
    this.emailInput = document.getElementById('email');
    this.passwordInput = document.getElementById('password');
    this.loginBtn = document.getElementById('loginBtn');
    this.validator = new FormValidator(this.form);

    this.init();
  }

  init() {
    this.attachEventListeners();
    this.setupPasswordToggle();
  }

  attachEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation
    this.emailInput.addEventListener('blur', () => this.validateEmail());
    this.passwordInput.addEventListener('blur', () => this.validatePassword());
  }

  setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const type =
          this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;

        const icon = toggleBtn.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
      });
    }
  }

  validateEmail() {
    return this.validator.validateField('email', Validators.validateEmail);
  }

  validatePassword() {
    const value = this.passwordInput.value;
    if (!value) {
      this.validator.showFieldError(this.passwordInput, 'Password is required');
      return false;
    }
    this.validator.clearFieldError(this.passwordInput);
    return true;
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    this.validator.clearAllErrors();

    // Validate all fields
    const emailValid = this.validateEmail();
    const passwordValid = this.validatePassword();

    if (!emailValid || !passwordValid) {
      return;
    }

    // Disable button and show loading
    this.setLoading(true);

    try {
      const credentials = {
        email: this.emailInput.value,
        password: this.passwordInput.value,
      };

      await authService.login(credentials);

      // Redirect after successful login
      const redirectUrl = AuthGuard.getRedirectAfterLogin();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Login error:', error);
      this.validator.showFieldError(
        this.passwordInput,
        'Invalid email or password'
      );
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.loginBtn.disabled = loading;
    this.loginBtn.innerHTML = loading
      ? '<span class="spinner-border spinner-border-sm me-2"></span>Signing in...'
      : 'Sign In';
  }
}

// Initialize page
new LoginPage();
