// ===== ИЗБРАННОЕ =====
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function toggleFavorite(name) {
    const index = favorites.indexOf(name);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(name);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteButtons();
}

function updateFavoriteButtons() {
    document.querySelectorAll('.btn-favorite, .btn-favorite-modal').forEach(btn => {
        const name = btn.dataset.name;
        const isFav = favorites.includes(name);
        btn.textContent = isFav ? '💜 В избранном' : '🤍 В избранное';
        btn.classList.toggle('active', isFav);
    });
}

// Делегирование событий для кнопок избранного
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-favorite, .btn-favorite-modal')) {
        toggleFavorite(e.target.dataset.name);
    }
});

// ===== Вкладки =====
const tabs = document.querySelectorAll('.tab');
const navLinks = document.querySelectorAll('[data-tab]');

function showTab(tabId) {
    tabs.forEach(t => t.classList.remove('active'));
    document.getElementById(tabId)?.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(l => {
        l.classList.toggle('active', l.dataset.tab === tabId);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('nav')?.classList.remove('open');
    document.getElementById('burger')?.classList.remove('active');
}

navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        showTab(link.dataset.tab);
    });
});

// ===== Бургер =====
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('open');
        burger.classList.toggle('active');
    });
}

// ===== Hero-статистика =====
const heroStats = document.getElementById('heroStats');
if (heroStats) {
    heroStats.innerHTML = `
        <div class="stat"><b>${violets.length}+</b><span>сортов в коллекции</span></div>
        <div class="stat"><b>${kids.length}</b><span>деток и стартёров</span></div>
        <div class="stat"><b>${articles.length}</b><span>авторских статей</span></div>
    `;
}

// ===== Рендер фиалок =====
const violetsGrid = document.getElementById('violetsGrid');
if (violetsGrid) {
    violets.forEach(v => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-img">
                <img src="${v.img}" alt="${v.name}" onerror="this.parentElement.innerHTML='<div class=\'card-img-placeholder\'>🌸</div>'">
            </div>
            <div class="card-body">
                <h3 class="card-name">${v.name}</h3>
                <p class="card-desc">${v.desc || ''}</p>
                <button class="btn-favorite" data-name="${v.name}">🤍 В избранное</button>
            </div>
        `;
        card.addEventListener('click', (e) => {
            // Если кликнули не по кнопке избранного, открываем модалку
            if (!e.target.matches('.btn-favorite')) {
                openViolet(v);
            }
        });
        violetsGrid.appendChild(card);
    });
    updateFavoriteButtons();
}

function openViolet(v) {
    const showDesc = v.desc && v.desc.trim().length > 0;
    openModal(`
        <img src="${v.img}" class="modal-img" alt="${v.name}" onerror="this.style.display='none'">
        <h2>${v.name}</h2>
        ${showDesc ? `<div class="modal-text">${v.desc}</div>` : ''}
        <button class="btn-favorite-modal" data-name="${v.name}">🤍 Добавить в избранное</button>
    `);
    // Обновляем кнопку в модалке после открытия
    setTimeout(updateFavoriteButtons, 0);
}

// ===== Рендер деток =====
const kidsList = document.getElementById('kidsList');
if (kidsList) {
    kids.forEach(k => {
        const item = document.createElement('div');
        item.className = 'kid-item';
        item.textContent = k;
        kidsList.appendChild(item);
    });
}

// ===== Рендер статей =====
const articlesGrid = document.getElementById('articlesGrid');
if (articlesGrid) {
    articles.forEach(a => {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.innerHTML = `
            <span class="article-tag">📖 ${a.tag || 'Статья'}</span>
            <h3>${a.title}</h3>
            <p>${a.short || ''}</p>
            <span class="article-more">Читать →</span>
        `;
        card.addEventListener('click', () => openArticle(a));
        articlesGrid.appendChild(card);
    });
}

function openArticle(a) {
    const galleryHTML = (a.images && a.images.length)
        ? `<div class="modal-gallery"> ${a.images.map(src => `<img src="${src}" alt="${a.title}" onerror="this.style.display='none'">`).join('')} </div>`
        : '';
        
    openModal(`
        <span class="article-tag">📖 ${a.tag || 'Статья'}</span>
        <h2>${a.title}</h2>
        ${galleryHTML}
        <div class="modal-text">${(a.text || '').replace(/\n/g, '<br>')}</div>
    `);
}

// ===== Рендер отзывов =====
const reviewsGrid = document.getElementById('reviewsGrid');
if (reviewsGrid && typeof reviews !== 'undefined') {
    reviews.forEach(r => {
        const card = document.createElement('div');
        card.className = 'review-card';
        const stars = '⭐'.repeat(r.rating);
        card.innerHTML = `
            <div class="review-header">
                <div class="review-avatar">${r.name.charAt(0)}</div>
                <div>
                    <h4>${r.name}</h4>
                    <span class="review-city">📍 ${r.city}</span>
                </div>
            </div>
            <div class="review-stars">${stars}</div>
            <p class="review-text">${r.text}</p>
            <span class="review-date">${r.date}</span>
        `;
        reviewsGrid.appendChild(card);
    });
}

// ===== Модалка =====
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function openModal(content) {
    if (!modal || !modalBody) return;
    modalBody.innerHTML = content;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) modalContent.scrollTop = 0;
}

function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

const modalBackdrop = document.querySelector('.modal-backdrop');
if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});