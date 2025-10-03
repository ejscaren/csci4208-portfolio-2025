class PlayScene extends Phaser.Scene {
//construct new scene
constructor() {
super('play'); //set this scene's id within superclass constructor

}
//preload external game assets
preload() {
this.load.path = 'assets/'; //Define file path
this.load.image( 'background', 'background.png' ); //Load tile images
this.load.image( 'player', 'player.png' ); //Load player image
this.load.image( 'enemy', 'enemy.png' ); //Load enemy image
this.load.image( 'player-0', 'player-0.png' ); //Load walk frame 0
this.load.image( 'player-1', 'player-1.png' ); //Load walk frame 1
this.load.image( 'enemy-0', 'enemy-0.png' ); //Load walk frame 0
this.load.image( 'enemy-1', 'enemy-1.png' ); //Load walk frame 1
this.load.image( 'projectile', 'projectile.png' ); //Load projectile image
this.load.image( 'powerup-projectile', 'powerup-1.png' ); //Load projectile image
this.load.image( 'powerup-slay', 'powerup-2.png' ); //Load projectile image



}

//create game data
create(){
    this.input.keyboard.on('keydown-ESC', () => { this.scene.start('title'); });

this.create_map(); // create level

this.create_animations(); //create animations
this.create_projectiles(); //create projectiles
this.create_player(); //helper method: create player
this.create_enemies(); //helper method: create enemies
this.create_powerups();

this.create_collisions(); //create physics-related behaviors
this.create_hud(); //create hud



}

update(time) {
this.update_player(time);
this.update_score();
this.update_enemies(time);
}


//Update game data


update_score() {
this.score_text.setText("Score: " + this.score);
const {winner, top_score} = this.registry.values;
this.top_score_text.setText(`${winner}: ${top_score}`);

}


//create animations
create_animations(scene){
if ( !this.anims.exists('player-move') ){
const anim_player_move = new Object();
anim_player_move.key = 'player-move'; //key to register into phaser
anim_player_move.frames = [{key: 'player-0'}, {key: 'player-1'}]; //list of image keys for anim
anim_player_move.frameRate = 6; //speed to play animation
anim_player_move.repeat = -1; //-1 for infinite loop
this.anims.create(anim_player_move); //facotory creates anim obj
}
if ( !this.anims.exists('enemy-move') ){
const anim_enemy_move = new Object();
anim_enemy_move.key = 'enemy-move'; //key to register into phaser
anim_enemy_move.frames = [{key: 'enemy-0'}, {key: 'enemy-1'}]; //list of image keys for anim
anim_enemy_move.frameRate = 6; //speed to play animation
anim_enemy_move.repeat = -1; //-1 for infinite loop
this.anims.create(anim_enemy_move); //facotory creates anim obj
}

}


update_enemies(time){
this.enemies.forEach(enemy => enemy.attack(time));
}


 get_powerup_slay(player, powerup) {
        this.enemies.forEach(monster => monster.destroy());
        this.enemy_projectiles.forEach(bullet => bullet.destroy());
        powerup.destroy();
        this.cameras.main.flash();
    }

    get_powerup_projectile(player, powerup) {
        this.player.projectileScale = Math.min(this.player.projectileScale + 1, 3);
        powerup.destroy();
    }





create_powerups() {
this.powerups_projectile = [];
this.powerups_slay = [];

const event = new Object();
event.delay = 500;
event.callback = this.spawn_powerup;
event.callbackScope = this;
event.loop = true;
this.time.addEvent(event, this);
}

// The powerup spawner
spawn_powerup() {
    this.powerup_types = [ProjectilePowerUp, SlayPowerUp]
if (Phaser.Math.Between(0, 2) !== 0) return;
// 1. Pick a PowerUp CLASS
const PowerUpClass = Phaser.Utils.Array.GetRandom(this.powerup_types);

// 2. Define the spawn position
const position = {
x: 640 + 32,
y: Phaser.Math.Between(50, 430)
};
// 3. Instantiate the chosen class and add it to a SINGLE group/array
const powerup = new PowerUpClass(this, position.x, position.y);

if ( PowerUpClass == ProjectilePowerUp ){
this.powerups_projectile.push(powerup);
}

else {
    this.powerups_slay.push(powerup);
}
}





slay_enemy(projectile, enemy) {
enemy.destroy();
projectile.destroy();
}



create_projectiles(){
 this.player_projectiles = [];
 this.enemy_projectiles = [];
}


create_hud() {
this.score = 0;
this.score_text = this.add.text(32, 32, "");
this.score_text.depth = 3;
this.score_text.setColor( 'rgb(255,255,255)' );
// Initialize persistent state by reading from the registry
const {winner, top_score} = this.registry.values;
this.top_score_text = this.add.text(600, 32, `${winner}: ${top_score}`);
this.top_score_text.depth = 3;
this.top_score_text.setOrigin(1,0);

}


update_background(){
this.background.tilePositionX += 3;
}

game_over() {
    const {top_score, winner} = this.registry.values;

this.cameras.main.flash();
if ( this.score >= top_score) {
this.registry.set('top_score', this.score);
this.physics.pause(); // freeze gameplay
const winner = prompt(`New High Score! Enter your name:`);
this.registry.set('winner', winner || 'Top Score');
this.input.keyboard.keys = [] 
}
this.scene.restart();


}

create_collisions(){
this.physics.add.overlap(this.player,this.enemies,this.game_over,null,this);
this.physics.add.overlap(this.player_projectiles,this.enemies,this.slay_enemy,null,this);
this.physics.add.overlap(this.enemy_projectiles,this.player,this.game_over,null,this);
this.physics.add.overlap(this.player, this.powerups_slay, this.get_powerup_slay, null, this);
this.physics.add.overlap(this.player, this.powerups_projectile, this.get_powerup_projectile, null, this);

}



spawn_enemy() {
const config = {};;
config.x = 640 + 32;
config.y = Phaser.Math.Between(0, 480)
const monster = new Enemy(this, config);
this.enemies.push(monster);
this.score +=1;
}


create_enemies() {
this.enemies = [];
const event = new Object();
event.delay = 200;
event.callback = this.spawn_enemy;
event.callbackScope = this;
event.loop = true;
this.time.addEvent(event, this);
}


update_player(time) {
this.player.move();
this.player.attack(time);
}



create_player() {
this.player = new Player(this); //create player
}


//Load level
create_map() {
this.background = this.add.tileSprite(640/2, 480/2, 640, 480, 'background');}

}
