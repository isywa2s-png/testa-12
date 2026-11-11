/* =====================================================
   LEILÃO! — VOTACAO.JS
   Gerenciador da Tela Final e Votação dos Melhores Elencos
===================================================== */

const Votacao = {
    selectedVoteFor: null,

    // Inicializa o módulo de votação e eventos dos botões
    init() {
        this.bindEvents();
        console.log('Módulo Votação inicializado.');
    },

    // Vincula os botões de interatividade da tela final
    bindEvents() {
        const confirmVoteBtn = document.getElementById('confirm-vote');
        if (confirmVoteBtn) {
            confirmVoteBtn.addEventListener('click', () => {
                this.submitVote();
            });
        }
    },

    // Prepara a tela de votação exibindo os times de todos os participantes
    prepareFinalScreen() {
        const teamsGrid = document.getElementById('final-teams');
        const votingOptionsContainer = document.getElementById('voting-options');
        const startVotingBtn = document.getElementById('start-voting');
        const confirmVoteBtn = document.getElementById('confirm-vote');
        const votingResultDiv = document.getElementById('voting-result');

        if (votingResultDiv) votingResultDiv.hidden = true;
        if (confirmVoteBtn) confirmVoteBtn.hidden = true;
        if (startVotingBtn) startVotingBtn.hidden = false;

        const players = App.state.players || [{ name: App.state.playerName || 'Jogador' }];
        
        // Renderiza cards dos times na grade superior
        if (teamsGrid) {
            teamsGrid.innerHTML = '';
            players.forEach(player => {
                // Se for o jogador atual, usa App.state.myTeam, senão simula/mostra o time básico
                const isMe = player.name === App.state.playerName;
                const teamData = isMe ? App.state.myTeam : (player.team || { shield: null, GOL: null, FIXO: null, 'ALA D': null, 'ALA E': null, PIVO: null });
                
                const shieldImg = teamData.shield ? `Assents/Escudos/${teamData.shield.image}` : 'Assents/Moedas/Moeda.png';

                const card = document.createElement('div');
                card.className = 'final-team-card';
                card.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
                        <img src="${shieldImg}" alt="Escudo">
                        <div>
                            <span class="section-tag">ELENCO</span>
                            <h3>${escapeHTML(player.name)}</h3>
                        </div>
                    </div>
                    <div style="font-size: 11px; color: var(--muted); display: grid; grid-template-columns: repeat(2, 1fr); gap: 5px;">
                        <div>🥅 GOL: <strong>${teamData.GOL ? escapeHTML(teamData.GOL.name) : '-'}</strong></div>
                        <div>🛡️ FIXO: <strong>${teamData.FIXO ? escapeHTML(teamData.FIXO.name) : '-'}</strong></div>
                        <div>⚡ ALA D: <strong>${teamData['ALA D'] ? escapeHTML(teamData['ALA D'].name) : '-'}</strong></div>
                        <div>⚡ ALA E: <strong>${teamData['ALA E'] ? escapeHTML(teamData['ALA E'].name) : '-'}</strong></div>
                        <div>🎯 PIVÔ: <strong>${teamData.PIVO ? escapeHTML(teamData.PIVO.name) : '-'}</strong></div>
                    </div>
                `;
                teamsGrid.appendChild(card);
            });
        }

        // Renderiza as opções de voto
        if (votingOptionsContainer) {
            votingOptionsContainer.innerHTML = '';
            players.forEach(player => {
                const option = document.createElement('button');
                option.className = 'vote-option';
                option.innerText = `Votar no time de ${player.name}`;
                option.dataset.playerName = player.name;

                option.addEventListener('click', () => {
                    // Remove seleção anterior
                    document.querySelectorAll('.vote-option').forEach(opt => opt.classList.remove('selected'));
                    option.classList.add('selected');
                    this.selectedVoteFor = player.name;

                    if (confirmVoteBtn) confirmVoteBtn.hidden = false;
                    App.showNotification(`Você selecionou o time de ${player.name}. Clique em Confirmar Voto.`);
                });

                votingOptionsContainer.appendChild(option);
            });
        }

        // Evento do botão Começar Votação
        if (startVotingBtn) {
            startVotingBtn.onclick = () => {
                startVotingBtn.hidden = true;
                App.showNotification('Votação iniciada! Escolha seu time favorito abaixo.');
            };
        }
    },

    // Confirma e registra o voto do jogador
    submitVote() {
        if (!this.selectedVoteFor) {
            App.showNotification('Selecione um time antes de confirmar o voto!');
            return;
        }

        // Salva voto no estado global
        App.state.votes[App.state.playerName] = this.selectedVoteFor;
        App.state.hasVoted = true;

        const confirmVoteBtn = document.getElementById('confirm-vote');
        const votingOptionsContainer = document.getElementById('voting-options');

        if (confirmVoteBtn) confirmVoteBtn.hidden = true;
        if (votingOptionsContainer) {
            votingOptionsContainer.style.pointerEvents = 'none';
            votingOptionsContainer.style.opacity = '0.7';
        }

        App.showNotification(`Voto registrado com sucesso em ${this.selectedVoteFor}!`);

        // Simula apuração e exibe vencedor após breve momento
        setTimeout(() => {
            this.showWinner(this.selectedVoteFor);
        }, 2000);
    },

    // Exibe o vencedor da votação na tela final
    showWinner(winnerName) {
        const votingResultDiv = document.getElementById('voting-result');
        const winnerDisplay = document.getElementById('winner-display');

        if (votingResultDiv && winnerDisplay) {
            votingResultDiv.hidden = false;
            winnerDisplay.innerHTML = `
                <h2 style="font-family: 'Barlow Condensed', sans-serif; font-size: 32px; color: var(--gold-light);">
                    ${escapeHTML(winnerName)}
                </h2>
                <p style="color: var(--muted); font-size: 12px; margin-top: 8px;">
                    O time mais votado pela galera! Parabéns pela montagem impecável.
                </p>
            `;
            
            // Faz scroll suave até o resultado
            votingResultDiv.scrollIntoView({ behavior: 'smooth' });
        }
    }
};

// Inicializa o módulo Votação ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    Votacao.init();
});