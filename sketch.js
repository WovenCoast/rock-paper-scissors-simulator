/// < reference path="./node_modules/@types/p5/d.ts" / >

// const p5 = require("./node_modules/@types/p5");

const rockAsset = "./assets/the rock.jpg";
const paperAsset = "./assets/post it note.jpg";
const scissorsAsset = "./assets/scissor.webp";
let rockImg, paperImg, scissorsImg;
let width = window.innerWidth;
let height = window.innerHeight - 100;
let entityCount, velocityRange;
let entitySize = 35;

function getImageForState(state) {
  let img;
  switch (state) {
    case "rock":
      img = rockImg;
      break;
    case "paper":
      img = paperImg;
      break;
    case "scissors":
      img = scissorsImg;
      break;
  }
  return img;
}
class Entity {
  constructor(idx, x, y, xv, yv, initState) {
    this.idx = idx;
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
    this.state = initState;
  }

  checkCollision(otherEntity) {
    let x1 = this.x;
    let y1 = this.y;
    let x2 = otherEntity.x;
    let y2 = otherEntity.y;
    let w = entitySize;
    let h = entitySize;
    if (x1 + w < x2 || x2 + w < x1) {
      return false;
    }
    if (y1 + h < y2 || y2 + h < y1) {
      return false;
    }
    return true;
  }

  update() {
    // let newState = random(["rock", "paper", "scissors"]);
    // this.state = newState;
    for (let i = 0; i < allEntities.length; i++) {
      if (i == this.idx) {
        continue;
      }
      let otherEntity = allEntities[i];
      if (this.checkCollision(otherEntity)) {
        // console.log("collision!");
        if (this.state == "rock" && otherEntity.state == "paper") {
          this.state = "paper";
        } else if (this.state == "paper" && otherEntity.state == "scissors") {
          this.state = "scissors";
        } else if (this.state == "scissors" && otherEntity.state == "rock") {
          this.state = "rock";
        }
      }
    }
    this.x += this.xv;
    this.y += this.yv;
    if (this.x < 0 || this.x + entitySize > width) {
      this.xv *= -1;
    }
    if (this.y < 0 || this.y + entitySize > height) {
      this.yv *= -1;
    }

    // for now, the entity just decides randomly. in reality, it should detect when it collides with another entity and process it accordingly
  }

  draw() {
    let img = getImageForState(this.state);
    image(img, this.x, this.y, entitySize, entitySize);
  }
}

let allEntities = [];

function setElementText(id, text) {
  document.getElementById(id).innerHTML = text;
}

function setElementClass(id, className) {
  document.getElementById(id).className = className;
}

function setElementSrc(id, src) {
  document.getElementById(id).src = src;
}

function preload() {
  rockImg = loadImage(rockAsset);
  paperImg = loadImage(paperAsset);
  scissorsImg = loadImage(scissorsAsset);
}

function setup() {
  createCanvas(width, height);
  frameRate(24);

  entityCount = Math.floor(random(100, 500));
  velocityRange = Math.floor(random(5, 20));

  setElementText("totalEntities", entityCount);
  setElementSrc("rockImg", rockAsset);
  setElementSrc("paperImg", paperAsset);
  setElementSrc("scissorsImg", scissorsAsset);
  for (let i = 0; i < entityCount; i++) {
    let x = random(width - entitySize);
    let y = random(height - entitySize);
    let xv = random(velocityRange) - velocityRange / 2;
    let yv = random(velocityRange) - velocityRange / 2;
    let state = random(["rock", "paper", "scissors"]);
    // let state = "rock";
    let e = new Entity(i, x, y, xv, yv, state);
    allEntities.push(e);
  }
}

let waitingForReload = false;
function draw() {
  background(60);
  let stats = { rock: 0, paper: 0, scissors: 0 };
  for (let i = 0; i < allEntities.length; i++) {
    stats[allEntities[i].state] += 1;
    allEntities[i].update();
    allEntities[i].draw();
  }

  if (!waitingForReload) {
    let firstEntity = allEntities[0];
    if (allEntities.every((e) => e.state == firstEntity.state)) {
      document.getElementById(
        "stats"
      ).innerHTML = `<span>The winner is <strong>${firstEntity.state}</strong>!</span>`;
      waitingForReload = true;
      setTimeout(() => {
        location.reload();
      }, 10000);
      return;
    }

    setElementText("rockCount", stats.rock);
    setElementText("paperCount", stats.paper);
    setElementText("scissorsCount", stats.scissors);
    setElementClass("rockCount", "");
    setElementClass("paperCount", "");
    setElementClass("scissorsCount", "");
    let max = Math.max(stats.rock, stats.paper, stats.scissors);
    if (max == stats.rock) {
      setElementClass("rockCount", "highest");
    } else if (max == stats.paper) {
      setElementClass("paperCount", "highest");
    } else if (max == stats.scissors) {
      setElementClass("scissorsCount", "highest");
    }
  }
}
