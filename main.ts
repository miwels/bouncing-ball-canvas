interface Shape {
    draw(ctx): void;
    color : string;
    x: number;
    y: number;
}

class Ball implements Shape {

    radius: number;
    color: string;
    x: number;
    y: number;
    vx: number;
    vy: number;

    /**
     * Define a couple of initial values:
     * @param {radius} number     Ball radius
     * @param {color}  string     Ball color, it can be a hex value
     * @param {x}      number     Ball x position
     * @param {y}      number     Ball y position
     * @param {vx}     number     Ball x speed
     * @param {vy}     number     Ball y speed
     */
    constructor(radius: number,
                color: string,
                x: number,
                y: number,
                vx: number,
                vy: number
        ) {
        this.radius = radius;
        this.color = color;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    /**
     *  This function draws the ball and is called in every frame
     *  We don't have a 'circle' canvas element so we have to draw
     *  it manually
     *  @param  {ctx}  <CanvasRenderingContext2D> The reference to the 2D canvas
     */
    public draw = (ctx): void => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 10;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }

    /**
     *  Clears the previous ball frame.
     *  We can include this function in the previous draw() method
     *  because there are only a couple of diferences between both methods
     *  @param  {ctx}  <CanvasRenderingContext2D> The reference to the 2D canvas
     */
    public clear = (ctx): void => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 25;
        ctx.arc(this.x, this.y, this.radius + 2, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
    }
}

/**
 *  Define a couple of variables used in the main program
 *  We can change the gravity and bounce factors to make the behaviour
 *  of the ball.
 */
var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
var gravity = 0.2;
var bounceFactor = 0.7;
var H = 295;
var W = 600;

/**
 * Clear the canvas. Useful if we want to get rid of all painted elements
 */
function clearCanvas(ctx) {
	ctx.clearRect(0, 0, W, H);
}

/**
 * Gets the (x, y) coordinates of the mouse and generates a new instance
 * of a ball in that point.
 * The ball animation is generated inside the interval function. This
 * function generates our frames.
 */
function getMousePos(canvas, evt, ctx) {
    console.log("test");
    var rect = canvas.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;
    var ball: Ball = new Ball(5, "red", x, y, 1, 1);

    var interval = setInterval(function() {

        ball.clear(ctx);

        // Add some speed and acceleration
        ball.y += ball.vy;
        ball.vy += gravity;
        ball.x += ball.vx;

        ball.draw(ctx);

        // make the ball bounce when it touches the floor
        if(ball.y >= H - ball.radius) {
            ball.y = H - ball.radius;
            ball.vy *= -bounceFactor;
        }

        // delete the ball when it reaches the edge of the screen
        // We can either delete the ball or make it stop
        if(ball.x >= W - ball.radius) {
            ball.x = W - ball.radius;
            ball.y = H - ball.radius;
            // ball = null;
            // clearInterval(interval);
        }
    }, 1000/60);
}

/**
 * Loads our canvas and binds the mouse event
 */
window.onload = () => {
    canvas = <HTMLCanvasElement>document.getElementById('cnvs');
    canvas.addEventListener('mousedown', function(evt) {
        ctx = canvas.getContext("2d");
        clearCanvas(ctx);
        getMousePos(canvas, evt, ctx);
    }, false);
}