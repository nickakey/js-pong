let lastTime = 0;
const fpsInterval = 1000 / 60; // 30fps
const mousePosition = { x: 0, y: 0 };

const canvasWidth = 1200;
const canvasHeight = 900;

const redWidth = 30;
const redHeight = 30;

const boardWidth = 140;
const boardHeight = 30;

window.onload = function() {
    requestAnimationFrame(gameLoop);
};



const score = [0]; // Initialize score variable
let redBall;
let blueBall;
let greenBall;

function gameLoop(timestamp) {
    // Calculate the time elapsed since the last frame
    const elapsed = timestamp - lastTime;
    const canvas = document.getElementById('myCanvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    
    ctx.font = '48px serif'; // Set font for the score display
    ctx.fillText(score.toString(), canvas.width - 100, 50); // Display score at the top right

    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        mousePosition.x = event.clientX - rect.left;
        mousePosition.y = event.clientY - rect.top;
    });

    if(!redBall){
        redBall = new Ball({ctx, setScore: (newScore) => score[0] = newScore, score: score[0], color: 'rgb(200, 0, 0)'})
    }
    if(!blueBall){
        blueBall = new Ball({ctx, setScore: (newScore) => score[0] = newScore, score: score[0], color: 'rgb(0, 0, 200)'})
    }


    if (elapsed > fpsInterval) {
        lastTime = timestamp - (elapsed % fpsInterval);
        redraw(ctx, canvas, redBall, blueBall)
    }
    requestAnimationFrame(gameLoop);
}



class Ball {
    constructor({ctx, setScore, score, color}){
        this.x = canvasWidth/2 - redWidth/2-1
        this.y = 2
        this.motionX = Math.floor(Math.random() * 21) - 10;
        this.motionY = 8;
        this.ctx = ctx;
        this.setScore = setScore;
        this.score = score;
        this.color = color;
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x + redWidth / 2, this.y + redHeight / 2, redWidth / 2, 0, Math.PI * 2);
        this.ctx.fill();

    }
    move(){
        this.x+=this.motionX
        this.y+=this.motionY
    }
    invertHorizontal(){
        this.motionX = this.motionX * -1;
    }
    invertVertical(){
        this.motionY = this.motionY * -1;
    }
    checkForCollisions(boardXPosition, boardWidth) {
        //horizontal collison
        const rightCollision = this.x + redWidth-1 >= canvasWidth;
        const leftCollision = this.x <= 0;
        if(rightCollision || leftCollision){
            this.invertHorizontal();
        
        }

        //vertical collision
        const bottomCollision = this.y + redHeight-1 >= canvasHeight
        const topCollision = this.y <= 1;
        if(topCollision){
            this.invertVertical()
        }
    
        // check for collisions with bottoms (that should lose)
        if(bottomCollision){
            this.x = canvasWidth/2 - redWidth/2-1;
            this.y = 2;
            this.setScore(0);
        }

        // check for collisions with board (that should boucne)

        //this represents the X range that the board is in. If the ball hits this range and is at the right Y, its a board collision
        const boardCollisionRangeX = [boardXPosition, boardXPosition + boardWidth]

        const ballIsAtCorrectYForBoardCollision = this.y + (redHeight*2)-1 >= canvasHeight && this.x
        const boardCollision = ballIsAtCorrectYForBoardCollision && this.x >= boardCollisionRangeX[0] && this.x <= boardCollisionRangeX[1];
        if(boardCollision){
            this.motionY = this.motionY * -1;
            this.setScore(Number(score) + 1)
        }

    }
}

const redraw = (ctx, canvas, redBall, blueBall) => {

    
    let boardXPosition = mousePosition.x - boardWidth/2

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    if(score > 1) {
        blueBall.move();
        blueBall.draw();
        blueBall.checkForCollisions(boardXPosition, boardWidth);
    }

    redBall.move();
    redBall.draw();
    redBall.checkForCollisions(boardXPosition, boardWidth);

    //draw score
    ctx.font = '48px serif'; // Set font for the score display
    ctx.fillText(score[0].toString(), 100, 100); // Display score at the top right
    // draw board
    ctx.fillStyle = 'rgb(100, 100, 100)';
    ctx.fillRect(boardXPosition, canvasHeight - boardHeight, boardWidth, boardHeight);    


}
