class Level1 extends Phaser.Scene {
//construct new scene
constructor(key='Level1') {
super(key); //set this scene's id within superclass constructor
this.map_key = 'map1';
this.map_json = 'level1.json';

}
//preload external game assets
preload(){
this.load.path = 'assets/'; //Define file path
this.load.tilemapTiledJSON( this.map_key, this.map_json); //Load JSON file
const tile_size = {frameWidth: 32, frameHeight: 32}
this.load.spritesheet('tiles', 'tiles.png', tile_size); //Load tile spritesheet
this.load.spritesheet('items', 'items.png', tile_size); //Load items spritesheet
//this.load.image( 'player', 'player.png'); //load player image
const player_size = {frameWidth: 64, frameHeight: 64} //player size props
this.load.spritesheet( 'player-walk', 'player-walk.png', player_size ); //load player spritesheet
this.load.image( 'enemy', 'enemy.png' ); //load enemy image


}

setup_objects(objGroup){
for(let obj of objGroup) {
this.physics.add.existing(obj);
obj.body.immovable = true;
obj.body.allowGravity = false;
}
}


//create game data
create(){
this.create_map(); //helper method: create map
this.input.keyboard.on('keydown-ESC', () => { this.scene.start('title'); });

this.create_animations(); //create animations

this.create_player(); //helper method: create player
this.create_enemies(); // create enemies

this.create_collectables();
this.create_falling_tiles(); // create falling tile hazards
this.create_hazards();

this.create_gravity(); // create gravity
 // create collectables

this.create_camera(); // create camera
 
this.create_goal(); // create goal

this.create_collisions();

}

attack(player, enemy){
if (player.body.touching.down)
enemy.destroy()
else
this.game_over(player, enemy);
}

respawn_enemy(enemy_idx) {
const enemy = this.group_enemies[enemy_idx];
if(enemy.y > this.map.heightInPixels) {
const new_enemy = new Enemy(this, enemy.start, enemy.speed)
this.group_enemies.splice(enemy_idx, 1); // remove old
this.group_enemies.push( new_enemy ); // add replacement
}
}

update_enemies() {
for (let enemy_idx in this.group_enemies){
this.respawn_enemy(enemy_idx);
}
}


create_enemies() {
this.group_enemies = [];
let enemy_tiles = this.map.filterObjects('items', (obj) => obj.name==='enemy');
for (let tile of enemy_tiles) {
let enemy_config = {x: tile.x, y: tile.y};
let enemy = new Enemy(this, enemy_config );
this.group_enemies.push( enemy );
}
}


//create animations
create_animations(){
if ( !this.anims.exists('player-left') ){
const left_animation = new Object();
left_animation.key = 'player-left';
left_animation.frames = this.anims.generateFrameNumbers('player-walk', {start:2, end:3});
left_animation.frameRate = 6;
this.anims.create(left_animation);
}
if ( !this.anims.exists('player-right') ){
const right_animation = new Object();
right_animation.key = 'player-right';
right_animation.frames = this.anims.generateFrameNumbers('player-walk', {start:0, end:1});
right_animation.frameRate = 6;
this.anims.create(right_animation);
}
}


//Create items from object layer
create_collectables(){
const collect_data = { name: 'collect', key: 'items', frame: 0 };
this.group_collect = this.map.createFromObjects('items', collect_data);
this.setup_objects(this.group_collect);
}

//pick up coins - scoring logic would go in this method too
take_collectable( player, collect ) {
collect.destroy();
}


//check player lose conditions
add_gravity(player, hazard){
hazard.body.gravity.y = -1;
hazard.body.allowGravity = true;
}


create_falling_tiles() {
const fall_image = {name:'fall', key:'tiles', frame: 3 };
this.group_fall = this.map.createFromObjects( 'items', fall_image);
this.setup_objects(this.group_fall);
}

create_hazards(){
const hazard1_image = { name: 'hazard1', key: 'items', frame: 2 };
this.group_hazard1 = this.map.createFromObjects('items', hazard1_image);
this.setup_objects(this.group_hazard1);

const hazard2_image = { name: 'hazard2', key: 'items', frame: 1 };
this.group_hazard2 = this.map.createFromObjects('items', hazard2_image);
this.setup_objects(this.group_hazard2);

}


//Create items from object layer
create_goal(){
const goal_image = { name: 'goal', key: 'items', frame: 3 };
this.goal = this.map.createFromObjects('items', goal_image);
this.setup_objects(this.goal);
}


//setups collisions with physics
create_collisions(){
this.physics.add.collider( this.player, this.groundLayer );
this.physics.add.overlap(this.player,this.goal,this.next_scene,null,this);
this.physics.add.overlap(this.player,this.group_hazard1,this.game_over,null,this);
this.physics.add.overlap(this.player,this.group_hazard2,this.game_over,null,this);
this.physics.add.collider(this.player,this.group_fall,this.add_gravity,null,this);
this.physics.add.overlap( this.player, this.group_collect, this.take_collectable, null, this );
this.physics.add.collider( this.group_enemies, this.groundLayer );
this.physics.add.collider( this.player,this.group_enemies,  this.attack, null, this );



}




//Setup camera to follow player
create_camera() {
this.cameras.main.startFollow(this.player);
this.cameras.main.setBounds(0,0,this.map.widthInPixels, this.map.heightInPixels);
this.cameras.main.setBackgroundColor('rgb(204, 207, 255)');
}


//setup gravity with physics
create_gravity() {
this.physics.world.gravity.y = 600;
}

create_map() {
this.map = this.make.tilemap({ key: this.map_key }); //setup map object from tilemap
// Argments: 1: Tiled tileset name, 2: image key you loaded
const groundTiles = this.map.addTilesetImage('tiles', 'tiles');
// Arguments: 1:<Tiled layer name or index>, 2:Tileset, 3:<x offset px>, 4:<y offset px>
this.groundLayer = this.map.createLayer('tiles', groundTiles, 0, 0);
//collisions based on tile type in custom properties
const ground_block = { terrain: 'block'};
this.groundLayer.setCollisionByProperty( ground_block );

}

create_player() {
this.player = new Player(this); //create player
}


//Update game data
update() {
this.update_player();
this.update_enemies();

this.game_over();

}

//check player lose conditions
game_over(player=null, hazard=null) {
if (this.player.y > this.map.heightInPixels) { //check if player is lower than level
this.scene.restart();
}

if (hazard !== null) { //check if player is touching hazard
this.scene.restart();
}

}

update_player() {
this.player.move();
}


//start the next level
next_scene() {
this.scene.start('Level2');
}



//Load level


}

