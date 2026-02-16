// utils/validators.js - Form Validation
export class Validators {
  // Email validation
  static validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return { valid: false, message: 'Email is required' };
    }
    if (!regex.test(email)) {
      return { valid: false, message: 'Invalid email format' };
    }
    return { valid: true };
  }

  // Password validation
  static validatePassword(password) {
    if (!password) {
      return { valid: false, message: 'Password is required' };
    }
    if (password.length < 8) {
      return {
        valid: false,
        message: 'Password must be at least 8 characters',
      };
    }
    if (!/[A-Z]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one uppercase letter',
      };
    }
    if (!/[a-z]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one lowercase letter',
      };
    }
    if (!/[0-9]/.test(password)) {
      return {
        valid: false,
        message: 'Password must contain at least one number',
      };
    }
    return { valid: true };
  }

  // Confirm password validation
  static validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) {
      return { valid: false, message: 'Please confirm your password' };
    }
    if (password !== confirmPassword) {
      return { valid: false, message: 'Passwords do not match' };
    }
    return { valid: true };
  }

  // Phone validation
  static validatePhone(phone) {
    const regex = /^[\d\s\-\+\(\)]+$/;
    if (!phone) {
      return { valid: false, message: 'Phone number is required' };
    }
    if (!regex.test(phone)) {
      return { valid: false, message: 'Invalid phone number format' };
    }
    if (phone.replace(/\D/g, '').length < 10) {
      return {
        valid: false,
        message: 'Phone number must be at least 10 digits',
      };
    }
    return { valid: true };
  }

  // Name validation
  static validateName(name, fieldName = 'Name') {
    if (!name) {
      return { valid: false, message: `${fieldName} is required` };
    }
    if (name.length < 2) {
      return {
        valid: false,
        message: `${fieldName} must be at least 2 characters`,
      };
    }
    if (!/^[a-zA-Z\s\-']+$/.test(name)) {
      return {
        valid: false,
        message: `${fieldName} contains invalid characters`,
      };
    }
    return { valid: true };
  }

  // Required field validation
  static validateRequired(value, fieldName = 'Field') {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true };
  }

  // Number validation
  static validateNumber(value, fieldName = 'Value', min = null, max = null) {
    if (!value && value !== 0) {
      return { valid: false, message: `${fieldName} is required` };
    }

    const num = Number(value);
    if (isNaN(num)) {
      return { valid: false, message: `${fieldName} must be a number` };
    }

    if (min !== null && num < min) {
      return { valid: false, message: `${fieldName} must be at least ${min}` };
    }

    if (max !== null && num > max) {
      return { valid: false, message: `${fieldName} must be at most ${max}` };
    }

    return { valid: true };
  }

  // URL validation
  static validateUrl(url, fieldName = 'URL') {
    if (!url) {
      return { valid: false, message: `${fieldName} is required` };
    }
    try {
      new URL(url);
      return { valid: true };
    } catch {
      return { valid: false, message: `Invalid ${fieldName} format` };
    }
  }

  // Zip code validation
  static validateZipCode(zipCode) {
    if (!zipCode) {
      return { valid: false, message: 'Zip code is required' };
    }
    // Basic validation (adjust regex for specific country formats)
    if (!/^[\d\s\-A-Za-z]{3,10}$/.test(zipCode)) {
      return { valid: false, message: 'Invalid zip code format' };
    }
    return { valid: true };
  }

  // Credit card validation (basic)
  static validateCardNumber(cardNumber) {
    if (!cardNumber) {
      return { valid: false, message: 'Card number is required' };
    }
    const cleaned = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) {
      return { valid: false, message: 'Invalid card number' };
    }
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    if (sum % 10 !== 0) {
      return { valid: false, message: 'Invalid card number' };
    }
    return { valid: true };
  }

  // CVV validation
  static validateCVV(cvv) {
    if (!cvv) {
      return { valid: false, message: 'CVV is required' };
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      return { valid: false, message: 'CVV must be 3 or 4 digits' };
    }
    return { valid: true };
  }

  // Expiry date validation (MM/YY)
  static validateExpiry(expiry) {
    if (!expiry) {
      return { valid: false, message: 'Expiry date is required' };
    }
    const parts = expiry.split('/');
    if (parts.length !== 2) {
      return { valid: false, message: 'Invalid expiry format (use MM/YY)' };
    }
    const [month, year] = parts.map((p) => parseInt(p.trim()));
    if (month < 1 || month > 12) {
      return { valid: false, message: 'Invalid month' };
    }
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { valid: false, message: 'Card has expired' };
    }
    return { valid: true };
  }
}

// Form validation helper
export class FormValidator {
  constructor(formElement) {
    this.form = formElement;
    this.errors = {};
  }

  // Validate field and show error
  validateField(fieldName, validator, ...args) {
    const field = this.form.querySelector(`[name="${fieldName}"]`);
    if (!field) return true;

    const value = field.value;
    const result = validator(value, ...args);

    if (!result.valid) {
      this.errors[fieldName] = result.message;
      this.showFieldError(field, result.message);
      return false;
    }

    this.clearFieldError(field);
    delete this.errors[fieldName];
    return true;
  }

  // Show field error
  showFieldError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');

    let errorElement = field.parentElement.querySelector('.invalid-feedback');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'invalid-feedback';
      field.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  // Clear field error
  clearFieldError(field) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');

    const errorElement = field.parentElement.querySelector('.invalid-feedback');
    if (errorElement) {
      errorElement.remove();
    }
  }

  // Clear all errors
  clearAllErrors() {
    this.errors = {};
    this.form.querySelectorAll('.is-invalid').forEach((field) => {
      this.clearFieldError(field);
    });
  }

  // Check if form is valid
  isValid() {
    return Object.keys(this.errors).length === 0;
  }

  // Get all errors
  getErrors() {
    return this.errors;
  }
}
