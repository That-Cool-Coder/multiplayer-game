class Game extends spnr.GameEngine.Scene {
    sendMessageKey = 'KeyT';
    sendMessageKeyDownLastFrame = false;
    instructionsTextStyle = {
        fontSize: 20,
        fill: 0xffffff,
        stroke: 0x000000
    };
    instructionsText = 'Use the arrow keys to move. Press "t" to a send message in the chat.';

    constructor() {
        super('Game');

        this.connectionLog = new ConnectionLog();
        this.addChild(this.connectionLog);

        var instructionsPosition = spnr.v(spnr.GameEngine.canvasSize.x / 2,
            spnr.GameEngine.canvasSize.y - 50);
        var instructions = new spnr.GameEngine.Label('Instructions', this.instructionsText,
            instructionsPosition, spnr.PI, this.instructionsTextStyle);
        this.addChild(instructions);

        this.socket = io.connect('', {
            // auth: this.passwordInput.value,
        });

        this.socket.on('connect', () => {
            this.player = new ControllablePlayer(
                spnr.v.random(spnr.v(0, 0), spnr.GameEngine.canvasSize));
            this.addChild(this.player);
            this.otherPlayers = {};
        });

        this.socket.on('set_player_id', playerId => {
            this.player.playerData.player_id = playerId;
            this.connectionLog.logData(`Joined as player #${playerId}`);
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
                this.connectionLog.logData(`Player #${newPlayerData.player_id} has joined`);
            }
        });

        this.socket.on('player_left', playerId => {
            if (playerId in this.otherPlayers) {
                var player = this.otherPlayers[playerId];
                player.parent.removeChild(player);
                delete this.otherPlayers[playerId];
                this.connectionLog.logData(`Player #${playerId} has left`);
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

        this.socket.on('new_chat_message', message => {
            if (message.player_id != this.player.playerData.player_id &&
                this.player.playerData.player_id != -1) {
                this.connectionLog.logData(
                    `Message from player #${message.player_id}: ${message.content}`);
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

        if (spnr.GameEngine.keyboard.keyIsDown(this.sendMessageKey)) {
            if (! this.sendMessageKeyDownLastFrame) {
                var messageContent = prompt('Enter message content:');
                this.socket.emit('send_chat_message', messageContent);
            }
            this.sendMessageKeyDownLastFrame = true;
        }
        else this.sendMessageKeyDownLastFrame = false;
    }
}