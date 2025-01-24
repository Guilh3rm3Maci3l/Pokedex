document.addEventListener("DOMContentLoaded", () => {
    const pokemonId = new URLSearchParams(window.location.search).get('id');
    if (!pokemonId) {
        alert("ID do Pokémon não fornecido na URL.");
        return;
    }

    const pokemonNameElement = document.getElementById("pokemon-name");
    const pokemonDetailsElement = document.getElementById("pokemon-info");
    const buttonsContainer = document.getElementById("buttons");

    // Função para formatar as estatísticas do Pokémon
    function formatStats(stats) {
        return stats.map(stat => {
            return `
                <div>
                    <strong>${stat.stat.name}:</strong> ${stat.base_stat}
                </div>
            `;
        }).join('');
    }

    // Função para formatar as habilidades
    function formatAbilities(abilities) {
        return abilities.map(ability => {
            return `
                <div>
                    <strong>${ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}:</strong> 
                    ${ability.is_hidden ? "Escondida" : "Normal"}
                </div>
            `;
        }).join('');
    }

    // Função para formatar os movimentos
    function formatMoves(moves) {
        return moves.slice(0, 10).map(move => {
            return `<div>${move.move.name}</div>`;
        }).join('');
    }

    // Função para formatar fraquezas e pontos fortes
    function formatStrengthsAndWeaknesses(types) {
        const typeChart = {
            fire: { strongAgainst: ['grass', 'bug'], weakAgainst: ['water', 'rock', 'ground'] },
            water: { strongAgainst: ['fire', 'ground', 'rock'], weakAgainst: ['electric', 'grass'] },
            grass: { strongAgainst: ['water', 'ground', 'rock'], weakAgainst: ['fire', 'ice', 'poison', 'flying', 'bug'] },
            // Adicione outros tipos conforme necessário
        };

        const strengths = types.flatMap(type => typeChart[type]?.strongAgainst || []);
        const weaknesses = types.flatMap(type => typeChart[type]?.weakAgainst || []);

        return `
            <h3>Fraquezas</h3>
            ${weaknesses.length > 0 ? weaknesses.join(', ') : 'Nenhuma fraqueza específica'}
            <h3>Pontos Fortes</h3>
            ${strengths.length > 0 ? strengths.join(', ') : 'Nenhum ponto forte específico'}
        `;
    }

    // Função para carregar as evoluções
    function loadEvolutions(speciesUrl) {
        fetch(speciesUrl)
            .then(response => response.json())
            .then(species => {
                const evolutionChainUrl = species.evolution_chain.url;
                return fetch(evolutionChainUrl);
            })
            .then(response => response.json())
            .then(chain => {
                const evolutionIds = [];
                let current = chain.chain;

                // Obtém os IDs de evolução
                while (current) {
                    const pokemonId = current.species.url.split('/')[6]; // Extrai o ID do Pokémon da URL
                    evolutionIds.push(pokemonId);
                    current = current.evolves_to[0];
                }

                // Faz a busca das imagens de cada evolução
                const evolutionImagesPromises = evolutionIds.map(id => 
                    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
                        .then(response => response.json())
                        .then(data => ({
                            name: data.name,
                            image: data.sprites.other['dream_world'].front_default
                        }))
                );

                // Aguarda todas as imagens das evoluções
                Promise.all(evolutionImagesPromises)
                    .then(evolutions => {
                        const evolutionImagesHTML = evolutions.map(evolution => {
                            return `
                                <a href="pokemon-details.html?id=${evolution.name}">
                                    <img src="${evolution.image}" alt="${evolution.name}" title="${evolution.name}" style="width: 100px; height: 100px; object-fit: contain; margin: 10px;">
                                </a>
                            `;
                        }).join(' → ');

                        document.getElementById('evolution-info').innerHTML = `<h3>Evoluções:</h3>${evolutionImagesHTML}`;
                    });
            });
    }

    // Função para carregar os detalhes do Pokémon
    function loadPokemonDetails() {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível obter os dados do Pokémon.');
                }
                return response.json();
            })
            .then(pokemon => {
                pokemonNameElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

                const types = pokemon.types.map(type => type.type.name);
                const stats = formatStats(pokemon.stats);
                const abilities = formatAbilities(pokemon.abilities);
                const moves = formatMoves(pokemon.moves);
                const height = pokemon.height / 10;
                const weight = pokemon.weight / 10;

                pokemonDetailsElement.innerHTML = `
                    <h2>Tipo(s): ${types.join(', ')}</h2>
                    <img src="${pokemon.sprites.other['dream_world'].front_default}" alt="${pokemon.name}" />
                    <h3>Estatísticas</h3>
                    ${stats}
                    <h3>Habilidades</h3>
                    ${abilities}
                    <h3>Movimentos</h3>
                    ${moves}
                    <h3>Altura: ${height} m</h3>
                    <h3>Peso: ${weight} kg</h3>
                    <div id="strength-weakness-info">
                        ${formatStrengthsAndWeaknesses(types)}
                    </div>
                    <div id="evolution-info">
                        <!-- Evoluções serão carregadas aqui -->
                    </div>
                `;

                // Carregar evoluções do Pokémon
                loadEvolutions(pokemon.species.url);

                // Criar os botões
                buttonsContainer.innerHTML = `
                    <button id="return-button">Voltar à Pokédex</button>
                `;

                const returnButton = document.getElementById("return-button");
                returnButton.addEventListener('click', () => {
                    window.location.href = "index.html"; // Substitua conforme necessário
                });
            })
            .catch(error => {
                console.error("Erro ao carregar detalhes do Pokémon:", error);
                pokemonDetailsElement.innerHTML = "<p>Erro ao carregar os detalhes do Pokémon. Verifique o ID e tente novamente.</p>";
            });
    }

    // Carregar os detalhes ao carregar a página
    loadPokemonDetails();
});
