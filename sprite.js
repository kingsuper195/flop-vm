
class Sprite {
  renderLoop = null;
  x = 0;
  y = 0;
  dir = 90;
  rotationStyle = 'all-around'; // 'left-right' || 'dont-rotate'
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
  resolvers = [];

  constructor() {
    this.motion.moveSteps = moveSteps.bind(this);
    this.motion.gotoXY = gotoXY.bind(this);
    this.motion.goTo = goTo.bind(this);
    this.motion.turnRight = turnRight.bind(this);
    this.motion.turnLeft = turnLeft.bind(this);
    this.motion.pointInDirection = pointInDirection.bind(this);
    this.motion.pointTowards = pointTowards.bind(this);
    this.motion.glide = glide.bind(this);
    this.motion.glideTo = glideTo.bind(this);
    this.motion.setRotationStyle = setRotationStyle.bind(this);
    this.motion.changeX = changeX.bind(this);
    this.motion.setX = setX.bind(this);
    this.motion.changeY = changeY.bind(this);
    this.motion.setY = setY.bind(this);
    this.motion.getX = getX.bind(this);
    this.motion.getY = getY.bind(this);
    this.motion.getDir = getDir.bind(this);
    this.looks.setCostume = setCostume.bind(this);
    this.looks.nextCostume = nextCostume.bind(this);
    this.looks.setSize = setSize.bind(this);
    this.looks.changeSize = changeSize.bind(this);
    this.looks.setEffect = setEffect.bind(this);
    this.looks.changeEffect = changeEffect.bind(this);
    this.looks.clearEffects = clearEffects.bind(this);
    this.looks.show = show.bind(this);
    this.looks.hide = hide.bind(this);
    this.looks.size = size.bind(this);
    this.looks.costumeNumber = costumeNumber.bind(this);
  }

  destructor() {
    if (this.renderLoop) {
      this.renderLoop.removeCallback(this.renderStep.bind(this));
    }
  }

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

  setRenderLoop(renderLoop) {
    if (this.renderLoop) {
      // this.renderLoop.removeCallback(this.glideStep.bind(this));
    }
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

async function moveSteps(steps) {
  const dir = this.dir;
  const dx = steps * Math.round(Math.sin((Math.PI * dir) / 180) * 1e10) / 1e10;
  const dy = steps * Math.round(Math.cos((Math.PI * dir) / 180) * 1e10) / 1e10;
  this.x += dx;
  this.y += dy;
  return this.waitForRenderLoop();
}

async function gotoXY(xPos, yPos) {
  this.x = xPos;
  this.y = yPos;
  return this.waitForRenderLoop();
}

async function goTo(target) {
  if (target == "random") {
    this.x = Math.floor(Math.random() * 481) - 240;
    this.y = Math.floor(Math.random() * 361) - 180;
  } else {
    this.x = target.x;
    this.y = target.y;
  }
  return this.waitForRenderLoop();
}

async function turnRight(deg) {
  this.dir += deg;
  return this.waitForRenderLoop();
}

async function turnLeft(deg) {
  this.dir -= deg;
  return this.waitForRenderLoop();
}

async function pointInDirection(dir) {
  this.dir = dir;
  return this.waitForRenderLoop();
}

async function pointTowards(target) {
  let targetX = 0;
  let targetY = 0;
  if (target == "random") {
    this.dir = Math.round(Math.random() * 360) - 180;
  } else {
    targetX = target.x;
    targetY = target.y;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const direction = 90 - Math.atan2(dy, dx) * 180 / Math.PI;
    this.dir = direction;
  }
  return this.waitForRenderLoop();
}


async function glide(x, y, secs) {
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

async function glideTo(target, secs) {
  if (target == "random") {
    x = Math.floor(Math.random() * 481) - 240;
    y = Math.floor(Math.random() * 361) - 180;
    return glide(x, y, secs);
  } else {
    return glide(target.x, target.y, secs);
  }
}

async function setRotationStyle(style) {
  this.rotationStyle = style;
  return this.waitForRenderLoop();
}

async function changeX(x) {
  this.x += x;
  return this.waitForRenderLoop();
}

async function setX(x) {
  this.x = x;
  return this.waitForRenderLoop();
}

async function changeY(y) {
  this.y += y;
  return this.waitForRenderLoop();
}

async function setY(y) {
  this.y = y;
  return this.waitForRenderLoop();
}

function getX() {
  return this.x;
}

function getY() {
  return this.y;
}

function getDir() {
  return this.dir;
}

/**
 * 
 * @param {number} costume 
 * @returns Promise<any>
 */
async function setCostume(costume) {
  this.currentIndex = costume;
  this.currentCostume = this.costumes[this.currentIndex];
  await this.renderLoop.updateSkin(this);
  return this.waitForRenderLoop();
}

async function nextCostume() {
  this.currentIndex = (this.currentIndex + 1) % this.costumes.lengthh;
  this.currentCostume = this.costumes[this.currentIndex];
  await this.renderLoop.updateSkin(this);
  return this.waitForRenderLoop();
}
async function setSize(inSize) {
  this.size = inSize;
  return this.waitForRenderLoop();
}
async function changeSize(inSize) {
  this.size += inSize;
  return this.waitForRenderLoop();
}

async function setEffect(effect, n) {
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
}

async function changeEffect(effect, n) {
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
}

async function clearEffects() {
  this.colour = 0;
  this.fisheye = 0;
  this.pixalate = 0;
  this.whirl = 0;
  this.mosaic = 0;
  this.brightness = 0;
  this.ghost = 0;
}

async function hide() {
  this.shown = false;
}

async function show() {
  this.shown = true;
}

async function costumeNumber() {
  return this.currentIndex;
}

async function size() {
  return this.size;
}