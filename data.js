// data.js - mockData, suggestions, filtering, dynamic pricing

const mockData = {
    flights: [
        {
            id: 'FL001',
            title: 'Mumbai to Delhi - Air India Express',
            price: '₹8,500',
            duration: '2h 15m',
            departure: '09:30 AM',
            arrival: '11:45 AM',
            stops: 'Non-stop',
            aircraft: 'Boeing 737-800',
            airline: 'Air India Express',
            class: 'Economy',
            rating: 4.2,
            reviews: [
                { name: 'Priya Sharma', rating: 4, comment: 'Good service and on-time departure! Comfortable seats and friendly staff.', verified: true },
                { name: 'Rahul Kumar', rating: 5, comment: 'Excellent flight experience. Clean aircraft and smooth journey.', verified: true },
                { name: 'Anjali Patel', rating: 4, comment: 'Value for money. Good food service and entertainment.', verified: false }
            ]
        },
        {
            id: 'FL002',
            title: 'Mumbai to Goa - IndiGo Airlines',
            price: '₹5,200',
            duration: '1h 30m',
            departure: '14:20 PM',
            arrival: '15:50 PM',
            stops: 'Non-stop',
            aircraft: 'Airbus A320neo',
            airline: 'IndiGo',
            class: 'Economy',
            rating: 4.5,
            reviews: [
                { name: 'Amit Pandey', rating: 4, comment: 'Smooth flight, good value for money. Quick boarding process.', verified: true },
                { name: 'Sneha Joshi', rating: 5, comment: 'Always reliable! Clean and punctual service as expected.', verified: true }
            ]
        },
        {
            id: 'FL003',
            title: 'Delhi to Bangalore - SpiceJet',
            price: '₹7,800',
            duration: '2h 45m',
            departure: '06:00 AM',
            arrival: '08:45 AM',
            stops: 'Non-stop',
            aircraft: 'Boeing 737 MAX',
            airline: 'SpiceJet',
            class: 'Economy',
            rating: 4.0,
            reviews: [
                { name: 'Vikram Singh', rating: 4, comment: 'Early morning flight but good service. Comfortable journey.', verified: true }
            ]
        },
        {
            id: 'FL004',
            title: 'Chennai to Mumbai - Vistara',
            price: '₹12,300',
            duration: '2h 00m',
            departure: '16:45 PM',
            arrival: '18:45 PM',
            stops: 'Non-stop',
            aircraft: 'Airbus A320',
            airline: 'Vistara',
            class: 'Premium Economy',
            rating: 4.7,
            reviews: [
                { name: 'Lakshmi Menon', rating: 5, comment: 'Premium service worth every penny! Excellent food and comfort.', verified: true },
                { name: 'Arjun Reddy', rating: 4, comment: 'Great experience with Vistara. Professional staff and quality service.', verified: true }
            ]
        }
    ],
    hotels: [
        {
            id: 'HT001',
            title: 'The Taj Mahal Palace - Mumbai',
            price: '₹25,000/night',
            rating: '5 Star Luxury',
            amenities: 'Pool, Spa, WiFi, Gym, Restaurant, Bar',
            location: 'Gateway of India, Colaba',
            roomType: 'Deluxe Sea View Room',
            checkIn: '3:00 PM',
            checkOut: '12:00 PM',
            starRating: 4.8,
            reviews: [
                { name: 'Sarah Mitchell', rating: 5, comment: 'Absolutely stunning! Historic luxury with modern amenities. The sea view is breathtaking.', verified: true },
                { name: 'David Johnson', rating: 5, comment: 'Iconic hotel with impeccable service. The heritage and elegance are unmatched.', verified: true },
                { name: 'Rajesh Gupta', rating: 4, comment: 'Expensive but worth it for special occasions. Beautiful architecture and great location.', verified: true }
            ]
        },
        {
            id: 'HT002',
            title: 'Vivanta by Taj - Panaji, Goa',
            price: '₹8,500/night',
            rating: '4 Star Resort',
            amenities: 'Beach Access, Pool, Restaurant, WiFi, Spa',
            location: 'Miramar Beach, Panaji',
            roomType: 'Superior Sea View Room',
            checkIn: '2:00 PM',
            checkOut: '11:00 AM',
            starRating: 4.4,
            reviews: [
                { name: 'Ravi Nair', rating: 4, comment: 'Perfect beachside location! Great for relaxation and water sports.', verified: true },
                { name: 'Meera Shah', rating: 5, comment: 'Beautiful resort with excellent service. The beach access is amazing.', verified: false }
            ]
        },
        {
            id: 'HT003',
            title: 'ITC Grand Chola - Chennai',
            price: '₹18,000/night',
            rating: '5 Star Business',
            amenities: 'Business Center, Pool, Multiple Restaurants, Spa, WiFi',
            location: 'Guindy, Chennai',
            roomType: 'Executive Club Room',
            checkIn: '3:00 PM',
            checkOut: '12:00 PM',
            starRating: 4.6,
            reviews: [
                { name: 'Karthik Raman', rating: 5, comment: 'Excellent business hotel with top-notch facilities. Great for corporate stays.', verified: true },
                { name: 'Priya Krishnan', rating: 4, comment: 'Luxurious and well-maintained. The restaurants serve amazing South Indian cuisine.', verified: true }
            ]
        },
        {
            id: 'HT004',
            title: 'The Oberoi - New Delhi',
            price: '₹22,000/night',
            rating: '5 Star Luxury',
            amenities: 'Spa, Pool, Fine Dining, Butler Service, WiFi',
            location: 'Dr. Zakir Hussain Marg, New Delhi',
            roomType: 'Premier Room',
            checkIn: '2:00 PM',
            checkOut: '12:00 PM',
            starRating: 4.9,
            reviews: [
                { name: 'Amanda Wilson', rating: 5, comment: 'Exceptional luxury and service. The attention to detail is remarkable.', verified: true },
                { name: 'Suresh Malhotra', rating: 5, comment: 'One of the best hotels in Delhi. Perfect blend of tradition and modernity.', verified: true }
            ]
        }
    ],
    packages: [
        {
            id: 'PK001',
            title: 'Golden Triangle Luxury Tour - 8 Days',
            price: '₹65,000/person',
            duration: '8 Days / 7 Nights',
            destinations: 'Delhi → Agra → Jaipur → Delhi',
            includes: '5-Star Hotels, Private Car, All Meals, English Guide, Entrance Fees',
            highlights: 'Taj Mahal Sunrise, Red Fort, Hawa Mahal, Amber Fort, City Palace',
            groupSize: 'Max 6 people',
            difficulty: 'Easy',
            rating: 4.8,
            reviews: [
                { name: 'Jennifer Roberts', rating: 5, comment: 'Amazing cultural experience! Our guide was knowledgeable and the hotels were fantastic.', verified: true },
                { name: 'Michael Davis', rating: 5, comment: 'Well organized tour with great attention to detail. The Taj Mahal visit was unforgettable.', verified: true },
                { name: 'Hans Mueller', rating: 4, comment: 'Excellent introduction to Indian culture and history. Highly recommended for first-time visitors.', verified: true }
            ]
        },
        {
            id: 'PK002',
            title: 'Kerala Backwaters & Hills - 6 Days',
            price: '₹45,000/person',
            duration: '6 Days / 5 Nights',
            destinations: 'Kochi → Alleppey → Munnar → Kochi',
            includes: 'Luxury Houseboat, Hill Resort, All Meals, Transfers, Activities',
            highlights: 'Houseboat Cruise, Tea Plantation Tour, Spice Gardens, Kathakali Show',
            groupSize: 'Max 8 people',
            difficulty: 'Easy to Moderate',
            rating: 4.7,
            reviews: [
                { name: 'Lisa Anderson', rating: 5, comment: 'Absolutely peaceful and rejuvenating! The backwaters are magical.', verified: true },
                { name: 'Robert Thompson', rating: 4, comment: 'Beautiful scenery and great hospitality. The houseboat experience was unique.', verified: false }
            ]
        },
        {
            id: 'PK003',
            title: 'Rajasthan Desert Safari - 10 Days',
            price: '₹85,000/person',
            duration: '10 Days / 9 Nights',
            destinations: 'Jaipur → Jodhpur → Jaisalmer → Udaipur → Pushkar',
            includes: 'Heritage Hotels, Desert Camp, All Meals, Camel Safari, Cultural Shows',
            highlights: 'Desert Camp Under Stars, Mehrangarh Fort, Lake Pichola, Camel Safari, Folk Performances',
            groupSize: 'Max 10 people',
            difficulty: 'Moderate',
            rating: 4.6,
            reviews: [
                { name: 'Emma Thompson', rating: 5, comment: 'Epic adventure! The desert camp experience was once in a lifetime.', verified: true },
                { name: 'Carlos Rodriguez', rating: 4, comment: 'Rich cultural experience with stunning architecture. The camel safari was fun!', verified: true }
            ]
        },
        {
            id: 'PK004',
            title: 'Himalayan Adventure - Manali & Ladakh - 12 Days',
            price: '₹95,000/person',
            duration: '12 Days / 11 Nights',
            destinations: 'Delhi → Manali → Leh → Nubra Valley → Pangong Lake',
            includes: 'Hotels & Camps, All Meals, Permits, Oxygen Support, Adventure Activities',
            highlights: 'Khardung La Pass, Pangong Lake, Nubra Valley, Buddhist Monasteries, River Rafting',
            groupSize: 'Max 8 people',
            difficulty: 'Challenging',
            rating: 4.9,
            reviews: [
                { name: 'Adventure_Seeker_2024', rating: 5, comment: 'Absolutely breathtaking! The landscapes are out of this world. Well-organized expedition.', verified: true },
                { name: 'Mountain_Lover', rating: 5, comment: 'Life-changing experience. The team handled altitude and logistics perfectly.', verified: true }
            ]
        }
    ]
};

// Suggestions & other helper datasets
const popularDestinations = {
    domestic: [
        { name: 'Goa', image: '🏖️', description: 'Beaches & Nightlife' },
        { name: 'Kerala', image: '🌴', description: 'Backwaters & Hills' },
        { name: 'Rajasthan', image: '🏰', description: 'Palaces & Desert' },
        { name: 'Himachal Pradesh', image: '⛰️', description: 'Mountains & Adventure' }
    ],
    international: [
        { name: 'Thailand', image: '🇹🇭', description: 'Tropical Paradise' },
        { name: 'Dubai', image: '🇦🇪', description: 'Luxury & Shopping' }
    ]
};

const travelTips = [
    { category: 'Booking Tips', tips: ['Book flights 2-3 months in advance for best prices','Tuesday and Wednesday flights are usually cheaper'] },
    { category: 'Packing Essentials', tips: ['Pack light and smart - choose versatile clothing','Keep important documents in carry-on'] }
];

const weatherData = {
    'Mumbai': { temp: '28°C', condition: 'Partly Cloudy', humidity: '75%', bestTime: 'Oct-Mar' },
    'Delhi': { temp: '25°C', condition: 'Clear Sky', humidity: '60%', bestTime: 'Oct-Apr' }
};

const pricingInfo = {
    currency: 'INR',
    conversionRates: { USD: 83.25, EUR: 90.15 },
    serviceCharges: { booking: 199, convenience: 99 },
    discountCodes: [{ code: 'FIRST500', discount: 500, description: 'First booking discount' }]
};

// Filtering & sorting functions (used by script.js)
function filterResults(data, filters = {}) {
    let filteredData = [...data];
    if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        filteredData = filteredData.filter(item => {
            const price = parseFloat((item.price || '').replace(/[^\d.]/g, '') || 0);
            return price >= min && price <= max;
        });
    }
    if (filters.minRating) {
        filteredData = filteredData.filter(item => (item.rating || item.starRating || 0) >= filters.minRating);
    }
    if (filters.maxDuration && filteredData[0]?.duration) {
        filteredData = filteredData.filter(item => {
            const duration = (item.duration || '').toLowerCase();
            const hours = parseFloat(duration.match(/(\d+)h/)?.[1] || '0');
            const days = parseFloat(duration.match(/(\d+)\s*day/)?.[1] || '0');
            return (hours + days * 24) <= filters.maxDuration;
        });
    }
    return filteredData;
}

function sortResults(data, sortType) {
    const sorted = [...data];
    switch (sortType) {
        case 'price-low':
            return sorted.sort((a,b)=> (parseFloat((a.price||'').replace(/[^\d.]/g,'' )||0) - parseFloat((b.price||'').replace(/[^\d.]/g,'' )||0)));
        case 'price-high':
            return sorted.sort((a,b)=> (parseFloat((b.price||'').replace(/[^\d.]/g,'' )||0) - parseFloat((a.price||'').replace(/[^\d.]/g,'' )||0)));
        case 'rating':
            return sorted.sort((a,b)=> (b.rating||b.starRating||0) - (a.rating||a.starRating||0));
        case 'duration':
            return sorted.sort((a,b)=> {
                const ha = parseFloat((a.duration||'').match(/(\d+)h/)?.[1]||0);
                const hb = parseFloat((b.duration||'').match(/(\d+)h/)?.[1]||0);
                return ha - hb;
            });
        default:
            return sorted;
    }
}

function getSearchSuggestions(query, type) {
    const suggestions = {
        flights: { from: ['Mumbai','Delhi','Bangalore','Chennai','Kolkata','Hyderabad','Pune','Ahmedabad'], to: ['Delhi','Mumbai','Goa','Bangalore','Chennai','Jaipur','Udaipur','Kochi'] },
        hotels: { destinations: ['Mumbai','Delhi','Goa','Jaipur','Udaipur','Kerala','Manali','Shimla','Rishikesh'] },
        packages: { destinations: ['Golden Triangle','Kerala','Rajasthan','Goa','Himachal Pradesh','Kashmir'] }
    };
    const q = (query||'').toLowerCase();
    const typeData = suggestions[type] || {};
    const all = Object.values(typeData).flat();
    return all.filter(item => item.toLowerCase().includes(q)).slice(0,5);
}

function getDynamicPrice(basePrice, date, demand='normal') {
    const base = parseFloat((basePrice||'').replace(/[^\d.]/g,'')) || 0;
    let multiplier = 1;
    const bookingDate = new Date(date);
    const day = bookingDate.getDay();
    if (day === 0 || day === 6) multiplier *= 1.15;
    const demandMultipliers = { low:0.85, normal:1, high:1.25, peak:1.5 };
    multiplier *= demandMultipliers[demand] || 1;
    const month = bookingDate.getMonth();
    if ([11,0,3,4,9,10].includes(month)) multiplier *= 1.1;
    const finalPrice = Math.round(base * multiplier);
    return `₹${finalPrice.toLocaleString('en-IN')}`;
}

// Export to window for global use
window.mockData = mockData;
window.popularDestinations = popularDestinations;
window.travelTips = travelTips;
window.weatherData = weatherData;
window.pricingInfo = pricingInfo;
window.filterResults = filterResults;
window.sortResults = sortResults;
window.getSearchSuggestions = getSearchSuggestions;
window.getDynamicPrice = getDynamicPrice;
