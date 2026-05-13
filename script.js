// ===== Вспомогательные функции =====

// Проверка: цена 0 + описание "Скоро появится в продаже"
function isComingSoon(item) {
  return item.price === 0 && item.description.trim().toLowerCase().startsWith('скоро');
}

// Проверка: цена 0, но это не "скоро" — значит "описание появится позже"
function isNoDescription(item) {
  return item.price === 0 && !isComingSoon(item);
}

// Формат цены для карточки
function getPriceHTML(item) {
  if (isComingSoon(item)) {
    return `<div class="card-price soon accent">✨ Скоро в продаже</div>`;
  }
  if (isNoDescription(item)) {
    return `<div class="card-price soon">Описание появится позже</div>`;
  }
  return `<div class="card-price">${item.price} ₽</div>`;
}

// Формат цены для модалки
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
  document.getElementById('nav').classList.remove('open');
  document.getElementById('burger').classList.remove('active');
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
burger.addEventListener('click', () => {
  nav.classList.toggle('open');
  burger.classList.toggle('active');
});

// ===== Hero-статистика =====
const heroStats = document.getElementById('heroStats');
heroStats.innerHTML = `
  <div class="stat"><b>${violetDataMini.length}+</b><span>сортов в коллекции</span></div>
  <div class="stat"><b>${kidsData.length}</b><span>деток и стартёров</span></div>
  <div class="stat"><b>${articlesData.length}</b><span>авторских статей</span></div>
`;

// ===== Рендер фиалок =====
const violetsGrid = document.getElementById('violetsGrid');

violetDataMini.forEach(v => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="card-img">
      <img src="${v.image}" alt="${v.name}"
           onerror="this.parentElement.innerHTML='<div class=\\'card-img-placeholder\\'>🌸</div>'">
    </div>
    <div class="card-body">
      <h3 class="card-name">${v.name}</h3>
      <p class="card-desc">${v.description}</p>
      ${getPriceHTML(v)}
    </div>
  `;
  card.addEventListener('click', () => openViolet(v));
  violetsGrid.appendChild(card);
});

function openViolet(v) {
  const showDesc = !isNoDescription(v); // если "Описание появится позже" — текст не дублируем

  openModal(`
    <img src="${v.image}" class="modal-img" alt="${v.name}"
         onerror="this.style.display='none'">
    <h2>${v.name}</h2>
    ${showDesc ? `<div class="modal-text">${v.description}</div>` : ''}
    ${getModalPriceHTML(v)}
  `);
}

// ===== Рендер деток =====
const kidsList = document.getElementById('kidsList');
kidsData.forEach(k => {
  const item = document.createElement('div');
  item.className = 'kid-item';
  item.textContent = k.name;
  kidsList.appendChild(item);
});

// ===== Рендер статей =====
const articlesGrid = document.getElementById('articlesGrid');

articlesData.forEach(a => {
  const card = document.createElement('div');
  card.className = 'article-card';
  card.innerHTML = `
    <span class="article-tag">📖 Статья</span>
    <h3>${a.title}</h3>
    <p>${a.preview}</p>
    <span class="article-more">Читать →</span>
  `;
  card.addEventListener('click', () => openArticle(a));
  articlesGrid.appendChild(card);
});

function openArticle(a) {
  let imagesHTML = '';

  if (a.images && a.images.length > 0) {
    imagesHTML = '<div class="modal-gallery">' +
      a.images.map(src =>
        `<img src="${src}" alt="${a.title}" onerror="this.style.display='none'">`
      ).join('') +
      '</div>';
  }

  openModal(`
    <span class="article-tag">📖 Статья</span>
    <h2>${a.title}</h2>
    ${imagesHTML}
    <div class="modal-text">${a.content}</div>
  `);
}

// ===== Модалка =====
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

function openModal(content) {
  modalBody.innerHTML = content;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal-content').scrollTop = 0;
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.querySelector('.modal-backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});