//===================================================================================================================================================================================================================
//Buttons
//Button declaration
const startBtn = document.querySelector(".start-btn");
const muteBtn = document.querySelector(".mute-btn");
const restartBtn = document.querySelector(".restart-btn");
const gameWindow = document.querySelector(".game-window");
let sound = "on";

//Start button
startBtn.addEventListener(
  "click",
  () => {
    startBtn.style.display = "none";
    gameWindow.style.display = "block";
    muteBtn.style.display = "block";
    restartBtn.style.display = "block";
    startGame();
  },
  { once: true }
);

//Mute button
muteBtn.addEventListener("click", () => {
  if (sound == "on") {
    song.muted = true;
    scan.muted = true;
    countdownAud.muted = true;
    gunshot.muted = true;
    win.muted = true;
    gameover.muted = true;
    muteBtn.src = "./images/mute.png";
    sound = "off";
  } else {
    song.muted = false;
    scan.muted = false;
    countdownAud.muted = false;
    gunshot.muted = false;
    win.muted = false;
    gameover.muted = false;
    muteBtn.src = "./images/sound.png";
    sound = "on";
  }
});

//Restart button
restartBtn.addEventListener("click", () => {
  window.location.reload();
});

//===================================================================================================================================================================================================================
//Timer
let timer = 60;
let gameState = "loading";
const time = document.querySelector(".game-timer");
const gameNoti = document.querySelector(".game-notification");

//Time delayer
function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

//Game clock logic
async function countdown() {
  while (timer > 0) {
    await delay(1000);
    timer--;
    time.innerText = timer;
  }
  if (timer == 0 && gameState == "running") {
    fireTurrets();
    characterDeath();
  }
}

//===================================================================================================================================================================================================================
//Game initialization
async function startGame() {
  await delay(1500);
  countdownAud.play();
  gameNoti.innerText = "3";
  await delay(1000);
  gameNoti.innerText = "2";
  await delay(1000);
  gameNoti.innerText = "1";
  await delay(1000);
  gameNoti.innerText = "Go!";
  gameState = "running";
  await delay(1000);
  gameNoti.innerText = "Hold Space to move!";
  start();
  countdown();
  move(ai_1);
  move(ai_2);
}

//===================================================================================================================================================================================================================
//Sound
//Audio declaration
const song = new Audio();
song.src = "./sound/song.mp3";
const songTime = 5;
let songDuration = 5000;

const scan = new Audio();
scan.src = "./sound/scan.mp3";
const scanTime = 3.5;
let scanDuration = 3500;

const countdownAud = new Audio();
countdownAud.src = "./sound/countdown.mp3";
const gunshot = new Audio();
gunshot.src = "./sound/gunshot.mp3";
const win = new Audio();
win.src = "./sound/win.wav";
const gameover = new Audio();
gameover.src = "./sound/gameover.mp3";

//Doll singing playback
function sing() {
  song.playbackRate = Math.random() + 0.75;
  songDuration = Math.round((songTime / song.playbackRate) * 1000);
  song.play();
}

//Doll scanning playback
function screen() {
  scan.playbackRate = Math.random() + 0.75;
  scanDuration = Math.round((scanTime / scan.playbackRate) * 1000);
  scan.play();
}

//===================================================================================================================================================================================================================
//Doll
//Doll movement and scanning phase indicator
let lookForward = false;

function turnForward() {
  document.querySelector(".doll").src = "./images/doll_red.png";
  document.querySelector(".game-window").style.borderColor = "#bb1e1040";
  document.querySelector(".game-window").style.boxShadow = "0 0 20px #bb1e10";
  setTimeout(() => (lookForward = true), 300);
}

function turnBack() {
  document.querySelector(".doll").src = "./images/doll_green.png";
  lookForward = false;
  move(ai_1);
  move(ai_2);
  document.querySelector(".game-window").style.borderColor = "#33a53240";
  document.querySelector(".game-window").style.boxShadow = "0 0 20px #33a532";
}

//Doll logic
async function start() {
  while (timer > 0) {
    sing();
    await delay(songDuration);
    turnForward();
    screen();
    await delay(scanDuration);
    turnBack();
    return start();
  }
}

//===================================================================================================================================================================================================================
//Character
//Character movement
const character = document.getElementById("player");
const character_indicator = document.getElementById("player_indicator");
let currentPlayerLocation = "5px";
let currentIndicatorLocation = "16px";
const step = 2;
let foot = "left";

function movement() {
  currentPlayerLocation = parseFloat(currentPlayerLocation) + step;
  character.style.left = `${currentPlayerLocation}px`;
  currentIndicatorLocation = parseFloat(currentIndicatorLocation) + step;
  character_indicator.style.left = `${currentIndicatorLocation}px`;
  if (foot == "left") {
    character.src = "./images/character_right.png";
    foot = "right";
  } else {
    character.src = "./images/character_left.png";
    foot = "left";
  }
}

//Movement input checker
window.addEventListener("keydown", function (e) {
  if (e.code == "Space") {
    if (gameState == "running") {
      movement();
    }
    checkGameStatus();
  }
});

//===================================================================================================================================================================================================================
//Game logic
//Turrets firing
const turrets = document.querySelectorAll(".turret");

async function fireTurrets() {
  for (const turret of turrets) {
    turret.src = "./images/turret_px_shoot.png";
  }
  gunshot.play();
  await delay(500);
  for (const turret of turrets) {
    turret.src = "./images/turret_px.png";
  }
}

//Character death sequence
async function characterDeath() {
  gameState = "end";
  character.src = "./images/tombstone.png";
  gameNoti.innerText = "Game Over";
  currentIndicatorLocation = parseFloat(currentIndicatorLocation) + 2;
  character_indicator.style.left = `${currentIndicatorLocation}px`;
  character_indicator.src = "./images/loss_indicator.png";
  await delay(1500);
  gameover.play();
}

//Winning pose
async function pose() {
  await delay(500);
  character.src = "./images/character_look_back.png";
  await delay(1500);
  for (let i = 0; i < 16; i++) {
    movement();
    await delay(300);
  }
  currentIndicatorLocation = parseFloat(currentIndicatorLocation) - 4;
  character_indicator.style.left = `${currentIndicatorLocation}px`;
  character_indicator.src = "./images/win_indicator.png";
  character.src = "./images/character_win.png";
  win.play();
}

//win/loss checker
async function checkGameStatus() {
  if (gameState == "running") {
    if (lookForward === true) {
      fireTurrets();
      characterDeath();
    } else if (parseFloat(character.style.left) > 711) {
      gameState = "end";
      gameNoti.innerText = "You Win!";
      pose();
    }
  }
}

//===================================================================================================================================================================================================================
//ai
//ai objects
const ai_1 = {
  name: "ai_1",
  tag: function () {
    return document.querySelector("#ai-1");
  },
  foot: "left",
  status: "alive",
  position: "8px",
  termination: function () {
    return Math.floor(Math.random() * 200 + 400);
  },
  step: function () {
    return Math.ceil(Math.random() * 3 + 1);
  },
};

const ai_2 = {
  name: "ai_2",
  tag: function () {
    return document.querySelector("#ai-2");
  },
  foot: "left",
  status: "alive",
  position: "5px",
  termination: function () {
    return Math.floor(Math.random() * 400 + 200);
  },
  step: function () {
    return Math.ceil(Math.random() * 2 + 1);
  },
};

//ai movement
async function aiFeet(ai) {
  if (ai.foot == "left") {
    ai.tag().src = `./images/${ai.name}_right.png`;
    ai.foot = "right";
  } else {
    ai.tag().src = `./images/${ai.name}_left.png`;
    ai.foot = "left";
  }
}

async function move(ai) {
  if (ai.status == "alive") {
    if (parseFloat(ai.position) < ai.termination()) {
      if (lookForward === false) {
        ai.position = parseFloat(ai.position) + ai.step();
        ai.tag().style.left = `${ai.position}px`;
        aiFeet(ai);
        await delay(150);
        return move(ai);
      }
    } else {
      ai.position = parseFloat(ai.position) + ai.step();
      ai.tag().style.left = `${ai.position}px`;
      aiFeet(ai);
      await delay(150);
      checkAiStatus(ai);
      return move(ai);
    }
  }
}

//ai termination
async function checkAiStatus(ai) {
  if (lookForward === true) {
    fireTurrets();
    ai.status = "dead";
    ai.tag().src = "./images/tombstone.png";
  }
}
