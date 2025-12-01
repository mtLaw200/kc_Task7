// utils/errorHandler.js
export class AppError extends Error {
  constructor(message, type = 'general') {
    super(message);
    this.type = type;
    this.name = 'AppError';
  }
}

export function handleError(error, userMessage = 'Something went wrong') {
  console.error('Application Error:', error);

  // Show user-friendly message
  showNotification(userMessage, 'error');

  // Track error (add analytics here if needed)
  return null;
}

export function showNotification(message, type = 'info') {
  const container =
    document.getElementById('notification-container') ||
    createNotificationContainer();

  const notification = document.createElement('div');
  notification.className = `alert alert-${getAlertType(
    type
  )} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  notification.style.zIndex = '9999';
  notification.style.minWidth = '300px';
  notification.setAttribute('role', 'alert');

  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;

  container.appendChild(notification);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 150);
  }, 5000);
}

function createNotificationContainer() {
  const container = document.createElement('div');
  container.id = 'notification-container';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.right = '0';
  container.style.zIndex = '9999';
  document.body.appendChild(container);
  return container;
}

function getAlertType(type) {
  const typeMap = {
    error: 'danger',
    success: 'success',
    info: 'info',
    warning: 'warning',
  };
  return typeMap[type] || 'info';
}
