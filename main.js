var cv = null;
var ctx = null;
var player = null;
var super_x = 240, super_y = 240;
var score = 0;
var pause = false;

var move = [];

var speed = 10;

var width = 1000;
var height = 800;


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function start() {
    cv = document.getElementById('mycanvas');
    ctx = cv.getContext('2d')

    player = new box(super_x, super_y, 40, 40, "red");

    paint();
}


//eventos de teclado
document.addEventListener('keydown', function (e) {
    //movimiento
    move[e.keyCode] = true;

    //pause
    if (e.keyCode == 32) {
        pause = (pause) ? false : true;
    }
});

document.addEventListener('keyup', function (e) {
    move[e.keyCode] = false;

});

function box(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dibujar = function (ctx) {
        ctx.fillStyle = this.c;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

function paint() {
    var aux;
    window.requestAnimationFrame(paint)

    ctx.fillStyle = "rgb(150,200,250)";
    ctx.fillRect(0, 0, width, height);


    player.dibujar(ctx);


    if (!pause) {
        update();
    } else {
        ctx.fillStyle = "rgba(0,0,0,0.5)"
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = "white";
        ctx.fillText("P A U S E", 480, 370);
    }


}


function update() {
    //derecha
    if (move[68] == true) {
        player.x += speed;
        if (player.x > width) {
            player.x = 0;
        }
    }

    //izquierda
    if (move[65] == true) {
        player.x -= speed;
        if (player.x < 0) {
            player.x = width;
        }
    }

    //arriba
    if (move[87]) {
        player.y -= speed;
        if (player.y < 0) {
            player.y = height;
        }
    }

    //abajo
    if (move[83]) {
        player.y += speed;
        if (player.y > height) {
            player.y = 0;
        }
    }

}



window.addEventListener('load', start);

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 17);
        };
}());
