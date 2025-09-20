// Main JavaScript for TravelEase Pro
class TravelEasePro {
    constructor() {
        this.currentSearchType = 'flights';
        this.selectedItem = null;
        this.currentResults = [];
        this.currentFilter = 'all';
        
        this.initializeApp();
    }

    initializeApp() {
        this.createFloatingShapes();
        this.initializeEventListeners();
        this.initializeDateFields();
        this.updateFormLabels();
        this.showWelcomeAnimation();
    }

    // Create animated floating shapes
    createFloatingShapes() {
        const shapesContainer = document.getElementById('floatingShapes');
        const shapeCount = 15;
        
        for (let i = 0; i < shapeCount; i++) {
            const shape = document.createElement('div');
            shape.className = 'shape';
            
            // Random properties
            const size = Math.random() * 60 + 20;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 10 + 15;
            const delay = Math.random() * 5;
            
            shape.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                animation-duration: ${animationDuration}s;
                animation-delay: ${delay}s;
                opacity: ${Math.random() * 0.3 + 0.1};
            `;
            
            shapesContainer.appendChild(shape);
        }
    }

    // Welcome animation
    showWelcomeAnimation() {
        const header = document.querySelector('header');
        header.style.transform = 'translateY(-50px)';
        header.style.opacity = '0';
        
        setTimeout(() => {
            header.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
        }, 300);
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.type);
            });
        });

        // Search form submission
        document.getElementById('searchForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.applyFilter(e.target.dataset.filter);
            });
        });

        // Booking form submission
        document.getElementById('bookingForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processBooking();
        });

        // Modal close events
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });

        // Input animations
        document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.closest('.form-group').style.transform = 'translateY(-2px)';
            });
            
            input.addEventListener('blur', (e) => {
                e.target.closest('.form-group').style.transform = 'translateY(0)';
            });
        });
    }

    // Tab switching functionality
    switchTab(type) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        this.currentSearchType = type;
        this.updateFormLabels();
        this.hideResults();
        
        // Add switching animation
        const searchSection = document.querySelector('.search-section');
        searchSection.style.transform = 'scale(0.98)';
        setTimeout(() => {
            searchSection.style.transform = 'scale(1)';
        }, 150);
    }

    // Update form labels based on selected tab
    updateFormLabels() {
        const labels = {
            flights: {
                from: 'From City',
                to: 'To City', 
                checkin: 'Departure Date',
                checkout: 'Return Date',
                guests: 'Passengers'
            },
            hotels: {
                from: 'Current Location',
                to: 'Hotel Destination',
                checkin: 'Check-in Date',
                checkout: 'Check-out Date',
                guests: 'Guests & Rooms'
            },
            packages: {
                from: 'Starting City',
                to: 'Tour Destination',
                checkin: 'Start Date',
                checkout: 'End Date',
                guests: 'Travelers'
            }
        };

        const currentLabels = labels[this.currentSearchType];
        Object.keys(currentLabels).forEach(key => {
            const label = document.querySelector(`label[for="${key}"]`);
            if (label) {
                label.textContent = currentLabels[key];
            }
        });
    }

    // Initialize date fields with default values
    initializeDateFields() {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        
        document.getElementById('checkin').value = today.toISOString().split('T')[0];
        document.getElementById('checkout').value = tomorrow.toISOString().split('T')[0];
        
        // Set minimum date to today
        document.getElementById('checkin').min = today.toISOString().split('T')[0];
        document.getElementById('checkout').min = today.toISOString().split('T')[0];
    }

    // Perform search with animations
    performSearch() {
        const searchBtn = document.querySelector('.search-btn');
        const originalText = searchBtn.textContent;
        
        // Show loading state
        searchBtn.innerHTML = '<span class="loading-spinner"></span> Searching...';
        searchBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(document.getElementById('searchForm'));
        const searchData = {
            type: this.currentSearchType,
            from: formData.get('from'),
            to: formData.get('to'),
            checkin: formData.get('checkin'),
            checkout: formData.get('checkout'),
            guests: formData.get('guests')
        };

        // Save search to database
        travelDB.saveSearchHistory(searchData);

        // Simulate API delay for realistic feel
        setTimeout(() => {
            this.showResults();
            
            // Reset button
            searchBtn.textContent = originalText;
            searchBtn.disabled = false;
        }, 1500);
    }

    // Show search results with animations
    showResults() {
        const resultsSection = document.getElementById('resultsSection');
        const resultsContainer = document.getElementById('resultsContainer');
        const resultsCount = document.getElementById('resultsCount');
        
        // Get data for current search type
        this.currentResults = mockData[this.currentSearchType] || [];
        
        // Update results count
        resultsCount.textContent = `Found ${this.currentResults.length} amazing ${this.currentSearchType}`;
        
        // Clear previous results
        resultsContainer.innerHTML = '';
        
        // Show results section with animation
        resultsSection.style.display = 'block';
        resultsSection.style.opacity = '0';
        resultsSection.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            resultsSection.style.transition = 'all 0.6s ease';
            resultsSection.style.opacity = '1';
            resultsSection.style.transform = 'translateY(0)';
        }, 100);

        // Render results
        this.renderResults(this.currentResults);
        
        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    // Render results based on type
    renderResults(results) {
        const resultsContainer = document.getElementById('resultsContainer');
        
        results.forEach((item, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';
            resultDiv.style.animationDelay = `${index * 0.1}s`;
            
            let detailsHTML = this.generateDetailsHTML(item);
            let reviewsHTML = this.generateReviewsHTML(item.reviews);
            
            resultDiv.innerHTML = `
                <div class="result-header">
                    <div class="result-title">
                        <div class="result-icon">${this.getServiceIcon(this.currentSearchType)}</div>
                        <div>${item.title}</div>
                    </div>
                    <div class="result-price">${item.price}</div>
                </div>
                <div class="result-details">
                    ${detailsHTML}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                    <button class="book-btn" onclick="travelApp.openBookingModal('${item.id}')">
                        🚀 Book Now
                    </button>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="stars">${this.generateStars(item.rating || item.starRating || 4)}</span>
                        <span style="color: #7f8c8d;">(${item.reviews.length} reviews)</span>
                    </div>
                </div>
                <div class="reviews-section">
                    <div class="reviews-header">
                        <h4 class="reviews-title">✨ Customer Reviews</h4>
                        <div class="overall-rating">
                            <span class="rating-value">${(item.rating || item.starRating || 4).toFixed(1)}</span>
                            <span class="stars">${this.generateStars(item.rating || item.starRating || 4)}</span>
                        </div>
                    </div>
                    ${reviewsHTML}
                </div>
            `;
            
            resultsContainer.appendChild(resultDiv);
            
            // Add stagger animation
            setTimeout(() => {
                resultDiv.style.opacity = '1';
                resultDiv.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Generate details HTML based on service type
    generateDetailsHTML(item) {
        if (this.currentSearchType === 'flights') {
            return `
                <div class="detail-item">
                    <div class="detail-label">Duration</div>
                    <div class="detail-value">${item.duration}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Departure</div>
                    <div class="detail-value">${item.departure}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Arrival</div>
                    <div class="detail-value">${item.arrival}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Aircraft</div>
                    <div class="detail-value">${item.aircraft}</div>
                </div>
            `;
        } else if (this.currentSearchType === 'hotels') {
            return `
                <div class="detail-item">
                    <div class="detail-label">Rating</div>
                    <div class="detail-value">${item.rating}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Room Type</div>
                    <div class="detail-value">${item.roomType}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${item.location}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Check-in</div>
                    <div class="detail-value">${item.checkIn}</div>
                </div>
            `;
        } else {
            return `
                <div class="detail-item">
                    <div class="detail-label">Duration</div>
                    <div class="detail-value">${item.duration}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Destinations</div>
                    <div class="detail-value">${item.destinations}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Group Size</div>
                    <div class="detail-value">${item.groupSize}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Difficulty</div>
                    <div class="detail-value">${item.difficulty}</div>
                </div>
            `;
        }
    }

    // Generate reviews HTML
    generateReviewsHTML(reviews) {
        return reviews.map(review => `
            <div class="review">
                <div class="review-header">
                    <div class="reviewer-name">
                        ${review.name} ${review.verified ? '✅' : ''}
                    </div>
                    <div class="stars">${this.generateStars(review.rating)}</div>
                </div>
                <div class="review-text">${review.comment}</div>
            </div>
        `).join('');
    }

    // Generate star ratings
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return '★'.repeat(fullStars) + 
               (hasHalfStar ? '☆' : '') + 
               '☆'.repeat(emptyStars);
    }

    // Get service icon
    getServiceIcon(type) {
        const icons = {
            flights: '✈️',
            hotels: '🏨',
            packages: '📦'
        };
        return icons[type] || '🎯';
    }

    // Apply filters
    applyFilter(filterType) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filterType}"]`).classList.add('active');
        
        this.currentFilter = filterType;
        
        let filteredResults = [...this.currentResults];
        
        // Apply sorting
        if (filterType !== 'all') {
            filteredResults = sortResults(filteredResults, filterType);
        }
        
        // Re-render results with animation
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.style.opacity = '0.5';
        resultsContainer.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            resultsContainer.innerHTML = '';
            this.renderResults(filteredResults);
            
            resultsContainer.style.transition = 'all 0.3s ease';
            resultsContainer.style.opacity = '1';
            resultsContainer.style.transform = 'scale(1)';
        }, 200);
    }

    // Open booking modal
    openBookingModal(itemId) {
        const modal = document.getElementById('bookingModal');
        const item = this.currentResults.find(item => item.id === itemId);
        
        if (!item) return;
        
        this.selectedItem = item;
        
        // Generate booking details
        document.getElementById('bookingDetails').innerHTML = `
            <div style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                <h3 style="color: #2c3e50; margin-bottom: 15px;">${item.title}</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div><strong>Service:</strong> ${this.currentSearchType.charAt(0).toUpperCase() + this.currentSearchType.slice(1)}</div>
                    <div><strong>Price:</strong> ${item.price}</div>
                    <div><strong>Booking ID:</strong> ${itemId}-${Date.now().toString().slice(-6)}</div>
                    <div><strong>Total Amount:</strong> <span style="color: #27ae60; font-size: 1.2em;">${item.price}</span></div>
                </div>
            </div>
        `;
        
        // Show modal with animation
        modal.style.display = 'block';
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.transition = 'opacity 0.3s ease';
            modal.style.opacity = '1';
        }, 10);
    }

    // Process booking
    processBooking() {
        const bookingBtn = document.querySelector('#bookingForm button');
        const originalText = bookingBtn.textContent;
        
        // Show processing state
        bookingBtn.innerHTML = '<span class="loading-spinner"></span> Processing Payment...';
        bookingBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(document.getElementById('bookingForm'));
        
        // Prepare booking data
        const bookingData = {
            serviceType: this.currentSearchType,
            serviceTitle: this.selectedItem.title,
            price: this.selectedItem.price,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            specialRequests: formData.get('specialRequests'),
            from: document.getElementById('from').value,
            to: document.getElementById('to').value,
            checkin: document.getElementById('checkin').value,
            checkout: document.getElementById('checkout').value,
            guests: document.getElementById('guests').value
        };
        
        // Simulate payment processing
        setTimeout(() => {
            // Save to database
            const booking = travelDB.saveBooking(bookingData);
            travelDB.saveUser(bookingData);
            
            // Show confirmation
            this.showBookingConfirmation(booking);
            
            // Reset button
            bookingBtn.textContent = originalText;
            bookingBtn.disabled = false;
            
            // Close booking modal
            this.closeModal(document.getElementById('bookingModal'));
        }, 2500);
    }

    // Show booking confirmation
    showBookingConfirmation(booking) {
        const confirmationModal = document.getElementById('confirmationModal');
        
        // Update booking ID
        document.getElementById('bookingIdDisplay').textContent = booking.id;
        
        // Generate confirmation details
        document.getElementById('confirmationDetails').innerHTML = `
            <p style="font-size: 1.1rem; margin: 20px 0;">
                Thank you, <strong>${booking.firstName} ${booking.lastName}</strong>!<br>
                Your ${booking.serviceType} booking is confirmed.
            </p>
            <div style="background: rgba(255,255,255,0.3); padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p><strong>📧 Confirmation sent to:</strong> ${booking.email}</p>
                <p><strong>📱 SMS sent to:</strong> ${booking.phone}</p>
            </div>
        `;
        
        // Generate itinerary
        document.getElementById('itinerary').innerHTML = this.generateItinerary(booking);
        
        // Show modal with animation
        confirmationModal.style.display = 'block';
        confirmationModal.style.opacity = '0';
        setTimeout(() => {
            confirmationModal.style.transition = 'opacity 0.3s ease';
            confirmationModal.style.opacity = '1';
        }, 10);
        
        // Show success notification
        travelDB.showNotification('🎉 Booking confirmed successfully!', 'success');
    }

    // Generate itinerary based on booking type
    generateItinerary(booking) {
        let itineraryHTML = '';
        
        if (booking.serviceType === 'flights') {
            itineraryHTML = `
                <div style="background: white; padding: 25px; border-radius: 15px; margin-top: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">✈️ Flight Itinerary</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div><strong>Flight:</strong><br>${booking.serviceTitle}</div>
                        <div><strong>Route:</strong><br>${booking.from} → ${booking.to}</div>
                        <div><strong>Departure:</strong><br>${booking.checkin}</div>
                        <div><strong>Passenger:</strong><br>${booking.firstName} ${booking.lastName}</div>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 10px;">
                        <p><strong>💡 Travel Tips:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Arrive 2 hours before domestic flights</li>
                            <li>Carry valid ID proof</li>
                            <li>Check baggage allowance</li>
                        </ul>
                    </div>
                </div>
            `;
        } else if (booking.serviceType === 'hotels') {
            itineraryHTML = `
                <div style="background: white; padding: 25px; border-radius: 15px; margin-top: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">🏨 Hotel Reservation</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div><strong>Hotel:</strong><br>${booking.serviceTitle}</div>
                        <div><strong>Location:</strong><br>${booking.to}</div>
                        <div><strong>Check-in:</strong><br>${booking.checkin}</div>
                        <div><strong>Check-out:</strong><br>${booking.checkout}</div>
                        <div><strong>Guests:</strong><br>${booking.guests}</div>
                        <div><strong>Guest Name:</strong><br>${booking.firstName} ${booking.lastName}</div>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 10px;">
                        <p><strong>💡 Hotel Tips:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Carry booking confirmation</li>
                            <li>Valid ID required at check-in</li>
                            <li>Early check-in subject to availability</li>
                        </ul>
                    </div>
                </div>
            `;
        } else {
            itineraryHTML = `
                <div style="background: white; padding: 25px; border-radius: 15px; margin-top: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
                    <h3 style="color: #2c3e50; margin-bottom: 20px;">📦 Tour Package Details</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div><strong>Package:</strong><br>${booking.serviceTitle}</div>
                        <div><strong>Start Date:</strong><br>${booking.checkin}</div>
                        <div><strong>End Date:</strong><br>${booking.checkout}</div>
                        <div><strong>Travelers:</strong><br>${booking.guests}</div>
                        <div><strong>Lead Traveler:</strong><br>${booking.firstName} ${booking.lastName}</div>
                    </div>
                    <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 10px;">
                        <p><strong>💡 Package Includes:</strong></p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Accommodation & meals</li>
                            <li>Transportation</li>
                            <li>Professional guide</li>
                            <li>All entrance fees</li>
                        </ul>
                    </div>
                </div>
            `;
        }
        
        return itineraryHTML;
    }

    // Close modal with animation
    closeModal(modal) {
        modal.style.transition = 'opacity 0.3s ease';
        modal.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.style.transition = '';
            modal.style.opacity = '';
        }, 300);
    }

    // Hide results section
    hideResults() {
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'none';
    }

    // Advanced search with filters
    performAdvancedSearch(filters) {
        let results = mockData[this.currentSearchType] || [];
        
        // Apply filters
        results = filterResults(results, filters);
        
        // Update results
        this.currentResults = results;
        this.renderResults(results);
        
        // Update count
        document.getElementById('resultsCount').textContent = 
            `Found ${results.length} ${this.currentSearchType} matching your filters`;
    }

    // Add search suggestions
    addSearchSuggestions() {
        const inputs = ['from', 'to'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            const suggestions = document.createElement('div');
            suggestions.className = 'search-suggestions';
            suggestions.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                z-index: 100;
                max-height: 200px;
                overflow-y: auto;
                display: none;
            `;
            
            input.parentElement.style.position = 'relative';
            input.parentElement.appendChild(suggestions);
            
            input.addEventListener('input', (e) => {
                const query = e.target.value;
                if (query.length < 2) {
                    suggestions.style.display = 'none';
                    return;
                }
                
                const matches = getSearchSuggestions(query, this.currentSearchType);
                if (matches.length > 0) {
                    suggestions.innerHTML = matches.map(match => `
                        <div style="padding: 10px 15px; cursor: pointer; border-bottom: 1px solid #eee;" 
                             onmouseover="this.style.background='#f8f9fa'" 
                             onmouseout="this.style.background='white'"
                             onclick="document.getElementById('${inputId}').value='${match}'; this.parentElement.style.display='none';">
                            ${match}
                        </div>
                    `).join('');
                    suggestions.style.display = 'block';
                } else {
                    suggestions.style.display = 'none';
                }
            });
            
            // Hide suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!input.parentElement.contains(e.target)) {
                    suggestions.style.display = 'none';
                }
            });
        });
    }

    // Add keyboard shortcuts
    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to search
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === 'block') {
                        this.closeModal(modal);
                    }
                });
            }
            
            // Tab switching with Alt + number
            if (e.altKey && ['1', '2', '3'].includes(e.key)) {
                e.preventDefault();
                const types = ['flights', 'hotels', 'packages'];
                this.switchTab(types[parseInt(e.key) - 1]);
            }
        });
    }

    // Add scroll animations
    addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                }
            });
        }, observerOptions);
        
        // Observe result items
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                document.querySelectorAll('.result-item').forEach(item => {
                    observer.observe(item);
                });
            }, 1000);
        });
    }

    // Performance monitoring
    monitorPerformance() {
        // Monitor search performance
        const originalPerformSearch = this.performSearch.bind(this);
        this.performSearch = function() {
            const startTime = performance.now();
            const result = originalPerformSearch();
            const endTime = performance.now();
            console.log(`Search took ${endTime - startTime} milliseconds`);
            return result;
        };
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.travelApp = new TravelEasePro();
    
    // Add additional features
    travelApp.addSearchSuggestions();
    travelApp.addKeyboardShortcuts();
    travelApp.addScrollAnimations();
    travelApp.monitorPerformance();
    
    console.log('🚀 TravelEase Pro initialized successfully!');
});

// CSS animations for scroll effects
const scrollAnimationCSS = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .result-item {
        opacity: 0;
    }
    
    .search-suggestions {
        animation: fadeInDown 0.3s ease;
    }
    
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Inject scroll animation CSS
const style = document.createElement('style');
style.textContent = scrollAnimationCSS;
document.head.appendChild(style);

// Export for global access
window.TravelEasePro = TravelEasePro;