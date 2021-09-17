class Game extends spnr.GameEngine.Scene {
    constructor() {
        super('Game');

        this.socket = io.connect('', {
            // auth: this.passwordInput.value,
        });

        this.socket.on('connect', () => {
            this.player = new ControllablePlayer(spnr.v(100, 100));
            this.addChild(this.player);
            this.otherPlayers = {};
        });

        this.socket.on('set_player_id', playerId => {
            this.player.playerData.player_id = playerId;
            spnr.dom.logToPara(`Joined as player #${playerId}`);
        })

        this.socket.on('init_other_players', playerDatas => {
            for (var playerId in playerDatas) {
                this.createNewPlayer(playerDatas[playerId]);
            }
        });
        
        this.socket.on('player_joined', newPlayerData => {
            if (this.player.player_id != -1 &&
                newPlayerData.player_id != this.player.playerData.player_id) {
                this.createNewPlayer(newPlayerData);
                spnr.dom.logToPara(`Player #${newPlayerData.player_id} has joined`);
            }
        });

        this.socket.on('player_left', playerId => {
            if (playerId in this.otherPlayers) {
                var player = this.otherPlayers[playerId];
                player.parent.removeChild(player);
                delete this.otherPlayers[playerId];
                spnr.dom.logToPara(`Player #${playerId} has left`);
            }
        });

        this.socket.on('set_player_datas', newPlayerDatas => {
            for (var playerData of newPlayerDatas) {
                if (this.player.player_id == -1 ||
                    playerData.player_id == this.player.playerData.player_id ||
                    ! playerData.player_id in this.otherPlayers) continue;
                this.otherPlayers[playerData.player_id].playerData = playerData;
            }
        });
    }

    createNewPlayer(playerData) {
        var newPlayer = new Player(playerData);
        this.addChild(newPlayer);
        this.otherPlayers[playerData.player_id] = newPlayer;
    }

    update() {
        if (this.player != undefined) {
            this.socket.emit('update_player_data', this.player.playerData);
        }
    }
}