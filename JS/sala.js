/* =====================================================
   LEILÃO! — SALA.JS
   Gerenciador da Sala de Espera e Multiplayer (Supabase)
===================================================== */

const Sala = {
    channel: null,

    // Cria uma nova sala de jogo
    async createRoom(playerName) {
        if (typeof App !== 'undefined') {
            App.toggleLoading(true, 'Criando sala de Futsal...');
        }

        // Gera um código alfanumérico aleatório de 6 caracteres
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        App.state.roomCode = roomCode;
        App.state.isHost = true;
        App.state.players = [{
            id: this.generatePlayerId(),
            name: playerName,
            isHost: true,
            coins: 50
        }];

        // Exibe o código na interface da sala de espera
        const codeDisplay = document.getElementById('room-code');
        if (codeDisplay) {
            codeDisplay.innerText = roomCode;
        }

        // Configura o botão de começar partida (visível apenas para o host)
        const startGameBtn = document.getElementById('start-game');
        if (startGameBtn) {
            startGameBtn.hidden = false;
            startGameBtn.disabled = true; // Desativado até ter pelo menos 1 jogador ou conforme regra
        }

        const waitingMsg = document.getElementById('waiting-message');
        if (waitingMsg) {
            waitingMsg.innerText = 'Aguardando amigos entrarem na sala...';
        }

        // Conecta ao canal do Supabase para multiplayer em tempo real
        await this.connectToRoom(roomCode, playerName, true);

        if (typeof App !== 'undefined') {
            App.toggleLoading(false);
            App.showScreen('waiting-screen');
            App.showNotification(`Sala ${roomCode} criada com sucesso!`);
        }

        this.updatePlayersUI();
    },

    // Entra em uma sala existente através do código
    async joinRoom(roomCode, playerName) {
        if (typeof App !== 'undefined') {
            App.toggleLoading(true, 'Entrando na sala...');
        }

        App.state.roomCode = roomCode;
        App.state.isHost = false;

        const codeDisplay = document.getElementById('room-code');
        if (codeDisplay) {
            codeDisplay.innerText = roomCode;
        }

        const startGameBtn = document.getElementById('start-game');
        if (startGameBtn) {
            startGameBtn.hidden = true; // Apenas o host pode ver/iniciar
        }

        const waitingMsg = document.getElementById('waiting-message');
        if (waitingMsg) {
            waitingMsg.innerText = 'Aguardando o criador iniciar a partida...';
        }

        // Conecta ao canal do Supabase
        const joined = await this.connectToRoom(roomCode, playerName, false);

        if (typeof App !== 'undefined') {
            App.toggleLoading(false);
            if (joined !== false) {
                App.showScreen('waiting-screen');
                App.showNotification(`Você entrou na sala ${roomCode}!`);
            } else {
                App.showNotification('Não foi possível entrar na sala. Verifique o código.');
            }
        }

        this.updatePlayersUI();
    },

    // Estabelece conexão com o canal do Supabase Realtime
    async connectToRoom(roomCode, playerName, isHost) {
        if (typeof supabaseClient === 'undefined' || !supabaseClient) {
            console.warn('Supabase Client não inicializado. Rodando em modo local/simulado.');
            return true;
        }

        try {
            // Remove canal anterior se houver
            if (this.channel) {
                supabaseClient.removeChannel(this.channel);
            }

            const playerId = this.generatePlayerId();
            App.state.myPlayerId = playerId;

            this.channel = supabaseClient.channel(`room_${roomCode}`, {
                config: {
                    presence: {
                        key: playerId,
                    },
                },
            });

            this.channel
                .on('presence', { event: 'sync' }, () => {
                    const state = this.channel.presenceState();
                    const playersList = [];

                    Object.keys(state).forEach(key => {
                        state[key].forEach(presence => {
                            playersList.push({
                                id: presence.id || key,
                                name: presence.name || 'Jogador',
                                isHost: presence.isHost || false,
                                coins: presence.coins || 50
                            });
                        });
                    });

                    App.state.players = playersList;
                    this.updatePlayersUI();
                })
                .on('broadcast', { event: 'start_match' }, () => {
                    if (typeof Leilao !== 'undefined' && Leilao.initAuction) {
                        Leilao.initAuction();
                    }
                });

            await this.channel.subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await this.channel.track({
                        id: playerId,
                        name: playerName,
                        isHost: isHost,
                        coins: 50,
                        online_at: new Date().toISOString(),
                    });
                }
            });

            return true;
        } catch (error) {
            console.error('Erro ao conectar na sala via Supabase:', error);
            return false;
        }
    },

    // Sai da sala atual e desconecta
    leaveRoom() {
        if (this.channel && typeof supabaseClient !== 'undefined') {
            supabaseClient.removeChannel(this.channel);
            this.channel = null;
        }

        App.state.roomCode = null;
        App.state.isHost = false;
        App.state.players = [];

        if (typeof App !== 'undefined') {
            App.showNotification('Você saiu da sala.');
        }
    },

    // Atualiza a interface da lista de jogadores na sala de espera
    updatePlayersUI() {
        const playersContainer = document.getElementById('waiting-players');
        const playerCounter = document.getElementById('player-counter');
        const startGameBtn = document.getElementById('start-game');

        const players = App.state.players || [];
        const totalPlayers = players.length;

        if (playerCounter) {
            playerCounter.innerText = `${totalPlayers}/8`;
        }

        if (playersContainer) {
            playersContainer.innerHTML = '';

            players.forEach(player => {
                const playerDiv = document.createElement('div');
                playerDiv.className = 'waiting-player';
                playerDiv.innerHTML = `
                    <img src="Assents/Moedas/Moeda.png" alt="Avatar">
                    <div>
                        <strong>${escapeHTML(player.name)}</strong>
                        <small>${player.isHost ? '👑 Criador' : '🎮 Participante'}</small>
                    </div>
                `;
                playersContainer.appendChild(playerDiv);
            });
        }

        // Habilita o botão de começar se houver pelo menos 1 jogador (ou regra customizada) e for o host
        if (startGameBtn && App.state.isHost) {
            startGameBtn.disabled = totalPlayers < 1;
        }
    },

    // Gera um ID único simples para o jogador atual
    generatePlayerId() {
        return 'user_' + Math.random().toString(36).substring(2, 9);
    }
};

// Função auxiliar para evitar XSS básico em nomes
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Inicialização do módulo Sala
document.addEventListener('DOMContentLoaded', () => {
    // Sala pronta para uso
});