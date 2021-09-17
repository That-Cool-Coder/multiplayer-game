class ControllablePlayer extends Player {
    speed = 200;

    constructor(localPosition) {
        super(new PlayerData(-1, localPosition));
        this.setTint(0xffffff);
    }

    update() {
        var movement = spnr.v(0, 0);
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowUp')) {
            movement.y -= 1;
        }
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowDown')) {
            movement.y += 1;
        }
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowLeft')) {
            movement.x -= 1;
        }
        if (spnr.GameEngine.keyboard.keyIsDown('ArrowRight')) {
            movement.x += 1;
        }
        if (spnr.v.magSq(movement) != 0) spnr.v.normalize(movement);
        spnr.v.mult(movement, this.speed * spnr.GameEngine.deltaTime);
        spnr.v.add(this.localPosition, movement);

        this.playerData.position = spnr.v.copy(this.localPosition);
    }
}