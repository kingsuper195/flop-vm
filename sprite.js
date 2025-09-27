/**
 * Implements a single actor
 */
export class Sprite {
  renderLoop = null;
  _screenRefresh = true;
  x = 0;
  y = 0;
  dir = 90;
  size = 100;
  shown = true;
  colour = 0;
  fisheye = 0;
  whirl = 0;
  pixalate = 0;
  mosaic = 0;
  brightness = 0;
  ghost = 0;
  costumes = [
    {
      "name": "cat1",
      "data": "https://cdn.assets.scratch.mit.edu/internalapi/asset/b7853f557e4426412e64bb3da6531a99.svg/get/",
      "type": "vector"
    }
  ];
  currentIndex = 0;
  currentCostume = this.costumes[this.currentIndex];
  motion = {};
  looks = {};
  sensing = {};
  resolvers = [];

  /**
   * Internal: returns an object describing the state of the sprite to be passed to the renderer
   */
  getRendererProps() {
    return {
      position: [this.x, this.y],
      direction: this.dir,
      scale: [this.size, this.size],
      color: this.colour,
      whirl: this.whirl,
      fisheye: this.fisheye,
      pixelate: this.pixalate,
      mosaic: this.mosaic,
      brightness: this.brightness,
      ghost: this.ghost,
      visible: this.shown,
    };
  }

  /**
   * Internal: connects the sprite to the render loop
   */
  setRenderLoop(renderLoop) {
    if (this.renderLoop) {
      this.renderLoop.removeCallback(this.renderStep.bind(this));
    }
    this.renderLoop = renderLoop;
    if (this.renderLoop) {
      this.renderLoop.addCallback(this.renderStep.bind(this));
    }
  }

  /**
   * Internal: for gliding
   */
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

  /**
   * Internal: return a promise to pass to clients for wait for the render loop
   */
  async waitForRenderLoop() {
    if (this._screenRefresh) {
      this.renderLoop.screenRefresh = true;
      return new Promise(resolve => {
        this.resolvers.push(resolve);
      });
    } else {
      this.renderLoop.screenRefresh = false;
      return true;
    }
  }

  /**
   * Enable or disable screen refresh for the sprite
   * @param {boolean} value 
   */
  async setScreenRefresh(value) {
    this._screenRefresh = value;
    if (value) {
      await this.waitForRenderLoop();
    }
  }

  /**
   * @returns the current screen refresh state for the sprite
   */
  getScreenRefresh() {
    return this._screenRefresh;
  }


  /**
  
   * @description Move in the current direction by n steps.
   * @param {number} steps steps to move
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * await sprite1.motion.moveSteps(10);
   * @category motion
   */
  async moveSteps(steps) {
    const dir = this.dir;
    const dx = steps * Math.round(Math.sin((Math.PI * dir) / 180) * 1e10) / 1e10;
    const dy = steps * Math.round(Math.cos((Math.PI * dir) / 180) * 1e10) / 1e10;
    this.x += dx;
    this.y += dy;
    await this.renderLoop.drawSprite(this, "position");
    return this.waitForRenderLoop();
  }

  /**
  
   * @description Go to the given X and Y position.
   * @param {number} xPos x position
   * @param {number} yPos y position
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * await sprite.motion.goToXY(101,212);
   * @category motion
   */
  async gotoXY(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
    await this.renderLoop.drawSprite(this, "position");
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Go to object. "random","mouse" or a sprite.
   * @param {"random" | "mouse" | Sprite} target "random","mouse" or Sprite
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * await sprite.motion.goTo("random");  
   * @category motion
   */
  async goTo(target) {
    if (target == "random") {
      this.x = Math.floor(Math.random() * 481) - 240;
      this.y = Math.floor(Math.random() * 361) - 180;
    } else if (target == "mouse") {
      this.x = this.renderLoop.mouse.x;
      this.y = this.renderLoop.mouse.y;
    } else {
      this.x = target.x;
      this.y = target.y;
    }
    await this.renderLoop.drawSprite(this, "position");
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Turn right by n degrees.
   * @param {number} deg degrees to turn by
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * await sprite.motion.turnRight(10);
   * @category motion
   */
  async turnRight(deg) {
    this.dir += deg;
    await this.renderLoop.drawSprite(this, direction);
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Turn left by n degrees.
   * @param {number} deg degrees to turn by
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * await sprite.motion.turnLeft(10);
   * @category motion
   */
  async turnLeft(deg) {
    this.dir -= deg;
    await this.renderLoop.drawSprite(this, direction);
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Point to a direction.
   * @param {number} dir direction to turn to
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * await sprite.motion.pointInDirection(100);
   * @category motion
   */
  async pointInDirection(dir) {
    this.dir = dir;
    await this.renderLoop.drawSprite(this, direction);
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Point towards an object.
   * @param {"random" | "mouse" | Sprite} target "random","mouse" or Sprite
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * await sprite.motion.pointTowards("random");
   * @category motion
   */
  async pointTowards(target) {
    let targetX = 0;
    let targetY = 0;
    if (target == "random") {
      targetX = Math.floor(Math.random() * 481) - 240;
      targetY = Math.floor(Math.random() * 361) - 180;
    } else if (target == "mouse") {
      targetX = this.renderLoop.mouse.x;
      targetY = this.renderLoop.mouse.y;
    }
    targetX = target.x;
    targetY = target.y;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const direction = 90 - Math.atan2(dy, dx) * 180 / Math.PI;
    this.dir = direction;
    await this.renderLoop.drawSprite(this, direction);
    return this.waitForRenderLoop();
  }

  /**
  
   * @description Move to a position over n seconds.
   * @param {number} x x position
   * @param {number} y y position
   * @param {number} secs seconds
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example 
   * await sprite.motion.glide(200,100,3);
   * @category motion
   */
  async glide(x, y, secs) {
    if (!this.renderLoop) {
      throw new Error('Sprite must be added to a RenderLoop before gliding');
    }

    if (secs == 0) {
      // if secs == 0, then move immediately
      return this.gotoXY(x, y);
    }

    return new Promise((resolve) => {
      const max = secs * this.renderLoop.fps;
      const speedx = (x - this.x) / max;
      const speedy = (y - this.y) / max;
      this.glideProps = {
        i: 0,
        max,
        speedx,
        speedy,
        resolve
      };
      this.glideStep();
    });
  }
  /**
  
   * @description Move to a target over n seconds. Accepts "random" or sprite.
   * @param {"random" | "mouse" | Sprite} target "random" or Sprite
   * @param {number} secs 
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * await sprite.motion.glideTo("random",2);
   * @category motion
   */
  async glideTo(target, secs) {
    if (target == "random") {
      x = Math.floor(Math.random() * 481) - 240;
      y = Math.floor(Math.random() * 361) - 180;
      return glide(x, y, secs);
    } else if (target == "mouse") {
      return glide(this.renderLoop.mouse.x, this.renderLoop.mouse.y, secs);
    } {
      return glide(target.x, target.y, secs);
    }
  }
  /**
  
   * @description Change x position by n.
   * @param {number} x value to change by
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example 
   * await sprite.motion.changeX(5);
   * @category motion
   */
  async changeX(x) {
    this.x += x;
    await this.renderLoop.drawSprite(this, "position");
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Set x position to n.
   * @param {number} x x position
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example 
   * await sprite.motion.setX(100);
   * @category motion
   */
  async setX(x) {
    this.x = x;
    await this.renderLoop.drawSprite(this, "position");
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Change y position by n.
   * @param {number} y value to change by
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * await sprite.motion.changeY(5);
   * @category motion
   */
  async changeY(y) {
    this.y += y;
    await this.renderLoop.drawSprite(this, "position");
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Set y postition to n.
   * @param {number} y y position
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example 
   * await sprite.motion.setY(100);
   * @category motion
   */
  async setY(y) {
    this.y = y;
    await this.renderLoop.drawSprite(this, "postion");
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Get the X position.
   * @returns X position.
   * @example
   * console.log(sprite.motion.getX());
   * @category motion
   */
  getX() {
    return this.x;
  }
  /**
  
   * @description Get the Y position.
   * @returns Y position.
   * @example
   * console.log(sprite.motion.getY());
   * @category motion
   */
  getY() {
    return this.y;
  }
  /**
  
   * @description Get the direction.
   * @returns Direction.
   * @example
   * console.log(sprite.motion.getDir());
   * @category motion
   */
  getDir() {
    return this.dir;
  }

  /**
  
   * @description Set the sprite costume by id.
   * @param {number} costume costume id
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * console.log(sprite.costumes);
   * // [{"name":"him","data":"him.svg","type":"vector"},{"name":"them","data":"them.png","type":"bitmap"}]
   * await sprite.looks.setCostume(1);
   * // {"name":"them","data":"them.png","type":"bitmap"}
   * @category looks
   */
  async setCostume(costume) {
    this.currentIndex = costume;
    this.currentCostume = this.costumes[this.currentIndex];
    await this.renderLoop.updateSkin(this);
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Switches to the next costume
   * @returns Promise. Await function to wait for the RenderLoop.
   * @example
   * await sprite.looks.nextCostume();
   * @category looks
   */

  async nextCostume() {
    this.currentIndex = (this.currentIndex + 1) % this.costumes.lengthh;
    this.currentCostume = this.costumes[this.currentIndex];
    await this.renderLoop.updateSkin(this);
    return this.waitForRenderLoop();
  }

  /**
  
   * @description Set the sprite size
   * @param {number} inSize New size
   * @example
   * await sprite.looks.setSize(32);
   * @returns Promise. Await function to wait for the RenderLoop.
   * @category looks
   */
  async setSize(inSize) {
    this.size = inSize;
    await this.renderLoop.drawSprite(this, "scale");
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Change the sprite size
   * @param {number} inSize Size to change by.
   * @example
   * await sprite.looks.changeSize(32);
   * @returns Promise. Await function to wait for the RenderLoop.
   * @category looks
   */
  async changeSize(inSize) {
    this.size += inSize;
    await this.renderLoop.drawSprite(this, "scale");
    return this.waitForRenderLoop();
  }

  /**
  
   * @description set an effect.
   * @param {"colour"|"fisheye"|"pixelate"|"whirl"|"mosaic"|"brightness"|"ghost"} effect Effect to set.
   * @param {number} n New value.
   * @example
   * await sprite.looks.setEffect("colour",42);
   * @category looks
   */

  async setEffect(effect, n) {
    switch (effect) {
      case 'colour':
        this.colour = n;
        break;
      case 'fisheye':
        this.fisheye = n;
        break;
      case 'pixalate':
        this.pixalate = n;
        break;
      case 'whirl':
        this.whirl = n;
        break;
      case 'mosaic':
        this.mosaic = n;
        break;
      case 'brightness':
        this.brightness = n;
        break;
      case 'ghost':
        this.ghost = n;
        break;
      default:
        console.error('invalid effect');
        break;
    }
    await this.renderLoop.drawSprite(this, "effects");
    return this.waitForRenderLoop();
  }
  /**
  
   * @description change an effect.
   * @param {"colour"|"fisheye"|"pixelate"|"whirl"|"mosaic"|"brightness"|"ghost"} effect Effect to change. 
   * @param {number} n Value to change by..
   * @example
   * await sprite.looks.changeEffect("colour",42);
   * @category looks
   */
  async changeEffect(effect, n) {
    switch (effect) {
      case 'colour':
        this.colour += n;
        break;
      case 'fisheye':
        this.fisheye += n;
        break;
      case 'pixalate':
        this.pixalate += n;
        break;
      case 'whirl':
        this.whirl += n;
        break;
      case 'mosaic':
        this.mosaic += n;
        break;
      case 'brightness':
        this.brightness += n;
        break;
      case 'ghost':
        this.ghost += n;
        break;
      default:
        console.error('invalid effect');
        break;
    }
    await this.renderLoop.drawSprite(this, "effects");
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Set all effects to 0, thus restoring the sprite's appearance to the default.
   * @example
   * await sprite.looks.changeEffect("colour",42);
   * await sprite.looks.clearEffects();
   * @category looks
   */
  async clearEffects() {
    this.colour = 0;
    this.fisheye = 0;
    this.pixalate = 0;
    this.whirl = 0;
    this.mosaic = 0;
    this.brightness = 0;
    this.ghost = 0;
    await this.renderLoop.drawSprite(this, "effects");
    return this.waitForRenderLoop();
  }
  /**
   * @description go to specific layer 0-INFINITY
   * @example
   * await sprite.looks.goToLayer(100);
   * @param {'back'|'front'|number} layer 
   * @category looks
   */
  async goToLayer(layer) {
    if (layer == 'back') {
      await this.renderLoop.setDrawableOrder(this, 0);
    } else if (layer == 'front') {
      await this.renderLoop.setDrawableOrder(this, Infinity);
    } else {
      await this.renderLoop.setDrawableOrder(this, layer);
    }
  }
  /**
   * @description change layer by X
   * @example
   * await this.renderLoop.changeLayers(1);
   * @param {number} layer 
   * 
   */
  async changeLayers(layer) {
    await this.renderLoop.renderer.setDrawableOrder(this.render, layer, true);
  }

  /**
  
   * @description Hide the sprite from the renderer.
   * @example
   * await sprite.looks.hide();
   * @category looks
   */
  async hide() {
    this.shown = false;
    await this.renderLoop.drawSprite(this, "visible");
    return this.waitForRenderLoop();
  }
  /**
  
   * @description Show the sprite to the renderer.
   * @example
   * await sprite.looks.show();
   * @category looks
   */
  async show() {
    this.shown = true;
    await this.renderLoop.drawSprite(this, "visible");
    return this.waitForRenderLoop();
  }
  /**
   * @description Get the current costume number.
   * @example
   * console.log(sprite.looks.costumeNumber());
   * @returns current costume number.
   * @category looks
   */
  async costumeNumber() {
    return this.currentIndex;
  }
  /**
   * @description Get the current sprite scale.
   * @example
   * console.log(sprite.looks.size());
   * @returns current sprite size.
   * @category looks
   */
  async size() {
    return this.size;
  }
  /**
  
   * @description Is a sprite touching another sprite
   * @param {"mouse" | Sprite} object object to check.
   * @example
   * console.log(await sprite.sensing.touching("mouse"));
   * @returns boolean
   * @category sensing
   */
  async touching(object) {
    if (object === "mouse") {
      return await this.renderLoop.spriteTouchingPoint(this, this.renderLoop.mouse.trueX, this.renderLoop.mouse.trueY);
    } else {
      return await this.renderLoop.spriteTouchingSprites([this, object]);
    }
  }
  /** 
  
   * @description Is a sprite touching a colour
   * @param {Array} colourRGB Colour to check
   * @example
   * console.log(await sprite.sensing.touchingColour([256,256,256]));
   * @returns boolean
   * @category sensing
   */
  async touchingColour(colourRGB) {
    return await this.renderLoop.spriteTouchingColour(this, colourRGB);
  }
  /**
  
   * @description Check if one colour in a sprite is touching another colour anywhere.
   * @param {Array} spriteColour Colour in sprite to check.
   * @param {Array} outerColour Colour outside sprite to check.
   * @example
   * console.log(await sprite.sensing.colourTouchingColour([255, 171, 25],[256,256,256]))
   * @returns boolean
   * @category sensing
   */
  async colourTouchingColour(spriteColour, outerColour) {
    return await this.renderLoop.spriteColourTouchingColour(this, spriteColour, outerColour);
  }
  /**
  
   * @description Distance from one object to another.
   * @param {"mouse" | Sprite} object Object to check.
   * @example
   * console.log(await sprite.sensing.distanceTo("mouse"));
   * @returns number
   * @category sensing
   */
  async distanceTo(object) {
    let tx, ty = 0;
    if (object === "mouse") {
      tx = this.renderLoop.mouse.x;
      ty = this.renderLoop.mouse.y;
    } else {
      tx = object.x;
      ty = object.y;
    }
    const dx = this.x - tx;
    const dy = this.y - ty;
    return Math.sqrt((dx * dx) + (dy * dy));
  }
}