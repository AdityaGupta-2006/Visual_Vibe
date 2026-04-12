let gallery = document.getElementById('visualvibe-gallery');
let searchInput = document.getElementById('searchInput');
let sortSelect = document.getElementById('sortSelect');

let PEXELS_KEY = 'BO6CWOeFvhiexGGhSdNmiEKphMRqXlFV4GnHuBLqFnZ6EtUTFVfQ1gOf';

let currentCategory = 'all';
let currentOrientation = ''; 
let currentPage = 1;

function toggleTheme() {
  let body = document.documentElement;
  let icon = document.getElementById('themeIcon');
  
  if (body.getAttribute('data-theme') === 'dark') {
    body.removeAttribute('data-theme');
    icon.className = 'fas fa-moon';
  } else {
    body.setAttribute('data-theme', 'dark');
    icon.className = 'fas fa-sun';
  }
}

function handleSearch(event) {
  if (event.key === 'Enter') {
    if (searchInput.value !== '') {
      currentCategory = searchInput.value;
      
      let buttons = document.querySelectorAll('.filter-btn');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
      }
      
      resetGallery();
    }
  }
}

function setFilter(category, btn) {
  currentCategory = category;
  searchInput.value = ''; 
  
  let buttons = document.querySelectorAll('#filterContainer .filter-btn');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove('active');
  }
  
  if (btn) {
    btn.classList.add('active');
  }
  
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
    let apiUrl = "https://api.pexels.com/v1/search?query=" + query + "&per_page=" + count + "&page=" + currentPage;
    
    if (currentOrientation !== '') {
      apiUrl = apiUrl + "&orientation=" + currentOrientation;
    }

    let response = await fetch(apiUrl, {
      headers: { Authorization: PEXELS_KEY }
    });
    
    let data = await response.json();
    return data.photos; 
    
  } catch (error) { 
    console.log("Fetch error:");
    console.log(error);
    return []; 
  }
}

function toggleLike(btnElement) {
  let icon = btnElement.querySelector('i');
  
  if (btnElement.classList.contains('liked')) {
    // If it is already liked, remove the like
    btnElement.classList.remove('liked');
    icon.classList.remove('fas');   
    icon.classList.add('far'); 
  } else {
    // If it is not liked, add the like
    btnElement.classList.add('liked');
    icon.classList.remove('far'); 
    icon.classList.add('fas');
  }
}

async function loadBatch(count) {
  let queryToUse = currentCategory;
  
  if (currentCategory === 'all') {
    let categories = ['animals', 'nature', 'people', 'technology', 'architecture', 'car'];
    let randomNumber = Math.floor(Math.random() * categories.length);
    queryToUse = categories[randomNumber];
  }

  let photos = await fetchPexelsBatch(queryToUse, count);

  // Using a traditional for loop instead of forEach
  for (let i = 0; i < photos.length; i++) {
    let photo = photos[i];

    let card = document.createElement('div');
    card.className = 'image-card';

    let img = document.createElement('img');
    img.src = photo.src.large;
    img.className = 'feed-image';
    img.loading = "lazy";

    let overlay = document.createElement('div');
    overlay.className = 'card-overlay';
    
    let topSection = document.createElement('div');
    topSection.className = 'interaction-top';
    topSection.innerHTML = "<button class='like-btn' onclick='toggleLike(this)'><i class='far fa-heart'></i></button>";

    let bottomSection = document.createElement('div');
    bottomSection.className = 'interaction-bottom';
    
    // Building the HTML string using basic addition
    let photographerName = "<span style='color: white; font-weight: bold; font-size: 14px; text-shadow: 0 2px 4px rgba(0,0,0,0.5);'>" + photo.photographer + "</span>";
    let viewLink = "<a href='" + photo.url + "' target='_blank' class='view-btn'>View</a>";
    bottomSection.innerHTML = photographerName + viewLink;

    overlay.appendChild(topSection);
    overlay.appendChild(bottomSection);
    card.appendChild(img);
    card.appendChild(overlay);
    
    gallery.appendChild(card);
  }

  // Adding 1 to the current page number
  currentPage = currentPage + 1; 
}

function loadMore() {
  loadBatch(12); 
}

function initBoard() {
  loadBatch(20); 
}

initBoard();