
class sprite {
  renderLoop = null;
  x = 0;
  y = 0;
  dir = 90;
  rotationStyle = 'all-around'; // 'left-right' || 'dont-rotate'
  size = 100;
  colour = 0;
  fisheye = 0;
  whirl = 0;
  pixalate = 0;
  mosaic = 0;
  brightness = 0;
  ghost = 0;
  costumes = {
    cat1:{"data":"https://cdn.assets.scratch.mit.edu/internalapi/asset/b7853f557e4426412e64bb3da6531a99.svg/get/",
      "type":"vector"
    }
  };
  currentCostume = this.costumes.cat1
  motion = {};
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
  }

  destructor() {
    if(this.renderLoop) {
      this.renderLoop.removeCallback(this.glideStep.bind(this));
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
    };
  }

  setRenderLoop(renderLoop) {
    if(this.renderLoop) {
      // this.renderLoop.removeCallback(this.glideStep.bind(this));
    }
    this.renderLoop = renderLoop;
    if(this.renderLoop) {
      this.renderLoop.addCallback(this.glideStep.bind(this));
    }
  }

  glideStep() {
    if(!this.glideProps) return;
    if(this.glideProps.i >= this.glideProps.max) {
      this.glideProps = null;
      return;
    }
    this.glideProps.i++;
    this.x += this.glideProps.speedx;
    this.y += this.glideProps.speedy;
  }
  
}

function moveSteps(steps) {
  const dir = this.dir;
  const dx = steps * Math.round(Math.sin((Math.PI * dir) / 180) * 1e10) / 1e10;
  const dy = steps * Math.round(Math.cos((Math.PI * dir) / 180) * 1e10) / 1e10;
  this.x += dx;
  this.y += dy;
}

function gotoXY(xPos, yPos) {
  this.x = xPos;
  this.y = yPos;
  
}
function goTo(target) {
  if(target == "random") {
    this.x = Math.floor(Math.random() * 481) - 240;
    this.y = Math.floor(Math.random() * 361) - 180;
  }else {
    this.x = target.x;
    this.y = target.y
  }
  
}
function turnRight(deg) {
  this.dir += deg;
  
}
function turnLeft(deg) {
  this.dir -= deg;
  
}
function pointInDirection(dir) {
  this.dir = dir
  
}
function pointTowards (target) {
  let targetX = 0;
  let targetY = 0;
  if (target == "random") {
    this.dir = Math.round(Math.random() * 360) - 180;
  } else {
    targetX = target.x;
    targetY = target.y;
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const direction = 90 - Math.atan2(dy, dx)* 180 / Math.PI;
    this.dir = direction
    
  }
}


function glide(x, y, secs) {
  if(!this.renderLoop) {
    throw new Error('Sprite must be added to a RenderLoop before gliding');
  }
  if(secs == 0) {
    // if secs == 0, then move immediately
    return this.gotoXY(this.x + x, this.y + y);
  }
  const max = secs*this.renderLoop.fps;
  const speedx = (x - this.x)/max;
  const speedy = (y - this.y)/max;
  this.glideProps = {
    i: 0,
    max,
    speedx,
    speedy
  };
  this.glideStep();
}

function glideTo(target, secs) {
  if(target == "random") {
    x = Math.floor(Math.random() * 481) - 240;
    y = Math.floor(Math.random() * 361) - 180;
    glide(x, y, secs)
  }else {
    glide(target.x, target.y, secs)
  }
}

function setRotationStyle(style) {
  this.rotationStyle = style;
}
 
function changeX(x) {
  this.x += x;
}
function setX(x) {
  this.x = x;
}
function changeY(y) {
  this.y += y;
}
function setY(y) {
  this.y = y;
}
function getX() {
  return this.x
}
function getY() {
  return this.y
}
function getDir() {
  return this.dir
}