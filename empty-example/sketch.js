
let Rockets
let Targets

let rocketsFired = 0
const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600
const ROCKETS_NUM = 30
const TARGETS_NUM = 100
const ROCKET_RADIUS = 10;
const TARGET_RADIUS = 30;
const ROCKET_COLORS = ['black'] //  ['white', 'red', 'green', 'lime', 'blue', 'yellow', 'pink', 'purple', 'black']

let agent, agent_speed, agent_accel
function setup() {

agent = createVector(100, 100)
agent_speed = createVector(0, 0)
agent_accel = createVector(0, 0)
  // Initialisation
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)

  Targets = []
  spawnTargets(TARGETS_NUM)
  Rockets = []
  spawnRockets(ROCKETS_NUM)
}

function spawnTargets(n) {
  for (let i = 0; i < n; i++) {
    Targets.push(new Target(random(0, CANVAS_WIDTH), random(0, 150)))
  }
}
function spawnRockets(n) {
  for (let i = 0; i < n; i++) {
    Rockets.push(new Rocket(300, 570))
    rocketsFired++
    if (rocketsFired % 100 === 0) {
      spawnTargets(1)
    }
  }
}

function draw() {
  // Runs once per frame, input + update + draw loop
  background(255,255,255, 3)

  //input()

  updateRockets()
  drawRockets()
  drawTargets()

  let mouse = createVector(mouseX, mouseY)
  agent_accel = p5.Vector.sub(mouse, agent).limit(5)
  agent_speed.add(agent_accel)
  agent.add(agent_speed)
  circle(agent.x, agent.y, 10)

  agent_accel.mult(0)

  drawHud()
}

//chat without firefox
//
function updateRockets() {

  const up = createVector(0, -1);
  const gravity = createVector(0, 0.1)
  const left = createVector(-1, 0)
  for (let rocket of Rockets) {
    const thrust_power = random(0.4, 2.0)
    let thrust = createVector((random(0, 1)-.5)*thrust_power, -0.15)
    //thrust.rotate(rocket.speed.heading())
    let angle = rocket.speed.angleBetween(up);
    thrust.rotate(-angle) // setHeading(rocket.speed.heading())
    left.rotate(-angle)
    rocket.pos = checkBounds(rocket.pos)
    if (!isInScreen(rocket)) {
      continue
    }
    rocket.acceleration.add(gravity)
    rocket.acceleration.add(thrust)
    rocket.acceleration.add(left)

    // rocket.acceleration.add(p5.Vector.mult(thrust, rotation))
    rocket.speed.add(rocket.acceleration)
    //rocket.speed.limit(5)
    rocket.pos.add(rocket.speed)

    rocket.acceleration.mult(0)
    for (let target of Targets) {
      if (target.pos.dist(rocket.pos) <= ROCKET_RADIUS) {
        target.destroyed = true
        fill("red")
        circle(target.pos.x, target.pos.y, TARGET_RADIUS)
      }
    }
  }
  // remove rockets that are out of screen
  Rockets = Rockets.filter(isInScreen)
  Targets = Targets.filter(t => !t.destroyed)
  spawnRockets(ROCKETS_NUM - Rockets.length) //?
}

function isInScreen(r) {
  return r.pos.x >= 0
    && r.pos.y >= 0
    && r.pos.x <= CANVAS_WIDTH
    && r.pos.y <= CANVAS_HEIGHT
}

function checkBounds(pos) {
    let new_pos = pos
    if (pos.x < 0) {
      new_pos.x = CANVAS_WIDTH
    } else if (pos.x > CANVAS_WIDTH) {
      new_pos.x = 0;
    }
    if (pos.y < 0) {
      new_pos.y = CANVAS_HEIGHT
    } else if (pos.y > CANVAS_HEIGHT) {
      new_pos.y = 0
    }
    return new_pos
}
function drawRockets() {
  const radius = 2;//ROCKET_RADIUS;
  for (let rocket of Rockets) {
    fill('black')
    circle(rocket.pos.x, rocket.pos.y, radius)
    //drawArrow(rocket.pos, rocket.speed, rocket.color)
    // drawArrow(rocket.pos, rocket.rotation, 'yellow')
  }
}

function drawTargets() {
  const radius = TARGET_RADIUS;
  fill('blue')
  for (let target of Targets) {
    circle(target.pos.x, target.pos.y, radius)
    // drawArrow(rocket.pos, rocket.speed, 'red')
    // drawArrow(rocket.pos, rocket.rotation, 'yellow')
  }
}

function drawHud() {
  const maxWidth = CANVAS_WIDTH - 60
  fill('white')
  rect(25, CANVAS_HEIGHT - 30, maxWidth, 20)
  fill('green')
  const currentWidth = maxWidth * Targets.length / TARGETS_NUM
  rect(25, CANVAS_HEIGHT - 30, currentWidth, 20)

  fill('black')
  text('ROCKETS FIRED: ' + rocketsFired, 30, CANVAS_HEIGHT - 15)
  text('TARGETS REMAINING: ' + Targets.length, 300, CANVAS_HEIGHT - 15)
}

class Rocket {
  constructor(x, y) {
    this.color = random(ROCKET_COLORS)
    this.pos = createVector(x, y)
    this.speed = createVector(0, -1)
    this.acceleration = createVector(0, 0)
    // this.rotation = createVector(0, -1).normalize()
  }
}
class Target {
  constructor(x, y) {
    this.destroyed = false
    this.pos = createVector(x, y)
  }
}

// But whate ARE the rockets??? :) *que music*
// they have position + speed + acceleration (vectors) or position + speed (float) + angle (float)
//
//
//
//
//        /\
//       | |
//       | |
//      //\\

// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
