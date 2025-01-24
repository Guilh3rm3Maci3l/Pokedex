const offset = 0;
const limit = 10;
const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

function convertpokemontoli(pokemon) {
      return `
                <li class="pokemon">
                <span class="number">#001</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ul class="types">
                        <li class="type">Grass</li>
                        <li class="type">Poison</li>
                    </ul>
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/1.svg" 
                    alt="${pokemon.name}">
                </div>
            </li>
      `

}
const pokemonlist = document.getElementById('pokemonlist');
fetch(url)
    .then((response) => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => {

        for(let i = 0; i < pokemons.length; i++) {
            const pokemon = pokemons[i];
            pokemonlist.innerHTML += convertpokemontoli(pokemon) 
        }
    })
    .catch((error) => console.error(error));
     