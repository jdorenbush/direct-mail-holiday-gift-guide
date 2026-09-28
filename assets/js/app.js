'use strict';

const products = [
  { id: 'APP-101', brand: 'Northstar Apparel', name: 'Summit Fleece Jacket', price: 59.98, category: 'Apparel' },
  { id: 'APP-204', brand: 'Northstar Apparel', name: 'Performance Polo', price: 37.98, category: 'Apparel' },
  { id: 'BAG-310', brand: 'Field & Carry', name: 'Commuter Backpack', price: 68.00, category: 'Bags' },
  { id: 'BAG-422', brand: 'Field & Carry', name: 'Canvas Weekender', price: 82.00, category: 'Bags' },
  { id: 'ACC-118', brand: 'Cedar Works', name: 'Insulated Travel Tumbler', price: 24.50, category: 'Accessories' },
  { id: 'ACC-227', brand: 'Cedar Works', name: 'Knit Cuff Beanie', price: 18.75, category: 'Accessories' }
];

const state = { favorites: new Set() };
const catalog = document.querySelector('#catalog');
const favoritesList = document.querySelector('#favorites-list');
const emptyState = document.querySelector('#favorites-empty');
const favoriteCount = document.querySelector('#favorite-count');
const clearButton = document.querySelector('#clear-favorites');
const shareForm = document.querySelector('#share-form');
const formStatus = document.querySelector('#form-status');
const previewDialog = document.querySelector('#preview-dialog');
const previewMeta = document.querySelector('#preview-meta');
const previewContent = document.querySelector('#preview-content');

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function productInitials(product) {
  return product.category.slice(0, 2).toUpperCase();
}

function renderCatalog() {
  catalog.replaceChildren(...products.map((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    const selected = state.favorites.has(product.id);
    card.innerHTML = `
      <div class="product-art" aria-hidden="true">${productInitials(product)}</div>
      <p class="product-brand">${product.brand}</p>
      <h3>${product.name}</h3>
      <div class="product-meta"><span>${product.id}</span><strong>${money.format(product.price)}</strong></div>
      <button class="${selected ? 'secondary-button' : 'primary-button'}" type="button" data-product-id="${product.id}" aria-pressed="${selected}">
        ${selected ? 'Remove favorite' : 'Add to favorites'}
      </button>`;
    return card;
  }));
}

function renderFavorites() {
  const selected = products.filter((product) => state.favorites.has(product.id));
  favoriteCount.textContent = String(selected.length);
  emptyState.hidden = selected.length > 0;
  clearButton.disabled = selected.length === 0;

  favoritesList.replaceChildren(...selected.map((product) => {
    const item = document.createElement('li');
    item.innerHTML = `<div><strong>${product.name}</strong><span>${product.brand} · ${product.id}</span></div><span>${money.format(product.price)}</span>`;
    return item;
  }));
}

function toggleFavorite(id) {
  if (state.favorites.has(id)) state.favorites.delete(id);
  else state.favorites.add(id);
  renderCatalog();
  renderFavorites();
}

catalog.addEventListener('click', (event) => {
  const button = event.target.closest('[data-product-id]');
  if (button) toggleFavorite(button.dataset.productId);
});

clearButton.addEventListener('click', () => {
  state.favorites.clear();
  renderCatalog();
  renderFavorites();
});

shareForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = '';

  if (!shareForm.reportValidity()) return;
  const selected = products.filter((product) => state.favorites.has(product.id));
  if (!selected.length) {
    formStatus.textContent = 'Add at least one favorite before generating a preview.';
    return;
  }

  const payload = {
    sender: document.querySelector('#sender-name').value.trim(),
    reply: document.querySelector('#reply-email').value.trim(),
    recipient: document.querySelector('#recipient-email').value.trim(),
    items: selected.map(({ id, brand, name, price }) => ({ id, brand, name, price }))
  };

  try {
    const response = await fetch('server/preview.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to generate preview.');

    previewMeta.textContent = `To: ${result.recipient} · Reply-To: ${result.reply} · Subject: ${result.subject}`;
    previewContent.innerHTML = result.html;
    previewDialog.showModal();
  } catch (error) {
    formStatus.textContent = error.message;
  }
});

document.querySelector('#close-preview').addEventListener('click', () => previewDialog.close());
previewDialog.addEventListener('click', (event) => {
  if (event.target === previewDialog) previewDialog.close();
});

renderCatalog();
renderFavorites();
