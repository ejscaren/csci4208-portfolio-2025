const config = new Object();
config.type = Phaser.CANVAS; //HTML Rendering API
config.scene = [ TitleScene, Level1, Level2 ]; //Scenes in this game
config.width = 32 * 24; //32px/tile * 96 tiles/world
config.height = 32 * 16; //32px/tile * 16 tiles/world
config.pixelArt = true; //optimized for pixel art
config.physics = { default:'arcade'}; //Physics: collisions & gravity

const game = new Phaser.Game(config); //Start game with these configs


