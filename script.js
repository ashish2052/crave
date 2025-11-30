document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Fetch Content
    fetch('content.json')
        .then(res => res.json())
        .then(data => {
            initSite(data);
        })
        .catch(err => console.error('Error loading content:', err));
});

function initSite(data) {
    // Global Elements
    document.title = data.site_title;

    document.querySelectorAll('.logo').forEach(el => {
        if (data.logo_image) {
            el.innerHTML = `<img src="${data.logo_image}" alt="${data.site_title}">`;
        } else {
            el.textContent = data.site_title;
        }
    });

    // Page Specific Logic
    const page = document.body.getAttribute('data-page');

    if (page === 'home') renderHome(data);
    if (page === 'menu') renderMenu(data);
    if (page === 'gallery') renderGallery(data);
    if (page === 'about') renderAbout(data);
    if (page === 'contact') renderContact(data);

    // Footer
    const year = new Date().getFullYear();
    const footer = document.querySelector('footer p');
    if (footer) footer.innerHTML = `&copy; ${year} ${data.site_title}. Crafted with <span style="color:var(--gold)">♥</span>`;
}

function renderHome(data) {
    // Hero
    document.querySelector('.hero-text h1').textContent = data.hero.title;
    document.querySelector('.hero-text .subtitle').textContent = data.hero.subtitle;
    document.querySelector('.hero-text .btn').textContent = data.hero.cta_text;
    document.querySelector('.hero-img-wrapper img').src = data.hero.image;

    // Specials
    const specialsGrid = document.querySelector('#specials-grid');
    if (specialsGrid) {
        specialsGrid.innerHTML = data.specials.map((item, index) => `
            <div class="card" data-aos="fade-up" data-aos-delay="${index * 100}">
                <div class="card-img"><img src="${item.image}" alt="${item.name}"></div>
                <div class="card-content">
                    <h3 class="card-title">${item.name}</h3>
                    <span class="card-price">${item.price}</span>
                    <p class="card-desc">${item.description}</p>
                </div>
            </div>
        `).join('');
    }

    // Reviews
    const reviewsContainer = document.querySelector('.review-slider');
    if (reviewsContainer) {
        let current = 0;
        const showReview = () => {
            const review = data.reviews[current];
            reviewsContainer.innerHTML = `
                <div class="review-card fade-in">
                    <p class="review-text">${review.text}</p>
                    <p class="review-author">— ${review.author}</p>
                </div>
            `;
            current = (current + 1) % data.reviews.length;
        };
        showReview();
        setInterval(showReview, 5000);
    }
}

function renderMenu(data) {
    const sidebar = document.querySelector('.menu-sidebar');
    const content = document.querySelector('.menu-content');

    // Categories
    const categories = Object.keys(data.menu_categories);

    sidebar.innerHTML = categories.map(cat => `
        <a href="#${cat}" class="menu-cat-link">${cat}</a>
    `).join('');

    content.innerHTML = categories.map(cat => `
        <div id="${cat}" class="menu-category" data-aos="fade-up">
            <h2>${cat}</h2>
            <div class="grid grid-2">
                ${data.menu_categories[cat].map(item => `
                    <div class="card menu-card">
                        <div style="display:flex; gap:1rem; align-items:center; padding:1rem;">
                            <img src="${item.image}" style="width:100px; height:100px; object-fit:cover; border-radius:50%;" alt="${item.name}">
                            <div>
                                <h3 class="card-title" style="margin:0; font-size:1.2rem;">${item.name}</h3>
                                <p class="card-desc" style="font-size:0.9rem;">${item.description}</p>
                                <span class="card-price" style="margin:0.5rem 0 0;">${item.price}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function renderGallery(data) {
    const grid = document.querySelector('.gallery-grid');
    grid.innerHTML = data.gallery.map((item, index) => `
        <div class="gallery-item" data-aos="fade-up" data-aos-delay="${index * 50}">
            <img src="${item.image}" alt="${item.caption}">
        </div>
    `).join('');
}

function renderAbout(data) {
    document.querySelector('#about-title').textContent = data.about.title;
    document.querySelector('#about-subtitle').textContent = data.about.subtitle;
    document.querySelector('#about-desc').textContent = data.about.description;
    document.querySelector('#about-img').src = data.about.image;
}

function renderContact(data) {
    document.querySelector('#phone').textContent = data.contact.phone;
    document.querySelector('#address').textContent = data.contact.address;
    document.querySelector('#email').textContent = data.contact.email;
    document.querySelector('#whatsapp-link').href = `https://wa.me/${data.contact.whatsapp}`;

    const mapFrame = document.querySelector('#map-frame');
    if (mapFrame) mapFrame.src = data.contact.google_map_embed;
}
