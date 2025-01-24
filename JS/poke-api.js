const pokeApi = {};
pokeApi.getpokemons = (offset = 0, limit = 100) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => {
            const pokemonList = jsonBody.results;
            // Adiciona os detalhes individuais dos Pokémons
            return Promise.all(
                pokemonList.map((pokemon) => fetch(pokemon.url).then((res) => res.json()))
            );
        })
        .catch((error) => {
            console.error("Erro ao buscar Pokémons:", error);
        });
};
