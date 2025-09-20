// database.js - TravelDatabase class and UI helper functions

class TravelDatabase {
    constructor() {
        this.bookings = this.loadFromStorage('travelBookings') || [];
        this.users = this.loadFromStorage('travelUsers') || [];
        this.searchHistory = this.loadFromStorage('searchHistory') || [];
        this.reviews = this.loadFromStorage('travelReviews') || [];
        this.analytics = this.loadFromStorage('travelAnalytics') || {
            totalBookings: 0,
            totalRevenue: 0,
            popularDestinations: {},
            monthlyStats: {}
        };
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key} from storage:`, error);
            return null;
        }
    }

    saveToStorage() {
        try {
            localStorage.setItem('travelBookings', JSON.stringify(this.bookings));
            localStorage.setItem('travelUsers', JSON.stringify(this.users));
            localStorage.setItem('searchHistory', JSON.stringify(this.searchHistory));
            localStorage.setItem('travelReviews', JSON.stringify(this.reviews));
            localStorage.setItem('travelAnalytics', JSON.stringify(this.analytics));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    saveBooking(bookingData) {
        const booking = {
            id: 'BK' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase(),
            ...bookingData,
            timestamp: new Date().toISOString(),
            status: 'confirmed',
            paymentStatus: 'paid',
            createdAt: new Date().toLocaleDateString(),
            amount: this.parsePrice(bookingData.price)
        };

        this.bookings.unshift(booking);
        this.updateAnalytics(booking);
        this.saveToStorage();
        this.updateDatabaseDisplay();

        return booking;
    }

    saveUser(userData) {
        const existingUserIndex = this.users.findIndex(u => u.email === userData.email);
        if (existingUserIndex !== -1) {
            this.users[existingUserIndex] = {
                ...this.users[existingUserIndex],
                ...userData,
                lastUpdated: new Date().toISOString()
            };
        } else {
            this.users.push({
                id: 'U' + Date.now(),
                ...userData,
                joinDate: new Date().toISOString(),
                bookingCount: 1,
                totalSpent: this.parsePrice(userData.price || '0')
            });
        }
        this.saveToStorage();
    }

    saveSearchHistory(searchData) {
        const search = {
            id: 'S' + Date.now(),
            ...searchData,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString()
        };
        this.searchHistory.unshift(search);
        if (this.searchHistory.length > 100) this.searchHistory = this.searchHistory.slice(0,100);
        this.saveToStorage();
    }

    saveReview(reviewData) {
        const review = {
            id: 'R' + Date.now(),
            ...reviewData,
            timestamp: new Date().toISOString(),
            helpful: 0,
            verified: true
        };
        this.reviews.unshift(review);
        this.saveToStorage();
    }

    updateAnalytics(booking) {
        this.analytics.totalBookings++;
        this.analytics.totalRevenue += booking.amount || 0;
        const destination = booking.to || booking.destination || 'Unknown';
        this.analytics.popularDestinations[destination] = (this.analytics.popularDestinations[destination] || 0) + 1;
        const month = new Date().toLocaleDateString('en', { month: 'long', year: 'numeric' });
        if (!this.analytics.monthlyStats[month]) this.analytics.monthlyStats[month] = { bookings:0, revenue:0 };
        this.analytics.monthlyStats[month].bookings++;
        this.analytics.monthlyStats[month].revenue += booking.amount || 0;
    }

    parsePrice(priceString){
        if (typeof priceString === 'number') return priceString;
        const numStr = (priceString||'').replace(/[^\d.]/g,'');
        return parseFloat(numStr) || 0;
    }

    formatCurrency(amount){
        return new Intl.NumberFormat('en-IN',{ style:'currency', currency:'INR' }).format(amount);
    }

    exportToCSV(){
        const header = 'Booking ID,Customer Name,Email,Phone,Service Type,Service Details,Amount,Date,Status\n';
        const csvContent = this.bookings.map(b => [
            b.id,
            `"${b.firstName} ${b.lastName}"`,
            `"${b.email}"`,
            `"${b.phone}"`,
            `"${b.serviceType}"`,
            `"${b.serviceTitle}"`,
            b.amount,
            b.createdAt,
            b.status
        ].join(',')).join('\n');
        return header + csvContent;
    }

    downloadCSV(){
        const csvContent = this.exportToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `travel_bookings_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    updateDatabaseDisplay(){
        const databaseContent = document.getElementById('databaseContent');
        if (!databaseContent) return;
        if (this.bookings.length === 0) {
            databaseContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <h3>No bookings yet</h3>
                    <p>Make your first booking to see data here!</p>
                </div>
            `;
            return;
        }
        const bookingsHTML = this.bookings.slice(0, 10).map(booking => `
            <div class="table-row" onclick="showBookingDetails('${booking.id}')">
                <div><strong>${booking.id}</strong></div>
                <div>
                    <div><strong>${booking.firstName} ${booking.lastName}</strong></div>
                    <small>${booking.email}</small><br>
                    <small>📱 ${booking.phone}</small>
                </div>
                <div>
                    <div><strong>${booking.serviceType}</strong></div>
                    <small>${(booking.serviceTitle||'').substring(0,30)}...</small>
                </div>
                <div><strong>${this.formatCurrency(booking.amount)}</strong></div>
                <div>${booking.createdAt}</div>
            </div>
        `).join('');
        databaseContent.innerHTML = bookingsHTML;
    }

    searchBookings(query){
        return this.bookings.filter(booking => {
            const q = query.toLowerCase();
            return booking.id.toLowerCase().includes(q)
                || `${booking.firstName} ${booking.lastName}`.toLowerCase().includes(q)
                || booking.email.toLowerCase().includes(q)
                || (booking.serviceTitle||'').toLowerCase().includes(q);
        });
    }

    getBookingsByDateRange(startDate,endDate){
        const start = new Date(startDate); const end = new Date(endDate);
        return this.bookings.filter(booking => {
            const b = new Date(booking.timestamp);
            return b >= start && b <= end;
        });
    }

    getAnalytics(){
        return {
            ...this.analytics,
            averageBookingValue: this.analytics.totalBookings > 0 ? (this.analytics.totalRevenue / this.analytics.totalBookings) : 0,
            topDestinations: Object.entries(this.analytics.popularDestinations).sort((a,b)=> b[1]-a[1]).slice(0,5),
            recentBookings: this.bookings.slice(0,5),
            totalUsers: this.users.length
        };
    }

    clearAllData(){
        if (confirm('⚠️ This will permanently delete ALL data. Are you sure?')) {
            this.bookings = []; this.users = []; this.searchHistory = []; this.reviews = [];
            this.analytics = { totalBookings:0, totalRevenue:0, popularDestinations:{}, monthlyStats:{} };
            ['travelBookings','travelUsers','searchHistory','travelReviews','travelAnalytics'].forEach(k=>localStorage.removeItem(k));
            this.updateDatabaseDisplay();
            this.showNotification('🗑️ All data cleared successfully!','success');
        }
    }

    showNotification(message, type='info'){
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; padding: 12px 18px; border-radius:10px; color:white; font-weight:700; z-index:9999; box-shadow:0 8px 30px rgba(0,0,0,0.2);
        `;
        const colors = {
            success: 'linear-gradient(45deg,#56ab2f,#a8e6cf)',
            error: 'linear-gradient(45deg,#ff416c,#ff4b2b)',
            info: 'linear-gradient(45deg,#4facfe,#00f2fe)',
            warning: 'linear-gradient(45deg,#f093fb,#f5576c)'
        };
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(()=> {
            notification.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            notification.style.transform = 'translateY(-10px)';
            notification.style.opacity = '0';
            setTimeout(()=> notification.remove(), 300);
        }, 2400);
    }
}

const travelDB = new TravelDatabase();

// UI helper functions
function viewBookings(){ travelDB.updateDatabaseDisplay(); travelDB.showNotification('📊 Showing all bookings','info'); }
function viewUsers(){
    const databaseContent = document.getElementById('databaseContent');
    if (!databaseContent) return;
    if (travelDB.users.length === 0) {
        databaseContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👥</div>
                <h3>No users yet</h3>
                <p>Users will appear here after bookings!</p>
            </div>
        `;
        return;
    }
    const usersHTML = travelDB.users.slice(0,10).map(u=>`
        <div class="table-row">
            <div><strong>${u.id}</strong></div>
            <div><div><strong>${u.firstName} ${u.lastName}</strong></div><small>${u.email}</small><br><small>📱 ${u.phone}</small></div>
            <div>User Profile</div>
            <div><strong>${travelDB.formatCurrency(u.totalSpent||0)}</strong></div>
            <div>${new Date(u.joinDate).toLocaleDateString()}</div>
        </div>
    `).join('');
    databaseContent.innerHTML = usersHTML;
    travelDB.showNotification('👥 Showing user data','info');
}
function exportData(){ try { travelDB.downloadCSV(); travelDB.showNotification('📄 Data exported successfully!','success'); } catch(e){ travelDB.showNotification('❌ Export failed','error'); } }
function clearDatabase(){ travelDB.clearAllData(); }
function showBookingDetails(bookingId){
    const booking = travelDB.bookings.find(b=>b.id===bookingId);
    if (!booking) return;
    const modal = document.createElement('div'); modal.className='modal'; modal.style.display='block';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>📋 Booking Details</h2>
            <div style="background:#f8f9fa;padding:16px;border-radius:12px;margin-top:12px;">
                <h3>${booking.serviceTitle}</h3>
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-top:12px;">
                    <div><strong>Booking ID:</strong><br>${booking.id}</div>
                    <div><strong>Customer:</strong><br>${booking.firstName} ${booking.lastName}</div>
                    <div><strong>Email:</strong><br>${booking.email}</div>
                    <div><strong>Phone:</strong><br>${booking.phone}</div>
                    <div><strong>Amount:</strong><br>${travelDB.formatCurrency(booking.amount)}</div>
                    <div><strong>Date:</strong><br>${booking.createdAt}</div>
                    <div><strong>Status:</strong><br>✅ ${booking.status}</div>
                    <div><strong>Payment:</strong><br>💳 ${booking.paymentStatus}</div>
                </div>
                ${(booking.specialRequests)?`<div style="margin-top:12px;"><strong>Special Requests:</strong><br>${booking.specialRequests}</div>`:''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// init
document.addEventListener('DOMContentLoaded', ()=>{ travelDB.updateDatabaseDisplay(); });
