// Nagar Mitra Login/Signup Application
class NagarMitraAuth {
    constructor() {
        // Application configuration from provided data
        this.config = {
            otpSettings: {
                length: 6,
                expiryMinutes: 5,
                maxAttempts: 3,
                resendDelay: 60
            },
            phoneValidation: {
                countryCode: "+91",
                pattern: /^[6-9]\d{9}$/,
                minLength: 10,
                maxLength: 10
            },
            humanVerification: {
                methods: ["ip_analysis", "device_fingerprint", "behavioral_analysis" , "geolocation"],
                riskFactors: ["new_device", "unusual_location", "proxy_detection", "bot_behavior"],
                verificationTimeout: 30
            },
            adminCredentials: {
                username: "admin",
                password: "admin123"
            },
            messages: {
                otpSent: "OTP sent successfully to your mobile number",
                otpVerified: "OTP verified successfully",
                humanVerified: "Human verification completed",
                loginSuccess: "Login successful! Redirecting...",
                signupSuccess: "Registration successful! Welcome to Nagar Mitra",
                adminLoginSuccess: "Admin login successful",
                errors: {
                    invalidPhone: "Please enter a valid 10-digit mobile number",
                    invalidOTP: "Invalid OTP. Please try again",
                    otpExpired: "OTP has expired. Please request a new one",
                    maxAttemptsReached: "Maximum attempts reached. Please try again later",
                    humanVerificationFailed: "Verification failed. Please try again",
                    networkError: "Network error. Please check your connection"
                }
            },
            smsProvider: {
                name: "Twilio",
                apiKey: "simulated_api_key",
                template: "Your Nagar Mitra OTP is: {otp}. Valid for 5 minutes. Do not share with anyone."
            },
            redirectUrls: {
                userSuccess: "/citizen-home",
                adminSuccess: "/admin-dashboard"
            }
        };

        // Application state
        this.state = {
            currentStep: 'phone',
            phoneNumber: '',
            generatedOTP: '',
            otpAttempts: 0,
            otpTimer: null,
            resendTimer: null,
            redirectTimerInterval: null,
            isOtpExpired: false,
            verificationData: {},
            isAdminLogin: false
        };

        this.init();
    }

    init() {
        console.log('Nagar Mitra Auth App initializing...');
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        console.log('Setting up application...');
        this.setupEventListeners();
        this.animateCounters();
        this.gatherDeviceFingerprint();
        this.detectLocation();
        
        // Focus first input
        setTimeout(() => {
            const phoneInput = document.getElementById('phoneNumber');
            if (phoneInput) {
                phoneInput.focus();
                console.log('Phone input focused');
            }
        }, 500);
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Phone form submission
        const phoneForm = document.getElementById('phoneForm');
        if (phoneForm) {
            phoneForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Phone form submitted');
                this.handlePhoneSubmit();
            });
            console.log('Phone form listener added');
        } else {
            console.error('Phone form not found');
        }

        // Phone number input validation
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.validatePhoneInput(e.target);
            });
            
            phoneInput.addEventListener('keypress', (e) => {
                // Only allow digits
                if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
                    e.preventDefault();
                }
            });
            console.log('Phone input listeners added');
        } else {
            console.error('Phone input not found');
        }

        // OTP form submission
        const otpForm = document.getElementById('otpForm');
        if (otpForm) {
            otpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('OTP form submitted');
                this.handleOtpSubmit();
            });
            console.log('OTP form listener added');
        } else {
            console.error('OTP form not found');
        }

        // OTP input handling
        const otpDigits = document.querySelectorAll('.otp-digit');
        if (otpDigits.length > 0) {
            otpDigits.forEach((digit, index) => {
                digit.addEventListener('input', (e) => {
                    this.handleOtpInput(e, index);
                });
                
                digit.addEventListener('keydown', (e) => {
                    this.handleOtpKeydown(e, index);
                });
                
                digit.addEventListener('paste', (e) => {
                    this.handleOtpPaste(e);
                });
            });
            console.log(`${otpDigits.length} OTP digit listeners added`);
        } else {
            console.error('OTP digits not found');
        }

        // Change number button
        const changeNumberBtn = document.getElementById('changeNumberBtn');
        if (changeNumberBtn) {
            changeNumberBtn.addEventListener('click', () => {
                console.log('Change number clicked');
                this.goBackToPhone();
            });
        }

        // Resend OTP button
        const resendOtpBtn = document.getElementById('resendOtpBtn');
        if (resendOtpBtn) {
            resendOtpBtn.addEventListener('click', () => {
                console.log('Resend OTP clicked');
                this.handleResendOTP();
            });
        }

        // Admin login button
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Admin login button clicked');
                this.showAdminModal();
            });
            console.log('Admin login button listener added');
        } else {
            console.error('Admin login button not found');
        }

        // Admin form submission
        const adminForm = document.getElementById('adminForm');
        if (adminForm) {
            adminForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Admin form submitted');
                this.handleAdminLogin();
            });
        }

        // Password toggle
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => {
                this.togglePasswordVisibility();
            });
        }

        // Modal controls
        const closeAdminModal = document.getElementById('closeAdminModal');
        if (closeAdminModal) {
            closeAdminModal.addEventListener('click', () => {
                console.log('Close admin modal clicked');
                this.closeModal('adminModal');
            });
        }

        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) {
            continueBtn.addEventListener('click', () => {
                this.handleSuccessRedirect();
            });
        }

        // Language button
        const languageBtn = document.getElementById('languageBtn');
        if (languageBtn) {
            languageBtn.addEventListener('click', () => {
                this.showLanguageOptions();
            });
        }

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey();
            }
        });

        // Modal backdrop clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__backdrop')) {
                const modal = e.target.closest('.modal');
                if (modal) {
                    console.log('Modal backdrop clicked for:', modal.id);
                    this.closeModal(modal.id);
                }
            }
        });

        console.log('All event listeners set up successfully');
    }

    validatePhoneInput(input) {
        const value = input.value.replace(/\D/g, ''); // Remove non-digits
        input.value = value;
        
        const errorElement = document.getElementById('phoneError');
        
        if (value.length === 0) {
            this.hideError('phoneError');
            return false;
        }
        
        if (value.length < 10) {
            this.showError('phoneError', 'Mobile number must be 10 digits');
            return false;
        }
        
        if (value.length > 10) {
            input.value = value.slice(0, 10);
            return false;
        }
        
        if (!this.config.phoneValidation.pattern.test(value)) {
            this.showError('phoneError', this.config.messages.errors.invalidPhone);
            return false;
        }
        
        this.hideError('phoneError');
        return true;
    }

    async handlePhoneSubmit() {
        console.log('Handling phone submit...');
        const phoneInput = document.getElementById('phoneNumber');
        const sendOtpBtn = document.getElementById('sendOtpBtn');
        
        if (!phoneInput || !this.validatePhoneInput(phoneInput)) {
            console.log('Phone validation failed');
            return;
        }
        
        this.state.phoneNumber = phoneInput.value;
        console.log('Phone number set to:', this.state.phoneNumber);
        
        // Show loading state
        if (sendOtpBtn) {
            sendOtpBtn.classList.add('loading');
            sendOtpBtn.disabled = true;
            console.log('Loading state enabled');
        }
        
        try {
            // Simulate API call delay
            console.log('Simulating SMS API call...');
            await this.simulateDelay(1500);
            
            // Generate and send OTP
            const success = await this.sendOTP(this.state.phoneNumber);
            
            if (success) {
                console.log('OTP sent successfully, showing OTP form');
                this.showOTPForm();
              /*  this.showNotification( this.config.messages.otpSent,'success'); */
            } else {
                throw new Error('Failed to send OTP');
            }
            
        } catch (error) {
            console.error('Phone submit error:', error);
            this.showError('phoneError', this.config.messages.errors.networkError);
        } finally {
            if (sendOtpBtn) {
                sendOtpBtn.classList.remove('loading');
                sendOtpBtn.disabled = false;
                console.log('Loading state disabled');
            }
        }
    }

    async sendOTP(phoneNumber) {
        console.log(`Simulating SMS API call to ${this.config.smsProvider.name}...`);
        
        // Generate 6-digit OTP
        this.state.generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Simulate API call
        const apiCall = {
            provider: this.config.smsProvider.name,
            apiKey: this.config.smsProvider.apiKey,
            to: `${this.config.phoneValidation.countryCode}${phoneNumber}`,
            message: this.config.smsProvider.template.replace('{otp}', this.state.generatedOTP),
            timestamp: new Date().toISOString()
        };
        
        console.log('SMS API Call:', apiCall);
        console.log(`🔐 Generated OTP: ${this.state.generatedOTP} (Use this to test OTP verification)`);
        
        // Show OTP in notification for testing
        this.showNotification(`Test OTP Generated: ${this.state.generatedOTP}\n(This would normally be sent via SMS)`, 'info');
        
        // Simulate network delay
        await this.simulateDelay(800);
        
        return true;
    }

    showOTPForm() {
        console.log('Showing OTP form...');
        const phoneForm = document.getElementById('phoneForm');
        const otpForm = document.getElementById('otpForm');
        const phoneDisplay = document.getElementById('phoneDisplay');
        
        if (phoneForm) {
            phoneForm.classList.add('hidden');
            console.log('Phone form hidden');
        } else {
            console.error('Phone form element not found');
        }
        
        if (otpForm) {
            otpForm.classList.remove('hidden');
            console.log('OTP form shown');
        } else {
            console.error('OTP form element not found');
        }
        
        if (phoneDisplay) {
            phoneDisplay.textContent = `${this.config.phoneValidation.countryCode} ${this.state.phoneNumber}`;
            console.log('Phone display updated');
        }
        
        this.state.currentStep = 'otp';
        this.state.otpAttempts = 0;
        this.state.isOtpExpired = false;
        
        // Start OTP timer
        this.startOTPTimer();
        this.startResendTimer();
        
        // Focus first OTP digit
        setTimeout(() => {
            const firstDigit = document.querySelector('.otp-digit');
            if (firstDigit) {
                firstDigit.focus();
                console.log('First OTP digit focused');
            }
        }, 100);
    }

    startOTPTimer() {
        let timeLeft = this.config.otpSettings.expiryMinutes * 60; // 5 minutes in seconds
        const timerDisplay = document.getElementById('timerDisplay');
        
        const updateTimer = () => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            if (timerDisplay) {
                timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
            
            if (timeLeft <= 0) {
                this.handleOTPExpiry();
                return;
            }
            
            timeLeft--;
        };
        
        updateTimer();
        this.state.otpTimer = setInterval(updateTimer, 1000);
    }

    startResendTimer() {
        let timeLeft = this.config.otpSettings.resendDelay; // 60 seconds
        const resendBtn = document.getElementById('resendOtpBtn');
        const resendTimer = document.getElementById('resendTimer');
        
        const updateResendTimer = () => {
            if (resendTimer) {
                resendTimer.textContent = timeLeft;
            }
            
            if (timeLeft <= 0) {
                if (resendBtn) {
                    resendBtn.disabled = false;
                    resendBtn.innerHTML = '<i class="fas fa-redo"></i> Resend OTP';
                }
                clearInterval(this.state.resendTimer);
                return;
            }
            
            timeLeft--;
        };
        
        updateResendTimer();
        this.state.resendTimer = setInterval(updateResendTimer, 1000);
    }

    handleOTPExpiry() {
        console.log('OTP expired');
        if (this.state.otpTimer) {
            clearInterval(this.state.otpTimer);
            this.state.otpTimer = null;
        }
        
        this.state.isOtpExpired = true;
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) {
            timerDisplay.textContent = 'EXPIRED';
            timerDisplay.style.color = 'var(--color-error)';
        }
        
        // Disable OTP inputs
        const otpDigits = document.querySelectorAll('.otp-digit');
        otpDigits.forEach(digit => {
            digit.disabled = true;
            digit.classList.add('error');
        });
        
        this.showError('otpError', this.config.messages.errors.otpExpired);
        this.showNotification('OTP has expired. Please request a new one.', 'warning');
    }

    handleOtpInput(event, index) {
        const digit = event.target;
        const value = digit.value.replace(/\D/g, ''); // Only digits
        
        digit.value = value;
        
        if (value) {
            digit.classList.add('filled');
            // Move to next digit
            const nextDigit = digit.parentElement.children[index + 1];
            if (nextDigit) {
                nextDigit.focus();
            }
        } else {
            digit.classList.remove('filled');
        }
        
        // Clear any previous errors
        this.hideError('otpError');
        const otpDigits = document.querySelectorAll('.otp-digit');
        otpDigits.forEach(d => d.classList.remove('error'));
    }

    handleOtpKeydown(event, index) {
        const digit = event.target;
        
        if (event.key === 'Backspace' && !digit.value) {
            // Move to previous digit on backspace
            const prevDigit = digit.parentElement.children[index - 1];
            if (prevDigit) {
                prevDigit.focus();
            }
        }
        
        if (event.key === 'ArrowLeft') {
            const prevDigit = digit.parentElement.children[index - 1];
            if (prevDigit) prevDigit.focus();
        }
        
        if (event.key === 'ArrowRight') {
            const nextDigit = digit.parentElement.children[index + 1];
            if (nextDigit) nextDigit.focus();
        }
    }

    handleOtpPaste(event) {
        event.preventDefault();
        const pastedData = event.clipboardData.getData('text').replace(/\D/g, '');
        
        if (pastedData.length === 6) {
            const otpDigits = document.querySelectorAll('.otp-digit');
            pastedData.split('').forEach((digit, index) => {
                if (otpDigits[index]) {
                    otpDigits[index].value = digit;
                    otpDigits[index].classList.add('filled');
                }
            });
            
            // Focus last digit
            const lastDigit = otpDigits[5];
            if (lastDigit) lastDigit.focus();
        }
    }

    async handleOtpSubmit() {
        console.log('Handling OTP submit...');
        const otpDigits = document.querySelectorAll('.otp-digit');
        const enteredOTP = Array.from(otpDigits).map(digit => digit.value).join('');
        const verifyBtn = document.getElementById('verifyOtpBtn');
        
        console.log('Entered OTP:', enteredOTP);
        console.log('Expected OTP:', this.state.generatedOTP);
        
        // Validate OTP length
        if (enteredOTP.length !== 6) {
            this.showError('otpError', 'Please enter the complete 6-digit OTP');
            return;
        }
        
        // Check if OTP expired
        if (this.state.isOtpExpired) {
            this.showError('otpError', this.config.messages.errors.otpExpired);
            return;
        }
        
        // Check max attempts
        if (this.state.otpAttempts >= this.config.otpSettings.maxAttempts) {
            this.showError('otpError', this.config.messages.errors.maxAttemptsReached);
            return;
        }
        
        this.state.otpAttempts++;
        
        // Show loading state
        if (verifyBtn) {
            verifyBtn.classList.add('loading');
            verifyBtn.disabled = true;
        }
        
        try {
            // Simulate API call delay
            await this.simulateDelay(1200);
            
            // Verify OTP
            const isValid = this.verifyOTP(enteredOTP);
            
            if (isValid) {
                // Clear timers
                if (this.state.otpTimer) clearInterval(this.state.otpTimer);
                if (this.state.resendTimer) clearInterval(this.state.resendTimer);
                
                this.showNotification(this.config.messages.otpVerified, 'success');
                
                // Proceed to human verification
                setTimeout(() => {
                    this.startHumanVerification();
                    return window.location.href = "home.html";
                }, 800);
                
            } else {
                // Show error animation
                otpDigits.forEach(digit => digit.classList.add('error'));
                setTimeout(() => {
                    otpDigits.forEach(digit => digit.classList.remove('error'));
                }, 300);
                
                const remainingAttempts = this.config.otpSettings.maxAttempts - this.state.otpAttempts;
                if (remainingAttempts > 0) {
                    this.showError('otpError', `${this.config.messages.errors.invalidOTP}. ${remainingAttempts} attempts remaining.`);
                } else {
                    this.showError('otpError', this.config.messages.errors.maxAttemptsReached);
                }
            }
            
        } catch (error) {
            console.error('OTP verify error:', error);
            this.showError('otpError', this.config.messages.errors.networkError);
        } finally {
            if (verifyBtn) {
                verifyBtn.classList.remove('loading');
                verifyBtn.disabled = false;
            }
        }
    }

    verifyOTP(enteredOTP) {
        console.log(`Verifying OTP: ${enteredOTP} against ${this.state.generatedOTP}`);
        return enteredOTP === this.state.generatedOTP;
    }

    async handleResendOTP() {
        console.log('Handling resend OTP...');
        const resendBtn = document.getElementById('resendOtpBtn');
        
        if (resendBtn) {
            resendBtn.disabled = true;
            resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        }
        
        try {
            // Generate new OTP and send
            const success = await this.sendOTP(this.state.phoneNumber);
            
            if (success) {
                // Reset state
                this.state.otpAttempts = 0;
                this.state.isOtpExpired = false;
                
                // Clear OTP inputs
                const otpDigits = document.querySelectorAll('.otp-digit');
                otpDigits.forEach(digit => {
                    digit.value = '';
                    digit.classList.remove('filled', 'error');
                    digit.disabled = false;
                });
                
                // Reset timer display
                const timerDisplay = document.getElementById('timerDisplay');
                if (timerDisplay) {
                    timerDisplay.style.color = '';
                }
                
                // Restart timers
                if (this.state.otpTimer) clearInterval(this.state.otpTimer);
                if (this.state.resendTimer) clearInterval(this.state.resendTimer);
                
                this.startOTPTimer();
                this.startResendTimer();
                
                this.hideError('otpError');
                this.showNotification('New OTP sent successfully!', 'success');
                
                // Focus first digit
                setTimeout(() => {
                    const firstDigit = document.querySelector('.otp-digit');
                    if (firstDigit) firstDigit.focus();
                }, 100);
            }
            
        } catch (error) {
            console.error('Resend OTP error:', error);
            this.showNotification('Failed to resend OTP. Please try again.', 'error');
        }
    }

    goBackToPhone() {
        console.log('Going back to phone form...');
        const phoneForm = document.getElementById('phoneForm');
        const otpForm = document.getElementById('otpForm');
        
        if (phoneForm) phoneForm.classList.remove('hidden');
        if (otpForm) otpForm.classList.add('hidden');
        
        // Clear timers
        if (this.state.otpTimer) clearInterval(this.state.otpTimer);
        if (this.state.resendTimer) clearInterval(this.state.resendTimer);
        
        // Reset state
        this.state.currentStep = 'phone';
        this.state.otpAttempts = 0;
        this.state.isOtpExpired = false;
        
        // Focus phone input
        setTimeout(() => {
            const phoneInput = document.getElementById('phoneNumber');
            if (phoneInput) phoneInput.focus();
        }, 100);
    }

    async startHumanVerification() {
        console.log('Starting human verification...');
        const otpForm = document.getElementById('otpForm');
        const humanVerification = document.getElementById('humanVerification');
        
        if (otpForm) otpForm.classList.add('hidden');
        if (humanVerification) humanVerification.classList.remove('hidden');
        
        this.state.currentStep = 'verification';
        
        console.log('Starting automatic human verification...');
        
        // Start verification steps
        const verificationSteps = this.config.humanVerification.methods;
        
        for (let i = 0; i < verificationSteps.length; i++) {
            const method = verificationSteps[i];
            const stepElement = document.querySelector(`[data-step="${method.split('_')[0]}"]`);
            
            console.log(`Processing verification step: ${method}`);
            
            // Add processing state
            if (stepElement) {
                stepElement.classList.add('processing');
            }
            
            // Simulate verification delay
            // await this.simulateDelay(2000 + Math.random() * 2000);
            await this.simulateDelay(1000 + Math.random() * 1000);

            
            // Perform verification
            const result = await this.performVerificationStep(method);
            
            // Update UI
            if (stepElement) {
                stepElement.classList.remove('processing');
                stepElement.classList.add('completed');
                
                const statusElement = stepElement.querySelector('.step-status');
                if (statusElement) {
                    statusElement.innerHTML = '<i class="fas fa-check"></i>';
                }
            }
            
            this.state.verificationData[method] = result;
        }
        
        // Complete verification
        await this.simulateDelay(1000);
        this.completeHumanVerification();
    }

    async performVerificationStep(method) {
        console.log(`Performing ${method} verification...`);
        
        switch (method) {
            case 'ip_analysis':
                return {
                    ip: this.getClientIP(),
                    location: this.state.verificationData.geolocation || 'Unknown',
                    isProxy: Math.random() < 0.1, // 10% chance of proxy detection
                    riskScore: Math.floor(Math.random() * 30), // Low risk score
                    timestamp: new Date().toISOString()
                };
                
            case 'device_fingerprint':
                return this.state.verificationData.deviceFingerprint || {};
                
            case 'behavioral_analysis':
                return {
                    typingPattern: 'Normal',
                    mouseMovement: 'Human-like',
                    pageInteraction: 'Genuine',
                    riskScore: Math.floor(Math.random() * 20),
                    timestamp: new Date().toISOString()
                }; 
                
            case 'geolocation':
                return this.state.verificationData.geolocation || {
                    country: 'India',
                    region: 'Delhi',
                    city: 'New Delhi',
                    timezone: 'Asia/Kolkata',
                    accuracy: 'High'
                };
                
            default:
                return { status: 'completed', timestamp: new Date().toISOString() };
        }
    }

    completeHumanVerification() {
        console.log('Human verification completed:', this.state.verificationData);
        
        // Calculate overall risk score
        const riskScore = this.calculateRiskScore();
        console.log('Overall risk score:', riskScore);
        
        if (riskScore < 50) { // Low risk threshold
            this.showNotification(this.config.messages.humanVerified, 'success');
            setTimeout(() => {
                this.showSuccessModal(false); // false = user login
            }, 1000);
        } else {
            this.showNotification(this.config.messages.errors.humanVerificationFailed, 'error');
            // In a real app, this would trigger additional verification steps
            setTimeout(() => {
                this.goBackToPhone();
            }, 2000);
        }
    }

    calculateRiskScore() {
        let riskScore = 0;
        
        // IP analysis risk
        if (this.state.verificationData.ip_analysis?.isProxy) {
            riskScore += 30;
        }
        
        // Device fingerprint risk
        if (this.state.verificationData.device_fingerprint?.isNewDevice) {
            riskScore += 20;
        }
        
        // Behavioral analysis risk
        riskScore += this.state.verificationData.behavioral_analysis?.riskScore || 0;
        
        // Geolocation risk
        if (this.state.verificationData.geolocation?.accuracy === 'Low') {
            riskScore += 15;
        }
        
        return Math.min(riskScore, 100);
    }

    showAdminModal() {
        console.log('Showing admin modal...');
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            console.log('Admin modal shown');
            
            // Focus username input
            setTimeout(() => {
                const usernameInput = document.getElementById('adminUsername');
                if (usernameInput) {
                    usernameInput.focus();
                    console.log('Admin username input focused');
                }
            }, 100);
        } else {
            console.error('Admin modal element not found');
        }
    }

    async handleAdminLogin() {
        console.log('Handling admin login...');
        const usernameInput = document.getElementById('adminUsername');
        const passwordInput = document.getElementById('adminPassword');
        const adminLoginSubmit = document.getElementById('adminLoginSubmit');
        
        const username = usernameInput?.value.trim();
        const password = passwordInput?.value;
        
        console.log('Admin credentials entered - Username:', username, 'Password length:', password?.length);
        
        // Validate inputs
        if (!username || !password) {
            this.showError('adminError', 'Please enter both username and password');
            return;
        }
        
        // Show loading state
        if (adminLoginSubmit) {
            adminLoginSubmit.classList.add('loading');
            adminLoginSubmit.disabled = true;
        }
        
        try {
            // Simulate API call delay
            await this.simulateDelay(1500);
            
            // Verify credentials
            const isValid = username === this.config.adminCredentials.username && 
                          password === this.config.adminCredentials.password;
            
            console.log('Admin credentials valid:', isValid);
            
            if (isValid) {
                this.state.isAdminLogin = true;
                this.closeModal('adminModal');
                this.showNotification(this.config.messages.adminLoginSuccess, 'success');
                
                setTimeout(() => {
                    this.showSuccessModal(true); // true = admin login
                }, 800);
                
            } else {
                this.showError('adminError', 'Invalid username or password');
            }
            
        } catch (error) {
            console.error('Admin login error:', error);
            this.showError('adminError', this.config.messages.errors.networkError);
        } finally {
            if (adminLoginSubmit) {
                adminLoginSubmit.classList.remove('loading');
                adminLoginSubmit.disabled = false;
            }
        }
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('adminPassword');
        const toggleBtn = document.getElementById('togglePassword');
        
        if (passwordInput && toggleBtn) {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = isPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
            }
        }
    }

    showSuccessModal(isAdmin = false) {
        console.log('Showing success modal, isAdmin:', isAdmin);
        const modal = document.getElementById('successModal');
        const title = document.getElementById('successTitle');
        const message = document.getElementById('successMessage');
        
        if (title) {
            title.textContent = isAdmin ? 'Admin Login Successful!' : 'Welcome to Nagar Mitra!';
        }
        
        if (message) {
            message.textContent = isAdmin ? 
                'Welcome Admin! Redirecting to admin dashboard...' : 
                this.config.messages.signupSuccess + ' Redirecting to your dashboard...';
        }
        
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Start redirect timer
            this.startRedirectTimer(isAdmin);
        }
    }

    startRedirectTimer(isAdmin = false) {
        let timeLeft = 3;
        const redirectTimer = document.getElementById('redirectTimer');
        
        const updateTimer = () => {
            if (redirectTimer) {
                redirectTimer.textContent = timeLeft;
            }
            
            if (timeLeft <= 0) {
                this.handleSuccessRedirect(isAdmin);
                return;
            }
            
            timeLeft--;
        };
        
        updateTimer();
        this.state.redirectTimerInterval = setInterval(updateTimer, 1000);
    }

    handleSuccessRedirect(isAdmin = false) {
        if (this.state.redirectTimerInterval) {
            clearInterval(this.state.redirectTimerInterval);
        }
        
        const targetUrl = isAdmin ? 
            this.config.redirectUrls.adminSuccess : 
            this.config.redirectUrls.userSuccess;
        
        console.log(`Redirecting to: ${targetUrl}`);
        
        // Show loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
        
        // Simulate redirect
        setTimeout(() => {
            // In a real app, this would be: window.location.href = targetUrl;
            this.showNotification(`Redirect to ${targetUrl}\n\n🎉 Demo completed successfully!\nAll features working as expected.`, 'success');
            
            // Reset app state for demo purposes
            setTimeout(() => {
                this.resetApplication();
            }, 3000);
        }, 1500);
    }

    resetApplication() {
        console.log('Resetting application for demo...');
        
        // Reset all states and UI for demo purposes
        this.closeModal('successModal');
        
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
        // Reset forms
        const phoneForm = document.getElementById('phoneForm');
        const otpForm = document.getElementById('otpForm');
        const humanVerification = document.getElementById('humanVerification');
        
        if (phoneForm) phoneForm.classList.remove('hidden');
        if (otpForm) otpForm.classList.add('hidden');
        if (humanVerification) humanVerification.classList.add('hidden');
        
        // Clear inputs
        const phoneInput = document.getElementById('phoneNumber');
        if (phoneInput) phoneInput.value = '';
        
        const otpDigits = document.querySelectorAll('.otp-digit');
        otpDigits.forEach(digit => {
            digit.value = '';
            digit.classList.remove('filled', 'error');
            digit.disabled = false;
        });
        
        const adminForm = document.getElementById('adminForm');
        if (adminForm) adminForm.reset();
        
        // Reset verification steps
        const verificationSteps = document.querySelectorAll('.verification-step');
        verificationSteps.forEach(step => {
            step.classList.remove('completed', 'processing');
            const statusElement = step.querySelector('.step-status');
            if (statusElement) {
                statusElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            }
        });
        
        // Clear timers
        if (this.state.otpTimer) clearInterval(this.state.otpTimer);
        if (this.state.resendTimer) clearInterval(this.state.resendTimer);
        if (this.state.redirectTimerInterval) clearInterval(this.state.redirectTimerInterval);
        
        // Hide all errors
        this.hideError('phoneError');
        this.hideError('otpError');
        this.hideError('adminError');
        
        // Reset state
        this.state = {
            currentStep: 'phone',
            phoneNumber: '',
            generatedOTP: '',
            otpAttempts: 0,
            otpTimer: null,
            resendTimer: null,
            redirectTimerInterval: null,
            isOtpExpired: false,
            verificationData: {},
            isAdminLogin: false
        };
        
        document.body.style.overflow = '';
        
        // Focus phone input
        setTimeout(() => {
            if (phoneInput) {
                phoneInput.focus();
            }
        }, 500);
        
        this.showNotification('Application reset for demo. You can try the full flow again!', 'info');
    }

    // Utility functions
    gatherDeviceFingerprint() {
        const fingerprint = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screen: {
                width: screen.width,
                height: screen.height,
                colorDepth: screen.colorDepth
            },
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            isNewDevice: Math.random() < 0.3, // 30% chance of new device
            timestamp: new Date().toISOString()
        };
        
        this.state.verificationData.deviceFingerprint = fingerprint;
        console.log('Device fingerprint gathered:', fingerprint);
    }

    detectLocation() {
        // Simulate geolocation detection
        const locations = [
            { country: 'India', region: 'Delhi', city: 'New Delhi' },
            { country: 'India', region: 'Maharashtra', city: 'Mumbai' },
            { country: 'India', region: 'Karnataka', city: 'Bangalore' },
            { country: 'India', region: 'Tamil Nadu', city: 'Chennai' }
        ];
        
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        
        this.state.verificationData.geolocation = {
            ...randomLocation,
            timezone: 'Asia/Kolkata',
            accuracy: Math.random() < 0.8 ? 'High' : 'Low'
        };
        
        console.log('Location detected:', this.state.verificationData.geolocation);
    }

    getClientIP() {
        // Simulate IP detection (in real app, this would be server-side)
        const ips = ['106.51.', '117.97.', '49.15.', '103.78.'];
        const randomIP = ips[Math.floor(Math.random() * ips.length)] + 
                        Math.floor(Math.random() * 256) + '.' + 
                        Math.floor(Math.random() * 256);
        return randomIP;
    }

    animateCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(element => {
            const targetValue = parseInt(element.dataset.count);
            let currentValue = 0;
            const increment = targetValue / 100;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    element.textContent = targetValue.toLocaleString();
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(currentValue).toLocaleString();
                }
            }, 30);
        });
    }

    showLanguageOptions() {
        const languages = [
            'English', 'हिंदी (Hindi)', 'বাংলা (Bengali)', 
            'తెలుగు (Telugu)', 'मराठी (Marathi)', 'தமிழ் (Tamil)',
            'ગુજરાતી (Gujarati)', 'ಕನ್ನಡ (Kannada)', 'മലയാളം (Malayalam)',
            'ਪੰਜਾਬੀ (Punjabi)', 'اردو (Urdu)'
        ];
        
        const languageList = languages.map(lang => `• ${lang}`).join('\n');
        this.showNotification(`Available Languages:\n\n${languageList}\n\nSelect your preferred language for the interface.`, 'info');
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    hideError(elementId) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }

    closeModal(modalId) {
        console.log('Closing modal:', modalId);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            console.log('Modal closed:', modalId);
        }
    }

    handleEscapeKey() {
        // Close visible modals
        const visibleModals = document.querySelectorAll('.modal:not(.hidden)');
        if (visibleModals.length > 0) {
            const lastModal = visibleModals[visibleModals.length - 1];
            this.closeModal(lastModal.id);
        }
    }

    async simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

        // Add styles if not already present
        this.addNotificationStyles();

        // Add to page
        document.body.appendChild(notification);

        // Show with animation
        setTimeout(() => {
            notification.classList.add('notification--show');
        }, 100);

        // Auto remove
        const timeout = message.length > 100 ? 10000 : 6000;
        setTimeout(() => {
            this.removeNotification(notification);
        }, timeout);

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
                top: 100px;
                right: 20px;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-lg);
                padding: var(--space-16);
                max-width: 420px;
                min-width: 320px;
                z-index: 1002;
                transform: translateX(100%);
                transition: transform var(--duration-normal) var(--ease-standard);
                display: flex;
                align-items: flex-start;
                gap: var(--space-12);
            }
            
            .notification--show {
                transform: translateX(0);
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: var(--space-8);
                flex: 1;
                color: var(--color-text);
                font-size: var(--font-size-sm);
                line-height: 1.4;
            }
            
            .notification-content span {
                white-space: pre-line;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: var(--space-4);
                border-radius: var(--radius-sm);
                transition: all var(--duration-fast) var(--ease-standard);
                flex-shrink: 0;
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
            
            @media (max-width: 480px) {
                .notification {
                    right: 12px;
                    left: 12px;
                    max-width: none;
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Global app instance
let app;

// Initialize the application
console.log('Script loaded, setting up initialization...');

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing Nagar Mitra Auth App...');
        app = new NagarMitraAuth();
    });
} else {
    console.log('DOM already loaded, initializing Nagar Mitra Auth App...');
    app = new NagarMitraAuth();
}

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && app) {
        console.log('Page became visible');
        app.animateCounters();
    }
});