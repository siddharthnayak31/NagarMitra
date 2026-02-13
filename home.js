// Nagar Mitra Civilian Portal Application 
class NagarMitraApp {
    constructor() {
        this.currentLanguage = 'en';
        this.permissions = {
            location: false,
            camera: false,
            microphone: false
        };
        this.userVotes = new Set(); // Track user votes to prevent multiple voting
        this.currentBannerIndex = 0;
        this.showingMoreComplaints = false;
        this.bannerInterval = null;
        
        // Application data
        this.data = {
            liveStats: {
                activeComplaints: 127,
                resolvedIssues: 342,
                inProgress: 89
            },
            banners: [
                {
                    id: 1,
                    title: "Report Civic Issues Instantly",
                    description: "Quick and easy complaint filing with photo and location",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                },
                {
                    id: 2,
                    title: "Track Your Complaints", 
                    description: "Real-time status updates and government response",
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                },
                {
                    id: 3,
                    title: "Community Voting System",
                    description: "Vote to prioritize urgent issues in your area",
                    background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                },
                {
                    id: 4,
                    title: "Direct Government Connection",
                    description: "Connect directly with municipal authorities",
                    background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
                }
            ],
            nearbyComplaints: [
                {
                    id: "#105",
                    type: "Pothole",
                    location: "MG Road, Near City Mall",
                    description: "Large pothole causing traffic issues and vehicle damage",
                    votes: 23,
                    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
                    category: "Potholes",
                    icon: "🕳️",
                    priority: "High",
                    timeAgo: "2 hours ago"
                },
                {
                    id: "#104",
                    type: "Street Light",
                    location: "Sector 5, Block B", 
                    description: "Street light not working for a week causing safety issues",
                    votes: 15,
                    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
                    category: "Electricity",
                    icon: "💡",
                    priority: "Medium",
                    timeAgo: "5 hours ago"
                },
                {
                    id: "#103",
                    type: "Garbage Overflow",
                    location: "Park Street, Near Bus Stop",
                    description: "Overflowing garbage bin attracting stray animals",
                    votes: 31,
                    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400",
                    category: "Garbage",
                    icon: "🗑️",
                    priority: "High",
                    timeAgo: "1 day ago"
                },
                {
                    id: "#102",
                    type: "Water Leakage",
                    location: "Gandhi Nagar, Main Road",
                    description: "Water pipe leakage causing road flooding",
                    votes: 18,
                    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
                    category: "Water",
                    icon: "💧",
                    priority: "Urgent",
                    timeAgo: "3 hours ago"
                },
                {
                    id: "#101",
                    type: "Sewer Block",
                    location: "Nehru Colony, Block C",
                    description: "Sewer line blocked causing foul smell",
                    votes: 27,
                    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
                    category: "Sewer",
                    icon: "🚰",
                    priority: "High",
                    timeAgo: "6 hours ago"
                }
            ],
            additionalComplaints:[
                {
                    id: "#100",
                    type: "Road Damage",
                    location: "Shanti Nagar, Phase 1",
                    description: "Road surface damaged after heavy rain",
                    votes: 12,
                    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
                    category: "Potholes",
                    icon: "🛣️",
                    priority: "Medium",
                    timeAgo: "1 day ago"
                },
                {
                    id: "#099",
                    type: "Power Outage",
                    location: "Industrial Area, Block A",
                    description: "Frequent power cuts affecting businesses",
                    votes: 35,
                    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
                    category: "Electricity",
                    icon: "⚡",
                    priority: "Urgent",
                    timeAgo: "4 hours ago"
                },
                {
                    id: "#098",
                    type: "Waste Dump",
                    location: "Market Square, Near Temple",
                    description: "Illegal waste dumping site creating health hazard",
                    votes: 42,
                    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400",
                    category: "Garbage",
                    icon: "🚮",
                    priority: "Urgent",
                    timeAgo: "2 days ago"
                }
            ],
            languages: [
                {code: "en", name: "English", nativeName: "English"},
                {code: "hi", name: "Hindi", nativeName: "हिंदी"},
                {code: "bn", name: "Bengali", nativeName: "বাংলা"},
                {code: "te", name: "Telugu", nativeName: "తెలుగు"},
                {code: "mr", name: "Marathi", nativeName: "मराठी"},
                {code: "ta", name: "Tamil", nativeName: "தமিழ्"},
                {code: "gu", name: "Gujarati", nativeName: "ગુજરાતી"},
                {code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ"},
                {code: "ml", name: "Malayalam", nativeName: "മലയാളം"},
                {code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ"},
                {code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ"},
                {code: "as", name: "Assamese", nativeName: "অসমীয়া"},
                {code: "ur", name: "Urdu", nativeName: "اردو"},
                {code: "sa", name: "Sanskrit", nativeName: "संस्कृत"},
                {code: "sd", name: "Sindhi", nativeName: "सिन्धী"},
                {code: "ne", name: "Nepali", nativeName: "नेपाली"},
                {code: "ks", name: "Kashmiri", nativeName: "کٲشُر"},
                {code: "ko", name: "Konkani", nativeName: "कोंकणी"},
                {code: "mni", name: "Manipuri", nativeName: "মৈতৈলোন্"},
                {code: "brx", name: "Bodo", nativeName: "बर'"},
                {code: "sat", name: "Santhali", nativeName: "ᱥᱟᱱᱛᱟᱲᱤ"},
                {code: "doi", name: "Dogri", nativeName: "डोगरी"}
            ]
        };

        this.translations = {
            en: {
                brandName: "Nagar Mitra",
                language: "Language",
                login: "Login/Signup",
                menu: "Menu",
                notifications: "Notifications/Updates 🔔",
                complaintHistory: "Complaint History",
                helplineNumbers: "Helpline numbers",
                settings: "Settings",
                faqs: "FAQs",
                aboutUs: "About Us ℹ️",
                activeComplaints: "Total Active Complaints",
                resolvedIssues: "Total Resolved Issues",
                issuesInProgress: "Issues in Progress",
                fileComplaint: "File Your Complaint",
                complaintsNearby: "Complaints near you (1km radius)",
                showMoreComplaints: "Show More Complaints",
                areaMap: "Area Map (1.5km radius)",
                contactInfo: "Contact Information",
                officialLinks: "Official Links",
                followUs: "Follow Us",
                privacyPolicy: "Privacy Policy",
                termsOfService: "Terms of Service",
                vote: "Vote",
                votes: "votes"
            },
            hi: {
                brandName: "नगर मित्र",
                language: "भाषा",
                login: "लॉगिन/साइनअप",
                menu: "मेनू",
                notifications: "सूचनाएं/अपडेट 🔔",
                complaintHistory: "शिकायत इतिहास",
                helplineNumbers: "हेल्पलाइन नंबर",
                settings: "सेटिंग्स",
                faqs: "अक्सर पूछे जाने वाले प्रश्न",
                aboutUs: "हमारे बारे में ℹ️",
                activeComplaints: "कुल सक्रिय शिकायतें",
                resolvedIssues: "कुल हल किए गए मुद्दे",
                issuesInProgress: "प्रगति में मुद्दे",
                fileComplaint: "अपनी शिकायत दर्ज करें",
                complaintsNearby: "आपके पास की शिकायतें (1 किमी दायरा)",
                showMoreComplaints: "अधिक शिकायतें दिखाएं",
                areaMap: "क्षेत्र मानचित्र (1.5 किमी दायरा)",
                contactInfo: "संपर्क जानकारी",
                officialLinks: "आधिकारिक लिंक",
                followUs: "हमें फॉलो करें",
                privacyPolicy: "गोपनीयता नीति",
                termsOfService: "सेवा की शर्तें",
                vote: "वोट",
                votes: "वोट"
            }
        };

        this.filteredComplaints = [...this.data.nearbyComplaints];
    }

    async init() {
        console.log('Initializing Nagar Mitra App...');
        
        // Wait a moment for DOM to be fully ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        this.initializeI18n();
        this.showPermissionModal();
        this.setupEventListeners();
        this.startBannerAutoSlide();
        
        // Render initial content
        setTimeout(() => {
            this.renderComplaints();
            this.animateStats();
            this.renderLanguageDropdown();
        }, 200);
    }

    initializeI18n() {
        // Simple i18n without external library
        this.updateContent();
    }

    showPermissionModal() {
        const modal = document.getElementById('permissionModal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    async requestPermissions() {
        try {
            console.log('Requesting permissions...');
            
            // Request Location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.permissions.location = true;
                        this.showNotification('Location access granted', 'success');
                    },
                    (error) => {
                        this.showNotification('Location access denied', 'warning');
                    }
                );
            }

            // Request Camera
            try {
                const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
                this.permissions.camera = true;
                cameraStream.getTracks().forEach(track => track.stop());
                this.showNotification('Camera access granted', 'success');
            } catch (error) {
                this.showNotification('Camera access denied', 'warning');
            }

            // Request Microphone
            try {
                const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
                this.permissions.microphone = true;
                micStream.getTracks().forEach(track => track.stop());
                this.showNotification('Microphone access granted', 'success');
            } catch (error) {
                this.showNotification('Microphone access denied', 'warning');
            }

        } catch (error) {
            console.error('Permission request error:', error);
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Permission modal handlers
        const grantBtn = document.getElementById('grantPermissions');
        const denyBtn = document.getElementById('denyPermissions');
        
        if (grantBtn) {
            grantBtn.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await this.requestPermissions();
                this.hidePermissionModal();
            };
        }

        if (denyBtn) {
            denyBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.hidePermissionModal();
                this.showNotification('Permissions denied. Some features may be limited.', 'info');
            };
        }

        // Hamburger menu
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        if (hamburgerMenu) {
            hamburgerMenu.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Hamburger menu clicked');
                this.toggleSidebar();
            };
        }

        // Sidebar close
        const sidebarClose = document.getElementById('sidebarClose');
        if (sidebarClose) {
            sidebarClose.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeSidebar();
            };
        }

        // Language dropdown
        const languageBtn = document.getElementById('languageBtn');
        if (languageBtn) {
            languageBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Language button clicked');
                this.toggleLanguageDropdown();
            };
        }

        // Banner navigation
        const prevBtn = document.getElementById('prevBanner');
        const nextBtn = document.getElementById('nextBanner');

        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.previousBanner();
            };
        }

        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.nextBanner();
            };
        }

        // Banner indicators
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.goToBanner(index);
            };
        });

        // Search functionality
        const searchInput = document.getElementById('complaintSearch');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            // Make sure search input is enabled
            searchInput.disabled = false;
            searchInput.oninput = (e) => {
                console.log('Search input:', e.target.value);
                this.handleSearch(e.target.value);
            };
        }

        if (searchBtn) {
            searchBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const query = searchInput ? searchInput.value : '';
                console.log('Search button clicked with query:', query);
                this.handleSearch(query);
            };
        }

        // Category filter
        const categoryFilter = document.getElementById('categoryFilter');
        if (categoryFilter) {
            categoryFilter.onchange = (e) => {
                console.log('Category filter changed:', e.target.value);
                this.filterByCategory(e.target.value);
            };
        }

        // File complaint button
        const fileComplaintBtn = document.getElementById('fileComplaintBtn');
        if (fileComplaintBtn) {
            fileComplaintBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('File complaint button clicked');
                this.handleFileComplaint();
            };
        }

        // Load more complaints
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Load more button clicked');
                this.loadMoreComplaints();
            };
        }

        // Login button
        const logoutBtn = document.getElementById('loginBtn');
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showNotification('Login functionality would redirect to authentication page', 'info');
            };
        }

        // Modal close handlers
        this.setupModalHandlers();

        // Navigation menu handlers
        document.querySelectorAll('.nav-link').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const key = link.getAttribute('data-key');
                console.log('Navigation clicked:', key);
                this.handleNavigation(key);
            };
        });

        // Close dropdowns when clicking outside
        document.onclick = (e) => {
            this.handleOutsideClick(e);
        };

        // Language search
        const languageSearch = document.getElementById('languageSearch');
        if (languageSearch) {
            languageSearch.oninput = (e) => {
                this.filterLanguages(e.target.value);
            };
        }

        console.log('Event listeners setup complete');
    }

    setupModalHandlers() {
        const modalClose = document.getElementById('modalClose');
        const modal = document.getElementById('complaintModal');
        
        if (modalClose) {
            modalClose.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.closeModal();
            };
        }

        if (modal) {
            const backdrop = modal.querySelector('.modal__backdrop');
            if (backdrop) {
                backdrop.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeModal();
                };
            }
        }
    }

    hidePermissionModal() {
        const modal = document.getElementById('permissionModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.getElementById('hamburgerMenu');
        
        console.log('Toggling sidebar', sidebar, hamburger);
        
        if (sidebar && hamburger) {
            sidebar.classList.toggle('open');
            hamburger.classList.toggle('open');
            this.toggleSidebarOverlay();
            console.log('Sidebar toggled, open:', sidebar.classList.contains('open'));
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.getElementById('hamburgerMenu');
        
        if (sidebar && hamburger) {
            sidebar.classList.remove('open');
            hamburger.classList.remove('open');
            this.removeSidebarOverlay();
        }
    }

    toggleSidebarOverlay() {
        let overlay = document.querySelector('.sidebar-overlay');
        const sidebar = document.getElementById('sidebar');
        
        if (sidebar && sidebar.classList.contains('open')) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                document.body.appendChild(overlay);
                
                overlay.onclick = () => {
                    this.closeSidebar();
                };
            }
            setTimeout(() => overlay.classList.add('active'), 10);
        } else if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    }

    removeSidebarOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 300);
        }
    }

    toggleLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        console.log('Toggling language dropdown', dropdown);
        if (dropdown) {
            dropdown.classList.toggle('hidden');
            console.log('Language dropdown toggled, hidden:', dropdown.classList.contains('hidden'));
        }
    }

    renderLanguageDropdown() {
        const languageList = document.getElementById('languageList');
        if (!languageList) return;

        languageList.innerHTML = '';

        this.data.languages.forEach(language => {
            const item = document.createElement('div');
            item.className = 'language-item';
            item.innerHTML = `
                <div class="language-name">${language.name}</div>
                <div class="language-native">${language.nativeName}</div>
            `;

            item.onclick = () => {
                this.changeLanguage(language.code);
            };

            languageList.appendChild(item);
        });
    }

    filterLanguages(query) {
        const languageList = document.getElementById('languageList');
        if (!languageList) return;

        const items = languageList.querySelectorAll('.language-item');
        items.forEach(item => {
            const name = item.querySelector('.language-name').textContent.toLowerCase();
            const native = item.querySelector('.language-native').textContent.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            if (name.includes(searchQuery) || native.includes(searchQuery)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    changeLanguage(languageCode) {
        console.log('Changing language to:', languageCode);
        this.currentLanguage = languageCode;
        this.updateContent();
        
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.classList.add('hidden');
        }

        this.showNotification(`Language changed to ${this.data.languages.find(l => l.code === languageCode)?.name}`, 'success');
    }

    updateContent() {
        const translations = this.translations[this.currentLanguage] || this.translations.en;
        
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[key];
            
            if (translation) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
    }

    startBannerAutoSlide() {
        this.bannerInterval = setInterval(() => {
            this.nextBanner();
        }, 5000);
    }

    stopBannerAutoSlide() {
        if (this.bannerInterval) {
            clearInterval(this.bannerInterval);
            this.bannerInterval = null;
        }
    }

    nextBanner() {
        this.currentBannerIndex = (this.currentBannerIndex + 1) % this.data.banners.length;
        this.updateBannerDisplay();
    }

    previousBanner() {
        this.currentBannerIndex = (this.currentBannerIndex - 1 + this.data.banners.length) % this.data.banners.length;
        this.updateBannerDisplay();
    }

    goToBanner(index) {
        this.currentBannerIndex = index;
        this.updateBannerDisplay();
        this.stopBannerAutoSlide();
        
        setTimeout(() => {
            this.startBannerAutoSlide();
        }, 3000);
    }

    updateBannerDisplay() {
        const slides = document.querySelectorAll('.banner-slide');
        const indicators = document.querySelectorAll('.indicator');

        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentBannerIndex);
        });

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentBannerIndex);
        });
    }

    animateStats() {
        console.log('Animating stats...');
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach((element, index) => {
            const targetValue = parseInt(element.dataset.target);
            console.log('Animating stat:', targetValue);
            
            if (isNaN(targetValue)) return;
            
            const duration = 2000;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentValue = Math.floor(targetValue * easeOut);
                
                element.textContent = currentValue.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            setTimeout(() => animate(), index * 200);
        });
    }

    handleSearch(query) {
        console.log('Handling search:', query);
        
        if (!query.trim()) {
            this.filteredComplaints = [...this.data.nearbyComplaints];
        } else {
            this.filteredComplaints = this.data.nearbyComplaints.filter(complaint => 
                complaint.id.toLowerCase().includes(query.toLowerCase()) ||
                complaint.type.toLowerCase().includes(query.toLowerCase()) ||
                complaint.location.toLowerCase().includes(query.toLowerCase()) ||
                complaint.description.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        this.renderComplaints();
        this.showNotification(`Found ${this.filteredComplaints.length} complaint(s)`, 'info');
    }

    filterByCategory(category) {
        console.log('Filtering by category:', category);
        
        if (category === 'All') {
            this.filteredComplaints = [...this.data.nearbyComplaints];
        } else {
            this.filteredComplaints = this.data.nearbyComplaints.filter(complaint => 
                complaint.category === category
            );
        }
        
        this.renderComplaints();
        this.showNotification(`Filtered by ${category}: ${this.filteredComplaints.length} complaint(s)`, 'info');
    }

    renderComplaints() {
        console.log('Rendering complaints...');
        
        const complaintsGrid = document.getElementById('complaintsGrid');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (!complaintsGrid) {
            console.error('Complaints grid not found');
            return;
        }

        complaintsGrid.innerHTML = '';

        const complaintsToShow = this.showingMoreComplaints ? 
            [...this.filteredComplaints, ...this.data.additionalComplaints].slice(0, 8) :
            this.filteredComplaints.slice(0, 5);

        console.log('Showing complaints:', complaintsToShow.length);

        complaintsToShow.forEach(complaint => {
            const card = this.createComplaintCard(complaint);
            complaintsGrid.appendChild(card);
        });

        if (loadMoreBtn) {
            if (!this.showingMoreComplaints && this.filteredComplaints.length >= 5) {
                loadMoreBtn.classList.remove('hidden');
            } else {
                loadMoreBtn.classList.add('hidden');
            }
        }
    }

    createComplaintCard(complaint) {
        const card = document.createElement('div');
        card.className = 'complaint-card';
        
        const isVoted = this.userVotes.has(complaint.id);
        const voteClass = isVoted ? 'voted' : '';
        
        card.innerHTML = `
            <div class="complaint-header">
                <div class="complaint-id">${complaint.id}</div>
            </div>
            <div class="complaint-type">
                <span class="complaint-icon">${complaint.icon}</span>
                <strong>${complaint.type}</strong>
            </div>
            <div class="complaint-location">
                <i class="fas fa-map-marker-alt"></i>
                ${complaint.location}
            </div>
            <div class="complaint-footer">
                <button class="vote-btn ${voteClass}" data-complaint-id="${complaint.id}" ${isVoted ? 'disabled' : ''}>
                    <span>👍</span>
                    <span>${complaint.votes} votes</span>
                </button>
            </div>
        `;

        // Add click handler for complaint details (not on vote button)
        card.onclick = (e) => {
            if (!e.target.closest('.vote-btn')) {
                console.log('Complaint card clicked:', complaint.id);
                this.showComplaintDetails(complaint);
            }
        };

        // Add vote button handler
        const voteBtn = card.querySelector('.vote-btn');
        if (voteBtn) {
            voteBtn.onclick = (e) => {
                e.stopPropagation();
                console.log('Vote button clicked:', complaint.id);
                this.handleVote(complaint.id);
            };
        }

        return card;
    }

    handleVote(complaintId) {
        console.log('Handling vote for:', complaintId);
        
        if (this.userVotes.has(complaintId)) {
            this.showNotification('You have already voted for this complaint', 'warning');
            return;
        }

        const complaint = [...this.data.nearbyComplaints, ...this.data.additionalComplaints]
            .find(c => c.id === complaintId);
            
        if (complaint) {
            complaint.votes++;
            this.userVotes.add(complaintId);
            this.renderComplaints();
            this.showNotification('Thank you for voting! Your vote helps prioritize this issue.', 'success');
        }
    }

    loadMoreComplaints() {
        console.log('Loading more complaints...');
        this.showingMoreComplaints = true;
        this.renderComplaints();
        this.showNotification('Loaded more complaints from your area', 'info');
        
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            const span = loadMoreBtn.querySelector('span');
            if (span) {
                span.textContent = 'All complaints shown';
            }
            loadMoreBtn.disabled = true;
        }
    }

    showComplaintDetails(complaint) {
        console.log('Showing complaint details:', complaint);
        
        const modal = document.getElementById('complaintModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (!modal || !modalTitle || !modalBody) {
            console.error('Modal elements not found');
            return;
        }

        modalTitle.textContent = `${complaint.type} - ${complaint.id}`;
        
        const isVoted = this.userVotes.has(complaint.id);
        const voteButtonContent = isVoted ? 
            '<button class="vote-btn voted" disabled><span>👍</span><span>Already Voted</span></button>' :
            `<button class="vote-btn" id="modalVoteBtn" data-complaint-id="${complaint.id}"><span>👍</span><span>Vote (${complaint.votes})</span></button>`;

        modalBody.innerHTML = `
            <img src="${complaint.image}" alt="${complaint.type}" class="modal-complaint-image" onerror="this.style.display='none'">
            <div class="modal-complaint-location">
                <i class="fas fa-map-marker-alt"></i>
                <strong>Location:</strong> ${complaint.location}
            </div>
            <div style="margin-bottom: 16px;">
                <strong>Description:</strong>
                <p style="margin-top: 8px; color: var(--color-text);">${complaint.description}</p>
            </div>
            <div style="margin-bottom: 16px;">
                <strong>Priority:</strong> <span class="status status--${complaint.priority.toLowerCase()}">${complaint.priority}</span>
            </div>
            <div style="margin-bottom: 16px;">
                <strong>Reported:</strong> ${complaint.timeAgo}
            </div>
            <div class="modal-vote-section">
                ${voteButtonContent}
            </div>
        `;

        // Add vote handler for modal button
        const modalVoteBtn = modalBody.querySelector('#modalVoteBtn');
        if (modalVoteBtn) {
            modalVoteBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleVote(complaint.id);
                this.closeModal();
            };
        }

        modal.classList.remove('hidden');
        console.log('Modal shown');
    }

    closeModal() {
        const modal = document.getElementById('complaintModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    handleFileComplaint() {
        if (!this.permissions.location) {
            this.showNotification('Location permission required to file complaints. Please refresh and grant permissions.', 'warning');
            return;
        }
        
        this.showNotification('File Complaint feature would open the complaint filing form with camera and location access', 'info');
    }

    handleNavigation(key) {
        const actions = {
            notifications: () => this.showNotification('Notifications: 3 new updates available', 'info'),
            history: () => this.showNotification('Complaint History: You have filed 5 complaints', 'info'),
            helpline: () => this.showNotification('Emergency: 100, Civic Issues: 1950, Support: 1800-xxx-xxxx', 'info'),
            settings: () => this.showNotification('Settings panel would open here', 'info'),
            faqs: () => this.showNotification('Frequently Asked Questions would be displayed', 'info'),
            about: () => this.showNotification('About Nagar Mitra: Digital platform for civic engagement', 'info')
        };

        if (actions[key]) {
            actions[key]();
        }
        
        this.closeSidebar();
    }

    handleOutsideClick(e) {
        // Close language dropdown if clicked outside
        const languageDropdown = document.getElementById('languageDropdown');
        const languageBtn = document.getElementById('languageBtn');
        
        if (languageDropdown && !languageDropdown.classList.contains('hidden') && 
            !languageDropdown.contains(e.target) && !languageBtn.contains(e.target)) {
            languageDropdown.classList.add('hidden');
        }

        // Close sidebar if clicked outside on mobile
        const sidebar = document.getElementById('sidebar');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        
        if (sidebar && sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && !hamburgerMenu.contains(e.target)) {
            this.closeSidebar();
        }
    }

    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.toast-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `toast-notification toast-notification--${type}`;
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        this.addNotificationStyles();
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('toast-notification--show');
        }, 100);

        setTimeout(() => {
            this.removeNotification(notification);
        }, 4000);

        const closeBtn = notification.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                this.removeNotification(notification);
            };
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
        if (!notification.parentNode) return;
        
        notification.classList.remove('toast-notification--show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }

    addNotificationStyles() {
        if (document.querySelector('#toast-styles')) return;

        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-notification {
                position: fixed;
                top: 90px;
                right: 20px;
                background: var(--color-surface);
                border: 1px solid var(--color-border);
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-lg);
                padding: var(--space-16);
                max-width: 400px;
                z-index: 1010;
                transform: translateX(100%);
                transition: transform var(--duration-normal) var(--ease-standard);
                display: flex;
                align-items: flex-start;
                gap: var(--space-12);
            }
            
            .toast-notification--show {
                transform: translateX(0);
            }
            
            .toast-content {
                display: flex;
                align-items: flex-start;
                gap: var(--space-8);
                flex: 1;
            }
            
            .toast-content i {
                margin-top: 2px;
                font-size: var(--font-size-base);
            }
            
            .toast-message {
                color: var(--color-text);
                font-size: var(--font-size-sm);
                line-height: var(--line-height-normal);
            }
            
            .toast-close {
                background: none;
                border: none;
                color: var(--color-text-secondary);
                cursor: pointer;
                padding: var(--space-4);
                border-radius: var(--radius-sm);
                transition: all var(--duration-fast) var(--ease-standard);
            }
            
            .toast-close:hover {
                background: var(--color-secondary);
                color: var(--color-text);
            }
            
            .toast-notification--success { border-left: 4px solid var(--color-success); }
            .toast-notification--error { border-left: 4px solid var(--color-error); }
            .toast-notification--warning { border-left: 4px solid var(--color-warning); }
            .toast-notification--info { border-left: 4px solid var(--color-primary); }
            
            .toast-notification--success .toast-content i { color: var(--color-success); }
            .toast-notification--error .toast-content i { color: var(--color-error); }
            .toast-notification--warning .toast-content i { color: var(--color-warning); }
            .toast-notification--info .toast-content i { color: var(--color-primary); }
            
            @media (max-width: 480px) {
                .toast-notification {
                    right: 10px;
                    left: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded, initializing app...');
    
    const app = new NagarMitraApp();
    app.init();
    
    // Make app available globally for debugging
    window.nagarMitraApp = app;
    
    setTimeout(() => {
        app.showNotification('Welcome to Nagar Mitra! Help improve your community by reporting civic issues. 🏛️', 'success');
    }, 2000);
});