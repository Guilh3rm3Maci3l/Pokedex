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
            return `<div><strong>${stat.stat.name}:</strong> ${stat.base_stat}</div>`;
        }).join('');
    }

    // Função para formatar as habilidades
    function formatAbilities(abilities) {
        return abilities.map(ability => {
            return `<div><strong>${ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1)}:</strong> ${ability.is_hidden ? "Escondida" : "Normal"}</div>`;
        }).join('');
    }

    // Função para formatar os movimentos aprendidos naturalmente
    function formatMoves(moves) {
        return moves.filter(move => move.version_group_details.some(group => group.move_learn_method.name === "level-up"))
            .map(move => {
                const levelLearned = move.version_group_details.find(group => group.move_learn_method.name === "level-up").level_learned_at;
                return `<div><a href="../html/attack-details.html?move=${move.move.name}">${move.move.name}</a> - Nível ${levelLearned}</div>`;
            }).join('');
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

                // Detalhes adicionais
                const types = pokemon.types.map(type => type.type.name).join(', ');
                const stats = formatStats(pokemon.stats);
                const abilities = formatAbilities(pokemon.abilities);
                const moves = pokemon.moves;

                // Carrega os movimentos aprendidos naturalmente
                const naturalMoves = formatMoves(moves);

                // Exibe o Pokémon e movimentos naturais
                pokemonDetailsElement.innerHTML = `
                    <h2>Tipo(s): ${types}</h2>
                    <img src="${pokemon.sprites.other['dream_world'].front_default}" alt="${pokemon.name}" />
                    <h3>Estatísticas</h3>
                    ${stats}
                    <h3>Habilidades</h3>
                    ${abilities}
                    <h3>Movimentos Naturais</h3>
                    ${naturalMoves || "<p>Não há movimentos naturais para este Pokémon.</p>"}
                    <h3>Altura: ${pokemon.height / 10} m</h3>
                    <h3>Peso: ${pokemon.weight / 10} kg</h3>
                `;

                // Criação dos botões dinamicamente após carregar os dados
                buttonsContainer.innerHTML = `
                    <button id="return-button">Voltar à Pokédex</button>
                `;

                // Adiciona evento para o botão de voltar
                const returnButton = document.getElementById("return-button");
                returnButton.addEventListener('click', () => {
                    window.location.href = "../html/index.html"; // Ajuste o caminho conforme necessário
                });
            })
            .catch(error => {
                console.error("Erro ao carregar detalhes do Pokémon:", error);
                pokemonDetailsElement.innerHTML = "<p>Erro ao carregar os detalhes do Pokémon. Verifique o ID e tente novamente.</p>";
            });
    }

    // Carrega os detalhes ao carregar a página
    loadPokemonDetails();
});
