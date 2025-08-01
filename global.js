
class Flop {
  renderLoop = null;
  looks = {};
  sound = {};
  resolvers = [];

  constructor() {
    this.looks.setBackdrop = setBackdrop.bind(this);
    this.sound.playSound = playSound.bind(this  );
  }

  destructor() {
    if (this.renderLoop) {
      this.renderLoop.removeCallback(this.renderStep.bind(this));
    }
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

async function setBackdrop(img, type) {
  await this.renderLoop.setStage(img, type);
  await this.waitForRenderLoop();
}

async function playSound(pan, pitch, volume, soundFile) {
  await this.renderLoop.playSound(pan, pitch, volume, soundFile);
}