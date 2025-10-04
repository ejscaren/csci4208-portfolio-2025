//level2 scene
class Level2 extends Level1 {
constructor() {
super('Level2');
this.map_key ='map2';
this.map_json ='level2.json';
}

//Setup camera to follow player
create_camera() {
this.cameras.main.startFollow(this.player);
this.cameras.main.setBounds(0,0,this.map.widthInPixels, this.map.heightInPixels);
this.cameras.main.setBackgroundColor('rgb(0, 0, 0)');
}

//start the next level
next_scene(player,goal) {
this.scene.start('Level1');
}


}