// define the objects
var isPaused = false;
let pop_size = 2000
let data = [pop_size-1, 1, 0, 0];

// Cells kinds constants 
const NORMAL = 0;
const INFECTED = 1;
const RECOVERED = 2;
const DEAD = 3;

const minDeathTime = 200;
const maxDeathTime = 300;
const minRecoveryTime = 150;
const maxRecoveryTime = 250;

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function getColor(kind) {
  switch(kind) {
    case NORMAL: return 'rgb(100,100,100)';
    case RECOVERED: return 'rgb(0,255,0)';
    case INFECTED: return 'rgb(255,0,0)';
    case DEAD: return 'rgb(0,0,255)';
    default :
      return 'rgb(100,100,100)';
  }
}

function Ball(x, y, velX, velY, size, kind) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.size = size;
  this.kind = kind;
  // random recovery time
  this.counter_rec = random(minRecoveryTime, maxRecoveryTime); 
  // random death time
  this.counter_death = random(minDeathTime, maxDeathTime); 
}

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = getColor(this.kind);
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width - 5) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 5) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height - 25) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 25) {
    this.velY = -(this.velY);
  }
  
  if (this.kind !== DEAD) {
      this.x += this.velX;
      this.y += this.velY;
      this.velX = random(-10,10);
      this.velY = random(-10,10);
  }

  if (this.kind === INFECTED) {
    if (this.counter_rec > 0) {
      this.counter_rec--;
    }
    if (this.counter_death > 0) {
      this.counter_death--;
    }
    if (this.counter_rec <= 0) {
      this.kind = RECOVERED;
      data[RECOVERED]++;
      data[INFECTED]--;
    } else if (this.counter_death <= 0) {
      this.kind = DEAD;
      data[DEAD]++;
      data[INFECTED]--;
    }
  }
}

Ball.prototype.collisionDetect = function() {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size 
        && balls[j].kind === INFECTED && this.kind === NORMAL) {
        this.kind = INFECTED;
        data[INFECTED]++;
        data[NORMAL]--;
      }
    }
  }
}




// Start simulation

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let balls = [];

while (balls.length < pop_size) {
  let size = 4;
  let ball = new Ball(
    random(5 + size,width - size),
    random(25 + size,height - size),
    random(-10,10),
    random(-10,10),
    size,
    NORMAL
  );

  balls.push(ball);
}

// Random sick Person
balls[random(0, pop_size)].kind = INFECTED;


// for (let i = 0; i < balls.length; i++) {
//     if (i%4 !== 0){
//         balls[i].stationary = true;
//     }
// }

clickButton = function() {
  if (isPaused) {
    resume();
  } else {
    pause();
  }
}

function pause() {
  let button = document.querySelector("span#button");
  isPaused = true;
  button.innerHTML = '<img height="30px" width="30px" src="play.png" />';
}

function resume() {
  let button = document.querySelector("span#button");
  isPaused = false;
  button.innerHTML = '<img height="30px" width="30px" src="pause.png" />';
}

function loop() {
  if (!isPaused) {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, width, height);
    ctx.font = "20px Arial";
    for(let i = 0; i<4; i++) {
        ctx.fillStyle = getColor(i);
        ctx.fillText(data[i], 5, 25 + 20*i);
    }

    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
