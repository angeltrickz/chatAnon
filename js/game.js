/*
 * Author: Jerome Renaux
 * E-mail: jerome.renaux@gmail.com
 */

var Game = {};
var myid;

var app = new Vue({
  el: '#app',
  data: {
    message: 'Chat'
  },
  methods: {
    onEnter: function() {
       Game.textMap[myid].setText(this.message);

       Client.socket.emit('chattext',{msg:this.message});
       this.message = "";
    }
  }
});

Game.init = function(){
    game.stage.disableVisibilityChange = true;
};

Game.preload = function() {
    game.load.tilemap('map', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tileset', 'assets/map/tilesheet.png',32,32);
    game.load.image('sprite','assets/sprites/sprite.png');
    game.load.image('background','assets/map/fondo.jpg');

    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
};

Game.create = function(){
  var layer = game.add.tileSprite(0, 0, 1680, 1050, 'background');
  game.world.setBounds(0, 0, 1680, 1050);
    Game.playerMap = {};
    Game.textMap = {};
    var testKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    testKey.onDown.add(Client.sendTest, this);
    /*
    var map = game.add.tilemap('map');
    map.addTilesetImage('tilesheet', 'tileset'); // tilesheet is the key of the tileset in map's JSON file
    var layer;
    for(var i = 0; i < map.layers.length; i++) {
        layer = map.createLayer(i);
    }
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);
    */
    layer.inputEnabled = true; // Allows clicking on the map ; it's enough to do it on the last layer
    layer.events.onInputUp.add(Game.getCoordinates, this);

    Client.askNewPlayer();
    Client.sendmyid();




};

Game.getCoordinates = function(layer,pointer){
    Client.sendClick(pointer.worldX,pointer.worldY);
};

Game.addNewPlayer = function(id,x,y){
    Game.playerMap[id] = game.add.sprite(x,y,'sprite');
    Game.playerMap[id].anchor.setTo(0.5,0);
    Game.textMap[id] = game.add.text(30, 30, "chat", {
            font: "20px Arial",
            fill: "#ff0044",
            align: "center"
        });
    Game.textMap[id].anchor.setTo(0.5);

};

Game.movePlayer = function(id,x,y){
    var player = Game.playerMap[id];
    var distance = Phaser.Math.distance(player.x,player.y,x,y);
    var tween = game.add.tween(player);
    var duration = distance*10;
    tween.to({x:x,y:y}, duration);
    tween.start();
};

Game.removePlayer = function(id){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
};

Game.update = function(){
  try{
    for(var i in Game.playerMap){
      if(i != myid){

        Game.textMap[i].addColor('#01DF01', 0) ;
      }else{
        Game.textMap[i].addColor('#ff0044', 0) ;
      }

      Game.textMap[i].position.x = Game.playerMap[i].position.x;
      Game.textMap[i].position.y = Game.playerMap[i].position.y-15;
    };
  }catch(error){

  }
};
