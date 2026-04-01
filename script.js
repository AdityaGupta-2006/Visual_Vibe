document.addEventListener('DOMContentLoaded', () => {
  loadPokemonData();
});

async function loadPokemonData() {
  const container = document.getElementById('gallery-container');
  
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/pikachu');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const rawData = await response.json();
 
    container.innerHTML = '';


    const pikachuData = {
      id: rawData.id,

      title: rawData.name.charAt(0).toUpperCase() + rawData.name.slice(1),
      imageUrl: rawData.sprites.other['official-artwork'].front_default,
      hpStat: rawData.stats.find(s => s.stat.name === 'hp').base_stat,
      attackStat: rawData.stats.find(s => s.stat.name === 'attack').base_stat,
      layoutClass: "tall",
      tags: rawData.types.map(t => ({
        name: t.type.name.toUpperCase(),
        style: "tag-primary" 
      }))
    };

    const cardHTML = buildCardHTML(pikachuData);
    container.insertAdjacentHTML('beforeend', cardHTML);

  } catch (error) {
    console.error("Failed to load Pokémon data:", error);
    container.innerHTML = `<p style="color: #ff6e84;">Failed to load Pokémon data. Please check your connection.</p>`;
  }
}

function buildCardHTML(art) {
  const tagsHTML = art.tags.map(tag => 
    `<span class="tag ${tag.style}">${tag.name}</span>`
  ).join('');

  return `
    <article class="gallery-card ${art.layoutClass}" data-id="${art.id}">
      <div class="card-overlay"></div>
      <img src="${art.imageUrl}" alt="${art.title}" class="card-image"/>
      <div class="card-content">
        <div class="tags">
          ${tagsHTML}
        </div>
        <h3>${art.title}</h3>
        <div class="card-actions">
          <div class="stats">
            <div class="stat"><span class="material-symbols-outlined icon-filled color-secondary">favorite</span> ${art.hpStat} HP</div>
            <div class="stat"><span class="material-symbols-outlined color-tertiary">bolt</span> ${art.attackStat} ATK</div>
          </div>
          <button class="add-btn"><span class="material-symbols-outlined">add</span></button>
        </div>
      </div>
    </article>
  ` ;
}