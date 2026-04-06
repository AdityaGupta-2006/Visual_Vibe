const gallery = document.getElementById('visualvibe-gallery');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

const PEXELS_KEY = 'BO6CWOeFvhiexGGhSdNmiEKphMRqXlFV4GnHuBLqFnZ6EtUTFVfQ1gOf';

let currentCategory = 'all';
let currentOrientation = ''; 
let currentPage = 1;

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

function handleSearch(event) {
  if (event.key === 'Enter' && searchInput.value.trim() !== '') {
    currentCategory = searchInput.value.trim();
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    resetGallery();
  }
}

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

async function loadBatch(count) {
  let queryToUse = currentCategory;
  

  if (currentCategory === 'all') {
    const categories = ['animals', 'nature', 'people', 'technology', 'architecture', 'car'];
    queryToUse = categories[Math.floor(Math.random() * categories.length)];
  }

  const photos = await fetchPexelsBatch(queryToUse, count);

  photos.forEach(photo => {

    const card = document.createElement('div');
    card.className = 'image-card';

    const img = document.createElement('img');
    img.src = photo.src.large;
    img.className = 'feed-image';
    img.alt = photo.alt || 'VisualVibe Image';
    img.loading = "lazy";


    const overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    
    const topSection = document.createElement('div');
    topSection.className = 'interaction-top';
    topSection.innerHTML = `
      <button class="like-btn" onclick="toggleLike(this)">
        <i class="far fa-heart"></i>
      </button>
    `;

    const bottomSection = document.createElement('div');
    bottomSection.className = 'interaction-bottom';
    bottomSection.innerHTML = `
      <span style="color: white; font-weight: 500; font-size: 14px; letter-spacing: 0.5px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${photo.photographer}</span>
      <a href="${photo.url}" target="_blank" class="view-btn">View</a>
    `;

    overlay.appendChild(topSection);
    overlay.appendChild(bottomSection);
    card.appendChild(img);
    card.appendChild(overlay);
    

    gallery.appendChild(card);
  });

  currentPage++; 
}

function loadMore() {
  loadBatch(12); 
}

function initBoard() {
  loadBatch(20); 
}


initBoard();