document.addEventListener("DOMContentLoaded", () => {
    const attackName = new URLSearchParams(window.location.search).get('move');
    if (!attackName) {
        alert("Nome do ataque não fornecido na URL.");
        return;
    }

    const attackInfoElement = document.getElementById("attack-info");
    const buttonsContainer = document.getElementById("buttons");

    // Função para carregar os detalhes do ataque
    function loadAttackDetails() {
        fetch(`https://pokeapi.co/api/v2/move/${attackName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Não foi possível obter os detalhes do ataque.');
                }
                return response.json();
            })
            .then(attack => {
                // Exibindo o nome do ataque
                const attackNameText = attack.name.charAt(0).toUpperCase() + attack.name.slice(1);
                
                // Formatando o poder, precisão, PP, e tipo do ataque
                const power = attack.power ? attack.power : 'Não disponível';
                const accuracy = attack.accuracy ? attack.accuracy : 'Não disponível';
                const pp = attack.pp ? attack.pp : 'Não disponível';
                const type = attack.type.name.charAt(0).toUpperCase() + attack.type.name.slice(1);

                // Exibindo as informações do ataque
                attackInfoElement.innerHTML = `
                    <h2>${attackNameText}</h2>
                    <h3>Tipo: ${type}</h3>
                    <h3>Poder: ${power}</h3>
                    <h3>Precisão: ${accuracy}</h3>
                    <h3>PP: ${pp}</h3>
                    <h3>Descrição:</h3>
                    <p>${attack.effect_entries ? attack.effect_entries[0].effect : 'Sem descrição disponível.'}</p>
                `;

                // Criação do botão de voltar
                buttonsContainer.innerHTML = `
                    <button id="back-to-index">Voltar à Pokédex</button>
                `;

                // Função para voltar à Pokédex
                function returnToPokedex() {
                    window.location.href = "../html/index.html"; // Substitua com o caminho correto da página inicial da Pokédex
                }

                // Adicionar evento ao botão de voltar
                const backButton = document.getElementById("back-to-index");
                backButton.addEventListener('click', returnToPokedex);
            })
            .catch(error => {
                console.error("Erro ao carregar os detalhes do ataque:", error);
                attackInfoElement.innerHTML = "<p>Erro ao carregar os detalhes do ataque. Verifique o nome e tente novamente.</p>";
            });
    }

    // Carregar os detalhes ao carregar a página
    loadAttackDetails();
});
