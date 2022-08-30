var cv = null;
var ctx = null;
var player = null;
var super_x = 240, super_y = 240;
var score = 0;
var pause = false;

var move = [];

var speed = 6;

var width = 1000;
var height = 800;

var direction = "right";
var moving = false;

//animations
var frameWidth = 64;
var frameHeight = 64;
var scale = 2;
var fps = 60;
var secondsToUpdate = 1 * fps;
var frameCount = 0;
var frameID = 0;

//animation states
var State = {
    states: {},
    generateState: function (name, startID, endID) {
        if (!this.states[name]) {
            this.states[name] = {
                frameID: startID,
                startID: startID,
                endID: endID
            }
        }
    },
    getState: function (name) {
        if (this.states[name]) {
            return this.states[name];
        }
    }
}
//movement states
State.generateState("move_right", 0, 5);
State.generateState("move_up", 6, 11);
State.generateState("move_left", 12, 17);
State.generateState("move_down", 18, 23);

State.generateState("idle_right", 0, 0);
State.generateState("idle_up", 6, 6);
State.generateState("idle_left", 12, 12);
State.generateState("idle_down", 18, 18);

//attack states
State.generateState("attack_right", 0, 0);
State.generateState("attack_up", 0, 0);
State.generateState("attack_left", 0, 0);
State.generateState("attack_down", 0, 0);

var spriteSheet = new Image();
spriteSheet.src = "sprites/Player.png";


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function start() {
    cv = document.getElementById('mycanvas');
    ctx = cv.getContext('2d')

    player = new box(super_x, super_y, 40, 40);

    paint();
}

//eventos de teclado
document.addEventListener('keydown', function (e) {
    //movimiento
    move[e.keyCode] = true;
    moving = true;

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
        ctx.fillStyle = this.c;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

function animate(state) {
    ctx.drawImage(
        spriteSheet,
        state.frameID * frameWidth, 0,
        frameWidth, frameHeight,
        player.x - 40, player.y - 45,
        frameWidth * scale, frameHeight * scale
    );
    //frame speed
    frameCount++;
    if (frameCount > 4) {
        state.frameID++;
        frameCount = 0;
    }

    //frames used
    if (state.frameID > state.endID) {
        state.frameID = state.startID;
    }
}

function paint() {
    window.requestAnimationFrame(paint)

    ctx.fillStyle = "rgb(150,200,250)";
    ctx.fillRect(0, 0, width, height);

    //collision box (debug)
    player.dibujar(ctx);

    //player drawing


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

    //derecha
    if (move[68]) {
        player.x += speed;
        animate(State.getState("move_right"));
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

    if (!moving) {
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

