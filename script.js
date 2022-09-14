//Game notification
const gameNoti = document.querySelector(".game-notification");
let gameState = "loading";

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function startGame() {
  await delay(750);
  gameNoti.innerText = "Get ready!";
  await delay(1000);
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

window.addEventListener("click", () => startGame(), { once: true });

//Timer
let timer = 60;
const time = document.querySelector(".game-timer");

async function countdown() {
  while (timer > 0) {
    await delay(1000);
    timer--;
    time.innerText = timer;
  }
  if (timer == 0 && gameState == "running") {
    fireTurrets();
    character.src = "./images/tombstone.png";
    gameNoti.innerText = "Game Over";
    await delay(1500);
    gameover.play();
    currentIndicatorLocation = parseFloat(currentIndicatorLocation) + 4;
    character_indicator.style.left = `${currentIndicatorLocation}px`;
    character_indicator.src = "./images/loss_indicator.png";
  }
}

//Sound
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

function sing() {
  song.playbackRate = Math.random() + 0.75;
  songDuration = Math.round((songTime / song.playbackRate) * 1000);
  song.play();
}

function screen() {
  scan.playbackRate = Math.random() + 0.75;
  scanDuration = Math.round((scanTime / scan.playbackRate) * 1000);
  scan.play();
}

//Doll movement
let lookForward = false;

function turnForward() {
  document.querySelector(".doll").src = "./images/doll_red.png";
  document.querySelector(".game-window").style.borderColor = "#FF1205";
  document.querySelector(".game-window").style.boxShadow = "0 0 1.5vh #FF1205";
  setTimeout(() => (lookForward = true), 300);
}

function turnBack() {
  document.querySelector(".doll").src = "./images/doll_green.png";
  lookForward = false;
  move(ai_1);
  move(ai_2);
  document.querySelector(".game-window").style.borderColor = "#32C732";
  document.querySelector(".game-window").style.boxShadow = "0 0 1.5vh #32c732";
}

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

//Character movement
const character = document.getElementById("player");
const character_indicator = document.getElementById("player_indicator");
let currentPlayerLocation = "5px";
let currentIndicatorLocation = "16px";
const step = 2.5;
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

window.addEventListener("keydown", function (e) {
  if (e.code == "Space") {
    if (gameState == "running") {
      movement();
    }
    checkGameStatus();
  }
});

//Game logic
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

async function checkGameStatus() {
  if (gameState == "running") {
    if (lookForward === true) {
      fireTurrets();
      gameState = "end";
      currentIndicatorLocation = parseFloat(currentIndicatorLocation) + 3;
      character_indicator.style.left = `${currentIndicatorLocation}px`;
      character_indicator.src = "./images/loss_indicator.png";
      character.src = "./images/tombstone.png";
      gameNoti.innerText = "Game Over";
      await delay(1500);
      gameover.play();
    } else if (parseFloat(character.style.left) > 887) {
      gameState = "end";
      gameNoti.innerText = "Congratulations, you won!";
      pose();
    }
  }
}

//Pose
async function pose() {
  await delay(500);
  character.src = "./images/character_look_back.png";
  await delay(1500);
  for (let i = 0; i < 10; i++) {
    movement();
    await delay(300);
  }
  currentIndicatorLocation = parseFloat(currentIndicatorLocation) - 3;
  character_indicator.style.left = `${currentIndicatorLocation}px`;
  character_indicator.src = "./images/win_indicator.png";
  character.src = "./images/character_win.png";
  win.play();
}

//ai movement
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

async function aiFeet(ai) {
  if (ai.foot == "left") {
    ai.tag().src = `./images/${ai.name}_right.png`;
    ai.foot = "right";
  } else {
    ai.tag().src = `./images/${ai.name}_left.png`;
    ai.foot = "left";
  }
}

async function checkAiStatus(ai) {
  if (lookForward === true) {
    fireTurrets();
    ai.status = "dead";
    ai.tag().src = "./images/tombstone.png";
  }
}
