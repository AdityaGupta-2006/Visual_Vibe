// DOM Elements
const gallery = document.getElementById('visualvibe-gallery');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

// API Configuration
const PEXELS_KEY = 'BO6CWOeFvhiexGGhSdNmiEKphMRqXlFV4GnHuBLqFnZ6EtUTFVfQ1gOf';

// State Management
let currentCategory = 'all';
let currentOrientation = ''; 
let currentPage = 1;

// --- Dark/Light Mode Logic ---
function toggleTheme() {
  const body = document.documentElement;
  const icon = document.getElementById('themeIcon');
  
  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
    icon.className = 'fas fa-moon';
  } else {
    body.setAttribute('data-theme', 'dark');
    icon.className = 'fas fa-sun';
  }
}

// --- Search Logic ---
function handleSearch(event) {
  if (event.key === 'Enter' && searchInput.value.trim() !== '') {
    currentCategory = searchInput.value.trim();
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    resetGallery();
  }
}

// --- Filter & Sort Logic ---
function setFilter(category, btn) {
  currentCategory = category;
  searchInput.value = ''; 
  
  document.querySelectorAll('#filterContainer .filter-btn').forEach(b => b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  
  resetGallery();
}

function applySort() {
  currentOrientation = sortSelect.value;
  resetGallery();
}

function resetGallery() {
  gallery.innerHTML = '';
  currentPage = 1; 
  initBoard();
}

// --- API Fetching Logic ---
async function fetchPexelsBatch(query, count) {
  try {
    let apiUrl = `https://api.pexels.com/v1/search?query=${query}&per_page=${count}&page=${currentPage}`;
    
    if (currentOrientation !== '') {
      apiUrl += `&orientation=${currentOrientation}`;
    }

    const response = await fetch(apiUrl, {
      headers: { Authorization: PEXELS_KEY }
    });
    const data = await response.json();
    return data.photos; 
  } catch (e) { 
    console.error("Fetch error:", e);
    return []; 
  }
}

// --- Interaction Logic ---
function toggleLike(btnElement) {
  btnElement.classList.toggle('liked');
  const icon = btnElement.querySelector('i');
  if (btnElement.classList.contains('liked')) {
    icon.classList.remove('far'); 
    icon.classList.add('fas');   
  } else {
    icon.classList.remove('fas');
    icon.classList.add('far');
  }
}

// --- DOM Manipulation ---
async function loadBatch(count) {
  let queryToUse = currentCategory;
  
  // Mix it up if 'All' is selected
  if (currentCategory === 'all') {
    const categories = ['animals', 'nature', 'people', 'technology', 'architecture', 'car'];
    queryToUse = categories[Math.floor(Math.random() * categories.length)];
  }

  const photos = await fetchPexelsBatch(queryToUse, count);

  photos.forEach(photo => {
    // Build Card Container
    const card = document.createElement('div');
    card.className = 'image-card';

    // Build Image
    const img = document.createElement('img');
    img.src = photo.src.large;
    img.className = 'feed-image';
    img.alt = photo.alt || 'VisualVibe Image';
    img.loading = "lazy";

    // Build Hover Overlay
    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    
    // Top Section (Like Button)
    const topSection = document.createElement('div');
    topSection.className = 'interaction-top';
    topSection.innerHTML = `
      <button class="like-btn" onclick="toggleLike(this)">
        <i class="far fa-heart"></i>
      </button>
    `;

    // Bottom Section (Photographer & View Link)
    const bottomSection = document.createElement('div');
    bottomSection.className = 'interaction-bottom';
    bottomSection.innerHTML = `
      <span style="color: white; font-weight: 500; font-size: 14px; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${photo.photographer}</span>
      <a href="${photo.url}" target="_blank" class="view-btn">View</a>
    `;

    // Assemble Card
    overlay.appendChild(topSection);
    overlay.appendChild(bottomSection);
    card.appendChild(img);
    card.appendChild(overlay);
    
    // Add to Gallery
    gallery.appendChild(card);
  });

  currentPage++; 
}

function loadMore() {
  loadBatch(12); // Load 12 new images
}

function initBoard() {
  loadBatch(20); // Initial load is larger
}

// Start the application
initBoard();