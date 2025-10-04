class Player extends Phaser.Physics.Arcade.Sprite {
constructor(scene) {
super(scene, 0, 0, 'player-walk', 0);
const start = scene.map.findObject('items', obj => obj.name === 'player' );
this.x = start.x;
this.y = start.y ;
this.setOrigin(0.5,1);
this.depth = 1;
this.speed = 600;

scene.add.existing(this);

scene.physics.add.existing(this);
this.arrow_keys = scene.input.keyboard.addKeys('up,left,right');
this.play('player-right',false);

}

//move player
move() {
//verify that player has a physics body to move (for multilevel)
if (this.body === undefined)
return;
// reset velocity
this.body.velocity.x = 0;
// take care of character movement
if ( this.arrow_keys.up.isDown  /*&& ( this.body.onFloor() || this.body.blocked.down)*/ ) {
this.body.velocity.y = -this.speed * .2;
}
if ( this.arrow_keys.left.isDown ) {
this.body.velocity.x = -this.speed;
this.play('player-left',true); //play animation

}
if ( this.arrow_keys.right.isDown ) {
this.body.velocity.x = this.speed;
this.play('player-right',true); //play animation

}
}
}
