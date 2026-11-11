/* =====================================================
   LEILÃO! — LEILAO.JS
   Gerenciador da Lógica do Leilão e Lances em Tempo Real
===================================================== */

const Leilao = {
    timerInterval: null,

    // Banco de Dados Completo do Leilão (Escudos e Jogadores por Posição)
    database: {
        escudos: [
            { id: 'esc_barcelona', name: 'Barcelona', image: 'Barcelona.png' },
            { id: 'esc_realmadrid', name: 'Real Madrid', image: 'RealMadrid.png' },
            { id: 'esc_chelsea', name: 'Chelsea', image: 'Chelsea.png' },
            { id: 'esc_liverpool', name: 'Liverpool', image: 'Liverpool.png' },
            { id: 'esc_milan', name: 'Milan', image: 'Milan.png' },
            { id: 'esc_juventus', name: 'Juventus', image: 'Juventus.png' },
            { id: 'esc_flamengo', name: 'Flamengo', image: 'Flamengo.png' },
            { id: 'esc_santos', name: 'Santos', image: 'Santos.png' },
            { id: 'esc_palmeiras', name: 'Palmeiras', image: 'Palmeiras.png' },
            { id: 'esc_bayern', name: 'Bayern de Munique', image: 'Bayern.png' },
            { id: 'esc_intermiami', name: 'Inter Miami', image: 'InterMiami.png' },
            { id: 'esc_psg', name: 'PSG', image: 'PSG.png.png' }
        ],
        GOL: [
            { id: 'gol_alisson', name: 'Alisson', image: 'Alisson.png', position: 'GOL' },
            { id: 'gol_rossi', name: 'Rossi', image: 'Rossi.png', position: 'GOL' },
            { id: 'gol_taffarel', name: 'Taffarel', image: 'Taffarel.png', position: 'GOL' },
            { id: 'gol_buffon', name: 'Buffon', image: 'Buffon.png', position: 'GOL' },
            { id: 'gol_hugosouza', name: 'Hugo Souza', image: 'HugoSouza.png', position: 'GOL' },
            { id: 'gol_cassio', name: 'Cássio', image: 'Cássio.png', position: 'GOL' },
            { id: 'gol_fabio', name: 'Fábio', image: 'Fábio.png', position: 'GOL' },
            { id: 'gol_neuer', name: 'Neuer', image: 'Neuer.png', position: 'GOL' },
            { id: 'gol_rogerioceni', name: 'Rogério Ceni', image: 'RogérioCeni.png', position: 'GOL' }
        ],
        FIXO: [
            { id: 'fix_vandijk', name: 'Van Dijk', image: 'VanDijk.png', position: 'FIXO' },
            { id: 'fix_leopereira', name: 'Léo Pereira', image: 'LéoPereira.png', position: 'FIXO' },
            { id: 'fix_marquinhos', name: 'Marquinhos', image: 'Marquinhos.png', position: 'FIXO' },
            { id: 'fix_thiagosilva', name: 'Thiago Silva', image: 'ThiagoSilva.png', position: 'FIXO' },
            { id: 'fix_davidluiz', name: 'David Luiz', image: 'DavidLuiz.png', position: 'FIXO' },
            { id: 'fix_leopele', name: 'Léo Pelé', image: 'LéoPele.png', position: 'FIXO' },
            { id: 'fix_bastoni', name: 'Bastoni', image: 'Bastoni.png', position: 'FIXO' },
            { id: 'fix_maldini', name: 'Maldini', image: 'Maldini.png', position: 'FIXO' },
            { id: 'fix_gabrielmagalhaes', name: 'Gabriel Magalhães', image: 'GabrielMagalhães.png', position: 'FIXO' },
            { id: 'fix_casemiro', name: 'Casemiro', image: 'Casemiro.png', position: 'FIXO' }
        ],
        'ALA D': [
            { id: 'alad_messi', name: 'Messi', image: 'Messi.png', position: 'ALA D' },
            { id: 'alad_yamal', name: 'Yamal', image: 'Yamal.png', position: 'ALA D' },
            { id: 'alad_robben', name: 'Robben', image: 'Robben.png', position: 'ALA D' },
            { id: 'alad_rodinei', name: 'Rodinei', image: 'Rodinei.png', position: 'ALA D' },
            { id: 'alad_evertonribeiro', name: 'Everton Ribeiro', image: 'EvertonRibeiro.png', position: 'ALA D' },
            { id: 'alad_kaka', name: 'Kaká', image: 'Kaka.png', position: 'ALA D' },
            { id: 'alad_debruyne', name: 'De Bruyne', image: 'Debruyne.png', position: 'ALA D' },
            { id: 'alad_kroos', name: 'Kroos', image: 'Kroos.png', position: 'ALA D' },
            { id: 'alad_bale', name: 'Bale', image: 'Bale.png', position: 'ALA D' }
        ],
        'ALA E': [
            { id: 'alae_cr7', name: 'Cristiano Ronaldo', image: 'CristianoRonaldo.png', position: 'ALA E' },
            { id: 'alae_ronaldinho', name: 'Ronaldinho', image: 'Ronaldinho.png', position: 'ALA E' },
            { id: 'alae_robinho', name: 'Robinho', image: 'Robinho.png', position: 'ALA E' },
            { id: 'alae_cebolinha', name: 'Cebolinha', image: 'Cebolinha.png', position: 'ALA E' },
            { id: 'alae_brunhenrique', name: 'Bruno Henrique', image: 'BrunoHenrique.png', position: 'ALA E' },
            { id: 'alae_dimaria', name: 'Dí Maria', image: 'DíMaria.png', position: 'ALA E' },
            { id: 'alae_doue', name: 'Doué', image: 'Doué.png', position: 'ALA E' },
            { id: 'alae_neymar', name: 'Neymar Jr', image: 'NeymarJr.png', position: 'ALA E' },
            { id: 'alae_iniesta', name: 'Iniesta', image: 'Iniesta.png', position: 'ALA E' },
            { id: 'alae_mbappe', name: 'Mbappé', image: 'Mbappe.png', position: 'ALA E' }
        ],
        PIVO: [
            { id: 'piv_haaland', name: 'Haaland', image: 'Haaland.png', position: 'PIVO' },
            { id: 'piv_ronaldofenomeno', name: 'Ronaldo Fenômeno', image: 'Ronaldofenomeno.png', position: 'PIVO' },
            { id: 'piv_suarez', name: 'Suárez', image: 'Suaréz.png', position: 'PIVO' },
            { id: 'piv_gabigol', name: 'Gabigol', image: 'Gabigol.png', position: 'PIVO' },
            { id: 'piv_pedro', name: 'Pedro', image: 'Pedro.png', position: 'PIVO' },
            { id: 'piv_romario', name: 'Romário', image: 'Romário.png', position: 'PIVO' },
            { id: 'piv_yurialberto', name: 'Yuri Alberto', image: 'YuriAlberto.png', position: 'PIVO' },
            { id: 'piv_depay', name: 'Depay', image: 'Depay.png', position: 'PIVO' },
            { id: 'piv_hulk', name: 'Hulk', image: 'Hulk.png', position: 'PIVO' }
        ]
    },

    // Ordem das Etapas do Leilão
    phases: [
        { type: 'escudos', categoryName: 'ESCUDO DO TIME', path: 'Assents/Escudos/' },
        { type: 'GOL', categoryName: 'GOLEIRO', path: 'Assents/Jogadores/' },
        { type: 'FIXO', categoryName: 'FIXO', path: 'Assents/Jogadores/' },
        { type: 'ALA D', categoryName: 'ALA DIREITA', path: 'Assents/Jogadores/' },
        { type: 'ALA E', categoryName: 'ALA ESQUERDA', path: 'Assents/Jogadores/' },
        { type: 'PIVO', categoryName: 'PIVÔ', path: 'Assents/Jogadores/' }
    ],

    currentPhaseIndex: 0,
    auctionQueue: [],
    currentItemIndex: 0,

    // Inicia a partida e sincroniza via Supabase se for Host
    startMatch() {
        if (App.state.isHost && Sala.channel) {
            Sala.channel.send({
                type: 'broadcast',
                event: 'start_match',
                payload: {}
            });
        }
        this.initAuction();
    },

    // Prepara as filas de sorteio e abre a tela de Leilão
    initAuction() {
        this.currentPhaseIndex = 0;
        this.currentItemIndex = 0;

        // Monta e embaralha as listas para garantir sorteio aleatório
        this.preparePhaseQueue();
        App.showScreen('auction-screen');
        this.startItemAuction();
    },

    // Embaralha itens da etapa atual (Sorteia os jogadores/escudos)
    preparePhaseQueue() {
        const phase = this.phases[this.currentPhaseIndex];
        let rawList = [];

        if (phase.type === 'escudos') {
            rawList = [...this.database.escudos];
        } else {
            rawList = [...this.database[phase.type]];
        }

        // Função de Fisher-Yates para embaralhamento aleatório real
        this.auctionQueue = this.shuffleArray(rawList);
        this.currentItemIndex = 0;
    },

    shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },

    // Inicia o leilão do item atual na tela
    startItemAuction() {
        if (this.currentItemIndex >= this.auctionQueue.length) {
            // Avança para a próxima etapa se a fila atual acabou
            this.currentPhaseIndex++;
            if (this.currentPhaseIndex >= this.phases.length) {
                this.finishAuctionPhase();
                return;
            }
            this.preparePhaseQueue();
        }

        const phase = this.phases[this.currentPhaseIndex];
        const currentItem = this.auctionQueue[this.currentItemIndex];

        App.state.currentAuctionItem = { ...currentItem, phaseType: phase.type };
        App.state.highestBid = 0;
        App.state.highestBidder = null;
        App.state.auctionTimer = 20;

        this.updateAuctionUI();
        this.startTimer();
    },

    // Controla o cronômetro regressivo de 20 segundos
    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const timerDisplay = document.getElementById('auction-timer');
        const timerContainer = document.querySelector('.auction-timer');

        this.timerInterval = setInterval(() => {
            App.state.auctionTimer--;

            if (timerDisplay) {
                timerDisplay.innerText = App.state.auctionTimer;
            }

            if (timerContainer) {
                if (App.state.auctionTimer <= 5) {
                    timerContainer.classList.add('urgent');
                } else {
                    timerContainer.classList.remove('urgent');
                }
            }

            if (App.state.auctionTimer <= 0) {
                clearInterval(this.timerInterval);
                this.endItemAuction();
            }
        }, 1000);
    },

    // Registrar Lance (+1 Moeda)
    placeBid() {
        const nextBid = App.state.highestBid + 1;

        if (App.state.coins < nextBid) {
            App.showNotification('Você não tem moedas suficientes para este lance!');
            return;
        }

        // Atualiza estado local
        App.state.highestBid = nextBid;
        App.state.highestBidder = App.state.playerName;

        // Transmite lance para outros jogadores via Broadcast Supabase
        if (Sala.channel) {
            Sala.channel.send({
                type: 'broadcast',
                event: 'place_bid',
                payload: {
                    playerName: App.state.playerName,
                    bidAmount: nextBid
                }
            });
        }

        this.updateBiddingUI();
    },

    // Encerra o leilão do item atual ao zerar os 20 segundos
    endItemAuction() {
        const item = App.state.currentAuctionItem;
        const winner = App.state.highestBidder;
        const cost = App.state.highestBid;

        if (winner && winner === App.state.playerName) {
            // Desconto automático de moedas
            App.state.coins -= cost;
            App.updateCoinsDisplay(App.state.coins);

            // Adiciona o item ao time do jogador
            if (item.phaseType === 'escudos') {
                App.state.myTeam.shield = item;
            } else {
                App.state.myTeam[item.phaseType] = item;
            }

            App.showNotification(`Parabéns! Você arrematou ${item.name} por ${cost} moedas!`);
        } else if (winner) {
            App.showNotification(`${winner} arrematou ${item.name} por ${cost} moedas!`);
        } else {
            App.showNotification(`Ninguém deu lance em ${item.name}. Item descartado.`);
        }

        this.currentItemIndex++;
        
        // Pequena pausa antes de sortear o próximo item
        setTimeout(() => {
            this.startItemAuction();
        }, 2000);
    },

    // Atualiza todos os componentes visuais da tela de leilão
    updateAuctionUI() {
        const phase = this.phases[this.currentPhaseIndex];
        const item = App.state.currentAuctionItem;

        const phaseDisplay = document.getElementById('auction-phase');
        const posDisplay = document.getElementById('auction-position');
        const categoryDisplay = document.getElementById('auction-category');
        const nameDisplay = document.getElementById('auction-player-name');
        const imgDisplay = document.getElementById('auction-image');
        const timerDisplay = document.getElementById('auction-timer');

        if (phaseDisplay) phaseDisplay.innerText = phase.categoryName;
        if (posDisplay) posDisplay.innerText = `ETAPA ${this.currentPhaseIndex + 1} DE 6`;
        if (categoryDisplay) categoryDisplay.innerText = phase.categoryName;
        if (nameDisplay) nameDisplay.innerText = item.name;

        if (imgDisplay) {
            imgDisplay.src = `${phase.path}${item.image}`;
            imgDisplay.alt = item.name;
        }

        if (timerDisplay) timerDisplay.innerText = '20';

        this.updateBiddingUI();
        this.updateParticipantsUI();
    },

    // Atualiza as informações do maior lance e licitante atual
    updateBiddingUI() {
        const highestBidDisplay = document.getElementById('highest-bid');
        const highestBidderDisplay = document.getElementById('highest-bidder');

        if (highestBidDisplay) {
            highestBidDisplay.innerText = App.state.highestBid;
        }

        if (highestBidderDisplay) {
            if (App.state.highestBidder) {
                highestBidderDisplay.innerText = `Maior lance: ${App.state.highestBidder}`;
            } else {
                highestBidderDisplay.innerText = 'Ninguém deu lance ainda.';
            }
        }
    },

    // Atualiza a lista de participantes e seus saldos de moedas
    updateParticipantsUI() {
        const listContainer = document.getElementById('auction-players-list');
        if (!listContainer) return;

        listContainer.innerHTML = '';
        const players = App.state.players || [{ name: App.state.playerName, coins: App.state.coins }];

        players.forEach(p => {
            const item = document.createElement('div');
            item.className = 'auction-participant';
            item.innerHTML = `
                <strong>${escapeHTML(p.name)}</strong>
                <span>💰 ${p.name === App.state.playerName ? App.state.coins : (p.coins || 50)}</span>
            `;
            listContainer.appendChild(item);
        });
    },

    // Finaliza todo o leilão e redireciona para a escalação do time
    finishAuctionPhase() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        App.showNotification('Leilão encerrado! Confira seu time montado.');

        if (typeof Times !== 'undefined' && Times.renderMyTeam) {
            Times.renderMyTeam();
        }
        App.showScreen('team-screen');
    }
};

// Escuta eventos broadcast de outros jogadores durante o leilão
document.addEventListener('DOMContentLoaded', () => {
    // Escutadores de eventos caso o Supabase Broadcast seja disparado externamente
    window.addEventListener('supabase_bid_received', (e) => {
        if (e.detail) {
            App.state.highestBid = e.detail.bidAmount;
            App.state.highestBidder = e.detail.playerName;
            Leilao.updateBiddingUI();
        }
    });
});