let lastTime = 0;
const fpsInterval = 1000 / 30; // 30fps

window.onload = function() {
    requestAnimationFrame(gameLoop);
};


function gameLoop(timestamp) {
    // Calculate the time elapsed since the last frame
    const elapsed = timestamp - lastTime;
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');


    if (elapsed > fpsInterval) {
        lastTime = timestamp - (elapsed % fpsInterval);
        redraw(ctx, canvas)


    }

    requestAnimationFrame(gameLoop);
}

const canvasWidth = 800;
const canvasHeight = 400;

let redPositionX = 0;
let redPositionY = 0;
let redMotionX = 6;
let redMotionY = 6;
let redWidth = 100;
let redHeight = 100;

const redraw = (ctx, canvas) => {
    
    redPositionX+=redMotionX;
    redPositionY+=redMotionY;
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw red square
    ctx.fillStyle = 'rgb(200, 0, 0)';
    ctx.fillRect(redPositionX, redPositionY, redWidth, redHeight);

    //check for horizontal collision
    const rightCollision = redPositionX + redWidth-1 >= canvasWidth;
    const leftCollision = redPositionX <= 0;
    if(rightCollision || leftCollision){
        console.log({redPositionX, redWidth, canvasWidth})
        redMotionX = redMotionX * -1;
    }


    const bottomCollision = redPositionY + redHeight-1 >= canvasHeight
    const topCollision = redPositionY <= 1;
    if(bottomCollision || topCollision){
        redMotionY = redMotionY * -1;
    }

}
