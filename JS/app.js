/* =====================================================
   LEILÃO! — APP.JS
   Gerenciador Principal do Estado do Jogo e Navegação
===================================================== */

const App = {
    // Estado Global da Aplicação
    state: {
        currentScreen: 'lobby-screen',
        playerName: '',
        roomCode: null,
        isHost: false,
        coins: 50,
        players: [],
        myTeam: {
            shield: null,
            GOL: null,
            FIXO: null,
            'ALA D': null,
            'ALA E': null,
            PIVO: null
        },
        currentAuctionItem: null,
        auctionTimer: 20,
        highestBid: 0,
        highestBidder: null,
        votes: {},
        hasVoted: false
    },

    // Inicialização da Aplicação
    init() {
        this.bindEvents();
        this.updateCoinsDisplay(50);
        this.showScreen('lobby-screen');
        console.log('App LEILÃO! Inicializado com sucesso.');
    },

    // Vinculação de Eventos Globais de Navegação e Interações
    bindEvents() {
        // Lobby -> Entrar no Futsal
        const openFutsalBtn = document.getElementById('open-futsal');
        if (openFutsalBtn) {
            openFutsalBtn.addEventListener('click', () => {
                this.showScreen('futsal-screen');
            });
        }

        // Futsal -> Voltar ao Lobby
        const backLobbyBtn = document.getElementById('back-lobby');
        if (backLobbyBtn) {
            backLobbyBtn.addEventListener('click', () => {
                this.showScreen('lobby-screen');
            });
        }

        // Criar Sala
        const createRoomBtn = document.getElementById('create-room');
        if (createRoomBtn) {
            createRoomBtn.addEventListener('click', () => {
                const nameInput = document.getElementById('player-name');
                const name = nameInput ? nameInput.value.trim() : '';

                if (!name) {
                    this.showNotification('Digite seu nome de jogador antes de criar a sala!');
                    return;
                }

                this.state.playerName = name;
                if (typeof Sala !== 'undefined' && Sala.createRoom) {
                    Sala.createRoom(name);
                } else {
                    this.showNotification('Módulo de sala ainda não foi carregado.');
                }
            });
        }

        // Entrar na Sala com Código
        const joinRoomBtn = document.getElementById('join-room');
        if (joinRoomBtn) {
            joinRoomBtn.addEventListener('click', () => {
                const nameInput = document.getElementById('player-name');
                const codeInput = document.getElementById('room-code-input');

                const name = nameInput ? nameInput.value.trim() : '';
                const code = codeInput ? codeInput.value.trim().toUpperCase() : '';

                if (!name) {
                    this.showNotification('Digite seu nome de jogador!');
                    return;
                }

                if (!code) {
                    this.showNotification('Digite o código da sala!');
                    return;
                }

                this.state.playerName = name;
                if (typeof Sala !== 'undefined' && Sala.joinRoom) {
                    Sala.joinRoom(code, name);
                } else {
                    this.showNotification('Módulo de sala ainda não foi carregado.');
                }
            });
        }

        // Sair da Sala de Espera
        const leaveRoomBtn = document.getElementById('leave-room');
        if (leaveRoomBtn) {
            leaveRoomBtn.addEventListener('click', () => {
                if (typeof Sala !== 'undefined' && Sala.leaveRoom) {
                    Sala.leaveRoom();
                }
                this.showScreen('futsal-screen');
            });
        }

        // Copiar Código da Sala
        const copyCodeBtn = document.getElementById('copy-room-code');
        if (copyCodeBtn) {
            copyCodeBtn.addEventListener('click', () => {
                const codeText = document.getElementById('room-code')?.innerText;
                if (codeText && codeText !== '--------') {
                    navigator.clipboard.writeText(codeText).then(() => {
                        this.showNotification('Código copiado para a área de transferência!');
                    }).catch(() => {
                        this.showNotification('Erro ao copiar código.');
                    });
                }
            });
        }

        // Começar Partida (Dono da Sala)
        const startGameBtn = document.getElementById('start-game');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => {
                if (typeof Leilao !== 'undefined' && Leilao.startMatch) {
                    Leilao.startMatch();
                }
            });
        }

        // Botão de Dar Lance (+1 Moeda)
        const placeBidBtn = document.getElementById('place-bid');
        if (placeBidBtn) {
            placeBidBtn.addEventListener('click', () => {
                if (typeof Leilao !== 'undefined' && Leilao.placeBid) {
                    Leilao.placeBid();
                }
            });
        }

        // Começar Votação
        const startVotingBtn = document.getElementById('start-voting');
        if (startVotingBtn) {
            startVotingBtn.addEventListener('click', () => {
                if (typeof Votacao !== 'undefined' && Votacao.startVoting) {
                    Votacao.startVoting();
                }
            });
        }

        // Confirmar Voto
        const confirmVoteBtn = document.getElementById('confirm-vote');
        if (confirmVoteBtn) {
            confirmVoteBtn.addEventListener('click', () => {
                if (typeof Votacao !== 'undefined' && Votacao.confirmVote) {
                    Votacao.confirmVote();
                }
            });
        }

        // Jogar Novamente
        const newGameBtn = document.getElementById('new-game');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                this.resetGameState();
                this.showScreen('futsal-screen');
            });
        }

        // Sair do Jogo e Voltar ao Lobby
        const returnLobbyBtn = document.getElementById('return-lobby');
        if (returnLobbyBtn) {
            returnLobbyBtn.addEventListener('click', () => {
                this.resetGameState();
                this.showScreen('lobby-screen');
            });
        }
    },

    // Gerenciador de Transição de Telas
    showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => screen.classList.remove('active'));

        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.state.currentScreen = screenId;
            window.scrollTo(0, 0);
        }
    },

    // Atualiza a exibição de moedas em todas as telas
    updateCoinsDisplay(amount) {
        this.state.coins = amount;
        const coinElements = [
            'lobby-coins',
            'futsal-coins',
            'waiting-coins',
            'auction-coins',
            'team-coins'
        ];

        coinElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.innerText = amount;
            }
        });
    },

    // Exibe notificações temporárias na tela
    showNotification(message, duration = 3500) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');

        if (notification && notificationMessage) {
            notificationMessage.innerText = message;
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, duration);
        }
    },

    // Exibe ou oculta a tela de carregamento (Loading)
    toggleLoading(show, message = 'Carregando...') {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingMessage = document.getElementById('loading-message');

        if (loadingScreen) {
            if (loadingMessage) loadingMessage.innerText = message;
            loadingScreen.hidden = !show;
        }
    },

    // Reinicia o estado do jogo para nova partida
    resetGameState() {
        this.state.coins = 50;
        this.state.roomCode = null;
        this.state.isHost = false;
        this.state.players = [];
        this.state.myTeam = {
            shield: null,
            GOL: null,
            FIXO: null,
            'ALA D': null,
            'ALA E': null,
            PIVO: null
        };
        this.state.currentAuctionItem = null;
        this.state.auctionTimer = 20;
        this.state.highestBid = 0;
        this.state.highestBidder = null;
        this.state.votes = {};
        this.state.hasVoted = false;

        this.updateCoinsDisplay(50);
        if (typeof Multiplayer !== 'undefined' && Multiplayer.disconnect) {
            Multiplayer.disconnect();
        }
    }
};

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});