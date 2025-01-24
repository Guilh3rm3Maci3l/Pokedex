document.addEventListener("DOMContentLoaded", () => {
    const offset = 0;
    const limit = 200;

    // Função para converter os dados do Pokémon em HTML
    function convertpokemontoli(pokemon) {
        return `
            <li class="pokemon">
                <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ul class="types">
                        ${pokemon.types.map((type) => `<li class="type">${type.type.name}</li>`).join('')}
                    </ul>
                    <img src="${pokemon.sprites.other['dream_world'].front_default}" alt="${pokemon.name}">
                </div>
            </li>
        `;
    }

    const pokemonlist = document.getElementById('pokemonlist');

    // Obtém os Pokémons e renderiza
    pokeApi.getpokemons(offset, limit).then((pokemons = []) => {
        const newlist = pokemons.map((pokemon) => convertpokemontoli(pokemon));
        pokemonlist.innerHTML = newlist.join('');
    }).catch((error) => {
        console.error("Erro ao renderizar a lista de Pokémons:", error);
    });
});
