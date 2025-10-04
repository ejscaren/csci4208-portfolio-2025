class Enemy extends Phaser.Physics.Arcade.Sprite {
constructor(scene, start, speed=120){
super(scene, start.x, start.y, 'enemy');
this.start = start;
this.depth = 1;
this.speed = speed;
scene.add.existing(this);
scene.physics.add.existing(this);
this.body.velocity.x = -this.speed;
this.body.bounce.x = 1;
}

respawn_enemy(enemy_idx) {
const enemy = this.group_enemies[enemy_idx];
if(enemy.y > this.map.heightInPixels) {
const new_enemy = new Enemy(this, enemy.start, enemy.speed)
this.group_enemies.splice(enemy_idx, 1); // remove old
this.group_enemies.push( new_enemy ); // add replacement
}
}


}
