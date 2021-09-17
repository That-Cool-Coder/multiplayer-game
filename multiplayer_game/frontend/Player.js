class PlayerData {
    constructor(player_id, position) {
        this.player_id = player_id;
        this.position = spnr.v.copy(position);
    }
}

class Player extends spnr.GameEngine.DrawableEntity {
    static texture = PIXI.Texture.WHITE;
    texture = Player.texture;
    static size = spnr.v(50, 50);
    size = Player.size;
    speed = 100;
    
    constructor(playerData) {
        super('Player', playerData.position, 0, Player.texture, Player.size);
        this.addTag('Player');
        this.playerData = playerData;
    }

    update() {
        this.localPosition = this.playerData.position;
    }
}