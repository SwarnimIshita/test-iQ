// --- Cryptocurrency Analysis UI Logic ---
// Demo data for 4 categories
const ASSET_CATEGORIES = {
  'DeFi': [
    { symbol: 'UNI', name: 'Uniswap', marketCap: 8000000000, volume: 350000000, price: 8.2, change: 2.1, volatility: 0.07, sentiment: 0.65, history: [7.8, 8.0, 8.1, 8.3, 8.2] },
    { symbol: 'AAVE', name: 'Aave', marketCap: 6000000000, volume: 210000000, price: 92.5, change: -1.2, volatility: 0.09, sentiment: 0.58, history: [93.0, 92.8, 92.7, 92.6, 92.5] }
  ],
  'Stablecoins': [
    { symbol: 'USDT', name: 'Tether', marketCap: 110000000000, volume: 45000000000, price: 1.0, change: 0.0, volatility: 0.01, sentiment: 0.5, history: [1.0, 1.0, 1.0, 1.0, 1.0] },
    { symbol: 'USDC', name: 'USD Coin', marketCap: 32000000000, volume: 12000000000, price: 1.0, change: 0.0, volatility: 0.01, sentiment: 0.51, history: [1.0, 1.0, 1.0, 1.0, 1.0] }
  ],
  'Memecoins': [
    { symbol: 'DOGE', name: 'Dogecoin', marketCap: 18000000000, volume: 1200000000, price: 0.13, change: 4.2, volatility: 0.18, sentiment: 0.72, history: [0.12, 0.13, 0.14, 0.13, 0.13] },
    { symbol: 'PEPE', name: 'Pepe', marketCap: 500000000, volume: 90000000, price: 0.000012, change: 8.5, volatility: 0.25, sentiment: 0.68, history: [0.000011, 0.000012, 0.000013, 0.000012, 0.000012] }
  ],
  'Blue-Chip': [
    { symbol: 'BTC', name: 'Bitcoin', marketCap: 1200000000000, volume: 35000000000, price: 65000, change: 1.5, volatility: 0.04, sentiment: 0.8, history: [64000, 64500, 65000, 65200, 65000] },
    { symbol: 'ETH', name: 'Ethereum', marketCap: 400000000000, volume: 18000000000, price: 3400, change: 2.8, volatility: 0.06, sentiment: 0.75, history: [3300, 3350, 3400, 3420, 3400] }
  ]
};

const THEME = {
  dark: {
    '--bg': '#181c24', '--text': '#f5f7fa', '--card': '#232a36', '--accent': '#00e676', '--danger': '#ff1744', '--muted': '#888', '--border': '#2c3442'
  },
  light: {
    '--bg': '#f5f7fa', '--text': '#222', '--card': '#fff', '--accent': '#1e90ff', '--danger': '#ff1744', '--muted': '#888', '--border': '#e0e0e0'
  }
};

let currentCategory = 'DeFi';
let currentTheme = 'dark';
let filter = '';

function setTheme(theme) {
  currentTheme = theme;
  const root = document.documentElement;
  Object.entries(THEME[theme]).forEach(([k, v]) => root.style.setProperty(k, v));
  document.getElementById('theme-toggle').textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}

function renderCategories() {
  const nav = document.getElementById('category-nav');
  nav.innerHTML = '';
  Object.keys(ASSET_CATEGORIES).forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = 'cat-btn' + (cat === currentCategory ? ' active' : '');
    btn.onclick = () => { currentCategory = cat; renderAssets(); };
    nav.appendChild(btn);
  });
}

function renderAssets() {
  const list = document.getElementById('asset-list');
  list.innerHTML = '';
  let assets = ASSET_CATEGORIES[currentCategory];
  if (filter) {
    assets = assets.filter(a => a.name.toLowerCase().includes(filter) || a.symbol.toLowerCase().includes(filter));
  }
  assets.forEach(asset => {
    const card = document.createElement('div');
    card.className = 'asset-card';
    card.innerHTML = `
      <div class="asset-header">
        <span class="asset-symbol">${asset.symbol}</span>
        <span class="asset-name">${asset.name}</span>
      </div>
      <div class="asset-metrics">
        <div><strong>Price:</strong> $${asset.price}</div>
        <div><strong>24h Change:</strong> <span style="color:${asset.change >= 0 ? 'var(--accent)' : 'var(--danger)'}">${asset.change}%</span></div>
        <div><strong>Market Cap:</strong> $${formatNum(asset.marketCap)}</div>
        <div><strong>Volume:</strong> $${formatNum(asset.volume)}</div>
        <div><strong>Volatility:</strong> ${Math.round(asset.volatility * 100)}%</div>
        <div><strong>Sentiment:</strong> <span style="color:var(--accent)">${Math.round(asset.sentiment * 100)}%</span></div>
      </div>
      <canvas class="asset-chart" width="180" height="60"></canvas>
    `;
    list.appendChild(card);
    drawChart(card.querySelector('canvas'), asset.history, asset.change >= 0 ? '#00e676' : '#ff1744');
  });
}

function drawChart(canvas, data, color) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  const max = Math.max(...data), min = Math.min(...data);
  data.forEach((v, i) => {
    const x = (i / (data.length - 1)) * (canvas.width - 10) + 5;
    const y = canvas.height - 10 - ((v - min) / (max - min || 1)) * (canvas.height - 20);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function formatNum(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n;
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderAssets();
  setTheme(currentTheme);
  document.getElementById('theme-toggle').onclick = () => setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  document.getElementById('asset-filter').oninput = e => {
    filter = e.target.value.trim().toLowerCase();
    renderAssets();
  };
});