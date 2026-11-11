/* =====================================================
   LEILÃO! — MULTIPLAYER.JS
   Gerenciador Auxiliar de Conexão e Eventos de Rede (Supabase)
===================================================== */

const Multiplayer = {
    isConnected: false,

    // Inicializa o gerenciador multiplayer
    init() {
        this.checkSupabaseConnection();
        console.log('Módulo Multiplayer inicializado.');
    },

    // Verifica se o Supabase Client está disponível na página
    checkSupabaseConnection() {
        if (typeof supabaseClient !== 'undefined' && supabaseClient) {
            this.isConnected = true;
            console.log('Supabase conectado com sucesso para multiplayer.');
        } else {
            this.isConnected = false;
            console.warn('Supabase não detectado. O jogo funcionará em modo simulado/local.');
        }
    },

    // Desconecta e limpa canais ativos do Supabase
    disconnect() {
        if (typeof Sala !== 'undefined' && Sala.channel && typeof supabaseClient !== 'undefined' && supabaseClient) {
            supabaseClient.removeChannel(Sala.channel);
            Sala.channel = null;
        }
        this.isConnected = false;
        console.log('Desconectado do multiplayer.');
    },

    // Envia eventos genéricos para a sala através do canal ativo
    sendEvent(eventName, payload) {
        if (typeof Sala !== 'undefined' && Sala.channel) {
            Sala.channel.send({
                type: 'broadcast',
                event: eventName,
                payload: payload
            }).catch(err => {
                console.error(`Erro ao enviar evento multiplayer (${eventName}):`, err);
            });
        }
    }
};

// Inicializa o módulo Multiplayer ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    Multiplayer.init();
});