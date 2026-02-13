// complaint.js

// --- CONFIGURATION ---
// IMPORTANT: Fill this with the details from your NEW Firebase project (the one in asia-south1).
const firebaseConfig = {
  apiKey: "AIzaSyBEJOP9E6Cvy55ZRrXcKrAysBraarOQOVU",
  authDomain: "crowd-sourced-civic-issu-d615e.firebaseapp.com",
  projectId: "crowd-sourced-civic-issu-d615e",
  storageBucket: "crowd-sourced-civic-issu-d615e.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "787152121870",
  appId: "1:787152121870:web:268cb84dc4520acf6d8c5f"
};

// --- INITIALIZATION ---
firebase.initializeApp(firebaseConfig);
// We only need Firestore, so we don't initialize Storage.
const db = firebase.firestore();

// --- APPLICATION CLASS ---
class NagarMitraComplaint {
    constructor() {
        // These properties will manage the state of the UI
        this.mediaFiles = []; // Stores the selected file objects for preview
        this.audioBlob = null; // Stores the recorded audio blob for preview
        this.currentLocation = null;
        this.mediaRecorder = null;
        this.cameraStream = null;
        this.isRecording = false;
        
        this.init();
    }

    init() {
        console.log('Nagar Mitra Complaint App Initializing...');
        this.setupEventListeners();
        this.updateCounters();
        setTimeout(() => this.requestLocationPermission(), 800);
    }

    // =================================================================
    // SETUP AND EVENT LISTENERS (Restored from your original file)
    // =================================================================

    requestLocationPermission() {
        const modal = document.getElementById('locationModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            const grantBtn = document.getElementById('grantLocationBtn');
            if (grantBtn) setTimeout(() => grantBtn.focus(), 100);
        }
    }

    setupEventListeners() {
        // Main form submission
        const complaintForm = document.getElementById('complaintForm');
        if (complaintForm) complaintForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitComplaint();
        });

        // UI controls
        const grantLocationBtn = document.getElementById('grantLocationBtn');
        if (grantLocationBtn) grantLocationBtn.addEventListener('click', () => this.handleLocationPermission());

        this.setupMediaButtons();
        this.setupAudioControls();
        this.setupCameraModal();

        const closeSuccessModal = document.getElementById('closeSuccessModal');
        if (closeSuccessModal) closeSuccessModal.addEventListener('click', () => {
            this.closeModal('successModal');
            this.resetForm();
        });
        
        // Add other minor listeners if needed (sidebar, etc.)
    }
    
    setupMediaButtons() {
        document.getElementById('mediaPickerBtn')?.addEventListener('click', () => this.openMediaPicker());
        document.getElementById('takePhotoBtn')?.addEventListener('click', () => this.takePhoto());
        document.getElementById('makeVideoBtn')?.addEventListener('click', () => this.makeVideo());
        document.getElementById('mediaFileInput')?.addEventListener('change', (e) => this.handleMediaFiles(e.target.files));
    }

    setupAudioControls() {
        document.getElementById('recordAudioBtn')?.addEventListener('click', () => this.startAudioRecording());
        document.getElementById('stopRecordingBtn')?.addEventListener('click', () => this.stopAudioRecording());
        document.getElementById('removeAudioBtn')?.addEventListener('click', () => this.removeAudio());
    }

    setupCameraModal() {
        document.getElementById('closeCameraModal')?.addEventListener('click', () => this.closeCameraModal());
        document.getElementById('cancelCameraBtn')?.addEventListener('click', () => this.closeCameraModal());
        document.getElementById('captureBtn')?.addEventListener('click', () => this.captureMedia());
    }

    // =================================================================
    // CORE FUNCTIONALITY (Restored from your original file)
    // =================================================================

    async handleLocationPermission() {
        const grantBtn = document.getElementById('grantLocationBtn');
        if (grantBtn) {
            grantBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
            grantBtn.disabled = true;
        }
        try {
            if (!navigator.geolocation) throw new Error('Geolocation not supported');
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000, enableHighAccuracy: true });
            });
            this.currentLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            this.displayLocation();
            this.closeModal('locationModal');
        } catch (error) {
            console.error("Location Error:", error);
            if (grantBtn) {
                grantBtn.innerHTML = 'Grant Permission';
                grantBtn.disabled = false;
            }
            alert("Could not get location. Please enable location services and try again.");
        }
    }

    displayLocation() {
        document.querySelector('.location-loading')?.classList.add('hidden');
        const locationDisplay = document.getElementById('locationDisplay');
        if (locationDisplay) locationDisplay.classList.remove('hidden');
        const locationCoords = document.getElementById('locationCoords');
        if (locationCoords) locationCoords.textContent = `${this.currentLocation.latitude.toFixed(5)}, ${this.currentLocation.longitude.toFixed(5)}`;
    }

    openMediaPicker() {
        document.getElementById('mediaFileInput')?.click();
    }

    async takePhoto() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
            this.openCameraModal('photo', stream);
        } catch (err) { alert('Could not access camera. Please grant permission.'); }
    }

    async makeVideo() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: true });
            this.openCameraModal('video', stream);
        } catch (err) { alert('Could not access camera/microphone. Please grant permissions.'); }
    }

    openCameraModal(type, stream) {
        this.cameraStream = stream;
        const modal = document.getElementById('cameraModal');
        const videoEl = document.getElementById('cameraVideo');
        if(videoEl) videoEl.srcObject = stream;
        if(modal) modal.classList.remove('hidden');
        
        document.getElementById('cameraModalTitle').textContent = type === 'photo' ? 'Take Photo' : 'Record Video';
        document.getElementById('captureBtnText').textContent = type === 'photo' ? 'Take Photo' : 'Start Recording';
        modal.dataset.type = type;
    }

    captureMedia() {
        const type = document.getElementById('cameraModal').dataset.type;
        if (type === 'photo') {
            this.capturePhoto();
        } else if (type === 'video') {
            if (!this.isRecording) this.startVideoRecording();
            else this.stopVideoRecording();
        }
    }

    capturePhoto() {
        const video = document.getElementById('cameraVideo');
        const canvas = document.getElementById('cameraCanvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        canvas.toBlob(blob => {
            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            this.addMediaFile(file);
            this.closeCameraModal();
        }, 'image/jpeg');
    }

    startVideoRecording() {
        if (!this.cameraStream) return;
        this.isRecording = true;
        document.getElementById('captureBtnText').textContent = 'Stop Recording';
        this.mediaRecorder = new MediaRecorder(this.cameraStream);
        const chunks = [];
        this.mediaRecorder.ondataavailable = e => chunks.push(e.data);
        this.mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const file = new File([blob], `video_${Date.now()}.webm`, { type: 'video/webm' });
            this.addMediaFile(file);
            this.closeCameraModal();
        };
        this.mediaRecorder.start();
    }

    stopVideoRecording() {
        if (this.mediaRecorder) this.mediaRecorder.stop();
        this.isRecording = false;
    }
    
    closeCameraModal() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
        document.getElementById('cameraModal')?.classList.add('hidden');
    }
    
    handleMediaFiles(files) {
        Array.from(files).forEach(file => this.addMediaFile(file));
    }

    addMediaFile(file) {
        this.mediaFiles.push(file);
        this.updateMediaPreview();
        // If a video is added, disable the audio recording section
        if(file.type.startsWith('video/')) {
            this.disableAudioSection(true);
        }
    }
    
    updateMediaPreview() {
        const mediaGrid = document.getElementById('mediaGrid');
        const mediaPreview = document.getElementById('mediaPreview');
        if (!mediaGrid || !mediaPreview) return;

        mediaPreview.classList.toggle('hidden', this.mediaFiles.length === 0);
        mediaGrid.innerHTML = '';
        this.mediaFiles.forEach((file, index) => {
            const url = URL.createObjectURL(file);
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-item';
            mediaItem.innerHTML = `
                ${file.type.startsWith('video/') ? `<video src="${url}" muted></video>` : `<img src="${url}">`}
                <button class="media-item__remove" data-index="${index}"><i class="fas fa-times"></i></button>
            `;
            mediaItem.querySelector('.media-item__remove').addEventListener('click', (e) => {
                e.preventDefault();
                this.removeMediaFile(index);
            });
            mediaGrid.appendChild(mediaItem);
        });
    }

    removeMediaFile(index) {
        const removedFile = this.mediaFiles.splice(index, 1)[0];
        this.updateMediaPreview();
        // If the removed file was a video, check if any other videos remain
        if(removedFile.type.startsWith('video/')) {
            const hasVideo = this.mediaFiles.some(f => f.type.startsWith('video/'));
            if(!hasVideo) this.disableAudioSection(false);
        }
    }

    async startAudioRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            document.getElementById('recordAudioBtn').classList.add('hidden');
            document.getElementById('audioRecorder').classList.remove('hidden');
            this.mediaRecorder = new MediaRecorder(stream);
            const chunks = [];
            this.mediaRecorder.ondataavailable = e => chunks.push(e.data);
            this.mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
                this.audioBlob = new Blob(chunks, { type: 'audio/webm' });
                this.displayAudioPreview();
            };
            this.mediaRecorder.start();
        } catch (err) {
            alert('Could not access microphone. Please grant permission.');
        }
    }

    stopAudioRecording() {
        if (this.mediaRecorder) this.mediaRecorder.stop();
        document.getElementById('recordAudioBtn').classList.remove('hidden');
        document.getElementById('audioRecorder').classList.add('hidden');
    }

    displayAudioPreview() {
        if (!this.audioBlob) return;
        const url = URL.createObjectURL(this.audioBlob);
        document.getElementById('audioPreview').classList.remove('hidden');
        document.getElementById('audioPlayback').src = url;
    }
    
    removeAudio() {
        this.audioBlob = null;
        document.getElementById('audioPreview').classList.add('hidden');
        document.getElementById('audioPlayback').src = '';
    }
    
    disableAudioSection(shouldDisable) {
        const audioSection = document.getElementById('audioSection');
        if(audioSection) audioSection.classList.toggle('audio-section-disabled', shouldDisable);
    }

    // =================================================================
    //  MODIFIED SUBMISSION LOGIC
    // =================================================================
    async submitComplaint() {
        const submitBtn = document.getElementById('submitComplaintBtn');
        if (!this.currentLocation) {
            alert('Location is required. Please grant permission first.');
            return;
        }

        // We check for media files just for the UI, but won't upload them.
        if (this.mediaFiles.length === 0 && !this.audioBlob) {
            alert('Please add at least one photo, video, or audio recording.');
            return;
        }

        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }

        // --- Create Dummy Media Data ---
        // We create a list of filenames to show what the user intended to upload.
        const mediaInfo = this.mediaFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size
        }));

        if (this.audioBlob) {
            mediaInfo.push({
                name: `audio_${Date.now()}.webm`,
                type: this.audioBlob.type,
                size: this.audioBlob.size
            });
        }
        
        const formData = this.collectFormData();
        const trackingId = this.generateTrackingId();
        
        // --- This is the ONLY data that gets sent to Firebase ---
        const complaintData = {
            trackingId: trackingId,
            description: formData.description,
            landmark: formData.landmark,
            location: new firebase.firestore.GeoPoint(this.currentLocation.latitude, this.currentLocation.longitude),
            mediaInfo: mediaInfo, // A list of media files, NOT the files themselves
            status: 'submitted',
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            // --- The only Firebase operation is to save the text data ---
            await db.collection("complaints").doc(trackingId).set(complaintData);
            
            console.log('Complaint TEXT data saved to Firestore successfully.');
            this.showSuccessModal(trackingId);

        } catch (error) {
            console.error('Firestore submission error:', error);
            alert('Submission failed. Could not connect to the database.');
        } finally {
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        }
    }

    collectFormData() {
        return {
            description: document.getElementById('problemDescription')?.value || '',
            landmark: document.getElementById('landmark')?.value || ''
        };
    }

    generateTrackingId() {
        return `CMP-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`;
    }

    showSuccessModal(trackingId) {
        document.getElementById('trackingId').textContent = trackingId;
        document.getElementById('successModal')?.classList.remove('hidden');
    }

    resetForm() {
        this.mediaFiles = [];
        this.audioBlob = null;
        this.currentLocation = null;
        document.getElementById('complaintForm')?.reset();
        this.updateMediaPreview();
        this.removeAudio();
        document.querySelector('.location-loading')?.classList.remove('hidden');
        document.getElementById('locationDisplay')?.classList.add('hidden');
        this.requestLocationPermission();
    }
    
    closeModal(id) {
        const modal = document.getElementById(id);
        if(modal) modal.classList.add('hidden');
        document.body.style.overflow = ''; // <-- ADD THIS LINE
    }
    
    // Placeholder for any other functions from the original file
    updateCounters() {}
}

// Initialize the application when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    new NagarMitraComplaint();
});