/* =====================================================
   LEILÃO! — LOBBY.JS
   Gerenciador da Tela Principal (Lobby)
===================================================== */

const Lobby = {
    // Inicializa os eventos da tela do Lobby
    init() {
        this.bindEvents();
        console.log('Módulo Lobby inicializado.');
    },

    // Vincula interações e botões da interface do Lobby
    bindEvents() {
        // Botão para acessar o modo FUTSAL
        const openFutsalBtn = document.getElementById('open-futsal');
        if (openFutsalBtn) {
            openFutsalBtn.addEventListener('click', () => {
                this.enterFutsalMode();
            });
        }
    },

    // Prepara e realiza a transição para a tela de configuração do Futsal
    enterFutsalMode() {
        // Limpa mensagens anteriores ou campos de entrada se necessário
        const roomCodeInput = document.getElementById('room-code-input');
        if (roomCodeInput) {
            roomCodeInput.value = '';
        }

        // Navega para a tela de configuração do Futsal via App
        if (typeof App !== 'undefined' && App.showScreen) {
            App.showScreen('futsal-screen');
        }
    },

    // Atualiza as informações do jogador visíveis no Lobby
    updateLobbyUI() {
        if (typeof App !== 'undefined') {
            App.updateCoinsDisplay(App.state.coins || 50);
        }
    }
};

// Inicializa o módulo do Lobby assim que a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    Lobby.init();
});