const canvasSize = spnr.v(400, 250);
const canvasSizer = new spnr.GameEngine.FixedARCanvasSizer(canvasSize, spnr.v(20, 20));
const game = new Game();

spnr.GameEngine.init(canvasSize, 1, 0x000000);
//spnr.GameEngine.selectCanvasSizer(canvasSizer);
spnr.GameEngine.selectScene(game);