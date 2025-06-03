// Product data for 4 categories
const PRODUCTS = [
  // Electronics
  { id: 1, name: 'Wireless Headphones', category: 'Electronics', price: 59.99, img: 'https://img.icons8.com/color/96/000000/headphones.png', desc: 'Bluetooth, noise-cancelling, 20h battery.' },
  { id: 2, name: 'Smart Watch', category: 'Electronics', price: 129.99, img: 'https://img.icons8.com/color/96/000000/smart-watch.png', desc: 'Fitness tracking, notifications, waterproof.' },
  // Fashion
  { id: 3, name: 'Classic Sneakers', category: 'Fashion', price: 49.99, img: 'https://img.icons8.com/color/96/000000/sneakers.png', desc: 'Comfortable, stylish, unisex.' },
  { id: 4, name: 'Leather Wallet', category: 'Fashion', price: 34.99, img: 'https://img.icons8.com/color/96/000000/wallet.png', desc: 'Genuine leather, RFID protection.' },
  // Home
  { id: 5, name: 'Aroma Diffuser', category: 'Home', price: 24.99, img: 'https://img.icons8.com/color/96/000000/aroma-lamp.png', desc: 'Ultrasonic, 7 LED colors, quiet.' },
  { id: 6, name: 'Nonstick Frying Pan', category: 'Home', price: 29.99, img: 'https://img.icons8.com/color/96/000000/frying-pan.png', desc: 'Induction compatible, easy clean.' },
  // Books
  { id: 7, name: 'Mystery Novel', category: 'Books', price: 14.99, img: 'https://img.icons8.com/color/96/000000/book.png', desc: 'Bestseller, thrilling plot.' },
  { id: 8, name: 'Cookbook', category: 'Books', price: 19.99, img: 'https://img.icons8.com/color/96/000000/cookbook.png', desc: '100+ recipes, full color.' },
];

let currentCategory = 'Electronics';
let cart = [];

function renderProducts() {
  const list = document.getElementById('product-list');
  list.innerHTML = '';
  const filtered = PRODUCTS.filter(p => p.category === currentCategory);
  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${product.img}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.desc}</p>
      <div class="price">$${product.price.toFixed(2)}</div>
      <button aria-label="Add ${product.name} to cart" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    list.appendChild(div);
  });
}

function renderCart() {
  const list = document.getElementById('cart-list');
  list.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    total += product.price * item.qty;
    const li = document.createElement('li');
    li.className = 'cart-item';
    li.innerHTML = `
      <div class="item-info">
        <span class="item-title">${product.name}</span>
        <span class="item-category">${product.category}</span>
      </div>
      <div class="item-qty">
        <button aria-label="Decrease quantity" onclick="updateQty(${item.id}, -1)">-</button>
        <span>${item.qty}</span>
        <button aria-label="Increase quantity" onclick="updateQty(${item.id}, 1)">+</button>
      </div>
      <span class="price">$${(product.price * item.qty).toFixed(2)}</span>
      <button aria-label="Remove from cart" onclick="removeFromCart(${item.id})">&times;</button>
    `;
    list.appendChild(li);
  });
  document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

function addToCart(id) {
  const idx = cart.findIndex(item => item.id === id);
  if (idx > -1) {
    cart[idx].qty++;
  } else {
    cart.push({ id, qty: 1 });
  }
  renderCart();
  animateCart();
}

function updateQty(id, delta) {
  const idx = cart.findIndex(item => item.id === id);
  if (idx > -1) {
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    renderCart();
  }
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function animateCart() {
  const cartEl = document.querySelector('.cart');
  cartEl.style.boxShadow = '0 0 0 4px var(--accent)';
  setTimeout(() => {
    cartEl.style.boxShadow = '';
  }, 400);
}

document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.category-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    this.classList.add('active');
    this.setAttribute('aria-pressed', 'true');
    currentCategory = this.dataset.category;
    renderProducts();
  });
});

document.getElementById('checkout-btn').addEventListener('click', function() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Thank you for your purchase!');
  cart = [];
  renderCart();
});

// Initial render
renderProducts();
renderCart();