var myId=0;
var map;
var tileset;
var layer;
var ledges;
var fighter;
var player;
//var datBoi = false;

var cursors;
var jumpButton;
var punchButton;
var background;
var hpText;
var fighterList;
//var Eureca = require('eureca.io');
var ready = false;
var eurecaServer;
//this function will handle client communication with the server
var eurecaClientSetup = function() {
    //create an instance of eureca.io client
    var eurecaClient = new Eureca.Client();

    eurecaClient.ready(function (proxy) {
        eurecaServer = proxy;
    });


    //methods defined under "exports" namespace become available in the server side

    eurecaClient.exports.setId = function(id)
    {
        //create() is moved here to make sure nothing is created before uniq id assignation
        //console.log("id = " + id );
        myId = id;
        create();
        eurecaServer.handshake();
        ready = true;

    }

    eurecaClient.exports.kill = function(id)
    {
        if (fighterList[id]) {
            fighterList[id].kill();
            console.log('killing ', id, fighterList[id]);
        }
    }

    eurecaClient.exports.spawnEnemy = function(i, x, y)
    {
        if (i == myId) return; //this is me

        console.log('SPAWN');
        var fgt = new Fighter(i, game, fighter);
        fighterList[i] = fgt;

    }

    eurecaClient.exports.updateState = function(id, state)
    {
        if (fighterList[id])  {
            fighterList[id].cursor = state;
            fighterList[id].fighter.x = state.x;
            fighterList[id].fighter.y = state.y;
            fighterList[id].update();
        }
    }
}

Fighter = function(index, game, player){
    //console.log("myid = " + index);
    //console.log("player.id = " + fighter.id);
    //console.log("Test test");
    this.cursor = {
        left:false,
        right:false,
        up:false,
        punch:false
    }

    this.input = {
        left:false,
        right:false,
        up:false,
        punch:false
    }
    var punchCounter = 0;
    var x = game.width/2;
    var y = 50;
    this.jumpTimer = 0;
    this.punchTimer = 0;
    this.randomVar = 0;
    this.air = 0;
    this.justPunched = false;
    this.gotPunched = false;
    this.game = game;
    this.dmgMulti = 1;
    this.player = player;
    this.alive = true;
    this.flyDirection;
    this.facing = 'left';
    this.dirrection = 'left';
    //this.fighter.id = index;
    //if(datBoi == false){
        this.fighter = game.add.sprite(x, y, 'allAnim');
        game.physics.enable(this.fighter, Phaser.Physics.ARCADE);
        this.fighter.body.bounce.y = 0;
        //this.fighter.scale.setTo(.5, .5);
        this.fighter.body.collideWorldBounds = false;
        this.fighter.body.setSize(60, 108);
        this.fighter.body.checkCollision.up = false;
        this.fighter.body.checkCollision.down = true;
        this.fighter.animations.add('right', [28, 29, 30, 31, 32, 33], 10, true);
        this.fighter.animations.add('turn', [35], 20, true);
        this.fighter.animations.add('left', [41, 40, 39, 38, 37, 36], 10, true);
        this.fighter.animations.add('idleLeft', [55, 54, 53, 52, 51, 50, 49], 10, true);
        this.fighter.animations.add('idleRight', [42, 43, 44, 45, 46, 47, 48], 10, true);
        this.fighter.animations.add('punchBehindRight', [0, 1, 2, 3, 4, 5, 6], 10, true);
        this.fighter.animations.add('punchBehindLeft', [13, 12, 11, 10, 9, 8, 7], 10, true);
        this.fighter.animations.add('punchFrontRight', [14, 15, 16, 17, 18, 19, 20],10, true);
        this.fighter.animations.add('punchFrontLeft', [27, 26, 25, 24, 23, 22, 21],10, true);
        this.fighter.animations.add('jumpRight', [56, 57, 58],10, true);
        this.fighter.animations.add('jumpLeft', [70, 69, 58],10, true);
        this.fighter.animations.add('rightInAir', [59],10, true);
        this.fighter.animations.add('leftInAir', [66],10, true);
        this.fighter.debug = true;
        this.fighter.id = index;
        //jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //game.height = 720;
        //game.width = 1280;
        this.fighter.scale.setTo(0.9, 0.9);
   /* }
    if(datBoi == true){
        this.fighter = game.add.sprite(x, y, 'datBoi');
        game.physics.enable(this.fighter, Phaser.Physics.ARCADE);
        this.fighter.body.bounce.y = 0;
        //this.fighter.scale.setTo(.5, .5);
        this.fighter.body.collideWorldBounds = false;
        this.fighter.body.setSize(240, 385);
        this.fighter.body.checkCollision.up = false;
        this.fighter.body.checkCollision.down = true;
        this.fighter.animations.add('right', [9,8,7,6,5], 10, true);
        this.fighter.animations.add('turn', [1], 20, true);
        this.fighter.animations.add('left', [0,1,2,3,4], 10, true);
        this.fighter.animations.add('idleLeft', [0,1,2,3,4], 10, true);
        this.fighter.animations.add('idleRight', [9,8,7,6,5], 10, true);
        this.fighter.animations.add('punchBehindRight', [9,8,7,6,5], 10, true);
        this.fighter.animations.add('punchBehindLeft', [0,1,2,3,4], 10, true);
        this.fighter.animations.add('punchFrontRight', [9,8,7,6,5],10, true);
        this.fighter.animations.add('punchFrontLeft', [0,1,2,3,4],10, true);
        this.fighter.animations.add('jumpRight', [9,8,7,6,5],10, true);
        this.fighter.animations.add('jumpLeft', [0,1,2,3,4],10, true);
        this.fighter.animations.add('rightInAir', [9],10, true);
        this.fighter.animations.add('leftInAir', [1],10, true);
        this.fighter.debug = true;
        this.fighter.id = index;
        //jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //game.height = 720;
        //game.width = 1280;
        this.fighter.scale.setTo(0.25, 0.25);
    }*/



};

Fighter.prototype.update = function(){
    //this.cursor.punch = punchButton;
    if( this.fighter.jumpTimer == undefined ||
        this.fighter.punchTimer == undefined ||
        this.fighter.randomVar == undefined ||
        this.fighter.air == undefined ||
        this.fighter.justPunched == undefined ||
        this.fighter.gotPunched == undefined ||
        this.fighter.flyDirection == undefined)
    {
        this.fighter.jumpTimer = 0;
        this.fighter.punchTimer = 0;
        this.fighter.randomVar = 0;
        this.fighter.air = 0;
        this.fighter.justPunched = false;
        this.fighter.gotPunched = false;
        this.fighter.flyDirection = 'left';
        return;
    }

    var inputChanged = (
        this.cursor.left != this.input.left ||
        this.cursor.right != this.input.right ||
        this.cursor.up != this.input.up ||
        this.cursor.punch != this.input.punch
    );

    if (inputChanged)
    {
        //Handle input change here
        //send new values to the server

        //console.log(this.cursor.up != this.input.up);
        if (this.fighter.id == myId)
        {
            // send latest valid state to the server
            this.input.x = this.fighter.x;
            this.input.y = this.fighter.y;
            //console.log("Bananer");
            eurecaServer.handleKeys(this.input);

        }
    }


    //console.log(this.fighter.gotPunched);

    if(game.physics.arcade.collide(this.fighter, layer)){

        this.fighter.air = 0;
        this.fighter.body.velocity.x = 0;
    }
    if (this.cursor.punch && (game.time.now > this.fighter.punchTimer )) {
        this.fighter.randomVar = game.rnd.integerInRange(0, 1);
        //console.log(punchButton.isDown);
        if(game.physics.arcade.collide(this.fighter, layer))
            this.fighter.body.velocity.x = 0;
        if (this.fighter.dirrection == 'left') {
            if(this.fighter.randomVar == 0){
                this.fighter.animations.play('punchFrontLeft');
            }
            else{
                this.fighter.animations.play('punchBehindLeft');
            }
            this.fighter.facing = 'left';
        }
        if (this.fighter.dirrection == 'right') {
            if(this.fighter.randomVar == 0){
                this.fighter.animations.play('punchFrontRight');
            }
            else{
                this.fighter.animations.play('punchBehindRight');
            }
            this.fighter.facing = 'right';
        }
        this.fighter.punchTimer = game.time.now + 750;
        this.fighter.justPunched = true;
    }
    else if (this.cursor.left && (game.time.now > this.fighter.punchTimer ))
    {
        if(this.fighter.justPunched){
            this.fighter.animations.stop();
            this.fighter.justPunched = false;
        }
        this.fighter.body.velocity.x = -150;
        if (this.fighter.facing != 'left') {
            this.fighter.animations.play('left');
            this.fighter.facing = 'left';
        }
        this.fighter.dirrection = 'left';
    }
    else if (this.cursor.right && (game.time.now > this.fighter.punchTimer ))
    {
        if(this.fighter.justPunched){
            this.fighter.animations.stop();
            this.fighter.justPunched = false;
        }
        this.fighter.dirrection = 'right';
        this.fighter.body.velocity.x = 150;
        if (this.fighter.facing != 'right') {
            this.fighter.animations.play('right');
            this.fighter.facing = 'right';
        }
    }
    else
    {
        if (this.fighter.facing != 'idle' && this.cursor.punch == false && (game.time.now > this.fighter.punchTimer)) {
            if(this.fighter.justPunched){
                this.fighter.animations.stop();
                this.fighter.justPunched = false;
            }
            if (this.fighter.facing == 'left') {
                this.fighter.animations.play('idleLeft');
            }
            else {
                this.fighter.animations.play('idleRight');
            }
            this.fighter.facing = 'idle';
        }
    }

    //console.log(fighter.body.blocked.down);
    if ((this.cursor.up && (game.time.now > this.fighter.jumpTimer ))) {
        this.jump();
    }
    //console.log(this.fighter.air);
    if(this.fighter.gotPunched == true && (game.time.now > this.fighter.punchTimer)){
        this.knockBack(this.fighter.flyDirection);
        this.fighter.punchTimer = game.time.now + 750;
        this.fighter.gotPunched = false;
    }
    //console.log(fighter.body.gravity.y);
    this.knockOut();
    this.stats();
};

Fighter.prototype.jump = function(){

    if((this.fighter.air < 2) ) {

        this.fighter.air++;
        this.fighter.body.velocity.y = -263;
        this.fighter.jumpTimer = game.time.now + 750;

    }
};

Fighter.prototype.knockOut = function(){
    if (this.fighter.x > game.width || this.fighter.x + fighter.width < 0 || this.fighter.y + this.fighter.height < 0 || this.fighter.y > game.height) {
        if (this.fighter.health > 0) {
            this.dmgMulti--;
            this.fighter.x = this.game.width / 2;
            this.fighter.y = 50;
            this.fighter.body.velocity.y = 0;
        }
        if (this.fighter.health == 0) {
            //fighter.kill();
            this.fighter.alive = false;
        }
    }
};

Fighter.prototype.kill = function(){
    this.fighter.kill();
};

Fighter.prototype.stats = function () {
    //if(this.fighter.body.velocity.y > 5 || this.fighter.body.velocity.y < 4)
        //console.log("does the fighter touch the ground?     " + this.fighter.body.touching.down);
    if(game.physics.arcade.collide(this.fighter, layer))
        console.log("true");
    //console.log("Fighter stats, velocity: x" + this.fighter.body.velocity.x + " y: " + this.fighter.body.velocity.y + "gravity: x" + this.fighter.body.gravity.x + " y: " + this.fighter.body.gravity.y);
};

Fighter.prototype.knockBack = function(direction){
    if (direction == 'left') {
        this.fighter.body.velocity.x = -150;
        this.fighter.body.velocity.y = -150;
    }
    if (direction == 'right') {
        this.fighter.body.velocity.x = 150;
        this.fighter.body.velocity.y = -150;
    }
    console.log(this.fighter.id + " Bananer");
};
function checkHit(fighter, target){
    //console.log(game.physics.arcade.overlap(fighter, target));
    //fighter.body.velocity.x = 0;
    target.gotPunched = true;
    if (fighter.dirrection == 'left')
        target.flyDirection = 'left';

    if (fighter.dirrection == 'right')
        target.flyDirection = 'right';
        //target.flydirection = fighter.dirrection;
}

var game = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'game', { preload: preload, create: eurecaClientSetup, update: update, render: render });

function preload() {
    game.load.tilemap('orebro', './images/Graphics/orebroMap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('pixelN', './images/Graphics/pixel.png');
    game.load.image('concept', './images/Graphics/concept.png');
    game.load.spritesheet('char', './images/SpriteSheets/TemplateAnimation1.png', 70, 120);
    game.load.spritesheet('allAnim','./images/SpriteSheets/AllAnimations.png',60,108);
    //game.load.spritesheet('datBoi','./images/SpriteSheets/DatBoi.png',240,385);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';
    game.stage.disableVisibilityChange  = true;

    map = game.add.tilemap('orebro');
    map.addTilesetImage('pixel', 'pixelN');

    background = game.add.image(0, 0, "concept");
    background.fixedToCamera = false;
    layer = map.createLayer("Tile Layer 1");
    layer.setScale(3, 3);
    map.setCollisionBetween(0, 3);
    layer.debug = true;

    hpText = game.add.text(50, 25, "Health: 5", { font: "20px Arial", fill: "#ff0044" });
    hpText.anchor.set(.5, .5);
    /*map.addTilesetImage('tiles-1');
    layer = map.createLayer('Tile Layer 1');*/
    game.physics.arcade.gravity.y = 250;

    //game.camera.follow(player);
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    //this.game.scale.setScreenSize(true);

    fighterList = {};

    player = new Fighter(myId, game, fighter);
    fighterList[myId] = player;
    //console.log(myId);
    fighter = player.fighter;
    fighter.air = 0;

    fighter.bringToTop();

    cursors = game.input.keyboard.createCursorKeys();

    punchButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);

}

function update() {
    /* console.log(game.height);
     console.log(game.width);*/
    if (!ready) return;

    player.input.left = cursors.left.isDown;
    player.input.right = cursors.right.isDown;
    player.input.up = cursors.up.isDown;
    player.input.punch = punchButton.isDown;

    for (var i in fighterList)
    {
        if (!fighterList[i]) continue;
        var curFgt = fighterList[i].fighter;
        for(var j in fighterList){

            if (j!=i)
            {
                var targetFgt = fighterList[j].fighter;
                if(curFgt.justPunched == true && targetFgt.gotPunched != true){
                    game.physics.arcade.overlap(curFgt, targetFgt, checkHit, null, this);

                }
            }
            if (fighterList[j].alive)
            {
                fighterList[j].update();
            }
        }

    }
    //console.log(air);
    updateText();
}

function collisionAlter() {
    air=0;
    //player.body.onFloor = true;
}

function updateText() {
    //hpText.setText("Health: " + this.fighter.health);
}

function render() {
    var fps = game.time.suggestedFps;
    var FPS = fps.toString();
    game.debug.text(FPS, 32, 64, '#FF0000');
    var bla = game.time.totalElapsedSeconds();
    var BLA = bla.toString();
    game.debug.text(BLA, 32, 96);

}
