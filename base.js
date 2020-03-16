// define the objects
var isPaused = false;

// Cells kinds constants 
const NORMAL = 0;
const INFECTED = 1;
const RECOVERED = 2;
const DEAD = 3;

const minDeathTime = 150;
const maxDeathTime = 300;
const minRecoveryTime = 200;
const maxRecoveryTime = 300;

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

function getColor(kind) {
  switch(kind) {
    case NORMAL: return 'rgb(' + 100 + ',' + 100 + ',' + 100 +')';
    case RECOVERED: return 'rgb(' + 0 + ',' + 255 + ',' + 0 +')';
    case INFECTED: return 'rgb(' + 255 + ',' + 0 + ',' + 0 +')';
    case DEAD: return 'rgb(' + 0 + ',' + 0 + ',' + 255 +')';
    default :
      return 'rgb(' + 100 + ',' + 100 + ',' + 100 +')';
  }
}

function Ball(x, y, velX, velY, size, kind) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.size = size;
  this.kind = kind;
  // random recovery time between 1000 and 2000 frames
  this.counter_rec = random(minDeathTime, maxDeathTime); 
  // random death time if not recovered time between 1500 and 2500 frames
  this.counter_death = random(minDeathTime, maxRecoveryTime); 
}

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = getColor(this.kind);
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}

Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }
  
  if (this.kind !== DEAD) {
      this.x += this.velX;
      this.y += this.velY;
      this.velX = random(-10,10);
      this.velY = random(-10,10);
  }

  if (this.kind == INFECTED && this.counter_rec > 0) {
    --this.counter_rec;
    if (this.counter_rec <= 0) {
      this.kind = RECOVERED;
    }
  } else if (this.kind == INFECTED && this.counter_death > 0) {
    this.counter_death--;
    if (this.counter_death <= 0) {
      this.kind = DEAD;
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
        && balls[j].kind === INFECTED && this.kind != RECOVERED) {
        this.kind = INFECTED;
      }
    }
  }
}




// Start simulation

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let pop_size = 3000;
let balls = [];

while (balls.length < pop_size) {
  let size = 4;
  let ball = new Ball(
    random(0 + size,width - size),
    random(0 + size,height - size),
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


function pause() {
  isPaused = true;
}

function resume() {
  isPaused = false;
}

function loop() {
  if (!isPaused) {
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
