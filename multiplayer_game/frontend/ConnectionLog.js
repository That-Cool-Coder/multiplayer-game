class ConnectionLog extends spnr.GameEngine.Entity {
    textStyle = {
        fontSize: 15,
        fill: 0xffffff,
        stroke: 0x000000
    };

    maxLogItems = 15;
    logItemSpacing = 20;

    constructor() {
        super('ConnectionLog', spnr.v(0, 0), 0);
    }

    logData(data) {
        var position = spnr.v(10, (this.children.length + 0.5) * this.logItemSpacing)
        var label = new spnr.GameEngine.Label('LoggedData', data,
            position, spnr.PI, this.textStyle, spnr.v(0, 0))
        this.addChild(label);

        if (this.children.length > this.maxLogItems) this.deleteOldestLogItem();
    }

    deleteOldestLogItem() {
        this.removeChild(this.children[0]);
        for (var child of this.children) {
            child.localPosition.y -= this.logItemSpacing;
        }
    }
}