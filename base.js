// define the objects

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}


function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.stationary = false;
    this.counter_rec = random(1000, 2000); // random recovery time between 1000 and 2000 frames
    this.counter_death = random(1500, 2500); // random death time if not recovered time between 1500 and 2500 frames
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
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
    
    if (!this.stationary) {
        this.x += this.velX;
        this.y += this.velY;
        this.velX = random(-5,5);
        this.velY = random(-5,5);
    }

    if (this.counter_rec > 0 && this.color === 'rgb(' + 255 + ',' + 0 + ',' + 0 +')') {
        this.counter_rec--;
    }

    if (this.counter_death > 0 && this.color === 'rgb(' + 255 + ',' + 0 + ',' + 0 +')') {
        this.counter_death--;
    }

    if (this.counter_rec <= 0) {
        this.color = 'rgb(' + 0 + ',' + 255 + ',' + 0 +')';
    }

    if (this.counter_death <= 0) {
        this.color = 'rgb(' + 0 + ',' + 0 + ',' + 255 +')';
        this.stationary = true;
    }
}

Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {
      if (!(this === balls[j])) {
        const dx = this.x - balls[j].x;
        const dy = this.y - balls[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < this.size + balls[j].size && balls[j].color === 'rgb(' + 255 + ',' + 0 + ',' + 0 +')' && this.color != 'rgb(' + 0 + ',' + 255 + ',' + 0 +')') {
          balls[j].color = this.color = 'rgb(' + 255 + ',' + 0 + ',' + 0 +')';
        }
      }
    }
}




// Start simulation

const canvas = document.querySelector('canvas');

const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let pop_size = 2000;
let balls = [];

while (balls.length < pop_size) {
  let size = 4;
  let ball = new Ball(
    
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-5,5),
    random(-5,5),
    'rgb(' + 100 + ',' + 100 + ',' + 100 +')',
    size
  );

  balls.push(ball);
}

balls[random(0, 1999)].color = 'rgb(' + 255 + ',' + 0 + ',' + 0 +')'; //random sick person

// for (let i = 0; i < balls.length; i++) {
//     if (i%4 !== 0){
//         balls[i].stationary = true;
//     }
// }




function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);
  
    for (let i = 0; i < balls.length; i++) {
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  
    requestAnimationFrame(loop);
}

loop();
