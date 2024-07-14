const fps = 30;
class sprite {
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
}

function moveSteps(steps) {
  const dir = this.dir;
  const dx = steps * Math.round(Math.sin((Math.PI * dir) / 180) * 1e10) / 1e10;
  const dy = steps * Math.round(Math.cos((Math.PI * dir) / 180) * 1e10) / 1e10;
  this.x += dx;
  this.y += dy;
  console.log(this);
  // if(this.renderer)
  //   renderer.updateDrawableProperties(drawableID2, s.getRendererProps());
}
function gotoXY(xPos, yPos) {
  this.x = xPos;
  this.y = yPos;
  console.log(this);
}
function goTo(target) {
  if(target == "random") {
    this.x = Math.floor(Math.random() * 481) - 240;
    this.y = Math.floor(Math.random() * 361) - 180;
  }else {
    this.x = target.x;
    this.y = target.y
  }
  console.log(this);
}
function turnRight(deg) {
  this.dir += deg;
  console.log(this);
}
function turnLeft(deg) {
  this.dir -= deg;
  console.log(this);
}
function pointInDirection(dir) {
  this.dir = dir
  console.log(this);
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
    console.log(this);
  }
}
function glide(x, y, secs) {
  const speedx = (x - this.x)/(secs*fps);
  const speedy = (y - this.y)/(secs*fps);
  for(let i = 0; i < secs*fps; i++) {
    this.x += speedx;
    this.y += speedy;
    console.log(this);
  }
}

function glideTo(target, secs) {
  if(target == "random") {
    x = Math.floor(Math.random() * 481) - 240;
    y = Math.floor(Math.random() * 361) - 180;
    glide(x, y, 1)
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