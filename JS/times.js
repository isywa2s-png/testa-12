/* =====================================================
   LEILÃO! — TIMES.JS
   Gerenciador da Escalação e Exibição do Elenco
===================================================== */

const Times = {
    // Inicializa o módulo de times
    init() {
        this.bindEvents();
        console.log('Módulo Times inicializado.');
    },

    // Vincula eventos da tela de escalação, se necessário
    bindEvents() {
        // Exemplo: transição automática para a tela final após conferir o time, 
        // ou botão opcional de avançar para votação caso exista na interface.
    },

    // Renderiza o time completo do jogador na tela (Team Screen)
    renderMyTeam() {
        const team = App.state.myTeam;
        const playerName = App.state.playerName || 'Meu Time';

        // Atualiza nome do time e escudo
        const teamNameEl = document.getElementById('team-name');
        const teamShieldEl = document.getElementById('team-shield');

        if (teamNameEl) {
            teamNameEl.innerText = `TIME DE ${playerName.toUpperCase()}`;
        }

        if (teamShieldEl && team.shield) {
            teamShieldEl.src = `Assents/Escudos/${team.shield.image}`;
            teamShieldEl.alt = team.shield.name;
        } else if (teamShieldEl) {
            teamShieldEl.src = 'Assents/Moedas/Moeda.png';
            teamShieldEl.alt = 'Sem Escudo';
        }

        // Renderiza cada posição do futsal
        this.renderPosition('team-gol', team.GOL, 'Goleiro');
        this.renderPosition('team-fixo', team.FIXO, 'Fixo');
        this.renderPosition('team-ala-d', team['ALA D'], 'Ala Direita');
        this.renderPosition('team-ala-e', team['ALA E'], 'Ala Esquerda');
        this.renderPosition('team-pivo', team.PIVO, 'Pivô');

        // Atualiza status do rodapé do time (Contador e Moedas restantes)
        const playerCountEl = document.getElementById('team-player-count');
        const teamBudgetEl = document.getElementById('team-budget');

        let count = 0;
        if (team.GOL) count++;
        if (team.FIXO) count++;
        if (team['ALA D']) count++;
        if (team['ALA E']) count++;
        if (team.PIVO) count++;

        if (playerCountEl) {
            playerCountEl.innerText = `${count}/5 JOGADORES`;
        }

        if (teamBudgetEl) {
            teamBudgetEl.innerText = `${App.state.coins} MOEDAS`;
        }

        // Após renderizar o próprio time, agenda a transição para a tela final de votação após alguns segundos
        setTimeout(() => {
            if (typeof Votacao !== 'undefined' && Votacao.prepareFinalScreen) {
                Votacao.prepareFinalScreen();
            }
            App.showScreen('final-screen');
        }, 5000);
    },

    // Renderiza um card de jogador em uma posição específica
    renderPosition(containerId, player, positionName) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        if (player) {
            const card = document.createElement('div');
            card.className = 'team-player-card';
            card.innerHTML = `
                <img src="Assents/Jogadores/${player.image}" alt="${escapeHTML(player.name)}">
                <div>
                    <strong>${escapeHTML(player.name)}</strong>
                    <small>${positionName}</small>
                </div>
            `;
            container.appendChild(card);
        } else {
            const empty = document.createElement('div');
            empty.className = 'team-player-card';
            empty.style.opacity = '0.5';
            empty.innerHTML = `
                <div style="padding: 10px; font-size: 11px; color: var(--muted);">
                    Nenhum jogador contratado
                </div>
            `;
            container.appendChild(empty);
        }
    }
};

// Inicializa o módulo Times ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    Times.init();
});