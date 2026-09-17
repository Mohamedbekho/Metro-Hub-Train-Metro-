// MetroHub - Train & Metro Ticket Booking System

document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('trainDate').setAttribute('min', today);
    document.getElementById('metroDate').setAttribute('min', today);

    // Train Form Submission
    const trainForm = document.getElementById('trainForm');
    trainForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            type: 'Train',
            from: document.getElementById('trainFrom').value,
            to: document.getElementById('trainTo').value,
            date: document.getElementById('trainDate').value,
            time: document.getElementById('trainTime').value,
            class: document.getElementById('trainClass').value,
            passengers: document.getElementById('trainPassengers').value
        };

        // Validate that from and to are different
        if (formData.from === formData.to) {
            alert('Please select different stations for departure and arrival.');
            return;
        }

        // Calculate price based on class and passengers
        const basePrice = calculateTrainPrice(formData.from, formData.to, formData.class);
        const totalPrice = basePrice * parseInt(formData.passengers);

        // Show booking confirmation
        showBookingModal(formData, totalPrice);
    });

    // Metro Form Submission
    const metroForm = document.getElementById('metroForm');
    metroForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            type: 'Metro',
            line: document.getElementById('metroLine').value,
            ticketType: document.getElementById('ticketType').value,
            from: document.getElementById('metroFrom').value,
            to: document.getElementById('metroTo').value,
            quantity: document.getElementById('metroQuantity').value,
            date: document.getElementById('metroDate').value
        };

        // Validate that from and to are different
        if (formData.from === formData.to) {
            alert('Please select different stations for departure and arrival.');
            return;
        }

        // Calculate price based on ticket type and quantity
        const basePrice = calculateMetroPrice(formData.ticketType);
        const totalPrice = basePrice * parseInt(formData.quantity);

        // Show booking confirmation
        showBookingModal(formData, totalPrice);
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });

    // Modal Close
    const modal = document.getElementById('bookingModal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    closeModalBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navButtons = document.querySelector('.nav-buttons');

    hamburger.addEventListener('click', function() {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navButtons.style.display = navButtons.style.display === 'flex' ? 'none' : 'flex';
    });

    // Header Scroll Effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'white';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    });

    // Route Card Book Now Buttons
    document.querySelectorAll('.route-card .btn-outline').forEach(button => {
        button.addEventListener('click', function() {
            const routeCard = this.closest('.route-card');
            const routeType = routeCard.querySelector('.route-type').textContent;
            const routeName = routeCard.querySelector('h3').textContent;
            
            if (routeType === 'Train') {
                document.getElementById('train-tickets').scrollIntoView({ behavior: 'smooth' });
            } else {
                document.getElementById('metro-tickets').scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Calculate Train Price
function calculateTrainPrice(from, to, trainClass) {
    const routes = {
        'cairo-alexandria': 25,
        'cairo-giza': 10,
        'cairo-luxor': 45,
        'cairo-aswan': 60,
        'cairo-port-said': 30,
        'alexandria-giza': 20,
        'alexandria-luxor': 50,
        'alexandria-aswan': 65,
        'giza-luxor': 40,
        'giza-aswan': 55,
        'luxor-aswan': 20
    };

    const routeKey = `${from}-${to}`;
    const reverseRouteKey = `${to}-${from}`;
    
    let basePrice = routes[routeKey] || routes[reverseRouteKey] || 30;

    // Apply class multiplier
    const classMultiplier = {
        'first': 1.5,
        'second': 1.0,
        'third': 0.7
    };

    return basePrice * (classMultiplier[trainClass] || 1.0);
}

// Calculate Metro Price
function calculateMetroPrice(ticketType) {
    const prices = {
        'single': 0.50,
        'return': 1.00,
        'daily': 2.00,
        'weekly': 8.00,
        'monthly': 25.00
    };

    return prices[ticketType] || 0.50;
}

// Show Booking Modal
function showBookingModal(formData, totalPrice) {
    const modal = document.getElementById('bookingModal');
    
    // Generate random ticket ID
    const ticketId = 'TKT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    // Format date
    const dateObj = new Date(formData.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Format time (for train)
    let formattedTime = '-';
    if (formData.time) {
        const [hours, minutes] = formData.time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        formattedTime = `${hour12}:${minutes} ${ampm}`;
    }

    // Get station names
    const stationNames = {
        'cairo': 'Cairo Central Station',
        'alexandria': 'Alexandria Station',
        'giza': 'Giza Station',
        'luxor': 'Luxor Station',
        'aswan': 'Aswan Station',
        'port-said': 'Port Said Station',
        'helwan': 'Helwan',
        'sadat': 'Sadat',
        'gamal-abdel-nasser': 'Gamal Abdel Nasser',
        'shubra': 'Shubra',
        'cairo-university': 'Cairo University'
    };

    // Update modal content
    document.getElementById('modalTicketType').textContent = formData.type + ' Ticket';
    document.getElementById('modalTicketId').textContent = '#' + ticketId;
    document.getElementById('modalFrom').textContent = stationNames[formData.from] || formData.from;
    document.getElementById('modalTo').textContent = stationNames[formData.to] || formData.to;
    document.getElementById('modalDate').textContent = formattedDate;
    document.getElementById('modalTime').textContent = formattedTime;
    
    if (formData.type === 'Train') {
        document.getElementById('modalPassengers').textContent = formData.passengers + ' Passenger(s)';
    } else {
        document.getElementById('modalPassengers').textContent = formData.quantity + ' Ticket(s)';
    }
    
    document.getElementById('modalTotal').textContent = '$' + totalPrice.toFixed(2);

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Download Ticket (simulated)
function downloadTicket() {
    const ticketId = document.getElementById('modalTicketId').textContent;
    const from = document.getElementById('modalFrom').textContent;
    const to = document.getElementById('modalTo').textContent;
    const date = document.getElementById('modalDate').textContent;
    const time = document.getElementById('modalTime').textContent;
    const passengers = document.getElementById('modalPassengers').textContent;
    const total = document.getElementById('modalTotal').textContent;

    const ticketContent = `
╔══════════════════════════════════════════════════════════════╗
║                    METROHUB TICKET                          ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Ticket ID: ${ticketId.padEnd(45)}║
║                                                              ║
║  From: ${from.padEnd(52)}║
║  To: ${to.padEnd(54)}║
║  Date: ${date.padEnd(52)}║
║  Time: ${time.padEnd(52)}║
║  Passengers: ${passengers.padEnd(46)}║
║                                                              ║
║  Total: ${total.padEnd(51)}║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
║  Thank you for choosing MetroHub!                           ║
║  Have a safe journey!                                        ║
╚══════════════════════════════════════════════════════════════╝
    `;

    // Create blob and download
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MetroHub_Ticket_${ticketId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    alert('Ticket downloaded successfully!');
}

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .route-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});