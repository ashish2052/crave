document.addEventListener('DOMContentLoaded', () => {
    fetch('content.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadContent(data);
        })
        .catch(error => {
            console.error('Error loading content:', error);
            document.body.innerHTML = '<h1 style="text-align:center; margin-top: 50px;">Error loading site content. Please try again later.</h1>';
        });
});

function loadContent(data) {
    // Site Title
    document.title = data.site_title;
    const navTitle = document.getElementById('nav-site-title');
    if (navTitle) navTitle.textContent = data.site_title;
    const footerTitle = document.getElementById('footer-site-title');
    if (footerTitle) footerTitle.textContent = data.site_title;

    // Home Section
    if (data.home) {
        document.getElementById('home-title').textContent = data.home.title;
        document.getElementById('home-subtitle').textContent = data.home.subtitle;
        document.getElementById('hero-img').src = data.home.hero_image;
    }

    // About Section
    if (data.about) {
        document.getElementById('about-title').textContent = data.about.title;
        document.getElementById('about-desc').textContent = data.about.description;
        document.getElementById('about-img').src = data.about.image;
    }

    // Menu Section
    const menuGrid = document.getElementById('menu-grid');
    if (data.menu && menuGrid) {
        menuGrid.innerHTML = data.menu.map(item => `
            <div class="menu-item">
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p class="price">${item.price}</p>
            </div>
        `).join('');
    }

    // Reviews Section
    const reviewsContainer = document.getElementById('reviews-container');
    if (data.reviews && reviewsContainer) {
        let currentReview = 0;
        const showReview = () => {
            reviewsContainer.innerHTML = `<p class="review-text">${data.reviews[currentReview]}</p>`;
            currentReview = (currentReview + 1) % data.reviews.length;
        };
        showReview();
        setInterval(showReview, 4000); // Change review every 4 seconds
    }

    // Contact Section
    if (data.contact) {
        document.getElementById('contact-phone').textContent = data.contact.phone;
        document.getElementById('contact-address').textContent = data.contact.address;

        // Handle Map
        const mapContainer = document.getElementById('contact-map');
        if (data.contact.map_embed && data.contact.map_embed.startsWith('http')) {
            mapContainer.innerHTML = `<iframe src="${data.contact.map_embed}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
            mapContainer.classList.remove('map-placeholder');
        }
    }
}
