class ControllablePlayer extends Player {
    speed = 100;

    constructor(localPosition) {
        super(new PlayerData(-1, localPosition));
        this.setTint(0xff0000);
    }

    update() {
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowUp')) {
            this.localPosition.y -= this.speed *= spnr.GameEngine.deltaTime;
        }
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowDown')) {
            this.localPosition.y += this.speed *= spnr.GameEngine.deltaTime;
        }
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowLeft')) {
            this.localPosition.x -= this.speed *= spnr.GameEngine.deltaTime;
        }
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowRight')) {
            this.localPosition.x += this.speed *= spnr.GameEngine.deltaTime;
        }
    }
}