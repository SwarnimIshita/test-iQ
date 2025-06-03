// 3x3 Memory Matching Game
const CATEGORIES = {
  Animals: ['🐶', '🐱', '🐰', '🦊', '🐻'],
  Fruits: ['🍎', '🍌', '🍉', '🍇', '🍓'],
  Symbols: ['★', '♥', '☀️', '♣', '♦'],
  Emojis: ['😃', '😎', '😂', '😍', '🤩']
};

const TILE_COLORS = [
  '#ffb347', '#77dd77', '#aec6cf', '#f49ac2', '#b19cd9', '#ff6961', '#fdfd96', '#84b6f4', '#fdcae1'
];

let selectedCategory = 'Animals';
let tiles = [];
let revealed = [];
let matched = [];
let score = 0;
let turns = 0;
let firstTile = null;
let lock = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function pickTiles(category) {
  const items = CATEGORIES[category];
  // For 3x3, 9 tiles: 4 pairs + 1 single (odd tile out)
  let pairs = shuffle([...items]).slice(0, 4);
  let tileItems = [...pairs, ...pairs, shuffle([...items])[0]];
  tileItems = shuffle(tileItems).slice(0, 9);
  return tileItems;
}

function renderBoard() {
  const board = document.getElementById('memory-board');
  board.innerHTML = '';
  tiles.forEach((tile, idx) => {
    const div = document.createElement('div');
    div.className = 'memory-tile';
    div.setAttribute('tabindex', '0');
    div.setAttribute('aria-label', revealed.includes(idx) || matched.includes(idx) ? `Tile: ${tile}` : 'Hidden tile');
    div.style.background = matched.includes(idx) ? '#d4edda' : TILE_COLORS[idx];
    div.innerHTML = revealed.includes(idx) || matched.includes(idx) ? `<span>${tile}</span>` : '';
    div.onclick = () => selectTile(idx);
    div.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') selectTile(idx); };
    if (revealed.includes(idx) || matched.includes(idx)) div.classList.add('revealed');
    board.appendChild(div);
  });
}

function selectTile(idx) {
  if (lock || revealed.includes(idx) || matched.includes(idx)) return;
  if (revealed.length === 2) return;
  revealed.push(idx);
  renderBoard();
  if (revealed.length === 2) {
    lock = true;
    turns++;
    setTimeout(() => {
      const [i1, i2] = revealed;
      if (tiles[i1] === tiles[i2]) {
        matched.push(i1, i2);
        score++;
      }
      revealed = [];
      lock = false;
      renderBoard();
      updateStats();
      if (matched.length === 8) setTimeout(() => alert('You matched all pairs!'), 300);
    }, 800);
  }
  updateStats();
}

function updateStats() {
  document.getElementById('score').textContent = `Score: ${score}`;
  document.getElementById('turns').textContent = `Turns: ${turns}`;
}

function resetGame(category = selectedCategory) {
  selectedCategory = category;
  tiles = pickTiles(category);
  revealed = [];
  matched = [];
  score = 0;
  turns = 0;
  renderBoard();
  updateStats();
}

function renderCategoryButtons() {
  const catBar = document.getElementById('category-bar');
  catBar.innerHTML = '';
  Object.keys(CATEGORIES).forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = 'cat-btn' + (cat === selectedCategory ? ' active' : '');
    btn.onclick = () => resetGame(cat);
    btn.setAttribute('aria-pressed', cat === selectedCategory);
    catBar.appendChild(btn);
  });
}

window.onload = function() {
  renderCategoryButtons();
  resetGame();
};