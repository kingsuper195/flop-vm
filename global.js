
export class Flop {
  renderLoop = null;
  _timer = 0;
  resolvers = [];

  /**
   * Internal: connects the sprite to the render loop
   */
  setRenderLoop(renderLoop) {
    this.renderLoop = renderLoop;
  }

  /**
   * Internal: return a promise to pass to clients for wait for the render loop
   */
  async waitForRenderLoop() {
    return new Promise(resolve => {
      this.resolvers.push(resolve);
    });
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
  async setBackdrop(img, type) {
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
  async playSound(pan, pitch, volume, soundFile) {
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
  waitSeconds(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
  }

  /**
   * @description Waits until condition = true
   * @param {Function} con 
   * @example
   * flop.control.waitUntil(() => flop.sensing.timer() > 3);
   * @returns Promise. Await to wait until condition = true.
   * @category control
   */
  waitUntil(con) {
    return new Promise((resolve) => {
      let intervalWaitUntil = setInterval(async () => {
        if (await con()) {
          clearInterval(intervalWaitUntil);
          resolve();
        }
      }, 100);
    })
  }
  /**
   * @description is this key pressed
   * @param {string} key https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values + a-z
   * @example
   * if(await flop.sensing.keyPressed("B")) 
   * @returns boolean
   * @category sensing
   */
  async keyPressed(key) {
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
  async mouseDown() {
    return this.renderLoop.mouse.click;
  }
  /**
   * @description Get the mouse x position.
   * @example
   * console.log(await flop.sensing.mouseX());
   * @returns number, x postition of mouse pointer
   * @category sensing
   */
  async mouseX() {
    return this.renderLoop.mouse.x;
  }
  /**
   * @description Get the mouse y position.
   * @example
   * console.log(await flop.sensing.mouseY());
   * @returns number, y postition of mouse pointer
   * @category sensing
   */
  async mouseY() {
    return this.renderLoop.mouse.y;
  }
  /**
   * @description get the time since resetTimer was last run
   * @example
   * await flop.sensing.resetTimer();
   * await flop.control.waitSeconds(1);
   * console.log(await flop.sensing.timer()); //1
   * @returns number
   * @category sensing
   */
  timer() {
    return (Date.now() - this._timer) / 1000;
  }

  /**
   * @description Reset the timer.
   * @example
   * await flop.sensing.resetTimer();
   * @returns number
   * @category sensing
   */
  resetTimer() {
    this._timer = Date.now();
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
  async pickRandom(min, max) {
    return Math.floor(Math.random() * max - min) + min + 1;
  }
}