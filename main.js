var cv = null;
var ctx = null

//boxes
var player = null;
var enemy = null;
var hitbox = null;

var enemies = [];
var walls = [];

var pause = false;

var move = [];

var speed = 3;
var width = 1920;
var height = 1080;

var direction = "right";
var moving = false;
var attacking = false;
var dead = false;
var win = false;

var startTime = 1.5; //Minutes
var time = startTime * 60;
var minutes = null;
var seconds = null;

//sprites
var bg = new Image();
bg.src = "sprites/background.png";

var chest = new Image();
chest.src = "sprites/chest.png";

var playerSpriteSheet = new Image();
playerSpriteSheet.src = "sprites/Player.png";

var enemySpriteSheet = new Image();
enemySpriteSheet.src = "sprites/Bat.png"

//music
var bgm = new Audio('sound/bgm.mp3');
bgm.currentTime = 1;
var pause_music = new Audio('sound/pause_music.mp3');
var game_over = new Audio('sound/gameover.mp3');
var victory = new Audio('sound/victory.mp3');

//sfx
var hit = new Audio('sound/hit.wav');
var swing = new Audio('sound/swing.wav');
var pausesfx = new Audio('sound/pause.wav');
var unpause = new Audio('sound/unpause.wav');
var hurt = new Audio('sound/hurt.wav');

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

//player animation states
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

//enemy animation states
var EnState = {
    states: {},
    generateState: function (name, startID, endID) {
        if (!this.states[name]) {
            this.states[name] = {
                name: name,
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

//Entities
Entity.createEntity("player", 64, 64, 1, 0, 0);
Entity.createEntity("enemy", 16, 24, 2, 0, 0);

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
State.generateState("attack_right", 24, 27);
State.generateState("attack_up", 28, 31);
State.generateState("attack_left", 32, 35);
State.generateState("attack_down", 36, 39);

//enemy states
State.generateState("enemy_move", 0, 4)


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnEnemies() {
    enemies[0] = new box(105, 290, 30, 30), enemies[1] = new box(415, 200, 30, 30), enemies[2] = new box(790, 51, 30, 30), enemies[3] = new box(988, 210, 30, 30), enemies[4] = new box(1320, 150, 30, 30),
        enemies[5] = new box(1535, 59, 30, 30), enemies[6] = new box(1630, 350, 30, 30), enemies[7] = new box(1525, 1002, 30, 30), enemies[8] = new box(765, 352, 30, 30), enemies[9] = new box(760, 450, 30, 30),
        enemies[10] = new box(98, 505, 30, 30), enemies[11] = new box(480, 550, 30, 30), enemies[12] = new box(911, 458, 30, 30), enemies[13] = new box(535, 702, 30, 30), enemies[14] = new box(362, 735, 30, 30),
        enemies[15] = new box(100, 853, 30, 30), enemies[16] = new box(360, 930, 30, 30), enemies[17] = new box(520, 903, 30, 30), enemies[18] = new box(545, 1000, 30, 30), enemies[19] = new box(956, 1000, 30, 30),
        enemies[20] = new box(1320, 750, 30, 30), enemies[21] = new box(990, 555, 30, 30), enemies[22] = new box(1340, 452, 30, 30), enemies[23] = new box(1525, 510, 30, 30), enemies[24] = new box(1795, 585, 30, 30),
        enemies[25] = new box(1440, 215, 30, 30), enemies[26] = new box(1786, 745, 30, 30), enemies[27] = new box(1763, 1000, 30, 30)
}

function drawWalls() {
    walls[0] = new box(67, 37, 5, 1005), walls[1] = new box(73, 85, 80, 5), walls[2] = new box(159, 39, 1690, 5), walls[3] = new box(70, 1037, 1700, 5), walls[4] = new box(1848, 39, 5, 955), walls[5] = new box(243, 40, 5, 250),
        walls[6] = new box(67, 186, 85, 5), walls[7] = new box(156, 135, 92, 5), walls[8] = new box(152, 188, 5, 50), walls[9] = new box(157, 286, 180, 5), walls[10] = new box(331, 138, 5, 153), walls[11] = new box(335, 186, 272, 5),
        walls[12] = new box(422, 40, 5, 95), walls[13] = new box(336, 86, 91, 5), walls[14] = new box(510, 86, 632, 5), walls[15] = new box(1317, 86, 270, 5), walls[16] = new box(1676, 86, 171, 5), walls[17] = new box(1136, 336, 185, 5),
        walls[18] = new box(600, 136, 276, 5), walls[19] = new box(1045, 136, 718, 5), walls[20] = new box(688, 186, 811, 5), walls[21] = new box(1671, 186, 96, 5), walls[22] = new box(600, 237, 95, 5), walls[23] = new box(778, 237, 97, 5),
        walls[24] = new box(1047, 237, 95, 5), walls[25] = new box(1224, 237, 185, 5), walls[26] = new box(1492, 237, 183, 5), walls[27] = new box(70, 336, 715, 5), walls[28] = new box(868, 336, 185, 5), walls[29] = new box(778, 287, 185, 5),
        walls[30] = new box(1047, 287, 185, 5), walls[31] = new box(1492, 287, 92, 5), walls[32] = new box(1764, 287, 89, 5), walls[33] = new box(1402, 336, 360, 5), walls[34] = new box(70, 387, 85, 5), walls[35] = new box(243, 387, 179, 5),
        walls[36] = new box(782, 387, 90, 5), walls[37] = new box(958, 387, 185, 5), walls[38] = new box(1318, 387, 92, 5), walls[39] = new box(1493, 387, 354, 5), walls[40] = new box(154, 437, 450, 5), walls[41] = new box(688, 437, 93, 5),
        walls[42] = new box(958, 437, 182, 5), walls[43] = new box(1224, 437, 360, 5), walls[44] = new box(421, 488, 94, 5), walls[45] = new box(599, 488, 274, 5), walls[46] = new box(1135, 488, 90, 5), walls[47] = new box(1314, 488, 95, 5),
        walls[48] = new box(1582, 488, 180, 5), walls[49] = new box(245, 537, 60, 5), walls[50] = new box(368, 537, 60, 5), walls[51] = new box(510, 537, 270, 5), walls[52] = new box(1048, 537, 273, 5), walls[53] = new box(1584, 537, 92, 5),
        walls[54] = new box(1764, 537, 88, 5), walls[55] = new box(155, 588, 180, 5), walls[56] = new box(421, 588, 540, 5), walls[57] = new box(1045, 588, 185, 5), walls[58] = new box(1320, 588, 90, 5), walls[59] = new box(1494, 588, 94, 5),
        walls[60] = new box(1674, 588, 90, 5), walls[61] = new box(73, 638, 172, 5), walls[62] = new box(689, 638, 92, 5), walls[63] = new box(1048, 638, 91, 5), walls[64] = new box(1228, 638, 270, 5), walls[65] = new box(1583, 638, 90, 5),
        walls[66] = new box(1762, 638, 90, 5), walls[67] = new box(333, 687, 92, 5), walls[68] = new box(512, 687, 180, 5), walls[69] = new box(781, 687, 90, 5), walls[70] = new box(958, 687, 181, 5), walls[71] = new box(1317, 687, 90, 5),
        walls[72] = new box(1495, 687, 91, 5), walls[73] = new box(1672, 687, 90, 5), walls[74] = new box(153, 738, 180, 5), walls[75] = new box(423, 738, 175, 5), walls[76] = new box(870, 738, 90, 5), walls[77] = new box(1138, 738, 180, 5),
        walls[78] = new box(1405, 738, 90, 5), walls[79] = new box(1582, 738, 180, 5), walls[80] = new box(246, 789, 180, 5), walls[81] = new box(515, 789, 180, 5), walls[82] = new box(870, 789, 180, 5), walls[83] = new box(1228, 789, 270, 5),
        walls[84] = new box(1674, 789, 178, 5), walls[85] = new box(423, 840, 90, 5), walls[86] = new box(693, 840, 90, 5), walls[87] = new box(870, 840, 90, 5), walls[88] = new box(1140, 840, 90, 5), walls[89] = new box(1765, 840, 88, 5),
        walls[90] = new box(1316, 840, 270, 5), walls[91] = new box(158, 890, 90, 5), walls[92] = new box(335, 890, 90, 5), walls[93] = new box(780, 890, 90, 5), walls[94] = new box(512, 890, 180, 5), walls[95] = new box(960, 890, 180, 5),
        walls[96] = new box(1227, 890, 180, 5), walls[97] = new box(1673, 890, 90, 5), walls[98] = new box(245, 940, 90, 5), walls[99] = new box(422, 940, 180, 5), walls[100] = new box(870, 940, 90, 5), walls[101] = new box(1137, 940, 180, 5),
        walls[102] = new box(1405, 940, 94, 5), walls[103] = new box(1583, 940, 180, 5), walls[104] = new box(155, 988, 90, 5), walls[105] = new box(333, 988, 92, 5), walls[106] = new box(603, 988, 92, 5), walls[107] = new box(961, 988, 90, 5),
        walls[108] = new box(1763, 989, 90, 5), walls[109] = new box(1320, 988, 355, 5), walls[110] = new box(155, 440, 5, 150), walls[111] = new box(154, 691, 5, 150), walls[112] = new box(155, 892, 5, 100), walls[113] = new box(243, 388, 5, 50),
        walls[114] = new box(243, 491, 5, 100), walls[115] = new box(243, 641, 5, 100), walls[116] = new box(243, 791, 5, 100), walls[117] = new box(243, 943, 5, 50), walls[118] = new box(332, 441, 5, 50), walls[119] = new box(332, 593, 5, 100),
        walls[120] = new box(332, 843, 5, 50), walls[121] = new box(332, 990, 5, 50), walls[122] = new box(422, 241, 5, 100), walls[123] = new box(422, 490, 5, 50), walls[124] = new box(422, 590, 5, 50), walls[125] = new box(422, 687, 5, 158),
        walls[126] = new box(422, 893, 5, 100), walls[127] = new box(511, 190, 5, 100), walls[128] = new box(511, 88, 5, 50), walls[129] = new box(511, 340, 5, 50), walls[130] = new box(511, 487, 5, 50), walls[131] = new box(511, 640, 5, 50),
        walls[132] = new box(511, 841, 5, 50), walls[133] = new box(511, 941, 5, 50), walls[134] = new box(600, 138, 5, 50), walls[135] = new box(600, 593, 5, 50), walls[136] = new box(600, 241, 5, 100), walls[137] = new box(600, 391, 5, 100),
        walls[138] = new box(600, 792, 5, 100), walls[139] = new box(690, 190, 5, 100), walls[140] = new box(690, 340, 5, 100), walls[141] = new box(690, 893, 5, 100), walls[142] = new box(690, 640, 5, 150), walls[143] = new box(779, 691, 5, 350),
        walls[144] = new box(779, 291, 5, 50), walls[145] = new box(779, 542, 5, 50), walls[146] = new box(868, 338, 5, 200), walls[147] = new box(868, 91, 5, 50), walls[148] = new box(868, 188, 5, 50), walls[149] = new box(868, 643, 5, 100),
        walls[150] = new box(868, 893, 5, 100), walls[151] = new box(868, 791, 5, 50), walls[152] = new box(958, 392, 5, 300), walls[153] = new box(958, 141, 5, 50), walls[154] = new box(958, 240, 5, 50), walls[155] = new box(958, 843, 5, 50),
        walls[156] = new box(1046, 90, 5, 50), walls[157] = new box(1046, 240, 5, 100), walls[158] = new box(1046, 490, 5, 100), walls[159] = new box(1046, 893, 5, 100), walls[160] = new box(1046, 690, 5, 150), walls[161] = new box(1136, 942, 5, 100),
        walls[162] = new box(1136, 90, 5, 50), walls[163] = new box(1136, 341, 5, 50), walls[164] = new box(1136, 441, 5, 50), walls[165] = new box(1136, 642, 5, 50), walls[166] = new box(1136, 742, 5, 50), walls[167] = new box(1136, 843, 5, 50),
        walls[168] = new box(1225, 592, 5, 150), walls[169] = new box(1225, 340, 5, 100), walls[170] = new box(1225, 43, 5, 50), walls[171] = new box(1225, 241, 5, 50), walls[172] = new box(1225, 793, 5, 50), walls[173] = new box(1225, 891, 5, 50),
        walls[174] = new box(1225, 993, 5, 50), walls[175] = new box(1315, 290, 5, 50), walls[176] = new box(1315, 491, 5, 50), walls[177] = new box(1315, 842, 5, 50), walls[178] = new box(1404, 492, 5, 100), walls[179] = new box(1404, 240, 5, 45),
        walls[180] = new box(1404, 342, 5, 50), walls[181] = new box(1404, 692, 5, 50), walls[182] = new box(1404, 943, 5, 50), walls[183] = new box(1493, 190, 5, 100), walls[184] = new box(1493, 392, 5, 200), walls[185] = new box(1493, 638, 5, 50),
        walls[186] = new box(1493, 743, 5, 50), walls[187] = new box(1493, 893, 5, 50), walls[188] = new box(1583, 690, 5, 250), walls[189] = new box(1583, 88, 5, 100), walls[190] = new box(1583, 490, 5, 50), walls[191] = new box(1583, 590, 5, 50),
        walls[192] = new box(1672, 190, 5, 150), walls[193] = new box(1672, 792, 5, 100), walls[194] = new box(1672, 442, 5, 50), walls[195] = new box(1672, 538, 5, 50), walls[196] = new box(1672, 638, 5, 50), walls[197] = new box(1672, 945, 5, 50),
        walls[198] = new box(1761, 189, 5, 50), walls[199] = new box(1761, 390, 5, 50), walls[200] = new box(1761, 590, 5, 50), walls[201] = new box(69, 0, 5, 40), walls[202] = new box(161, 0, 5, 40), walls[203] = new box(70, 0, 120, 5)
}

function start() {
    cv = document.getElementById('mycanvas');
    ctx = cv.getContext('2d')

    cv.addEventListener('click', function (e) {
        console.log("X: " + e.offsetX + " Y: " + e.offsetY);
    });

    player = new box(112, 40, 20, 20);

    hitbox = new box();

    treasure = new box(1785, 980, 120, 120);

    timeCountdown();
    paint();
    spawnEnemies();
    drawWalls();
    
}

setInterval(timeCountdown, 1000);
//time countdown
function timeCountdown() {
    if (time != -1 && !pause) {
        minutes = Math.floor(time / 60);
        seconds = time % 60;
        seconds = seconds < 10 ? '0' + seconds : seconds
        time--;
    }

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


    if (!dead && !win) {
        //atacar
        if (move[74]) {
            attacking = true;
            swing.play()
        }

        //pause
        if (e.keyCode == 32) {
            pause = (pause) ? false : true;
            if (pause) {
                pausesfx.play();
                bgm.pause();
                pause_music.play();
            } else {
                unpause.play()
                bgm.play();
                pause_music.pause();
                pause_music.currentTime = 0;
            }
        }
    }

    //reiniciar
    if (move[82]) {
        for (i = 0; i < enemies.length; i++) {
            enemies[i].x = -50;
        }

        player.x = 112, player.y = 40;
        dead = false;
        pause = false;

        bgm.play();
        bgm.currentTime = 1;
        game_over.pause();
        game_over.currentTime = 0;
        pause_music.pause();
        pause_music.currentTime = 0;
        victory.pause();
        victory.currentTime = 0;
        time = 90;
        win = false;

        spawnEnemies();

    }

});

document.addEventListener('keyup', function (e) {
    move[e.keyCode] = false;
    if (!move[68] && !move[65] && !move[87] && !move[83]) {
        moving = false;
    }

});

//boxes
function box(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.dibujar = function (ctx) {
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    this.se_tocan = function (target) {

        if (this.x < target.x + target.w &&
            this.x + this.w > target.x &&
            this.y < target.y + target.h &&
            this.y + this.h > target.y) {
            return true;
        }
    };

    this.collision = function (target, i) {

        if (this.x < target[i].x + target[i].w &&
            this.x + this.w > target[i].x &&
            this.y < target[i].y + target[i].h &&
            this.y + this.h > target[i].y) {
            return true;
        }
    };


}

//enemy animations
function en_animate(state) {
    //enemy drawing
    for (i = 0; i < enemies.length; i++) {
        ctx.drawImage(
            enemySpriteSheet,
            state.frameID * Entity.getEntity("enemy").frameWidth, 0,
            Entity.getEntity("enemy").frameWidth, Entity.getEntity("enemy").frameHeight,
            enemies[i].x - 2, enemies[i].y,
            Entity.getEntity("enemy").frameWidth * Entity.getEntity("enemy").scale,
            Entity.getEntity("enemy").frameHeight * Entity.getEntity("enemy").scale
        );
    }


    //frame speed
    Entity.getEntity("enemy").frameCount++;
    if (Entity.getEntity("enemy").frameCount > 4) {
        state.frameID++;
        Entity.getEntity("enemy").frameCount = 0;
    }

    //frames used
    if (state.frameID > state.endID) {
        state.frameID = state.startID;
    }
}

//player animations
function animate(state) {

    //player drawing
    ctx.drawImage(
        playerSpriteSheet,
        state.frameID * Entity.getEntity("player").frameWidth, 0,
        Entity.getEntity("player").frameWidth, Entity.getEntity("player").frameHeight,
        player.x - 21, player.y - 23,
        Entity.getEntity("player").frameWidth * Entity.getEntity("player").scale,
        Entity.getEntity("player").frameHeight * Entity.getEntity("player").scale
    );

    ctx.draw

    //frame speed
    Entity.getEntity("player").frameCount++;
    if (Entity.getEntity("player").frameCount > 4) {
        state.frameID++;
        Entity.getEntity("player").frameCount = 0;
    }

    //frames used
    if (state.frameID > state.endID) {
        state.frameID = state.startID;
        attacking = false;
    }
}

//draw
function paint() {
    window.requestAnimationFrame(paint)

    //background
    // ctx.fillStyle = "rgb(150,200,250)";
    // ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bg, 0, 0, 1920, 1080)

    for (i = 0; i < walls.length; i++) {
        ctx.fillStyle = "rgb(6, 88, 24)";
        ctx.strokeStyle = "rgb(6, 88, 24)";
        if (i > 200) {
            ctx.fillStyle = "rgba(0,0,0,0)";
            ctx.strokeStyle = "rgba(0,0,0,0)";
        }
        walls[i].dibujar(ctx);
    }

    for (i = 0; i < enemies.length; i++) {
        ctx.fillStyle = "rgba(0,0,0,0)";
        ctx.strokeStyle = "rgba(0,0,0,0)";
        enemies[i].dibujar(ctx);
    }

    treasure.dibujar(ctx);
    ctx.drawImage(chest, 1785, 980, 120, 120)

    //collision box (debug)
    // ctx.strokeStyle = "black";
    // player.dibujar(ctx);

    // ctx.strokeStyle = "red";
    // for (i = 0; i < enemies.length; i++) {
    //     enemies[i].dibujar(ctx);
    // }

    //hitbox placement
    if (attacking) {
        if (direction == 'right') {
            hitbox.x = player.x + 25;
            hitbox.y = player.y - 3;
            hitbox.w = 12, hitbox.h = 27;
        }
        if (direction == 'left') {
            hitbox.x = player.x - 15;
            hitbox.y = player.y - 3;
            hitbox.w = 12, hitbox.h = 27;
        }
        if (direction == 'up') {
            hitbox.x = player.x - 4;
            hitbox.y = player.y - 15;
            hitbox.w = 27, hitbox.h = 12;
        }
        if (direction == 'down') {
            hitbox.x = player.x - 4;
            hitbox.y = player.y + 25;
            hitbox.w = 27, hitbox.h = 12;
        }
        //hitbox.dibujar(ctx);
    }

    //pause
    if (!pause) {
        update();
    } else {
        if (win) {
            ctx.fillStyle = "rgba(0,0,50,0.5)"
            ctx.fillRect(0, 0, width, height);

            ctx.font = "80px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("you win :)", 800, 500);

            bgm.pause();
            victory.play();
        }

        if (dead) {
            ctx.fillStyle = "rgba(150,0,0,0.8)"
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "white";
            ctx.font = "80px Arial";
            ctx.fillText("G A M E  O V E R", 620, 500);
            ctx.font = "30px Arial";
            ctx.fillText("Press 'R' to restart", 840, 570);
            bgm.pause();
            bgm.currentTime = 0;
            game_over.play();
            if (game_over.currentTime > 8) {
                game_over.pause();
            }

        } else if (!dead && !win) {
            ctx.fillStyle = "rgba(0,0,0,0.5)"
            ctx.fillRect(0, 0, width, height);

            ctx.font = "80px Arial";
            ctx.fillStyle = "white";
            ctx.fillText("P A U S E", 780, 350);

            ctx.font = "40px Arial";
            ctx.fillText("- Controles -", 850, 450);

            ctx.font = "40px Arial";
            ctx.fillText("Moverse - WASD", 810, 500);

            ctx.font = "40px Arial";
            ctx.fillText("Atacar - J", 810, 550);

            ctx.font = "40px Arial";
            ctx.fillText("Pausa - Espacio", 810, 600);

            ctx.font = "40px Arial";
            ctx.fillText("Reiniciar - R", 810, 650);
        }

    }

    //game over
    if (time == -1 || dead) {
        dead = true;
        pause = true;
    }

    //winner
    if (win) {
        pause = true;
    }

    //contador
    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(minutes + ":" + seconds, 900, 70);
}

//player inputs
function update() {
    bgm.play();
    en_animate(State.getState("enemy_move"));

    if (!attacking) { //detiene al jugador al atacar
        hitbox.x = -50, hitbox.y = -50;
        //derecha
        if (move[68]) {
            player.x += speed;
            animate(State.getState("move_right"));
            direction = 'right';
        }

        //izquierda
        if (move[65]) {
            player.x -= speed;
            animate(State.getState("move_left"));
            direction = 'left';
        }

        //arriba
        if (move[87]) {
            player.y -= speed;
            animate(State.getState("move_up"));
            direction = 'up';
        }

        //abajo
        if (move[83]) {
            player.y += speed;
            animate(State.getState("move_down"));
            direction = 'down';
        }
    }

    //colisiones
    for (i = 0; i < walls.length; i++) {
        if (player.se_tocan(walls[i])) {
            //derecha
            if (move[68]) {
                player.x -= speed;
            }

            //izquierda
            if (move[65]) {
                player.x += speed;
            }

            //arriba
            if (move[87]) {
                player.y += speed;
            }

            //abajo
            if (move[83]) {
                player.y -= speed;
            }
        }

    }

    //if not moving
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

    //attack animations
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

    //hitbox detection
    for (i = 0; i < enemies.length; i++) {
        if (hitbox.collision(enemies, i)) {
            enemies[i].x = -50;
            hitbox.x = -50, hitbox.y = -50;
            hit.play();
        }
        if (player.collision(enemies, i)) {
            hurt.play();
            dead = true;
        }
    }

    if (player.se_tocan(treasure)) {
        win = true;
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

