var cv = null;
var ctx = null;
var player = null;
var enemy = null;
var super_x = 240, super_y = 240;
var score = 0;
var pause = false;

var move = [];

var speed = 6;

var width = 1000;
var height = 800;

var direction = "right";
var moving = false;
var attacking = false;
var finalFrame;

//audio
var bgm = new Audio('sound/bgm.mp3');
var hit = new Audio('sound/hit.wav');
var swing = new Audio('sound/swing.wav');

//Entities
var Entity = {
    frameData: {},
    createEntity: function (name, frameWidth, frameHeight, scale, frameCount, frameID) {
        if (!this.frameData[name]) {
            this.frameData[name] = {
                frameWidth: frameWidth,
                frameHeight: frameHeight,
                scale: scale,
                frameCount: frameCount,
                frameID: frameID
            }
        }

    },
    getEntity: function (name) {
        if (this.frameData[name]) {
            return this.frameData[name];
        }
    }
}

// var frameWidth = 64;
// var frameHeight = 64;
// var scale = 2;
// var frameCount = 0;
// var frameID = 0;

//animation states
var State = {
    states: {},
    generateState: function (entityN, name, startID, endID) {
        if (!this.states[entityN]) {
            this.states[entityN] = {
                name: name,
                frameID: startID,
                startID: startID,
                endID: endID
            }
        }
    },
    getState: function (entityN) {
        if (this.states[entityN]) {
            return this.states[entityN];
        }
    },
    setState: function (newState) {
        this.states[name] = newState;
    }
}


//Entities
Entity.createEntity("player", 64, 64, 2, 0, 0);
Entity.createEntity("enemy", 16, 24, 2, 0, 0);

//movement states
State.generateState("player", "move_right", 0, 5);
State.generateState("player", "move_up", 6, 11);
State.generateState("player", "move_left", 12, 17);
State.generateState("player", "move_down", 18, 23);

State.generateState("player", "idle_right", 0, 0);
State.generateState("player", "idle_up", 6, 6);
State.generateState("player", "idle_left", 12, 12);
State.generateState("player", "idle_down", 18, 18);

//attack states
State.generateState("player", "attack_right", 24, 27);
State.generateState("player", "attack_up", 28, 31);
State.generateState("player", "attack_left", 32, 35);
State.generateState("player", "attack_down", 36, 39);

//enemy states
State.generateState("enemy", "enemy_move", 0, 4)

var playerSpriteSheet = new Image();
playerSpriteSheet.src = "sprites/Player.png";

var enemySpriteSheet = new Image();
enemySpriteSheet.src = "sprites/Bat.png"


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function start() {
    cv = document.getElementById('mycanvas');
    ctx = cv.getContext('2d')

    player = new box(super_x, super_y, 40, 40);
    enemy = new box(750, 250, 30, 30);

    paint();
}

//eventos de teclado
document.addEventListener('keydown', function (e) {
    //movimiento
    move[e.keyCode] = true;
    if (!attacking) {
        if (move[68] || move[65] || move[87] || move[83]) {
            moving = true;
        }
    }

    if (move[74]) {
        attacking = true;
        swing.play()
    }

    //pause
    if (e.keyCode == 32) {
        pause = (pause) ? false : true;
    }
});

document.addEventListener('keyup', function (e) {
    move[e.keyCode] = false;
    if (!move[68] && !move[65] && !move[87] && !move[83]) {
        moving = false;
    }

});

function box(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.dibujar = function (ctx) {
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

function animate() {
    State.setState("move_down")
    // console.log(State.getState("player"));
    console.log(Entity)

    //player drawing
    ctx.drawImage(
        playerSpriteSheet,
        State.getState("player").frameID * Entity.getEntity("player").frameWidth, 0,
        Entity.getEntity("player").frameWidth, Entity.getEntity("player").frameHeight,
        player.x - 40, player.y - 45,
        Entity.getEntity("player").frameWidth * Entity.getEntity("player").scale,
        Entity.getEntity("player").frameHeight * Entity.getEntity("player").scale
    );

    // //enemy drawing
    // ctx.drawImage(
    //     enemySpriteSheet,
    //     state.getEntityStates["enemy"] * Entity.getEntity("enemy").frameWidth, 0,
    //     Entity.getEntity("enemy").frameWidth, Entity.getEntity("enemy").frameHeight,
    //     enemy.x - 2, enemy.y,
    //     Entity.getEntity("enemy").frameWidth * Entity.getEntity("enemy").scale,
    //     Entity.getEntity("enemy").frameHeight * Entity.getEntity("enemy").scale
    // );

    //frame speed

    Entity.getEntity("player").frameCount++;
    if (Entity.getEntity("player").frameCount > 4) {
        State.getState("player").frameID++;
        Entity.getEntity("player").frameCount = 0;
    }

    // Entity.getEntity("enemy").frameCount++;
    // if (Entity.getEntity("enemy").frameCount > 4) {
    //     state.getState[12].frameID++;
    //     Entity.getEntity("enemy").frameCount = 0;
    // }

    //frames used
    if (State.getState("player").frameID > State.getState("player").endID) {
        State.getState("player").frameID = State.getState("player").startID;
        attacking = false;
    }

    // if (state.frameID > state.endID) {
    //     state.frameID = state.startID;
    // }

}

function paint() {
    window.requestAnimationFrame(paint)

    ctx.fillStyle = "rgb(150,200,250)";
    ctx.fillRect(0, 0, width, height);

    //collision box (debug)
    ctx.strokeStyle = "black";
    player.dibujar(ctx);

    ctx.strokeStyle = "red";
    enemy.dibujar(ctx);



    if (!pause) {
        update();
    } else {


        ctx.fillStyle = "rgba(0,0,0,0.5)"
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "white";
        ctx.fillText("P A U S E", 480, 370);
    }
}

//player inputs
function update() {

    if (!attacking) { //detiene al jugador al atacar
        //derecha
        if (move[68]) {
            player.x += speed;
            animate(State.getState("player").name("move_right"));
            direction = 'right';
            if (player.x > width) {
                player.x = 0;
            }
        }

        //izquierda
        if (move[65]) {
            player.x -= speed;
            animate(State.getState("move_left"));
            direction = 'left';
            if (player.x < 0) {
                player.x = width;

            }
        }

        //arriba
        if (move[87]) {
            player.y -= speed;
            animate(State.getState("move_up"));
            direction = 'up';
            if (player.y < 0) {
                player.y = height;
            }
        }

        //abajo
        if (move[83]) {
            player.y += speed;
            animate(State.getState("move_down"));
            direction = 'down';
            if (player.y > height) {
                player.y = 0;
            }
        }
    }


    if (!moving && !attacking) {
        if (direction == 'right') {
            animate(State.getState("idle_right"));
        }
        if (direction == 'up') {
            animate(State.getState("idle_up"));
        }
        if (direction == 'down') {
            animate(State.getState("idle_down"));
        }
        if (direction == 'left') {
            animate(State.getState("idle_left"));
        }
    }

    if (attacking) {
        if (direction == 'right') {
            animate(State.getState("attack_right"));
        }
        if (direction == 'up') {
            animate(State.getState("attack_up"));
        }
        if (direction == 'down') {
            animate(State.getState("attack_down"));
        }
        if (direction == 'left') {
            animate(State.getState("attack_left"));
        }
    }
}



window.addEventListener('load', start);

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 10);
        };
}());

