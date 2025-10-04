// src/TitleScene.js
class TitleScene extends Phaser.Scene {
constructor() {
super('title'); // Register scene with key 'title'
}
create() {
// We will add content here in the next step
this.create_title()
this.input.keyboard.on('keydown-SPACE', () => { this.scene.start('Level1'); });

}

create_title() {
const width = this.game.config.width;
const height = this.game.config.height;
// Game Title
let font_config = { fontSize: '48px', fill: '#FFFFFF'};
const game_title = this.add.text(width / 2, height / 3, 'Platformer GAME', font_config);
game_title.setOrigin(0.5);
game_title.setResolution(1);
// Instructions
font_config = {fontSize: '24px', fill: '#FFFFFF', align: 'center'};
const instruction_text = this.add.text(width/2, height/2, 'Arrow Keys to Move & Jump', font_config)
instruction_text.setOrigin(0.5)
instruction_text.setResolution(1);
// Start prompt
font_config = { fontSize: '24px',fill: '#FFFF00'};
const start_text = this.add.text(width / 2, height * 2 / 3, 'Press SPACE to Start', font_config)
start_text.setOrigin(0.5);
start_text.setResolution(1);
}

}
