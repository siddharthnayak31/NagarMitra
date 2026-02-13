// Nagar Mitra Department Admin Dashboard
class DepartmentAdminPortal {
    constructor() {
        this.config = {
            counterUpdateInterval: 5000,
            timelineCheckInterval: 60000, // Check timelines every minute
            departments: {
                'ELEC': { name: 'Electricity Department', timeline: 1, unit: 'day' },
                'WATER': { name: 'Water Department', timeline: 2, unit: 'days' },
                'SEWER': { name: 'Sewer Department', timeline: 3, unit: 'days' },
                'ROADS': { name: 'Roads & Infrastructure Department', timeline: 7, unit: 'days' },
                'SANIT': { name: 'Sanitation Department', timeline: 4, unit: 'days' },
                'PWD': { name: 'Public Works Department', timeline: 4, unit: 'days' }
            }
        };

        this.data = {
            currentDepartment: 'ELEC',
            complaints: [
                {
                    id: "CM2024001",
                    category: "Electricity",
                    location: "Indrapuri sector C, near gurukripa restaurant",
                    coordinates: "23.2599, 77.4126",
                    description: "Street light not working for past week, causing safety issues for pedestrians",
                    priority: "Urgent",
                    status: "New",
                    assignedTime: "2 hours ago",
                    votes: 45,
                    hasAudio: true,
                    hasVideo: false,
                    timeline: null,
                    timelineExpiry: null,
                    progress: 0,
                    timelineStatus: null
                },
                {
                    id: "CM2024002", 
                    category: "Electricity",
                    location: "Piplani police station road corner", 
                    coordinates: "23.2650, 77.4000",
                    description: "Power outage in residential area affecting 50+ houses for 3 hours",
                    priority: "Urgent",
                    status: "In Progress",
                    assignedTime: "5 hours ago",
                    votes: 78,
                    hasAudio: false,
                    hasVideo: true,
                    timeline: 24,
                    timelineExpiry: 1726781400000,
                    progress: 60,
                    timelineStatus: "onTime"
                },
                {
                    id: "CM2024003",
                    category: "Roads and Infrastructure", 
                    location: "Minal Street, Near CIPET office",
                    coordinates: "23.2500, 77.4200",
                    description: "Large pothole causing traffic issues and vehicle damage",
                    priority: "Normal",
                    status: "In Progress", 
                    assignedTime: "2 days ago",
                    votes: 34,
                    hasAudio: false,
                    hasVideo: true,
                    timeline: 168,
                    timelineExpiry: 1727213400000,
                    progress: 25,
                    timelineStatus: "warning"
                },
                {
                    id: "CM2024004",
                    category: "Water",
                    location: "Gandhi Nagar, Block C",
                    coordinates: "23.2580, 77.4080", 
                    description: "Water pipeline burst causing flooding in residential area",
                    priority: "Urgent",
                    status: "ESCALATED",
                    assignedTime: "3 days ago",
                    votes: 89,
                    hasAudio: true,
                    hasVideo: true,
                    timeline: 48,
                    timelineExpiry: 1726694400000,
                    progress: 30,
                    timelineStatus: "escalated"
                }
            ],
            counters: {
                assigned: 47,
                inProgress: 23,
                completedToday: 12,
                escalated: 3
            },
            timelineStats: {
                onTime: 18,
                warning: 5,
                critical: 2
            },
            resources: {
                availableStaff: '8/12',
                equipmentStatus: 'Good',
                budgetUtilized: '65%',
                avgResponseTime: '2.3 hrs'
            }
        };

        this.state = {
            sidebarOpen: false,
            currentFilters: {
                status: '',
                priority: ''
            },
            timers: {
                counter: null,
                timeline: null
            },
            charts: {
                timeline: null,
                progress: null
            }
        };

        this.init();
    }

    init() {
        console.log('Department Admin Portal initializing...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        console.log('Setting up department admin portal...');
        this.ensureModalsClosed();
        this.setupEventListeners();
        this.loadDepartmentData();
        this.renderComplaints();
        this.startCounterUpdates();
        this.startTimelineMonitoring();
        this.setupCharts();
        this.showWelcomeMessage();
    }

    ensureModalsClosed() {
        const modals = ['complaintActionModal', 'timelineWarningModal'];
        const toast = document.getElementById('toast');
        
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('hidden');
                modal.style.display = 'none';
            }
        });
        
        if (toast) {
            toast.classList.add('hidden');
        }
        
        document.body.style.overflow = '';
        console.log('All modals ensured closed');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');

        // Hamburger menu - Fixed implementation
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Hamburger menu clicked');
                this.toggleSidebar();
            });
        }

        // Department selector - Fixed implementation
        const departmentSelect = document.getElementById('departmentSelect');
        if (departmentSelect) {
            // Ensure the select element is properly styled and functional
            departmentSelect.style.pointerEvents = 'auto';
            departmentSelect.style.zIndex = '1001';
            
            departmentSelect.addEventListener('change', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Department changed to:', e.target.value);
                this.switchDepartment(e.target.value);
            });

            // Also add click event for debugging
            departmentSelect.addEventListener('click', (e) => {
                console.log('Department selector clicked');
            });
        }

        // Sidebar menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMenuClick(item.dataset.section);
            });
        });

        // Logout button - Fixed implementation
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Logout button clicked');
                this.handleLogout();
            });
        }

        // Filter controls - Fixed implementation
        const statusFilter = document.getElementById('statusFilter');
        const priorityFilter = document.getElementById('priorityFilter');

        if (statusFilter) {
            statusFilter.style.pointerEvents = 'auto';
            statusFilter.addEventListener('change', (e) => {
                console.log('Status filter changed to:', e.target.value);
                this.state.currentFilters.status = e.target.value;
                this.renderComplaints();
            });

            statusFilter.addEventListener('click', (e) => {
                console.log('Status filter clicked');
            });
        }

        if (priorityFilter) {
            priorityFilter.style.pointerEvents = 'auto';
            priorityFilter.addEventListener('change', (e) => {
                console.log('Priority filter changed to:', e.target.value);
                this.state.currentFilters.priority = e.target.value;
                this.renderComplaints();
            });

            priorityFilter.addEventListener('click', (e) => {
                console.log('Priority filter clicked');
            });
        }

        // Export button
        const exportBtn = document.getElementById('exportBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportComplaints();
            });
        }

        // Quick action buttons
        this.setupQuickActionButtons();

        // Modal close handlers
        this.setupModalHandlers();

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const hamburgerMenu = document.getElementById('hamburgerMenu');
            
            if (this.state.sidebarOpen && 
                sidebar && 
                !sidebar.contains(e.target) && 
                !hamburgerMenu.contains(e.target)) {
                this.toggleSidebar();
            }
        });

        console.log('All event listeners setup successfully');
    }

    setupQuickActionButtons() {
        const quickActionBtns = {
            'bulkUpdateBtn': () => this.handleBulkUpdate(),
            'scheduleWorkBtn': () => this.handleScheduleWork(),
            'requestResourcesBtn': () => this.handleRequestResources(),
            'generateReportBtn': () => this.handleGenerateReport()
        };

        Object.entries(quickActionBtns).forEach(([btnId, handler]) => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    handler();
                });
            }
        });
    }

    setupModalHandlers() {
        // Close modal buttons
        const closeModalBtns = ['closeModal', 'closeTimelineModal'];
        closeModalBtns.forEach(btnId => {
            const btn = document.getElementById(btnId);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.closeModal();
                });
            }
        });

        // Close modal on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__backdrop')) {
                e.preventDefault();
                this.closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.closeModal();
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const hamburgerMenu = document.getElementById('hamburgerMenu');

        this.state.sidebarOpen = !this.state.sidebarOpen;
        console.log('Sidebar state:', this.state.sidebarOpen);

        if (sidebar) {
            sidebar.classList.toggle('active', this.state.sidebarOpen);
            console.log('Sidebar classes:', sidebar.className);
        }
        if (mainContent) {
            mainContent.classList.toggle('sidebar-open', this.state.sidebarOpen);
        }
        if (hamburgerMenu) {
            hamburgerMenu.classList.toggle('active', this.state.sidebarOpen);
        }

        // Show/hide toast for feedback
        if (this.state.sidebarOpen) {
            this.showToast('Sidebar opened', 'info');
        }
    }

    switchDepartment(departmentCode) {
        this.data.currentDepartment = departmentCode;
        this.loadDepartmentData();
        this.renderComplaints();
        this.updateCounterDisplays();
        
        const deptName = this.config.departments[departmentCode]?.name || 'Department';
        this.showToast(`Switched to ${deptName}`, 'info');
        console.log('Switched to department:', deptName);
    }

    loadDepartmentData() {
        const dept = this.config.departments[this.data.currentDepartment];
        if (!dept) return;

        // Filter complaints by current department
        const categoryMap = {
            'ELEC': 'Electricity',
            'WATER': 'Water',
            'SEWER': 'Sewer',
            'ROADS': 'Roads and Infrastructure',
            'SANIT': 'Sanitation',
            'PWD': 'Public Works'
        };

        const currentCategory = categoryMap[this.data.currentDepartment];
        
        // Update counters based on department
        const deptComplaints = this.data.complaints.filter(c => c.category === currentCategory);
        
        this.data.counters = {
            assigned: Math.floor(Math.random() * 20) + 30,
            inProgress: deptComplaints.filter(c => c.status === 'In Progress').length,
            completedToday: Math.floor(Math.random() * 15) + 5,
            escalated: deptComplaints.filter(c => c.status === 'ESCALATED').length
        };
    }

    renderComplaints() {
        const complaintsGrid = document.getElementById('complaintsGrid');
        if (!complaintsGrid) return;

        // Filter complaints by current department and filters
        const categoryMap = {
            'ELEC': 'Electricity',
            'WATER': 'Water',
            'SEWER': 'Sewer',
            'ROADS': 'Roads and Infrastructure',
            'SANIT': 'Sanitation',
            'PWD': 'Public Works'
        };

        const currentCategory = categoryMap[this.data.currentDepartment];
        let filteredComplaints = this.data.complaints.filter(c => c.category === currentCategory);
        
        if (this.state.currentFilters.status) {
            filteredComplaints = filteredComplaints.filter(c => c.status === this.state.currentFilters.status);
        }
        
        if (this.state.currentFilters.priority) {
            filteredComplaints = filteredComplaints.filter(c => c.priority === this.state.currentFilters.priority);
        }

        complaintsGrid.innerHTML = '';

        if (filteredComplaints.length === 0) {
            complaintsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--color-text-secondary);">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>No complaints found for the current department and filters.</p>
                </div>
            `;
            return;
        }

        filteredComplaints.forEach(complaint => {
            const complaintCard = this.createComplaintCard(complaint);
            complaintsGrid.appendChild(complaintCard);
        });
    }

    createComplaintCard(complaint) {
        const card = document.createElement('div');
        card.className = 'complaint-card';
        card.dataset.complaintId = complaint.id;

        const mediaIndicators = [];
        if (complaint.hasVideo) {
            mediaIndicators.push('<div class="media-indicator"><i class="fas fa-video"></i> Video</div>');
        }
        if (complaint.hasAudio) {
            mediaIndicators.push('<div class="media-indicator"><i class="fas fa-microphone"></i> Audio</div>');
        }
        mediaIndicators.push('<div class="media-indicator"><i class="fas fa-image"></i> Photo</div>');

        // Calculate timeline display
        const timelineDisplay = this.calculateTimelineDisplay(complaint);
        const actionButtons = this.getActionButtons(complaint);

        card.innerHTML = `
            <div class="complaint-status ${complaint.status.toLowerCase().replace(' ', '-')}">${complaint.status}</div>
            
            <div class="complaint-header">
                <div class="complaint-id">${complaint.id}</div>
                <div class="complaint-priority ${complaint.priority.toLowerCase()}">${complaint.priority}</div>
            </div>
            
            <div class="media-indicators">
                ${mediaIndicators.join('')}
            </div>
            
            <div class="complaint-location">
                <i class="fas fa-map-marker-alt"></i>
                ${complaint.location}
            </div>
            
            <div class="complaint-description">
                ${complaint.description}
            </div>
            
            ${timelineDisplay}
            
            <div class="complaint-meta">
                <div class="vote-count">
                    <i class="fas fa-thumbs-up"></i>
                    ${complaint.votes} votes
                </div>
                <div class="complaint-time">${complaint.assignedTime}</div>
            </div>
            
            <div class="complaint-actions">
                ${actionButtons}
            </div>
        `;

        // Add event listeners to action buttons
        this.setupComplaintActions(card, complaint);

        return card;
    }

    calculateTimelineDisplay(complaint) {
        if (!complaint.timeline || complaint.status === 'New') {
            return '';
        }

        const now = Date.now();
        const expiry = complaint.timelineExpiry;
        const totalTime = complaint.timeline * 60 * 60 * 1000; // Convert hours to milliseconds
        const elapsed = now - (expiry - totalTime);
        const remaining = Math.max(0, expiry - now);
        
        const progress = Math.min(100, (elapsed / totalTime) * 100);
        
        // Determine status
        let status, progressClass;
        if (complaint.status === 'ESCALATED') {
            status = 'escalated';
            progressClass = 'escalated';
        } else if (remaining === 0) {
            status = 'critical';
            progressClass = 'critical';
        } else if (remaining / totalTime < 0.2) {
            status = 'critical';
            progressClass = 'critical';
        } else if (remaining / totalTime < 0.5) {
            status = 'warning';
            progressClass = 'warning';
        } else {
            status = 'on-time';
            progressClass = 'on-time';
        }

        const remainingHours = Math.floor(remaining / (1000 * 60 * 60));
        const remainingMins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        
        let timeDisplay;
        if (complaint.status === 'ESCALATED') {
            timeDisplay = 'ESCALATED';
        } else if (remaining === 0) {
            timeDisplay = 'OVERDUE';
        } else if (remainingHours > 0) {
            timeDisplay = `${remainingHours}h ${remainingMins}m`;
        } else {
            timeDisplay = `${remainingMins}m`;
        }

        return `
            <div class="complaint-timeline">
                <div class="timeline-header">
                    <span class="timeline-remaining">${timeDisplay} remaining</span>
                    <span class="timeline-total">${complaint.timeline}h total</span>
                </div>
                <div class="timeline-progress">
                    <div class="timeline-progress-bar ${progressClass}" style="width: ${progress}%"></div>
                </div>
                <div class="timeline-status ${status}">${status.replace('-', ' ')}</div>
            </div>
        `;
    }

    getActionButtons(complaint) {
        switch (complaint.status) {
            case 'New':
                return `
                    <button class="action-btn-sm assign" data-complaint-id="${complaint.id}" data-action="assign">
                        <i class="fas fa-play"></i>
                        Assign Work
                    </button>
                `;
            case 'In Progress':
                return `
                    <button class="action-btn-sm update" data-complaint-id="${complaint.id}" data-action="update">
                        <i class="fas fa-edit"></i>
                        Update Status
                    </button>
                    <button class="action-btn-sm resolve" data-complaint-id="${complaint.id}" data-action="resolve">
                        <i class="fas fa-check"></i>
                        Mark Resolved
                    </button>
                `;
            case 'ESCALATED':
                return `
                    <button class="action-btn-sm update" data-complaint-id="${complaint.id}" data-action="update">
                        <i class="fas fa-edit"></i>
                        Update Status
                    </button>
                    <button class="action-btn-sm resolve" data-complaint-id="${complaint.id}" data-action="resolve">
                        <i class="fas fa-check"></i>
                        Mark Resolved
                    </button>
                `;
            default:
                return '';
        }
    }

    setupComplaintActions(card, complaint) {
        const actionButtons = card.querySelectorAll('.action-btn-sm');
        
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const action = btn.dataset.action;
                const complaintId = btn.dataset.complaintId;
                
                switch (action) {
                    case 'assign':
                        this.assignWork(complaintId);
                        break;
                    case 'update':
                        this.updateStatus(complaintId);
                        break;
                    case 'resolve':
                        this.resolveComplaint(complaintId);
                        break;
                }
            });
        });
    }

    assignWork(complaintId) {
        const complaint = this.data.complaints.find(c => c.id === complaintId);
        if (!complaint) return;

        const dept = this.config.departments[this.data.currentDepartment];
        const timelineHours = dept.timeline * 24; // Convert days to hours
        
        this.showToast('Assigning work and starting timeline...', 'info');
        
        setTimeout(() => {
            // Update complaint status
            complaint.status = 'In Progress';
            complaint.timeline = timelineHours;
            complaint.timelineExpiry = Date.now() + (timelineHours * 60 * 60 * 1000);
            complaint.timelineStatus = 'onTime';
            complaint.progress = 0;
            
            // Update counters
            this.data.counters.assigned = Math.max(0, this.data.counters.assigned - 1);
            this.data.counters.inProgress += 1;
            
            // Re-render
            this.renderComplaints();
            this.updateCounterDisplays();
            
            this.showToast(`Work assigned for ${complaint.id}. Timeline: ${dept.timeline} ${dept.unit}`, 'success');
        }, 1000);
    }

    updateStatus(complaintId) {
        const complaint = this.data.complaints.find(c => c.id === complaintId);
        if (!complaint) return;

        const modalContent = `
            <div style="margin-bottom: 20px;">
                <h4 style="margin: 0 0 16px 0; color: var(--color-text);">Update Progress for ${complaint.id}</h4>
                <div style="background: var(--color-bg-1); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <strong>Location:</strong> ${complaint.location}<br>
                    <strong>Description:</strong> ${complaint.description}
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Progress Update:</label>
                <select id="progressUpdate" style="width: 100%; padding: 8px; border: 1px solid var(--color-border); border-radius: 4px; margin-bottom: 16px;">
                    <option value="">Select progress...</option>
                    <option value="25">25% - Work initiated</option>
                    <option value="50">50% - In progress</option>
                    <option value="75">75% - Near completion</option>
                    <option value="90">90% - Final touches</option>
                </select>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Status Notes:</label>
                <textarea id="statusNotes" placeholder="Add notes about current progress..." style="width: 100%; height: 80px; padding: 8px; border: 1px solid var(--color-border); border-radius: 4px; resize: vertical;"></textarea>
            </div>
        `;

        this.showModal('Update Status', modalContent, [
            { text: 'Cancel', class: 'btn btn--outline', action: 'close' },
            { text: 'Update Status', class: 'btn btn--primary', action: () => this.confirmStatusUpdate(complaintId) }
        ]);
    }

    confirmStatusUpdate(complaintId) {
        const progress = document.getElementById('progressUpdate')?.value;
        const notes = document.getElementById('statusNotes')?.value;
        
        if (!progress) {
            this.showToast('Please select a progress update', 'warning');
            return;
        }

        const complaint = this.data.complaints.find(c => c.id === complaintId);
        if (!complaint) return;

        this.closeModal();
        this.showToast('Updating status...', 'info');
        
        setTimeout(() => {
            complaint.progress = parseInt(progress);
            
            this.renderComplaints();
            this.showToast(`Status updated for ${complaint.id} - ${progress}% complete`, 'success');
        }, 1000);
    }

    resolveComplaint(complaintId) {
        const complaint = this.data.complaints.find(c => c.id === complaintId);
        if (!complaint) return;

        const modalContent = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #4CAF50, #66BB6A); color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">
                    <i class="fas fa-check"></i>
                </div>
                <h3 style="margin: 0; color: var(--color-text);">Mark as Resolved</h3>
            </div>
            
            <div style="background: var(--color-bg-3); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <div><strong>Complaint ID:</strong> ${complaint.id}</div>
                <div><strong>Location:</strong> ${complaint.location}</div>
                <div><strong>Issue:</strong> ${complaint.description}</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Resolution Details:</label>
                <textarea id="resolutionDetails" placeholder="Describe how the issue was resolved..." style="width: 100%; height: 100px; padding: 8px; border: 1px solid var(--color-border); border-radius: 4px; resize: vertical;" required></textarea>
            </div>
            
            <div style="background: var(--color-bg-2); padding: 12px; border-radius: 6px; font-size: 14px; color: var(--color-text-secondary);">
                <i class="fas fa-info-circle"></i> The citizen will be notified about the resolution.
            </div>
        `;

        this.showModal('Resolve Complaint', modalContent, [
            { text: 'Cancel', class: 'btn btn--outline', action: 'close' },
            { text: 'Mark Resolved', class: 'btn btn--primary', action: () => this.confirmResolveComplaint(complaintId) }
        ]);
    }

    confirmResolveComplaint(complaintId) {
        const resolutionDetails = document.getElementById('resolutionDetails')?.value;
        
        if (!resolutionDetails.trim()) {
            this.showToast('Please provide resolution details', 'warning');
            return;
        }

        this.closeModal();
        this.showToast('Marking complaint as resolved...', 'info');
        
        setTimeout(() => {
            // Remove complaint from list (simulate resolution)
            this.data.complaints = this.data.complaints.filter(c => c.id !== complaintId);
            
            // Update counters
            this.data.counters.inProgress = Math.max(0, this.data.counters.inProgress - 1);
            this.data.counters.completedToday += 1;
            
            // Re-render
            this.renderComplaints();
            this.updateCounterDisplays();
            
            this.showToast(`Complaint ${complaintId} marked as resolved`, 'success');
        }, 1500);
    }

    startCounterUpdates() {
        this.updateCounterDisplays();
        
        this.state.timers.counter = setInterval(() => {
            // Simulate small changes
            const changes = [-1, 0, 1];
            
            this.data.counters.assigned = Math.max(0, 
                this.data.counters.assigned + changes[Math.floor(Math.random() * changes.length)]
            );
            
            // Occasionally add completed complaints
            if (Math.random() < 0.3) {
                this.data.counters.completedToday += 1;
            }
            
            this.updateCounterDisplays();
        }, this.config.counterUpdateInterval);
    }

    updateCounterDisplays() {
        const elements = {
            'assignedComplaints': this.data.counters.assigned,
            'inProgressComplaints': this.data.counters.inProgress,
            'completedToday': this.data.counters.completedToday,
            'escalatedComplaints': this.data.counters.escalated
        };
        
        Object.entries(elements).forEach(([elementId, value]) => {
            const element = document.getElementById(elementId);
            if (element) {
                this.animateCounter(element, value);
            }
        });

        // Update timeline stats
        const timelineElements = {
            'onTimeCount': this.data.timelineStats.onTime,
            'warningCount': this.data.timelineStats.warning,
            'criticalCount': this.data.timelineStats.critical
        };

        Object.entries(timelineElements).forEach(([elementId, value]) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value;
            }
        });

        // Update resource stats
        const resourceElements = {
            'availableStaff': this.data.resources.availableStaff,
            'equipmentStatus': this.data.resources.equipmentStatus,
            'budgetUtilized': this.data.resources.budgetUtilized,
            'avgResponseTime': this.data.resources.avgResponseTime
        };

        Object.entries(resourceElements).forEach(([elementId, value]) => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = value;
            }
        });
    }

    animateCounter(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const difference = targetValue - currentValue;
        const steps = 10;
        const stepSize = difference / steps;
        let currentStep = 0;
        
        const interval = setInterval(() => {
            currentStep++;
            const newValue = Math.round(currentValue + (stepSize * currentStep));
            element.textContent = newValue;
            
            if (currentStep >= steps) {
                clearInterval(interval);
                element.textContent = targetValue;
            }
        }, 30);
    }

    startTimelineMonitoring() {
        this.state.timers.timeline = setInterval(() => {
            this.checkTimelineExpiry();
        }, this.config.timelineCheckInterval);
    }

    checkTimelineExpiry() {
        const now = Date.now();
        let escalated = false;

        this.data.complaints.forEach(complaint => {
            if (complaint.status === 'In Progress' && complaint.timelineExpiry && now >= complaint.timelineExpiry) {
                complaint.status = 'ESCALATED';
                complaint.timelineStatus = 'escalated';
                this.data.counters.escalated += 1;
                this.data.counters.inProgress = Math.max(0, this.data.counters.inProgress - 1);
                escalated = true;
                
                this.showTimelineWarning(complaint);
            }
        });

        if (escalated) {
            this.renderComplaints();
            this.updateCounterDisplays();
        }
    }

    showTimelineWarning(complaint) {
        const modalContent = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #F44336, #E57373); color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 style="margin: 0; color: var(--color-error);">Timeline Expired - Escalated</h3>
            </div>
            
            <div style="background: var(--color-bg-4); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <div><strong>Complaint ID:</strong> ${complaint.id}</div>
                <div><strong>Location:</strong> ${complaint.location}</div>
                <div><strong>Timeline:</strong> ${this.config.departments[this.data.currentDepartment].timeline} ${this.config.departments[this.data.currentDepartment].unit}</div>
            </div>
            
            <div style="background: var(--color-bg-2); padding: 12px; border-radius: 6px; font-size: 14px; color: var(--color-text-secondary);">
                <strong>Actions Taken:</strong><br>
                • Upper level officer has been notified<br>
                • Priority level increased<br>
                • Additional resources may be assigned<br>
                • Escalation report generated
            </div>
        `;

        // Use timeline warning modal
        const modal = document.getElementById('timelineWarningModal');
        const modalBody = document.getElementById('timelineModalBody');
        const modalFooter = document.getElementById('timelineModalFooter');
        
        if (modal && modalBody && modalFooter) {
            modalBody.innerHTML = modalContent;
            modalFooter.innerHTML = `
                <button class="btn btn--primary" onclick="this.closest('.modal').classList.add('hidden'); this.closest('.modal').style.display = 'none';">
                    Acknowledge
                </button>
            `;
            
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
        }
    }

    setupCharts() {
        this.setupTimelineChart();
        this.setupProgressChart();
    }

    setupTimelineChart() {
        const ctx = document.getElementById('timelineChart');
        if (!ctx) return;

        this.state.charts.timeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'On Time',
                    data: [12, 15, 18, 14, 16, 13, 18],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Escalated',
                    data: [2, 1, 3, 2, 1, 4, 2],
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    setupProgressChart() {
        const ctx = document.getElementById('progressChart');
        if (!ctx) return;

        this.state.charts.progress = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Assigned', 'In Progress', 'Completed', 'Escalated'],
                datasets: [{
                    label: 'Complaints',
                    data: [this.data.counters.assigned, this.data.counters.inProgress, this.data.counters.completedToday, this.data.counters.escalated],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#5D878F', '#B4413C'],
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Quick Action Handlers
    handleBulkUpdate() {
        this.showToast('Opening bulk update tool...', 'info');
    }

    handleScheduleWork() {
        this.showToast('Opening work scheduler...', 'info');
    }

    handleRequestResources() {
        this.showToast('Opening resource request form...', 'info');
    }

    handleGenerateReport() {
        this.showToast('Generating department report...', 'info');
        
        setTimeout(() => {
            this.exportReport();
        }, 2000);
    }

    exportComplaints() {
        this.showToast('Exporting complaint data...', 'info');
        
        setTimeout(() => {
            const exportData = {
                department: this.config.departments[this.data.currentDepartment].name,
                timestamp: new Date().toISOString(),
                complaints: this.data.complaints.filter(c => {
                    const categoryMap = {
                        'ELEC': 'Electricity',
                        'WATER': 'Water',
                        'SEWER': 'Sewer',
                        'ROADS': 'Roads and Infrastructure',
                        'SANIT': 'Sanitation',
                        'PWD': 'Public Works'
                    };
                    return c.category === categoryMap[this.data.currentDepartment];
                }),
                counters: this.data.counters
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `complaints-${this.data.currentDepartment}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('Complaints exported successfully', 'success');
        }, 1500);
    }

    exportReport() {
        const reportData = {
            department: this.config.departments[this.data.currentDepartment].name,
            reportDate: new Date().toISOString(),
            counters: this.data.counters,
            timelineStats: this.data.timelineStats,
            resources: this.data.resources,
            performance: {
                averageResolutionTime: '2.3 hours',
                onTimePercentage: '78%',
                escalationRate: '8%',
                citizenSatisfaction: '4.2/5'
            }
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `department-report-${this.data.currentDepartment}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Department report generated successfully', 'success');
    }

    handleMenuClick(section) {
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        this.showToast(`Navigated to ${section.charAt(0).toUpperCase() + section.slice(1)}`, 'info');
        
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                this.toggleSidebar();
            }, 200);
        }
    }

    handleLogout() {
        this.showToast('Logging out...', 'info');
        
        if (this.state.timers.counter) clearInterval(this.state.timers.counter);
        if (this.state.timers.timeline) clearInterval(this.state.timers.timeline);
        
        setTimeout(() => {
            this.showToast('Logged out successfully. Redirecting...', 'success');
            console.log('Logout successful - would redirect to login');
        }, 1500);
    }

    showModal(title, content, buttons = []) {
        const modal = document.getElementById('complaintActionModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalFooter = document.getElementById('modalFooter');
        
        if (!modal) return;

        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        
        modalFooter.innerHTML = '';
        buttons.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button.text;
            btn.className = button.class;
            
            if (button.action === 'close') {
                btn.onclick = () => this.closeModal();
            } else if (typeof button.action === 'function') {
                btn.onclick = button.action;
            }
            
            modalFooter.appendChild(btn);
        });

        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modals = ['complaintActionModal', 'timelineWarningModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('hidden');
                modal.style.display = 'none';
            }
        });
        document.body.style.overflow = '';
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        const toastClose = toast.querySelector('.toast-close');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toastIcon.className = `toast-icon ${icons[type]}`;
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        
        toast.classList.add('show');
        toast.classList.remove('hidden');
        
        const hideTimeout = setTimeout(() => {
            this.hideToast();
        }, 4000);
        
        toastClose.onclick = () => {
            clearTimeout(hideTimeout);
            this.hideToast();
        };
    }

    hideToast() {
        const toast = document.getElementById('toast');
        toast.classList.remove('show');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }

    showWelcomeMessage() {
        setTimeout(() => {
            const deptName = this.config.departments[this.data.currentDepartment]?.name || 'Department';
            this.showToast(`Welcome to ${deptName} Dashboard! Timeline monitoring is active.`, 'success');
        }, 1000);
    }

    destroy() {
        if (this.state.timers.counter) clearInterval(this.state.timers.counter);
        if (this.state.timers.timeline) clearInterval(this.state.timers.timeline);
        
        Object.values(this.state.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        
        console.log('Department Admin Portal destroyed');
    }
}

// Initialize the department admin portal
let departmentPortal;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing Department Admin Portal...');
        departmentPortal = new DepartmentAdminPortal();
    });
} else {
    console.log('DOM already loaded, initializing Department Admin Portal...');
    departmentPortal = new DepartmentAdminPortal();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && departmentPortal) {
        // Refresh charts when page becomes visible
        setTimeout(() => {
            Object.values(departmentPortal.state.charts).forEach(chart => {
                if (chart) chart.resize();
            });
        }, 100);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (departmentPortal) {
        setTimeout(() => {
            Object.values(departmentPortal.state.charts).forEach(chart => {
                if (chart) chart.resize();
            });
        }, 100);
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (departmentPortal) {
        departmentPortal.showToast('An error occurred. Please refresh if issues persist.', 'error');
    }
});

// Export for global access
window.departmentPortal = departmentPortal;