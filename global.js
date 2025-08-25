
export class Flop {
  renderLoop = null;
  looks = {};
  sound = {};
  control = {};
  sensing = {};
  operaters = {};
  resolvers = [];

  constructor() {
    this.looks.setBackdrop = setBackdrop.bind(this);
    this.sound.playSound = playSound.bind(this);
    this.control.waitSeconds = waitSeconds.bind(this);
    this.sensing.keyPressed = keyPressed.bind(this);
    this.sensing.mouseDown = mouseDown.bind(this);
    this.sensing.mouseX = mouseX.bind(this);
    this.sensing.mouseY = mouseY.bind(this);
    this.operaters.pickRandom = pickRandom.bind(this);
  }

  destructor() {
    if (this.renderLoop) {
      this.renderLoop.removeCallback(this.renderStep.bind(this));
    }
  }



  setRenderLoop(renderLoop) {
    this.renderLoop = renderLoop;
    if (this.renderLoop) {
      this.renderLoop.addCallback(this.renderStep.bind(this));
    }
  }

  renderStep() {
    const resolvers = [...this.resolvers];
    this.resolvers = [];
    resolvers.forEach(resolve => resolve());

    if (this.glideProps) {
      if (this.glideProps.i >= this.glideProps.max) {
        this.glideProps.resolve();
        this.glideProps = null;
        return;
      }
      this.glideProps.i++;
      this.x += this.glideProps.speedx;
      this.y += this.glideProps.speedy;
    }
  }

  async waitForRenderLoop() {
    return new Promise(resolve => {
      this.resolvers.push(resolve);
    });
  }
}
/**
 * @description Sets the background of the stage,
 * @param {string} img url/filepath to backdrop image
 * @param {string} type "vector" or "bitmap"
 * @example
 * await flop.looks.setBackdrop("him.png",bimap);
 * @returns Promise. Await function to wait for the RenderLoop.
 * @category looks
 */
async function setBackdrop(img, type) {
  await this.renderLoop.setStage(img, type);
  return this.waitForRenderLoop();
}
/**
 * @description Play sound.
 * @param {number} pan Pan (left/right) of sound file -100 - 100
 * @param {number} pitch Pitch of sound file 0 - 100
 * @param {number} volume Volume of sound file 0 - 100
 * @param {string} soundFile url/filepath to sound file.
 * @example 
 * await flop.sound.playSound(0, 100,100,sound.mp3)
 * @category sound
 */
async function playSound(pan, pitch, volume, soundFile) {
  await this.renderLoop.playSound(pan, pitch, volume, soundFile);
}
/**
 * @description Sleep the code for s seconds.
 * @param {number} s seconds to wait.
 * @example
 * sprite.motion.moveSteps(10);
 * flop.control.waitSeconds(0.1);
 * sprite.motion.moveSteps(10);
 * @returns Promise. Await to wait for s seconds
 * @category control
 */
function waitSeconds(s) {
  return new Promise(resolve => setTimeout(resolve, s * 1000));
}
/**
 * @description is this key pressed
 * @param {string} key https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values + a-z
 * @example
 * if(await flop.sensing.keyPressed("B")) 
 * @returns boolean
 * @category sensing
 */
async function keyPressed(key) {
  return (renderLoop.key == key);
}

/**
 * @description is the mouse being clicked or not.
 * @example
 * if(await flop.sensing.mouseDown()){
 *  console.log("yay!");
 * }
 * @returns boolean
 * @category sensing
 */
async function mouseDown() {
  return this.renderLoop.mouse.click;
}
/**
 * @description Get the mouse x position.
 * @example
 * console.log(await flop.sensing.mouseX());
 * @returns number, x postition of mouse pointer
 * @category sensing
 */
async function mouseX() {
  return this.renderLoop.mouse.x;
}
/**
 * @description Get the mouse y position.
 * @example
 * console.log(await flop.sensing.mouseY());
 * @returns number, y postition of mouse pointer
 * @category sensing
 */
async function mouseY() {
  return this.renderLoop.mouse.y;
}
/**
 * @description Get a random number from min to max.
 * @example
 * console.log(await flop.operaters.pickRandom(3,10)); 
 * @param {number} min 
 * @param {number} max 
 * @returns number
 * @category operaters
 */
async function pickRandom(min, max) {
  return Math.floor(Math.random() * max - min) + min + 1;
}