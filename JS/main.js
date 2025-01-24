document.addEventListener("DOMContentLoaded", () => {
    const pokemonlist = document.getElementById('pokemonlist');
    const offsetStep = 15; // Quantidade de Pokémon carregados por vez
    let offset = 0; // Offset inicial
    let isLoading = false; // Controle de carregamento
    let debounceTimeout;

    // Função para converter os dados do Pokémon em HTML
// Função para converter os dados do Pokémon em HTML
function convertpokemontoli(pokemon) {
    const primaryType = pokemon.types[0].type.name; // Pega o tipo primário do Pokémon
    return `
        <li class="pokemon ${primaryType}"> <!-- Classe dinâmica do tipo -->
            <span class="number">#${pokemon.id.toString().padStart(3, '0')}</span>
            <span class="name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</span>
            <div class="detail">
                <ul class="types">
                    ${pokemon.types.map((type) => `<li class="type">${type.type.name}</li>`).join('')}
                </ul>
                <a href="pokemon-details.html?id=${pokemon.id}">
                    <img src="${pokemon.sprites.other['dream_world'].front_default}" alt="${pokemon.name}" loading="lazy">
                </a>
            </div>
        </li>
    `;
}


    // Função para carregar Pokémon
    function loadPokemons() {
        if (isLoading) return; // Evita múltiplos carregamentos simultâneos
        isLoading = true;

        pokeApi.getpokemons(offset, offsetStep).then((pokemons = []) => {
            const newlist = pokemons.map((pokemon) => convertpokemontoli(pokemon));
            pokemonlist.innerHTML += newlist.join(''); // Adiciona ao conteúdo existente
            offset += offsetStep; // Incrementa o offset
            isLoading = false; // Finaliza o carregamento
        }).catch((error) => {
            console.error("Erro ao carregar Pokémons:", error);
            isLoading = false; // Finaliza o carregamento mesmo em caso de erro
        });
    }

    // Detecta quando o usuário chega próximo do final da página
    window.addEventListener('scroll', () => {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 100) {
                loadPokemons(); // Carrega mais Pokémon
            }
        }, 200); // Espera 200ms após o usuário parar de rolar
    });

    // Carrega os Pokémon iniciais
    loadPokemons();
});