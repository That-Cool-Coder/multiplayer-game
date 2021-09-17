const canvasSize = spnr.v(800, 500);
spnr.GameEngine.init(canvasSize, 1, 0x000000);

const canvasSizer = new spnr.GameEngine.FixedARCanvasSizer(canvasSize, spnr.v(20, 20));
spnr.GameEngine.selectCanvasSizer(canvasSizer);

const game = new Game();
spnr.GameEngine.selectScene(game);