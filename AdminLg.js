// Nagar Mitra Admin Login Application
class NagarMitraLogin {
    constructor() {
        // Simulated admin database (in production, this would be server-side)
        this.adminDatabase = [
            { userId: "admin123", password: "testpass" },
            { userId: "admin001", password: "nagar2025" },
            { userId: "superadmin", password: "securePass!" },
           // { userId: "" , password: ""}
           { userId: "saksham", password: "saksham123" },
           { userId: "vishuddh" , password: "vishuddh123"},
           { userId: "techhawks" , password: "techhawks"}

        ];
        
        this.loginAttempts = 0;
        this.maxAttempts = 3;
        this.isVerificationComplete = false;
        
        this.init();
    }

    init() {
        console.log('Nagar Mitra Login App initializing...');
        this.setupEventListeners();
        this.setupKeyboardShortcuts();
        this.focusUserIdField();
        
        // Welcome message
        setTimeout(() => {
            this.showNotification('Welcome to Nagar Mitra Admin Portal', 'info');
        }, 1000);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Login form submission
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Form submitted');
                this.handleLogin();
            });
        } else {
            console.error('Login form not found');
        }

        // Password toggle
        const passwordToggle = document.getElementById('passwordToggle');
        if (passwordToggle) {
            passwordToggle.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Password toggle clicked');
                this.togglePasswordVisibility();
            });
        } else {
            console.error('Password toggle not found');
        }

        // Login button direct click (fallback)
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Login button clicked directly');
                this.handleLogin();
            });
        }

        // Modal close handlers
        this.setupModalHandlers();

        // Success modal - proceed to verification
        const proceedBtn = document.getElementById('proceedToVerification');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Proceed to verification clicked');
                this.showHumanVerification();
            });
        }

        // Human verification handlers
        this.setupVerificationHandlers();

        // Error modal - retry login
        const retryBtn = document.getElementById('retryLogin');
        if (retryBtn) {
            retryBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Retry login clicked');
                this.closeModal('errorModal');
                this.resetForm();
            });
        }

        // Form input handlers for better UX
        this.setupFormInputHandlers();
    }

    setupFormInputHandlers() {
        const userIdInput = document.getElementById('userId');
        const passwordInput = document.getElementById('password');

        // Real-time validation feedback
        if (userIdInput) {
            userIdInput.addEventListener('input', (e) => {
                this.clearInputError(e.target);
            });
            
            userIdInput.addEventListener('blur', (e) => {
                this.validateUserId(e.target.value);
            });
        }

        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => {
                this.clearInputError(e.target);
            });
        }

        // Enter key navigation
        if (userIdInput && passwordInput) {
            userIdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    passwordInput.focus();
                }
            });
            
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleLogin();
                }
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+L to focus User ID field
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                this.focusUserIdField();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupModalHandlers() {
        // Close modal when clicking backdrop
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__backdrop')) {
                const modal = e.target.closest('.modal');
                if (modal && modal.id !== 'verificationModal') {
                    this.closeModal(modal.id);
                }
            }
        });
    }

    setupVerificationHandlers() {
        // Captcha checkbox
        const captchaCheckbox = document.getElementById('captchaCheckbox');
        const captchaBox = document.querySelector('.captcha-box');
        
        if (captchaBox) {
            captchaBox.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Captcha clicked');
                this.handleCaptchaClick();
            });
        }

        // Complete login button
        const completeLoginBtn = document.getElementById('completeLogin');
        if (completeLoginBtn) {
            completeLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Complete login clicked');
                this.completeLoginProcess();
            });
        }

        // Cancel verification
        const cancelBtn = document.getElementById('cancelVerification');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Cancel verification clicked');
                this.cancelVerification();
            });
        }
    }

    handleLogin() {
        console.log('handleLogin called');
        
        const userIdInput = document.getElementById('userId');
        const passwordInput = document.getElementById('password');
        
        if (!userIdInput || !passwordInput) {
            console.error('Input fields not found');
            return;
        }
        
        const userId = userIdInput.value.trim();
        const password = passwordInput.value;
        const loginBtn = document.getElementById('loginBtn');

        console.log('Login attempt with userId:', userId);

        // Input validation
        if (!this.validateInputs(userId, password)) {
            console.log('Input validation failed');
            return;
        }

        // Show loading state
        this.setLoadingState(loginBtn, true);

        // Simulate network delay
        setTimeout(() => {
            const isValid = this.validateCredentials(userId, password);
            console.log('Credentials valid:', isValid);
            
            this.setLoadingState(loginBtn, false);
            
            if (isValid) {
                this.handleSuccessfulLogin(userId);
            } else {
                this.handleFailedLogin();
            }
        }, 1500);
    }

    validateInputs(userId, password) {
        let isValid = true;
        
        const userIdInput = document.getElementById('userId');
        const passwordInput = document.getElementById('password');
        
        // Clear previous errors
        this.clearInputError(userIdInput);
        this.clearInputError(passwordInput);
        
        if (!userId) {
            this.showInputError(userIdInput, 'User ID is required');
            isValid = false;
        } else if (userId.length < 3) {
            this.showInputError(userIdInput, 'User ID must be at least 3 characters');
            isValid = false;
        }
        
        if (!password) {
            this.showInputError(passwordInput, 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            this.showInputError(passwordInput, 'Password must be at least 6 characters');
            isValid = false;
        }
        
        return isValid;
    }

    validateUserId(userId) {
        const userIdInput = document.getElementById('userId');
        
        if (userId && userId.length >= 3) {
            // Check if user exists (without revealing if it exists)
            userIdInput.classList.add('input-valid');
        } else {
            userIdInput.classList.remove('input-valid');
        }
    }

    validateCredentials(userId, password) {
        // Simulate secure credential validation
        const isValid = this.adminDatabase.some(admin => 
            admin.userId === userId && admin.password === password
        );
        console.log('Validating credentials:', { userId, password, isValid });
        return isValid;
    }

    handleSuccessfulLogin(userId) {
        console.log('Login successful for:', userId);
        this.loginAttempts = 0;
        
        // Add success animation to login card
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            loginCard.classList.add('success');
        }
        
        setTimeout(() => {
            if (loginCard) {
                loginCard.classList.remove('success');
            }
            this.showSuccessModal(userId);
        }, 1000);
        
        this.showNotification('Credentials verified successfully!', 'success');
    }

    handleFailedLogin() {
        console.log('Login failed');
        this.loginAttempts++;
        
        // Add error animation to login card
        const loginCard = document.querySelector('.login-card');
        if (loginCard) {
            loginCard.classList.add('error');
        }
        
        setTimeout(() => {
            if (loginCard) {
                loginCard.classList.remove('error');
            }
        }, 500);
        
        // Show error modal
        setTimeout(() => {
            this.showErrorModal();
        }, 600);
        
        this.showNotification('Invalid credentials. Please try again.', 'error');
        
        // Auto-focus on User ID for retry
        setTimeout(() => {
            this.focusUserIdField();
        }, 1000);
    }

    showSuccessModal(userId) {
        console.log('Showing success modal for:', userId);
        const modal = document.getElementById('successModal');
        const verifiedUserSpan = document.getElementById('verifiedUserId');
        const loginTimeSpan = document.getElementById('loginTime');
        
        if (verifiedUserSpan) {
            verifiedUserSpan.textContent = userId;
        }
        
        if (loginTimeSpan) {
            loginTimeSpan.textContent = new Date().toLocaleString();
        }
        
        this.showModal('successModal');
    }

    showErrorModal() {
        console.log('Showing error modal');
        this.showModal('errorModal');
    }

    showHumanVerification() {
        console.log('Showing human verification');
        this.closeModal('successModal');
        
        setTimeout(() => {
            this.showModal('verificationModal');
            this.resetVerificationState();
        }, 300);
    }

    resetVerificationState() {
        const checkbox = document.getElementById('captchaCheckbox');
        const progress = document.getElementById('verificationProgress');
        const success = document.getElementById('verificationSuccess');
        const completeBtn = document.getElementById('completeLogin');
        
        // Reset checkbox
        if (checkbox) {
            checkbox.classList.remove('checked');
            checkbox.innerHTML = '<i class="fas fa-check hidden"></i>';
        }
        
        // Hide progress and success
        if (progress) progress.classList.add('hidden');
        if (success) success.classList.add('hidden');
        
        // Disable complete button
        if (completeBtn) {
            completeBtn.disabled = true;
        }
        
        this.isVerificationComplete = false;
    }

    handleCaptchaClick() {
        console.log('Captcha verification started');
        const checkbox = document.getElementById('captchaCheckbox');
        const progress = document.getElementById('verificationProgress');
        const success = document.getElementById('verificationSuccess');
        const completeBtn = document.getElementById('completeLogin');
        
        if (this.isVerificationComplete) return;
        
        // Show loading state
        if (checkbox) {
            checkbox.classList.add('checked');
            checkbox.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
        
        // Show progress
        setTimeout(() => {
            if (progress) progress.classList.remove('hidden');
        }, 500);
        
        // Simulate verification process
        setTimeout(() => {
            // Hide progress
            if (progress) progress.classList.add('hidden');
            
            // Show success
            if (success) success.classList.remove('hidden');
            
            // Update checkbox
            if (checkbox) {
                checkbox.innerHTML = '<i class="fas fa-check"></i>';
            }
            
            // Enable complete button
            if (completeBtn) {
                completeBtn.disabled = false;
            }
            
            this.isVerificationComplete = true;
            this.showNotification('Human verification completed successfully!', 'success');
        }, 3000);
    }

    completeLoginProcess() {
        console.log('Completing login process');
        if (!this.isVerificationComplete) {
            this.showNotification('Please complete the human verification first', 'warning');
            return;
        }
        
        // Close verification modal
        this.closeModal('verificationModal');
        
        // Show loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
        
        // Simulate redirect to dashboard
        setTimeout(() => {
            this.redirectToDashboard();
        }, 3000);
    }

    redirectToDashboard() {
        console.log('Redirecting to dashboard');
        // In a real application, this would redirect to the actual dashboard
        // For demo purposes, we'll show a success message
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
        // Show success notification
        this.showNotification('🎉 Login successful! Redirecting to admin dashboard...', 'success');
        
        // Reset the form for demo purposes
        setTimeout(() => {
            this.resetForm();
            this.showNotification('Demo completed. You can try logging in again.', 'info');
        }, 3000);
    }

    cancelVerification() {
        this.closeModal('verificationModal');
        this.resetForm();
        this.showNotification('Verification cancelled. Please login again.', 'warning');
    }

    togglePasswordVisibility() {
        console.log('Toggling password visibility');
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#passwordToggle i');
        
        if (!passwordInput || !toggleIcon) {
            console.error('Password input or toggle icon not found');
            return;
        }
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
    }

    setLoadingState(button, isLoading) {
        if (!button) return;
        
        const spinner = button.querySelector('.login-spinner');
        const buttonText = button.querySelector('span');
        
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            if (spinner) spinner.classList.remove('hidden');
            if (buttonText) buttonText.style.opacity = '0';
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            if (spinner) spinner.classList.add('hidden');
            if (buttonText) buttonText.style.opacity = '1';
        }
    }

    showInputError(input, message) {
        if (!input) return;
        
        // Remove existing error
        this.clearInputError(input);
        
        // Add error class
        input.classList.add('input-error');
        
        // Create error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error-message';
        errorDiv.textContent = message;
        
        // Insert after input wrapper
        const wrapper = input.closest('.input-wrapper');
        if (wrapper && wrapper.parentNode) {
            wrapper.parentNode.insertBefore(errorDiv, wrapper.nextSibling);
        }
        
        // Focus the input
        input.focus();
    }

    clearInputError(input) {
        if (!input) return;
        
        input.classList.remove('input-error', 'input-valid');
        
        // Remove error message
        const wrapper = input.closest('.input-wrapper');
        if (wrapper && wrapper.parentNode) {
            const errorMessage = wrapper.parentNode.querySelector('.input-error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }
    }

    focusUserIdField() {
        const userIdInput = document.getElementById('userId');
        if (userIdInput) {
            userIdInput.focus();
            userIdInput.select();
        }
    }

    resetForm() {
        const form = document.getElementById('loginForm');
        if (form) {
            form.reset();
        }
        
        // Clear any error states
        const inputs = document.querySelectorAll('.form-control');
        inputs.forEach(input => this.clearInputError(input));
        
        // Reset password visibility
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.querySelector('#passwordToggle i');
        if (passwordInput && passwordInput.type === 'text') {
            passwordInput.type = 'password';
            if (toggleIcon) {
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        }
        
        // Focus User ID field
        setTimeout(() => {
            this.focusUserIdField();
        }, 100);
    }

    showModal(modalId) {
        console.log('Showing modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            
            // Trap focus in modal
            this.trapFocus(modal);
        } else {
            console.error('Modal not found:', modalId);
        }
    }

    closeModal(modalId) {
        console.log('Closing modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    trapFocus(modal) {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // Focus first element
        setTimeout(() => {
            firstElement.focus();
        }, 100);
        
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    showNotification(message, type = 'info') {
        console.log('Showing notification:', message, type);
        
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add styles
        this.addNotificationStyles();

        // Add to page
        document.body.appendChild(notification);

        // Show with animation
        setTimeout(() => {
            notification.classList.add('notification--show');
        }, 100);

        // Auto remove
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.removeNotification(notification);
            });
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('notification--show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }

    addNotificationStyles() {
        if (document.querySelector('#notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-lg);
                padding: var(--space-16);
                max-width: 400px;
                z-index: 1002;
                transform: translateX(100%);
                transition: transform var(--duration-normal) var(--ease-standard);
                display: flex;
                align-items: center;
                gap: var(--space-12);
            }
            
            .notification--show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: var(--space-8);
                flex: 1;
                color: var(--color-text);
                font-size: var(--font-size-sm);
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: var(--space-4);
                border-radius: var(--radius-sm);
                transition: all var(--duration-fast) var(--ease-standard);
            }
            
            .notification-close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
            }
            
            .notification--success {
                border-left: 4px solid var(--color-success);
            }
            
            .notification--error {
                border-left: 4px solid var(--color-error);
            }
            
            .notification--warning {
                border-left: 4px solid var(--color-warning);
            }
            
            .notification--info {
                border-left: 4px solid var(--color-primary);
            }
            
            .notification--success .notification-content i {
                color: var(--color-success);
            }
            
            .notification--error .notification-content i {
                color: var(--color-error);
            }
            
            .notification--warning .notification-content i {
                color: var(--color-warning);
            }
            
            .notification--info .notification-content i {
                color: var(--color-primary);
            }
            
            .input-error {
                border-color: var(--color-error) !important;
                box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.15) !important;
            }
            
            .input-valid {
                border-color: var(--color-success) !important;
            }
            
            .input-error-message {
                color: var(--color-error);
                font-size: var(--font-size-xs);
                margin-top: var(--space-4);
                display: flex;
                align-items: center;
                gap: var(--space-4);
            }
            
            .input-error-message::before {
                content: "⚠";
                font-size: var(--font-size-sm);
            }
            
            @media (max-width: 480px) {
                .notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application
let loginApp;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    loginApp = new NagarMitraLogin();
});

// Handle page visibility for better UX
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && loginApp) {
        // Re-focus User ID field when page becomes visible
        setTimeout(() => {
            const userId = document.getElementById('userId');
            if (userId && !userId.value) {
                userId.focus();
            }
        }, 100);
    }
});