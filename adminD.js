
const firebaseConfig = {
  apiKey: "AIzaSyBEJOP9E6Cvy55ZRrXcKrAysBraarOQOVU",
  authDomain: "crowd-sourced-civic-issu-d615e.firebaseapp.com",
  projectId: "crowd-sourced-civic-issu-d615e",
  storageBucket: "crowd-sourced-civic-issu-d615e.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "787152121870",
  appId: "1:787152121870:web:268cb84dc4520acf6d8c5f"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // <-- Firestore database instance

// Nagar Mitra Admin Portal Application
class AdminPortal {
    // ADD THIS NEW METHOD inside the AdminPortal class

listenForComplaints() {
    const listenerStartTime = new Date();

    db.collection("complaints").onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const complaintData = { id: change.doc.id, ...change.doc.data() };

            if (change.type === "added") {
                const data = change.doc.data();
                alert("📢 New complaint: " + (data.message || data.description || "No message provided"));
                // Optionally, display in the dashboard UI
                const div = document.getElementById("complaints");
                if (div) {
                    const p = document.createElement("p");
                    p.textContent = data.message || data.description || "No message provided";
                    div.appendChild(p);
      }
    }
            if (change.type === "modified") {
                // Logic to update an existing complaint in this.data.complaints
                const index = this.data.complaints.findIndex(c => c.id === complaintData.id);
                if (index > -1) {
                    this.data.complaints[index] = complaintData;
                }
            }
            if (change.type === "removed") {
                // Logic to remove a complaint from this.data.complaints
                this.data.complaints = this.data.complaints.filter(c => c.id !== complaintData.id);
            }
        });

        // After processing all changes, re-render the list
        this.renderComplaints();
        // You could also update the map markers here
        this.addComplaintMarkers();
    }, error => {
        console.error("Error listening for complaints: ", error);
        this.showToast('Could not connect to the complaint database.', 'error');
    });
}

    constructor() {
        this.config = {
            mapCenter: [23.2599, 77.4126],
            mapZoom: 12,
            counterUpdateInterval: 5000,
            activityUpdateInterval: 30000
        };

        this.data = {
            departments: [
                "Electricity Department",
                "Water Department", 
                "Sewer Department",
                "Roads & Infrastructure Department",
                "Sanitation Department",
                "Public Works Department"
            ],
            complaintCategories: [
                "Electricity",
                "Water",
                "Sewer", 
                "Roads and Infrastructure",
                "Sanitation",
                "Public Works"
            ],
            priorityLevels: ["Urgent", "Normal", "Low"],
            complaints: [
                {
                    id: "CM2024001",
                    category: "Roads and Infrastructure",
                    location: "MG Road, Near City Mall",
                    coordinates: [23.2599, 77.4126],
                    description: "Large pothole causing traffic issues and accidents",
                    priority: "Urgent", 
                    votes: 45,
                    hasAudio: true,
                    hasVideo: true,
                    timestamp: "2 hours ago"
                },
                {
                    id: "CM2024002",
                    category: "Electricity",
                    location: "Sector 5, Block B",
                    coordinates: [23.2650, 77.4000],
                    description: "Street light not working for past week",
                    priority: "Normal",
                    votes: 23,
                    hasAudio: false,
                    hasVideo: false,
                    timestamp: "5 hours ago"
                },
                {
                    id: "CM2024003",
                    category: "Water",
                    location: "New Market Area",
                    coordinates: [23.2500, 77.4200],
                    description: "Water pipeline burst causing flooding",
                    priority: "Urgent",
                    votes: 78,
                    hasAudio: true,
                    hasVideo: true,
                    timestamp: "1 hour ago"
                },
                {
                    id: "CM2024004",
                    category: "Sewer",
                    location: "Residential Colony Block C",
                    coordinates: [23.2400, 77.4300],
                    description: "Sewer blockage causing overflow on main road",
                    priority: "Normal",
                    votes: 34,
                    hasAudio: false,
                    hasVideo: true,
                    timestamp: "3 hours ago"
                },
                {
                    id: "CM2024005",
                    category: "Sanitation",
                    location: "Park Avenue Market",
                    coordinates: [23.2700, 77.3900],
                    description: "Garbage not collected for 3 days, health hazard",
                    priority: "Urgent",
                    votes: 67,
                    hasAudio: true,
                    hasVideo: false,
                    timestamp: "4 hours ago"
                }
            ]       
            ,
            counters: {
                active: 247,
                inProgress: 89,
                resolved: 1532
            }
        };

        this.state = {
            map: null,
            markers: [],
            sidebarOpen: false,
            currentFilters: {
                category: '',
                priority: ''
            },
            timers: {
                counter: null,
                activity: null
            }
        };

        this.init();
    }

    init() {
        console.log('Admin Portal initializing...');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApplication();
            });
        } else {
            this.setupApplication();
        }
    }

    setupApplication() {
        console.log('Setting up admin portal...');
        this.ensureModalsClosed(); // Fix: Ensure modals are closed on startup
        this.setupEventListeners();
        this.initializeMap();
        this.listenForComplaints();
        this.renderDepartments();
        this.startCounterUpdates();
        this.setupPerformanceChart();
        this.startActivityLog();
        this.showWelcomeMessage();
    }

    ensureModalsClosed() {
        // Fix: Ensure all modals are properly hidden on startup
        const modal = document.getElementById('complaintActionModal');
        const toast = document.getElementById('toast');
        
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none'; // Extra safety
        }
        
        if (toast) {
            toast.classList.add('hidden');
        }
        
        // Reset body overflow
        document.body.style.overflow = '';
        
        console.log('All modals ensured closed');
    }

    setupEventListeners() {
        // Hamburger menu
        const hamburgerMenu = document.getElementById('hamburgerMenu');

        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleSidebar();
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

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();  
            });
        }

        // Filter controls
        const categoryFilter = document.getElementById('categoryFilter');
        const priorityFilter = document.getElementById('priorityFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.state.currentFilters.category = categoryFilter.value;
                this.renderComplaints();
            });
        }

        if (priorityFilter) {
            priorityFilter.addEventListener('change', () => {
                this.state.currentFilters.priority = priorityFilter.value;
                this.renderComplaints();
            });
        }

        // Map controls
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const refreshMapBtn = document.getElementById('refreshMapBtn');

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreenMap();
            });
        }

        if (refreshMapBtn) {
            refreshMapBtn.addEventListener('click', () => {
                this.refreshMap();
            });
        }

        // Modal close - Fixed implementation
        const closeModal = document.getElementById('closeModal');
        if (closeModal) {
            closeModal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            });
        }

        // Close modal on backdrop click - Fixed implementation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal__backdrop')) {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            }
        });

        // Keyboard shortcuts - Fixed implementation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                this.closeModal();
            }
        });

        // Action buttons
        this.setupActionButtons();

        console.log('All event listeners setup successfully');
    }

    setupActionButtons() {
        // Quick action buttons
        const actionBtns = document.querySelectorAll('.action-btn');
        actionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.querySelector('span').textContent.trim();
                this.handleQuickAction(action);
            });
        });

        // Communication buttons
        const commBtns = document.querySelectorAll('.comm-btn');
        commBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.querySelector('span').textContent.trim();
                this.handleCommunicationAction(action);
            });
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        const hamburgerMenu = document.getElementById('hamburgerMenu');

        this.state.sidebarOpen = !this.state.sidebarOpen;

        if (sidebar) {
            sidebar.classList.toggle('active', this.state.sidebarOpen);
        }
        
        if (mainContent) {
            mainContent.classList.toggle('sidebar-open', this.state.sidebarOpen);
        }
        
        if (hamburgerMenu) {
            hamburgerMenu.classList.toggle('active', this.state.sidebarOpen);
        }

        // Resize map after sidebar toggle
        setTimeout(() => {
            if (this.state.map) {
                this.state.map.invalidateSize();
            }
        }, 300);
    }

    handleMenuClick(section) {
        // Update active menu item
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });

        this.showToast(`Navigated to ${section.charAt(0).toUpperCase() + section.slice(1)}`, 'info');
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                this.toggleSidebar();
            }, 200);
        }
    }

    handleLogout() {
        this.showModal('Confirm Logout', 
            'Are you sure you want to logout from the admin panel?',
            [
                { text: 'Cancel', class: 'btn btn--outline', action: 'close' },
                { text: 'Logout', class: 'btn btn--primary', action: () => window.location.href = "login.html" }
            ]
        );
    }

    performLogout() {
        this.showToast('Logging out...', 'info');
        this.closeModal();
        
        // Clear timers
        if (this.state.timers.counter) clearInterval(this.state.timers.counter);
        if (this.state.timers.activity) clearInterval(this.state.timers.activity);
        
        setTimeout(() => {
            this.showToast('Logged out successfully. Redirecting...', 'success');
            // In a real app, this would redirect to login page
            console.log('Logout successful - would redirect to login');
        }, 1500);
    }

    initializeMap() {
        console.log('Initializing map...');
        
        const mapElement = document.getElementById('liveMap');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }

        try {
            // Initialize map
            this.state.map = L.map('liveMap').setView(this.config.mapCenter, this.config.mapZoom);

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(this.state.map);

            // Add complaint markers
            this.addComplaintMarkers();

            console.log('Map initialized successfully');
        } catch (error) {
            console.error('Map initialization failed:', error);
            this.showToast('Failed to load map', 'error');
        }
    }

    addComplaintMarkers() {
        // Clear existing markers
        this.state.markers.forEach(marker => {
            this.state.map.removeLayer(marker);
        });
        this.state.markers = [];

        // Add markers for each complaint
        this.data.complaints.forEach(complaint => {
            const marker = this.createComplaintMarker(complaint);
            if (marker) {
                marker.addTo(this.state.map);
                this.state.markers.push(marker);
            }
        });
    }

    createComplaintMarker(complaint) {
        const colors = {
            'Urgent': '#FF6B6B',
            'Normal': '#FFA726',
            'Low': '#66BB6A'
        };

        const color = colors[complaint.priority] || '#666';

        // Create custom icon
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: ${color};
                border: 3px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 10px;
                font-weight: bold;
            ">!</div>`,
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });

        const marker = L.marker(complaint.coordinates, { icon });

        // Create popup content
        const popupContent = `
            <div style="min-width: 200px;">
                <div style="font-weight: bold; color: #2196F3; margin-bottom: 8px;">
                    ${complaint.id}
                </div>
                <div style="margin-bottom: 6px;">
                    <strong>Category:</strong> ${complaint.category}
                </div>
                <div style="margin-bottom: 6px;">
                    <strong>Priority:</strong> 
                    <span style="
                        background: ${complaint.priority === 'Urgent' ? '#ffebee' : complaint.priority === 'Normal' ? '#fff3e0' : '#e8f5e8'};
                        color: ${complaint.priority === 'Urgent' ? '#d32f2f' : complaint.priority === 'Normal' ? '#f57c00' : '#388e3c'};
                        padding: 2px 8px;
                        border-radius: 10px;
                        font-size: 12px;
                    ">${complaint.priority}</span>
                </div>
                <div style="margin-bottom: 6px;">
                    <strong>Location:</strong> ${complaint.location}
                </div>
                <div style="margin-bottom: 8px; font-size: 14px;">
                    ${complaint.description}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #666;">
                    <span>👍 ${complaint.votes} votes</span>
                    <span>${complaint.timestamp}</span>
                </div>
            </div>
        `;

        marker.bindPopup(popupContent);

        return marker;
    }

    refreshMap() {
        this.showToast('Refreshing map data...', 'info');
        
        // Simulate data refresh
        setTimeout(() => {
            this.addComplaintMarkers();
            this.showToast('Map refreshed successfully', 'success');
        }, 1000);
    }

    toggleFullscreenMap() {
        const mapContainer = document.querySelector('.map-container');
        
        if (!document.fullscreenElement) {
            mapContainer.requestFullscreen().then(() => {
                setTimeout(() => {
                    if (this.state.map) {
                        this.state.map.invalidateSize();
                    }
                }, 100);
                this.showToast('Entered fullscreen mode', 'info');
            });
        } else {
            document.exitFullscreen().then(() => {
                setTimeout(() => {
                    if (this.state.map) {
                        this.state.map.invalidateSize();
                    }
                }, 100);
                this.showToast('Exited fullscreen mode', 'info');
            });
        }
    }

    renderComplaints() {
        const complaintsList = document.getElementById('complaintsList');
        if (!complaintsList) return;

        // Filter complaints
        let filteredComplaints = this.data.complaints;
        
        if (this.state.currentFilters.category) {
            filteredComplaints = filteredComplaints.filter(c => 
                c.category === this.state.currentFilters.category
            );
        }
        
        if (this.state.currentFilters.priority) {
            filteredComplaints = filteredComplaints.filter(c => 
                c.priority === this.state.currentFilters.priority
            );
        }

        complaintsList.innerHTML = '';

        if (filteredComplaints.length === 0) {
            complaintsList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                    <p>No complaints found matching the current filters.</p>
                </div>
            `;
            return;
        }

        filteredComplaints.forEach(complaint => {
            const complaintCard = this.createComplaintCard(complaint);
            complaintsList.appendChild(complaintCard);
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

        card.innerHTML = `
            <div class="complaint-header">
                <div class="complaint-id">${complaint.id}</div>
                <div class="complaint-priority ${complaint.priority.toLowerCase()}">${complaint.priority}</div>
            </div>
            
            <div class="complaint-media">
                ${mediaIndicators.join('')}
                <div class="media-indicator"><i class="fas fa-image"></i> Photo</div>
            </div>
            
            <div class="complaint-location">
                <i class="fas fa-map-marker-alt"></i>
                ${complaint.location}
            </div>
            
            <div class="complaint-description">
                ${complaint.description}
            </div>
            
            <div class="complaint-meta">
                <div class="vote-count">
                    <i class="fas fa-thumbs-up"></i>
                    ${complaint.votes} votes
                </div>
                <div class="complaint-time">${complaint.timestamp}</div>
            </div>
            
            <div class="complaint-actions">
                <button class="action-btn-sm verify" data-complaint-id="${complaint.id}" data-action="verify">
                    <i class="fas fa-check"></i>
                    Verify & Assign
                </button>
                <button class="action-btn-sm reject" data-complaint-id="${complaint.id}" data-action="reject">
                    <i class="fas fa-times"></i>
                    Reject
                </button>
            </div>
        `;

        // Add event listeners to action buttons
        const verifyBtn = card.querySelector('.action-btn-sm.verify');
        const rejectBtn = card.querySelector('.action-btn-sm.reject');

        if (verifyBtn) {
            verifyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.verifyComplaint(complaint.id);
            });
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.rejectComplaint(complaint.id);
            });
        }

        return card;
    }

    verifyComplaint(complaintId) {
        const complaint = this.data.complaints.find(c => c.id === complaintId);
        if (!complaint) return;

        const departmentMap = {
            'Electricity': 'Electricity Department',
            'Water': 'Water Department',
            'Sewer': 'Sewer Department',
            'Roads and Infrastructure': 'Roads & Infrastructure Department',
            'Sanitation': 'Sanitation Department',
            'Public Works': 'Public Works Department'
        };

        const assignedDepartment = departmentMap[complaint.category] || 'General Department';

        const modalContent = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #4CAF50, #66BB6A); color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">
                    <i class="fas fa-check"></i>
                </div>
                <h3 style="margin: 0; color: var(--color-text);">Verify Complaint</h3>
            </div>
            
            <div style="background: var(--color-bg-3); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-weight: bold; margin-bottom: 8px;">Complaint Details:</div>
                <div><strong>ID:</strong> ${complaint.id}</div>
                <div><strong>Category:</strong> ${complaint.category}</div>
                <div><strong>Priority:</strong> ${complaint.priority}</div>
                <div><strong>Location:</strong> ${complaint.location}</div>
            </div>
            
            <div style="background: var(--color-bg-1); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-weight: bold; margin-bottom: 8px;">Assignment Details:</div>
                <div><strong>Department:</strong> ${assignedDepartment}</div>
                <div><strong>Status:</strong> Will be marked as "In Progress"</div>
                <div><strong>Notification:</strong> User will be notified of verification</div>
            </div>
            
            <p style="color: var(--color-text-secondary); font-size: 14px; text-align: center;">
                This complaint will be forwarded to the respective department for immediate action.
            </p>
        `;

        this.showModal('Verify & Assign Complaint', modalContent, [
            { text: 'Cancel', class: 'btn btn--outline', action: 'close' },
            { text: 'Verify & Assign', class: 'btn btn--primary', action: () => this.confirmVerifyComplaint(complaintId, assignedDepartment) }
        ]);
    }

    confirmVerifyComplaint(complaintId, department) {
        this.closeModal();
        this.showToast('Processing complaint verification...', 'info');
        
        setTimeout(() => {
            // Remove complaint from active list (simulate forwarding)
            this.data.complaints = this.data.complaints.filter(c => c.id !== complaintId);
            
            // Update counters
            this.data.counters.active = Math.max(0, this.data.counters.active - 1);
            this.data.counters.inProgress += 1;
            
            // Update displays
            this.renderComplaints();
            this.updateCounterDisplays();
            this.addActivity(`Complaint ${complaintId} verified and assigned to ${department}`, 'verified');
            
            this.showToast(`Complaint ${complaintId} verified and forwarded to ${department}`, 'success');
        }, 1500);
    }

    rejectComplaint(complaintId) {
        const complaint = this.data.complaints.find(c => c.id === complaintId);
        if (!complaint) return;

        const modalContent = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #F44336, #E57373); color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; font-size: 24px;">
                    <i class="fas fa-times"></i>
                </div>
                <h3 style="margin: 0; color: var(--color-text);">Reject Complaint</h3>
            </div>
            
            <div style="background: var(--color-bg-4); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <div style="font-weight: bold; margin-bottom: 8px;">Complaint Details:</div>
                <div><strong>ID:</strong> ${complaint.id}</div>
                <div><strong>Category:</strong> ${complaint.category}</div>
                <div><strong>Description:</strong> ${complaint.description}</div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Reason for Rejection:</label>
                <select id="rejectionReason" style="width: 100%; padding: 8px; border: 1px solid var(--color-border); border-radius: 4px; margin-bottom: 12px;">
                    <option value="">Select a reason...</option>
                    <option value="insufficient_evidence">Insufficient Evidence</option>
                    <option value="unclear_images">Unclear Images/Videos</option>
                    <option value="incomplete_information">Incomplete Information</option>
                    <option value="duplicate_complaint">Duplicate Complaint</option>
                    <option value="outside_jurisdiction">Outside Jurisdiction</option>
                    <option value="other">Other</option>
                </select>
                <textarea id="rejectionNote" placeholder="Additional notes (optional)" style="width: 100%; height: 80px; padding: 8px; border: 1px solid var(--color-border); border-radius: 4px; resize: vertical;"></textarea>
            </div>
            
            <div style="background: var(--color-bg-2); padding: 12px; border-radius: 6px; font-size: 14px; color: var(--color-text-secondary);">
                <strong>Note:</strong> User will be notified about the rejection and can resubmit with clear images and videos.
            </div>
        `;

        this.showModal('Reject Complaint', modalContent, [
            { text: 'Cancel', class: 'btn btn--outline', action: 'close' },
            { text: 'Reject Complaint', class: 'btn btn--primary', action: () => this.confirmRejectComplaint(complaintId) }
        ]);
    }

    confirmRejectComplaint(complaintId) {
        const reason = document.getElementById('rejectionReason')?.value;
        const note = document.getElementById('rejectionNote')?.value;
        
        if (!reason) {
            this.showToast('Please select a reason for rejection', 'warning');
            return;
        }

        this.closeModal();
        this.showToast('Processing complaint rejection...', 'info');
        
        setTimeout(() => {
            // Remove complaint from active list
            this.data.complaints = this.data.complaints.filter(c => c.id !== complaintId);
            
            // Update counters
            this.data.counters.active = Math.max(0, this.data.counters.active - 1);
            
            // Update displays
            this.renderComplaints();
            this.updateCounterDisplays();
            this.addActivity(`Complaint ${complaintId} rejected - ${reason}`, 'rejected');
            
            this.showToast(`Complaint ${complaintId} rejected. User has been notified.`, 'success');
        }, 1500);
    }

    renderDepartments() {
        const departmentsGrid = document.getElementById('departmentsGrid');
        if (!departmentsGrid) return;

        const departmentIcons = [
            'fas fa-bolt',
            'fas fa-tint',
            'fas fa-water',
            'fas fa-road',
            'fas fa-broom',
            'fas fa-hammer'
        ];

        departmentsGrid.innerHTML = '';

        this.data.departments.forEach((department, index) => {
            const card = document.createElement('div');
            card.className = 'department-card';
            
            // Generate random complaint count for each department
            const count = Math.floor(Math.random() * 50) + 5;
            
            card.innerHTML = `
                <div class="department-icon">
                    <i class="${departmentIcons[index]}"></i>
                </div>
                <div class="department-name">${department}</div>
                <div class="department-count">${count} active complaints</div>
            `;
            
            departmentsGrid.appendChild(card);
        });
    }

    startCounterUpdates() {
        this.updateCounterDisplays();
        
        this.state.timers.counter = setInterval(() => {
            // Simulate live updates with small random changes
            const changes = [-2, -1, 0, 1, 2];
            
            this.data.counters.active = Math.max(0, 
                this.data.counters.active + changes[Math.floor(Math.random() * changes.length)]
            );
            
            this.data.counters.inProgress = Math.max(0, 
                this.data.counters.inProgress + changes[Math.floor(Math.random() * changes.length)]
            );
            
            this.data.counters.resolved += Math.floor(Math.random() * 3);
            
            this.updateCounterDisplays();
        }, this.config.counterUpdateInterval);
    }

    updateCounterDisplays() {
        const activeElement = document.getElementById('activeComplaints');
        const inProgressElement = document.getElementById('inProgressComplaints');
        const resolvedElement = document.getElementById('resolvedComplaints');
        
        if (activeElement) {
            this.animateCounter(activeElement, this.data.counters.active);
        }
        
        if (inProgressElement) {
            this.animateCounter(inProgressElement, this.data.counters.inProgress);
        }
        
        if (resolvedElement) {
            this.animateCounter(resolvedElement, this.data.counters.resolved);
        }
    }

    animateCounter(element, targetValue) {
        const currentValue = parseInt(element.textContent) || 0;
        const difference = targetValue - currentValue;
        const steps = 20;
        const stepSize = difference / steps;
        let currentStep = 0;
        
        const interval = setInterval(() => {
            currentStep++;
            const newValue = Math.round(currentValue + (stepSize * currentStep));
            element.textContent = newValue.toLocaleString();
            
            if (currentStep >= steps) {
                clearInterval(interval);
                element.textContent = targetValue.toLocaleString();
            }
        }, 50);
    }

    setupPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Resolved Complaints',
                    data: [120, 190, 300, 500, 420, 650],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'New Complaints',
                    data: [100, 180, 280, 450, 380, 600],
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
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

    startActivityLog() {
        this.addActivity('Admin portal initialized successfully', 'system');
        this.addActivity('Live map loaded with 5 active complaints', 'info');
        this.addActivity('Counter updates started', 'system');
        
        // Simulate periodic activity updates
        this.state.timers.activity = setInterval(() => {
            const activities = [
                'New complaint received from sector 7',
                'Complaint CM2024006 resolved by Water Department',
                'Bulk assignment completed for Roads Department',
                'System backup completed successfully',
                'Department officer logged in',
                'Weekly report generated'
            ];
            
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            this.addActivity(randomActivity, 'info');
        }, this.config.activityUpdateInterval);
    }

    addActivity(message, type = 'info') {
        const activityLog = document.getElementById('activityLog');
        if (!activityLog) return;

        const activity = document.createElement('div');
        activity.className = 'activity-item';

        const iconMap = {
            'system': { icon: 'fas fa-cog', color: '#666' },
            'info': { icon: 'fas fa-info-circle', color: '#2196F3' },
            'verified': { icon: 'fas fa-check-circle', color: '#4CAF50' },
            'rejected': { icon: 'fas fa-times-circle', color: '#F44336' }
        };

        const activityType = iconMap[type] || iconMap['info'];
        const timestamp = new Date().toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        activity.innerHTML = `
            <div class="activity-icon" style="background: ${activityType.color};">
                <i class="${activityType.icon}"></i>
            </div>
            <div class="activity-text">${message}</div>
            <div class="activity-time">${timestamp}</div>
        `;

        // Insert at the beginning
        activityLog.insertBefore(activity, activityLog.firstChild);

        // Keep only the latest 10 activities
        while (activityLog.children.length > 10) {
            activityLog.removeChild(activityLog.lastChild);
        }
    }

    handleQuickAction(action) {
        switch (action) {
            case 'Bulk Assign':
                this.showToast('Opening bulk assignment tool...', 'info');
                break;
            case 'Export Reports':
                this.exportReports();
                break;
            case 'Broadcast Update':
                this.showBroadcastDialog();
                break;
            case 'Analytics':
                this.showToast('Opening analytics dashboard...', 'info');
                break;
            default:
                this.showToast(`${action} feature will be available soon`, 'info');
        }
    }

    exportReports() {
        this.showToast('Generating reports...', 'info');
        
        setTimeout(() => {
            // Simulate report generation
            const reportData = {
                timestamp: new Date().toISOString(),
                totalComplaints: this.data.counters.active + this.data.counters.inProgress + this.data.counters.resolved,
                activeComplaints: this.data.counters.active,
                inProgressComplaints: this.data.counters.inProgress,
                resolvedComplaints: this.data.counters.resolved,
                departments: this.data.departments.length
            };
            
            const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nagar-mitra-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('Report exported successfully', 'success');
        }, 2000);
    }

    showBroadcastDialog() {
        const modalContent = `
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Broadcast Type:</label>
                <select id="broadcastType" style="width: 100%; padding: 8px; border: 1px solid var(--color-border); border-radius: 4px; margin-bottom: 16px;">
                    <option value="all">All Users</option>
                    <option value="departments">Department Officers</option>
                    <option value="citizens">Citizens Only</option>
                    <option value="admins">Admin Staff</option>
                </select>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Message Title:</label>
                <input type="text" id="broadcastTitle" placeholder="Enter broadcast title" style="width: 100%; padding: 8px; border: 1px solid var(--color-border); border-radius: 4px; margin-bottom: 16px;">
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold;">Message Content:</label>
                <textarea id="broadcastMessage" placeholder="Enter your broadcast message..." style="width: 100%; height: 100px; padding: 8px; border: 1px solid var(--color-border); border-radius: 4px; resize: vertical;"></textarea>
            </div>
            
            <div style="background: var(--color-bg-2); padding: 12px; border-radius: 6px; font-size: 14px; color: var(--color-text-secondary);">
                <i class="fas fa-info-circle"></i> This message will be sent via push notification, SMS, and email.
            </div>
        `;

        this.showModal('Broadcast Message', modalContent, [
            { text: 'Cancel', class: 'btn btn--outline', action: 'close' },
            { text: 'Send Broadcast', class: 'btn btn--primary', action: () => this.sendBroadcast() }
        ]);
    }

    sendBroadcast() {
        const type = document.getElementById('broadcastType')?.value;
        const title = document.getElementById('broadcastTitle')?.value;
        const message = document.getElementById('broadcastMessage')?.value;
        
        if (!title || !message) {
            this.showToast('Please fill in all required fields', 'warning');
            return;
        }

        this.closeModal();
        this.showToast('Sending broadcast message...', 'info');
        
        setTimeout(() => {
            this.addActivity(`Broadcast sent to ${type}: "${title}"`, 'info');
            this.showToast(`Broadcast sent successfully to ${type}`, 'success');
        }, 2000);
    }

    handleCommunicationAction(action) {
        switch (action) {
            case 'Send Email':
                this.showToast('Opening email composer...', 'info');
                break;
            case 'SMS Alert':
                this.showToast('SMS alert system activated', 'success');
                break;
            case 'Push Notification':
                this.showToast('Push notification sent to all users', 'success');
                break;
        }
    }

    showModal(title, content, buttons = []) {
        const modal = document.getElementById('complaintActionModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        const modalFooter = document.getElementById('modalFooter');
        
        if (!modal) return;

        modalTitle.textContent = title;
        modalBody.innerHTML = content;
        
        // Clear and populate footer
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

        // Show modal with proper display
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('complaintActionModal');
        if (modal) {
            modal.classList.add('hidden');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        const toastClose = toast.querySelector('.toast-close');
        
        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toastIcon.className = `toast-icon ${icons[type]}`;
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        
        // Show toast
        toast.classList.add('show');
        toast.classList.remove('hidden');
        
        // Auto hide after 4 seconds
        const hideTimeout = setTimeout(() => {
            this.hideToast();
        }, 4000);
        
        // Close button functionality
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
            this.showToast('Welcome to Nagar Mitra Admin Portal! All systems are operational.', 'success');
        }, 1000);
    }

    // Cleanup method
    destroy() {
        // Clear all timers
        if (this.state.timers.counter) clearInterval(this.state.timers.counter);
        if (this.state.timers.activity) clearInterval(this.state.timers.activity);
        
        // Remove event listeners if needed
        console.log('Admin Portal destroyed');
    }
}

// Initialize the admin portal
let adminPortal;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing Admin Portal...');
        adminPortal = new AdminPortal();
    });
} else {
    console.log('DOM already loaded, initializing Admin Portal...');
    adminPortal = new AdminPortal();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && adminPortal) {
        // Refresh data when page becomes visible
        if (adminPortal.state.map) {
            setTimeout(() => {
                adminPortal.state.map.invalidateSize();
            }, 100);
        }
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (adminPortal && adminPortal.state.map) {
        setTimeout(() => {
            adminPortal.state.map.invalidateSize();
        }, 100);
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (adminPortal) {
        adminPortal.showToast('An error occurred. Please refresh the page if issues persist.', 'error');
    }
});

// Export for global access
window.adminPortal = adminPortal;