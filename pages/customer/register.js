// pages/customer/register.js
import { authService } from '../../services/authService.js';
import { AuthGuard } from '../../utils/auth-guard.js';
import { Validators, FormValidator } from '../../utils/validators.js';

// Redirect if already logged in
AuthGuard.redirectIfAuthenticated();

class RegisterPage {
  constructor() {
    this.form = document.getElementById('registerForm');
    this.firstNameInput = document.getElementById('firstName');
    this.lastNameInput = document.getElementById('lastName');
    this.emailInput = document.getElementById('email');
    this.phoneInput = document.getElementById('phone');
    this.passwordInput = document.getElementById('password');
    this.confirmPasswordInput = document.getElementById('confirmPassword');
    this.agreeTermsInput = document.getElementById('agreeTerms');
    this.registerBtn = document.getElementById('registerBtn');
    this.validator = new FormValidator(this.form);

    this.init();
  }

  init() {
    this.attachEventListeners();
    this.setupPasswordToggles();
  }

  attachEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation
    this.firstNameInput.addEventListener('blur', () =>
      this.validateFirstName()
    );
    this.lastNameInput.addEventListener('blur', () => this.validateLastName());
    this.emailInput.addEventListener('blur', () => this.validateEmail());
    this.phoneInput.addEventListener('blur', () => this.validatePhone());
    this.passwordInput.addEventListener('blur', () => this.validatePassword());
    this.confirmPasswordInput.addEventListener('blur', () =>
      this.validateConfirmPassword()
    );
    this.agreeTermsInput.addEventListener('change', () => this.validateTerms());
  }

  setupPasswordToggles() {
    const setupToggle = (toggleId, inputElement) => {
      const toggleBtn = document.getElementById(toggleId);
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const type = inputElement.type === 'password' ? 'text' : 'password';
          inputElement.type = type;

          const icon = toggleBtn.querySelector('i');
          icon.classList.toggle('fa-eye');
          icon.classList.toggle('fa-eye-slash');
        });
      }
    };

    setupToggle('togglePassword', this.passwordInput);
    setupToggle('toggleConfirmPassword', this.confirmPasswordInput);
  }

  validateFirstName() {
    return this.validator.validateField(
      'firstName',
      Validators.validateName,
      'First name'
    );
  }

  validateLastName() {
    return this.validator.validateField(
      'lastName',
      Validators.validateName,
      'Last name'
    );
  }

  validateEmail() {
    return this.validator.validateField('email', Validators.validateEmail);
  }

  validatePhone() {
    // Phone is optional
    if (!this.phoneInput.value.trim()) {
      this.validator.clearFieldError(this.phoneInput);
      return true;
    }
    return this.validator.validateField('phone', Validators.validatePhone);
  }

  validatePassword() {
    return this.validator.validateField(
      'password',
      Validators.validatePassword
    );
  }

  validateConfirmPassword() {
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;

    const result = Validators.validateConfirmPassword(
      password,
      confirmPassword
    );
    if (!result.valid) {
      this.validator.showFieldError(this.confirmPasswordInput, result.message);
      return false;
    }

    this.validator.clearFieldError(this.confirmPasswordInput);
    return true;
  }

  validateTerms() {
    if (!this.agreeTermsInput.checked) {
      this.validator.showFieldError(
        this.agreeTermsInput,
        'You must agree to the terms and conditions'
      );
      return false;
    }
    this.validator.clearFieldError(this.agreeTermsInput);
    return true;
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Clear previous errors
    this.validator.clearAllErrors();

    // Validate all fields
    const firstNameValid = this.validateFirstName();
    const lastNameValid = this.validateLastName();
    const emailValid = this.validateEmail();
    const phoneValid = this.validatePhone();
    const passwordValid = this.validatePassword();
    const confirmPasswordValid = this.validateConfirmPassword();
    const termsValid = this.validateTerms();

    if (
      !firstNameValid ||
      !lastNameValid ||
      !emailValid ||
      !phoneValid ||
      !passwordValid ||
      !confirmPasswordValid ||
      !termsValid
    ) {
      return;
    }

    // Disable button and show loading
    this.setLoading(true);

    try {
      const userData = {
        firstName: this.firstNameInput.value.trim(),
        lastName: this.lastNameInput.value.trim(),
        email: this.emailInput.value.trim(),
        phone: this.phoneInput.value.trim(),
        password: this.passwordInput.value,
      };

      await authService.register(userData);

      // Redirect after successful registration
      const redirectUrl = AuthGuard.getRedirectAfterLogin();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Registration error:', error);

      // Show specific error on email field (most likely duplicate email)
      if (error.message.includes('already registered')) {
        this.validator.showFieldError(
          this.emailInput,
          'This email is already registered'
        );
      }
    } finally {
      this.setLoading(false);
    }
  }

  setLoading(loading) {
    this.registerBtn.disabled = loading;
    this.registerBtn.innerHTML = loading
      ? '<span class="spinner-border spinner-border-sm me-2"></span>Creating account...'
      : 'Create Account';
  }
}

// Initialize page
new RegisterPage();
