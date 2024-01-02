//canvas
let canvas;
let width = 360;
let height = 640;
let c;
let birdImg;

//bird
let birdWidth = 34;
let birdHeight = 25;
let birdX = width / 8;
let birdY = height / 2.5;

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = width;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdWidth,
  height: birdHeight,
};

//Physics
let velocityX = -2; //Pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;
let choice;

window.onload = () => {
  canvas = document.getElementById("board");
  canvas.height = height;
  canvas.width = width;
  c = canvas.getContext("2d");

  //Load image
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = () => {
    c.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  };

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";

  update();   
  setInterval(placePipes, 1700);
  document.addEventListener("keydown", moveBird);
  document.addEventListener("touchstart" , ()=>{
      velocityY = -6;
  });
};

function update() {
  requestAnimationFrame(update);
  if (gameOver) {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "white";
    c.font = "35px sans-serif";
    c.fillText("GAME OVER", width / 5, height / 2);

    // Display score
    c.fillStyle = "white";
    c.font = "40px sans-serif";
    c.fillText("Score: " + score, width / 4, height / 1.8);

    // Display confirmation dialog
    if (choice === undefined) {
      choice = confirm("Play Again?");
    }

    if (choice) {
        bird.y = birdY;
        pipeX = width;
        velocityY = 0; // Reset bird's vertical velocity
        pipeArray = [];
        score = 0;
        gameOver = false;
        choice = undefined;
      }

    return;
  }
  c.clearRect(0, 0, canvas.width, canvas.height);
  // console.log("hello");

  //bird
  velocityY += gravity;
  // bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0);
  c.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  //Down Collision
  if (bird.y > height){
    gameOver = true;
  }


  //pipes
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    // console.log("pipe");
    c.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    if(!pipe.passed && bird.x>pipe.x + pipe.width){
        score += 0.5;  //0.5 score for both top and bottom pipe
        pipe.passed = true;
    }
    if(detectCollision(bird, pipe)) {
        gameOver = true;
    }
  }

  //Clear pipes
  while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth ){
    pipeArray.shift() ; //removes the first pipe
  }

  //Score
  c.fillStyle = "white";
  c.font = "45px sans-serif"
  c.fillText(score,5 ,45);

  if(gameOver){
    c.fillStyle = "red";
    c.font = "35px sans-serif";
    c.fillText("GAME OVER" , width/5, height/2);
  }

}



function placePipes() {
    if(gameOver){
        return;
      }
  let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
  let openingSpace = height / 4;

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(topPipe);

  let bottompipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false,
  };
  pipeArray.push(bottompipe);
}

function moveBird(event) {
  if (
    event.code == "Space" ||
    event.code == "ArrowUp" ||
    event.code == "KeyX"
  ) {
    //jump
    velocityY = -6;
  }

  //reset game
//   if (gameOver){
//     bird.y = birdY;
//     pipeArray = [];
//     score = 0;
//     gameOver = false;
//   }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
