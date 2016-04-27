var map;
var tileset;
var layer;
var ledges;
var fighter;
var player;
var facing = 'left';
var dirrection = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var punchButton;
var background;
var health = 5;
var hpText;
var air = 0;

var myId=0;

var fighterList;

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
            fighterList[id].fighter = state;
            fighterList[id].fighter.x = state.x;
            fighterList[id].fighter.y = state.y;
            fighterList[id].update();
        }
    }
}

Fighter = function(index, game, player){
    
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

    var x = 0;
    var y = 0;

    this.game = game;
    this.health = 30;
    this.player = player;
    this.alive = true;

    this.player.id = index;
    this.fighter = game.add.sprite(game.width / 2, 50, 'char');
    game.physics.enable(this.fighter, Phaser.Physics.ARCADE);
    this.fighter.body.bounce.y = 0;
    this.fighter.scale.setTo(.5, .5);
    this.fighter.body.collideWorldBounds = false;
    this.fighter.body.setSize(70, 120);
    this.fighter.body.checkCollision.up = false;
    this.fighter.body.checkCollision.down = true;
    this.fighter.animations.add('right', [28, 29, 30, 31, 32, 33], 10, true);
    this.fighter.animations.add('turn', [35], 20, true);
    this.fighter.animations.add('left', [41, 40, 39, 38, 37, 36], 10, true);
    this.fighter.animations.add('idleLeft', [55, 54, 53, 52, 51, 50, 49], 10, true);
    this.fighter.animations.add('idleRight', [42, 43, 44, 45, 46, 47, 48], 10, true);
    this.fighter.animations.add('punchRight', [0, 1, 2, 3, 4, 5, 6], 10, true);
    this.fighter.animations.add('punchLeft', [13, 12, 11, 10, 9, 8, 7], 10, true);


    //jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //game.height = 720;
    //game.width = 1280;
    player.scale.setTo(0.9, 0.9);

};

Fighter.prototype.update = function(){

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
        if (this.fighter.id == myId)
        {
            // send latest valid state to the server
            this.input.x = this.fighter.x;
            this.input.y = this.fighter.y;
            this.input.angle = this.fighter.angle;

            eurecaServer.handleKeys(this.input);

        }
    }
    fighter.body.velocity.x = 0;

    if (this.cursor.left.isDown)
    {
        fighter.body.velocity.x = -150;
        if (facing != 'left') {
            fighter.animations.play('left');
            facing = 'left';
        }
        dirrection = 'left';
    }
    else if (this.cursor.right.isDown)
    {
        fighter.body.velocity.x = 150;
        if (facing != 'right') {
            fighter.animations.play('right');
            facing = 'right';
        }
        dirrection = 'right';
    }
    else
    {
        if (facing != 'idle' && punchButton.isDown == false) {
            fighter.animations.stop();
            if (facing == 'left') {
                fighter.animations.play('idleLeft');
            }
            else {
                fighter.animations.play('idleRight');
            }
            facing = 'idle';
        }
    }
    if (fighter.body.blocked.down) {
        air = 0;
    }
    if (cursor.up.isDown && game.time.now > jumpTimer && air < 2) {
        air++;
        fighter.body.velocity.y = -263;
        jumpTimer = game.time.now + 750;
    }
    if (this.cursor.punch.isDown) {
        fighter.body.velocity.x = 0;
        if (dirrection == 'left') {
            fighter.animations.play('punchLeft');
            facing = 'left';
        }
        if (dirrection == 'right') {
            figher.animations.play('punchRight');
            facing = 'right';
        }
    }
    knockOut();
};

Fighter.prototype.knockOut = function(){
    if (fighter.x > game.width || fighter.x + fighter.width < 0 || fighter.y + fighter.height < 0 || fighter.y > game.height) {
        if (health > 0) {
            health--;
            fighter.x = game.width / 2;
            fighter.y = 50;
            fighter.body.velocity.y = 0;
        }
        if (health == 0) {
            //fighter.kill();
            fighter.alive = false;
        }
    }
};

var game = new Phaser.Game(1920, 1080, Phaser.CANVAS, 'phaser-example', { preload: preload, create: eurecaClientSetup, update: update, render: render });

function preload() {
    game.load.tilemap('orebro', './images/Graphics/orebroMap.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('pixelN', './images/Graphics/pixel.png');

    game.load.image('concept', './images/Graphics/concept.png');

    game.load.spritesheet('char', './images/SpriteSheets/TemplateAnimation1.png', 70, 120);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';
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

    /*this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    this.scale.setScreenSize(true);*/

    fighterList = {};

    player = new Fighter(myId, game, fighter);
    fighterList[myId] = player;
    fighter = player.fighter;
    fighter.x=0;
    fighter.y=0;

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
    player.input.fire = game.input.activePointer.isDown;
    player.input.tx = game.input.x+ game.camera.x;
    player.input.ty = game.input.y+ game.camera.y;
    for (var i in fighterList)
    {
        if (!fighterList[i]) continue;
        var curTank = fighterList[i].fighter;
        for (var j in fighterList)
        {
            if (tanksList[j].alive)
            {
                tanksList[j].update();
            }
        }
    }
        console.log(air);
        updateText();
}

function collisionAlter() {
    player.body.onFloor = true;
}

function updateText() {
    hpText.setText("Health: " + health);
}

function render() {
    /*var fps = game.time.suggestedFps;
    var FPS = fps.toString();
    game.debug.text(FPS, 32, 64, '#FF0000');
    var bla = game.time.totalElapsedSeconds();
    var BLA = bla.toString();
    game.debug.text(BLA, 32, 96);
    game.debug.body(player);
    game.debug.bodyInfo(player, 16, 200);*/
}
//# sourceMappingURL=app.js.map