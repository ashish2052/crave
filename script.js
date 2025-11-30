document.addEventListener('DOMContentLoaded', () => {
    // Page Transition
    const transitionEl = document.querySelector('.page-transition');
    setTimeout(() => {
        transitionEl.classList.remove('active');
    }, 100);

    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

            e.preventDefault();
            transitionEl.classList.add('active');
            setTimeout(() => {
                window.location.href = href;
            }, 600);
        });
    });

    // Fetch Content
    fetch('content.json')
        .then(response => response.json())
        .then(data => {
            loadCommonContent(data);

            if (document.getElementById('specials-grid')) {
                loadHomeContent(data);
            }

            if (document.getElementById('menu-grid')) {
                loadMenuContent(data);
            }
        })
        .catch(error => console.error('Error loading content:', error));
});

function loadCommonContent(data) {
    document.title = data.site_title + (window.location.pathname.includes('menu') ? ' - Menu' : '');
    const navTitle = document.getElementById('nav-site-title');
    if (navTitle) navTitle.textContent = data.site_title;
    const footerTitle = document.getElementById('footer-site-title');
    if (footerTitle) footerTitle.textContent = data.site_title;
}

function loadHomeContent(data) {
    // Hero
    if (data.home) {
        document.getElementById('home-title').textContent = data.home.title;
        document.getElementById('home-subtitle').textContent = data.home.subtitle;
        document.getElementById('hero-img').src = data.home.hero_image;
    }

    // Specials
    const specialsGrid = document.getElementById('specials-grid');
    if (data.specials && specialsGrid) {
        specialsGrid.innerHTML = data.specials.map(item => createCard(item)).join('');
    }

    // About
    if (data.about) {
        document.getElementById('about-title').textContent = data.about.title;
        document.getElementById('about-desc').textContent = data.about.description;
        document.getElementById('about-img').src = data.about.image;
    }

    // Reviews
    const reviewsContainer = document.getElementById('reviews-container');
    if (data.reviews && reviewsContainer) {
        let currentReview = 0;
        const showReview = () => {
            reviewsContainer.style.opacity = 0;
            setTimeout(() => {
                reviewsContainer.innerHTML = `<p class="review-text">${data.reviews[currentReview]}</p>`;
                reviewsContainer.style.opacity = 1;
                currentReview = (currentReview + 1) % data.reviews.length;
            }, 500);
        };
        showReview();
        setInterval(showReview, 5000);
    }

    // Contact
    if (data.contact) {
        document.getElementById('contact-phone').textContent = data.contact.phone;
        document.getElementById('contact-address').textContent = data.contact.address;
        const mapContainer = document.getElementById('contact-map');
        if (data.contact.map_embed && data.contact.map_embed.startsWith('http')) {
            mapContainer.innerHTML = `<iframe src="${data.contact.map_embed}" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
        }
    }
}

function loadMenuContent(data) {
    const menuGrid = document.getElementById('menu-grid');
    if (data.menu && menuGrid) {
        menuGrid.innerHTML = data.menu.map(item => createCard(item)).join('');
    }
}

function createCard(item) {
    return `
        <div class="menu-item">
            <div style="overflow:hidden;">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                ${item.description ? `<p class="desc">${item.description}</p>` : ''}
                <p class="price">${item.price}</p>
            </div>
        </div>
    `;
}
