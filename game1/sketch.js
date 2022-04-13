const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

const UP = new p5.Vector(0, -1, 0);

let Ids;
let Positions;
let Speeds;
let Accelerations;
let Rotations;
let Forces;

function setup() {
  // Initialisation
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  Ids = [];
  Positions = [];
  Speeds = [];
  Accelerations = [];
  Rotations = [];
  Forces = [];
  Forces.push({
    relative: false,
    force: (id) => {
      return createVector(0, 0.1);
    },
  });
  Forces.push({
    relative: false,
    force: (id) => {
      let speed = Speeds[id];
      if (speed.mag() > 3) {
        return createVector(-speed.x, -speed.y).limit(0.3);
      } else return createVector(0, 0);
    },
  });
  Forces.push({
    relative: false,
    force: (id) => {
      let speed = Speeds[id];
      let rotation = speed.angleBetween(UP);
      if (rotation > 0.5) {
        return createVector(random(), -1 * random());
      } else return createVector(0, 0);
    },
  });
  Forces.push({
    relative: true,
    force: (id) => {
      let thrust_power = random(0.4, 2.0);
      return createVector((random(0, 1) - 0.5) * thrust_power, -0.15);
    },
  });
  for (let i = 0; i < 50; i++) {
    addEntity(createVector(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2));
  }
  addEntity(
    createVector(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2),
    createVector(2, 0),
    createVector(0, 0),
    50.0
  );
}

function addEntity(
  position = new p5.Vector(0, 0, 0),
  speed = new p5.Vector(0, 0, 0),
  acceleration = new p5.Vector(0, 0, 0),
  rotation = 0
) {
  //console.log(position, speed, acceleration, rotation);
  Ids.push(Ids.length);
  Positions.push(position);
  Speeds.push(speed);
  Accelerations.push(acceleration);
  Rotations.push(rotation);
}

function draw() {
  let mouse = createVector(mouseX, mouseY);
  background(0, 0, 0, 255);

  drawRockets();
  updateRockets();
  /*
    agent_accel = p5.Vector.sub(mouse, agent).limit(5)
    agent_speed.add(agent_accel)
    agent.add(agent_speed)
    agent_accel.mult(0)
    */
}

function drawRockets() {
  const radius = 2;
  for (let rocket of Ids) {
    if (rocket !== undefined) {
      circle(Positions[rocket].x, Positions[rocket].y, radius);
      drawArrow(Positions[rocket], Speeds[rocket], "blue");
    }
  }
}

function updateRockets() {
  for (let rocket of Ids) {
    if (rocket !== undefined) {
      let rotation = Speeds[rocket].angleBetween(UP);

      for (let force_type of Forces) {
        let force;
        if (force_type.relative && rotation) {
          force = p5.Vector.rotate(force_type.force(rocket), rotation);
        } else {
          force = force_type.force(rocket);
        }
        Accelerations[rocket].add(force);
      }

      Speeds[rocket].add(Accelerations[rocket]);
      Positions[rocket].add(Speeds[rocket]);

      Positions[rocket] = checkBounds(Positions[rocket]);
      Accelerations[rocket].mult(0);
    }
  }
}

function isInScreen(position) {
  return (
    position.pos.x >= 0 &&
    position.pos.y >= 0 &&
    position.pos.x <= CANVAS_WIDTH &&
    position.pos.y <= CANVAS_HEIGHT
  );
}

function checkBounds(position) {
  let new_pos = position;
  if (position.x < 0) {
    new_pos.x = CANVAS_WIDTH;
  } else if (position.x > CANVAS_WIDTH) {
    new_pos.x = 0;
  }
  if (position.y < 0) {
    new_pos.y = CANVAS_HEIGHT;
  } else if (position.y > CANVAS_HEIGHT) {
    new_pos.y = 0;
  }
  return new_pos;
}

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
