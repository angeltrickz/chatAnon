/**
 * Created by Jerome on 03-03-17.
 */

var Client = {};
Client.socket = io.connect();


Client.sendmyid = function(){

    Client.socket.emit('myid');
};

Client.socket.on('chattextr',function(data){
    console.log("respuesta :"+data.msg)
    Game.textMap[data.id].setText(data.msg);

  });

Client.socket.on('myid',function(data){
    console.log("my id es: "+data.id)
    myid = data.id;
    game.camera.follow(Game.playerMap[myid]);
  });

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.askNewPlayer = function(){
    Client.socket.emit('newplayer');
};

Client.sendClick = function(x,y){
  Client.socket.emit('click',{x:x,y:y});
};

Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
    console.log(data.id)
});

Client.socket.on('allplayers',function(data){
    for(var i = 0; i < data.length; i++){
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data){
        Game.movePlayer(data.id,data.x,data.y);
    });

    Client.socket.on('remove',function(id){
        Game.removePlayer(id);
    });
});
