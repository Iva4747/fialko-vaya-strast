// ===== Вспомогательные функции =====

function isComingSoon(item) {
  return item.price === 0 && item.desc?.trim().toLowerCase().startsWith('скоро');
}

function isNoDescription(item) {
  return item.price === 0 && !isComingSoon(item);
}

function getPriceHTML(item) {
  if (isComingSoon(item)) {
    return `<div class="card-price soon accent">✨ Скоро в продаже</div>`;
  }
  if (isNoDescription(item)) {
    return `<div class="card-price soon">Описание появится позже</div>`;
  }
  return `<div class="card-price">${item.price} ₽</div>`;
}

function getModalPriceHTML(item) {
  if (isComingSoon(item)) {
    return `<div class="modal-price soon accent">✨ Скоро появится в продаже</div>`;
  }
  if (isNoDescription(item)) {
    return `<div class="modal-price soon">Описание появится позже</div>`;
  }
  return `<div class="modal-price">${item.price} ₽</div>`;
}

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
        <img src="${v.img}" alt="${v.name}"
             onerror="this.parentElement.innerHTML='<div class=\\'card-img-placeholder\\'>🌸</div>'">
      </div>
      <div class="card-body">
        <h3 class="card-name">${v.name}</h3>
        <p class="card-desc">${v.desc || ''}</p>
        ${getPriceHTML(v)}
      </div>
    `;
    card.addEventListener('click', () => openViolet(v));
    violetsGrid.appendChild(card);
  });
}

function openViolet(v) {
  const showDesc = !isNoDescription(v);
  openModal(`
    <img src="${v.img}" class="modal-img" alt="${v.name}"
         onerror="this.style.display='none'">
    <h2>${v.name}</h2>
    ${showDesc ? `<div class="modal-text">${v.desc || ''}</div>` : ''}
    ${getModalPriceHTML(v)}
  `);
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
  openModal(`
    <span class="article-tag">📖 ${a.tag || 'Статья'}</span>
    <h2>${a.title}</h2>
    <div class="modal-text">${(a.text || '').replace(/\n/g, '<br>')}</div>
  `);
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