const canvas = document.querySelector("#arenaCanvas");
const ctx = canvas.getContext("2d");
const missionSelect = document.querySelector("#missionSelect");
const missionTitle = document.querySelector("#missionTitle");
const missionBrief = document.querySelector("#missionBrief");
const missionStatus = document.querySelector("#missionStatus");
const scoreReadout = document.querySelector("#scoreReadout");
const objectiveList = document.querySelector("#objectiveList");
const codeEditor = document.querySelector("#codeEditor");
const logOutput = document.querySelector("#logOutput");
const runBtn = document.querySelector("#runBtn");
const stopBtn = document.querySelector("#stopBtn");
const resetBtn = document.querySelector("#resetBtn");
const resetCodeBtn = document.querySelector("#resetCodeBtn");
const hintBtn = document.querySelector("#hintBtn");
const hintOutput = document.querySelector("#hintOutput");
const storyOutput = document.querySelector("#storyOutput");
const compassNeedle = document.querySelector("#compassNeedle");
const headingReadout = document.querySelector("#headingReadout");
const mentorOverlay = document.querySelector("#mentorOverlay");
const studentNameInput = document.querySelector("#studentNameInput");
const saveNameBtn = document.querySelector("#saveNameBtn");
const mentorReadout = document.querySelector("#mentorReadout");
const rankWordOutput = document.querySelector("#rankWordOutput");
const rankGuessBtn = document.querySelector("#rankGuessBtn");
const rankGuessOutput = document.querySelector("#rankGuessOutput");

const WORLD = { width: 920, height: 620 };
const robotRadius = 22;
const missionCompleteDelay = 250;
const STORAGE_KEY = "mars-rover-missions-progress-v1";

const missions = buildMissions();

function buildMissions() {
  const ranks = [
    { title: "Rank 1: Landing Site Cadet", requiresLoop: false, requiresIfElse: false },
    { title: "Rank 2: Terrain Survey Operator", requiresLoop: false, requiresIfElse: false },
    { title: "Rank 3: Sample Return Specialist", requiresLoop: true, requiresIfElse: true },
    { title: "Rank 4: Mars Mission Lead", requiresLoop: true, requiresIfElse: true },
  ];

  const routes = [
    {
      id: "beacons",
      theme: "mars",
      start: { x: 96, y: 520, heading: 0, color: "#f47b20" },
      points: [
        { x: 230, y: 445, label: "Beacon A", kind: "capsule", action: "flash", code: "orange-blue", objective: "Flash orange-blue at navigation beacon A" },
        { x: 500, y: 300, label: "Beacon B", kind: "capsule", action: "flash", code: "blue-blue", objective: "Flash blue-blue at navigation beacon B" },
        { x: 770, y: 145, label: "Beacon C", kind: "capsule", action: "flash", code: "orange-white", objective: "Flash orange-white at navigation beacon C" },
      ],
      hazards: [
        { x: 310, y: 486, w: 185, h: 42, kind: "rock" },
        { x: 392, y: 334, w: 50, h: 140, kind: "rock" },
        { x: 594, y: 180, w: 54, h: 210, kind: "rock" },
      ],
      decorations: [
        { kind: "command", x: 112, y: 470, label: "Base Camp" },
        { kind: "crater", x: 358, y: 225, size: 42 },
      ],
      moves: [
        [80, 330, 1.1],
        [80, 335, 2.3],
        [80, 335, 2.8],
      ],
    },
    {
      id: "relay",
      theme: "mars",
      start: { x: 140, y: 500, heading: 0, color: "#f47b20" },
      points: [
        { x: 140, y: 168, label: "Relay 1", kind: "satellite", action: "flash", code: "blue-orange", objective: "Transmit blue-orange to relay 1" },
        { x: 760, y: 168, label: "Relay 2", kind: "satellite", action: "flash", code: "blue-white", objective: "Transmit blue-white to relay 2" },
        { x: 760, y: 500, label: "Relay 3", kind: "satellite", action: "flash", code: "orange-orange", objective: "Transmit orange-orange to relay 3" },
        { x: 140, y: 500, label: "Depot", kind: "dock", action: "collect", objective: "Collect the data package from the return depot" },
      ],
      hazards: [
        { x: 282, y: 252, w: 360, h: 86, kind: "sand" },
        { x: 410, y: 392, w: 110, h: 74, kind: "debris" },
      ],
      decorations: [
        { kind: "command", x: 132, y: 506, label: "Comms Hub" },
        { kind: "crater", x: 510, y: 298, size: 46 },
      ],
      moves: [
        [70, 270, 3.8],
        [70, 0, 7.5],
        [70, 90, 3.8],
        [70, 180, 7.5],
      ],
    },
    {
      id: "samples",
      theme: "mars",
      start: { x: 86, y: 92, heading: 0, color: "#f47b20" },
      points: [
        { x: 290, y: 120, label: "Rock", kind: "sample", action: "collect", objective: "Collect the basalt rock sample" },
        { x: 426, y: 482, label: "Ice", kind: "sample", action: "collect", objective: "Collect the buried ice sample" },
        { x: 792, y: 342, label: "Soil", kind: "sample", action: "collect", objective: "Collect the red soil sample" },
      ],
      hazards: [
        { x: 178, y: 212, w: 130, h: 64, kind: "dust" },
        { x: 372, y: 124, w: 68, h: 240, kind: "dust" },
        { x: 548, y: 392, w: 82, h: 150, kind: "dust" },
        { x: 676, y: 96, w: 72, h: 188, kind: "dust" },
      ],
      decorations: [
        { kind: "habitat", x: 112, y: 96, label: "Lab" },
        { kind: "crater", x: 560, y: 250, size: 52 },
      ],
      moves: [
        [75, 8, 2.5],
        [75, 78, 4.8],
        [75, 340, 4.8],
      ],
    },
    {
      id: "return",
      theme: "mars",
      start: { x: 86, y: 520, heading: 0, color: "#f47b20" },
      points: [
        { x: 260, y: 500, label: "Tube", kind: "sample", action: "collect", objective: "Collect the sealed sample tube" },
        { x: 420, y: 365, label: "Sensor", kind: "sample", action: "collect", objective: "Collect the surface sensor pack" },
        { x: 610, y: 260, label: "Mast", kind: "satellite", action: "flash", code: "orange-blue-white", objective: "Flash orange-blue-white at the weather mast" },
        { x: 800, y: 175, label: "Capsule", kind: "dock", action: "collect", objective: "Collect the return capsule clearance tag" },
      ],
      hazards: [
        { x: 312, y: 410, w: 72, h: 140, kind: "dust" },
        { x: 505, y: 300, w: 72, h: 118, kind: "debris" },
        { x: 694, y: 170, w: 50, h: 164, kind: "rock" },
      ],
      decorations: [
        { kind: "habitat", x: 100, y: 500, label: "Depot" },
        { kind: "crater", x: 680, y: 430, size: 44 },
      ],
      moves: [
        [70, 354, 2.0],
        [70, 320, 2.8],
        [70, 335, 2.6],
        [70, 335, 2.6],
      ],
    },
  ];

  const rankNames = [
    ["Landing Zone Beacon Check", "Solar Relay Alignment", "Starter Sample Sweep", "Depot Route Test"],
    ["Dust Basin Signal Run", "Ridge Relay Link", "Ice Pocket Retrieval", "Habitat Supply Loop"],
    ["Crater Edge Logic", "Canyon Sensor Sweep", "Delta Core Pickup", "Weather Mast Signal"],
    ["Return Capsule Prep", "Lava Tube Mapping", "Plateau Sample Chain", "Earth Uplink Final"],
  ];

  return ranks.flatMap((rank, rankIndex) =>
    routes.map((route, routeIndex) => {
      const missionRoute = rankIndex >= 2 ? makeYear8Route(route, routeIndex, rankIndex) : makeDifficultyRoute(route, rankIndex);
      const points = missionRoute.points.map((point) => ({ ...point, r: point.kind === "dock" ? 32 : 28 }));
      return {
        id: `rank-${rankIndex + 1}-${missionRoute.id}`,
        rank: rank.title,
        rankIndex,
        routeIndex,
        name: rankNames[rankIndex][routeIndex],
        brief: makeBrief(rankIndex, routeIndex),
        theme: missionRoute.theme,
        start: missionRoute.start,
        beacons: points,
        hazards: missionRoute.hazards,
        decorations: missionRoute.decorations,
        story: makeStory(rankIndex, routeIndex),
        hint: makeHint(rankIndex, routeIndex, points),
        requiresLoop: rank.requiresLoop,
        requiresIfElse: rank.requiresIfElse,
        starter: makeStarter(rank.title, rankNames[rankIndex][routeIndex], points, missionRoute.moves, rank.requiresLoop, rank.requiresIfElse),
      };
    }),
  );
}

function makeDifficultyRoute(route, rankIndex) {
  if (rankIndex === 0) {
    return {
      ...route,
      points: route.points.slice(0, Math.min(2, route.points.length)),
      hazards: route.hazards.slice(0, Math.max(1, Math.min(2, route.hazards.length))),
      moves: route.moves.slice(0, Math.min(2, route.moves.length)),
    };
  }

  return {
    ...route,
    hazards: [
      ...route.hazards,
      { x: 744, y: 378, w: 58, h: 96, kind: route.theme === "mars" ? "dust" : "debris" },
    ],
  };
}

function makeYear8Route(route, routeIndex, rankIndex) {
  const labels = [
    ["Supply Crate", "Beacon"],
    ["Tool Kit", "Relay"],
    ["Core Sample", "Signal"],
    ["Sample Tube", "Gate"],
  ][routeIndex];
  const code = rankIndex === 2 ? "orange-blue" : "blue-orange";
  const lastStep = rankIndex === 2 ? 3 : 4;
  const pointTemplates = [
    { x: 250, y: 430, name: labels[0], action: "collect", kind: "sample" },
    { x: 405, y: 340, name: "Cache", action: "collect", kind: "sample" },
    { x: 560, y: 250, name: labels[1], action: "flash", kind: routeIndex === 3 ? "dock" : "satellite" },
    { x: 715, y: 160, name: "Final", action: "flash", kind: "satellite" },
  ].slice(0, lastStep);
  pointTemplates.forEach((point, index) => {
    if (index < pointTemplates.length - 1) {
      point.action = "collect";
      point.kind = "sample";
    } else {
      point.action = "flash";
      point.kind = routeIndex === 3 ? "dock" : "satellite";
      point.name = labels[1];
    }
  });

  return {
    id: `${route.id}-year8`,
    theme: route.theme,
    start: { x: 96, y: 520, heading: 0, color: "#f47b20" },
    points: pointTemplates.map((point, index) => ({
      x: point.x,
      y: point.y,
      label: point.name,
      kind: point.kind,
      action: point.action,
      code: point.action === "flash" ? code : undefined,
      objective:
        point.action === "flash"
          ? `Flash ${code} at the ${point.name.toLowerCase()}`
          : `Collect the ${point.name.toLowerCase()}`,
      step: index + 1,
    })),
    hazards: [
      { x: 372, y: 180, w: 70, h: 95, kind: routeIndex % 2 ? "debris" : "rock" },
      { x: 680, y: 410, w: 92, h: 70, kind: routeIndex % 2 ? "sand" : "dust" },
      ...(rankIndex === 3 ? [{ x: 500, y: 260, w: 55, h: 105, kind: "debris" }] : []),
    ],
    decorations: [
      ...(route.decorations || []).slice(0, 1),
      { kind: "crater", x: 720, y: 250, size: 38 },
    ],
    moves: [
      [70, 330, 2.05],
      [70, 330, 2.05],
      [70, 330, 2.05],
      [70, 330, 2.05],
    ].slice(0, lastStep),
  };
}

function makeStory(rankIndex, routeIndex) {
  const stories = [
    [
      "Your rover has just touched down on the edge of a new exploration zone. Mission control needs the landing beacons checked before the rest of the science team can unload equipment, so your code must guide the rover to each marker and send the correct signal back to base.",
      "Overnight temperatures on Mars have knocked out part of the solar relay network. The rover is the only machine close enough to reactivate the towers, and the base cannot upload new weather data until the correct signals are sent from each relay point.",
      "The geology team has identified a small patch of interesting surface material near the landing site. If the rover can collect the first rock, ice, and soil samples before the dust picks up, scientists on Earth will be able to decide where the next major dig should happen.",
      "A depot run has been scheduled before the next communication window closes. The rover needs to collect field gear, confirm the weather mast is working, and secure the return tag so the science team can safely plan tomorrow's expedition.",
    ],
    [
      "The next survey area sits beyond a dust basin where visibility changes quickly. Your rover has to weave through rough ground, reach each checkpoint in order, and transmit the right code so the mapping team can mark a safe route for future missions.",
      "A communications ridge connects the main base to a remote science station, but several relays have dropped out. The rover must climb the route, restore each relay before the weather shifts, and bring back the stored data package for the engineers to review.",
      "Radar scans have detected frozen water just below the surface in a hazardous patch of terrain. The rover needs careful programming here because one wrong move into a storm zone could cost the sample, and this ice could help future astronauts survive on Mars.",
      "The habitat team is running low on a few key tools and sensor packs needed for their next field repair. Your rover is being used as the delivery unit, so it must collect the right items, check the mast signal, and secure the capsule tag before returning.",
    ],
    [
      "The rover is working along the edge of a crater where the driving pattern repeats at each stop. Mission control wants you to program it like a real engineer would: use a loop to repeat the movement and an if / else to decide whether the rover should collect material or send a signal.",
      "A short sensor route has been set up through a narrow canyon to test whether the rover can follow repeated instructions reliably. At one point it must pick up a toolkit, and at the other it must activate a relay, so your code has to make the right choice at the right step.",
      "Scientists have marked a compact route for collecting one core sample and then reporting back to a final signal post. This mission is designed to feel like a real robotic field routine where the rover repeats a movement pattern but changes jobs at the final checkpoint.",
      "The weather mast team needs one last test before the forecast system can be trusted for longer journeys. Program the rover to collect the required item first, then send the final signal, using clear logic that another engineer could easily read and check.",
    ],
    [
      "The return capsule is almost ready for launch, but the final preparation checklist still needs one item collected and one signal confirmed. Your rover is handling both tasks while moving through a cramped area of rough ground, just like a real last-minute mission on Mars.",
      "A lava tube near the base has been chosen for a trial mapping mission because it may one day shelter astronauts from harsh weather. The rover must follow a repeated movement pattern through the entry route and make the correct decision at each stop without scraping the walls.",
      "A science team on the plateau has queued a chain of sample jobs before the next communications pass. The rover must gather the materials in order and then send the final signal, showing that your code can manage repeated actions without becoming messy or hard to follow.",
      "This is the final Earth uplink mission, where the rover must complete its route, protect the science payload, and send the last confirmation needed for data return. If your program works, the mission team can transmit the results back to Earth and officially mark the expedition as a success.",
    ],
  ];
  return stories[rankIndex][routeIndex];
}

function makeHint(rankIndex, routeIndex, points) {
  const flashPoint = points.find((point) => point.action === "flash");
  const collectCount = points.filter((point) => point.action === "collect").length;
  if (rankIndex >= 2) {
    return `Use a loop from 1 to ${points.length}. If the step is less than ${points.length}, roll and collect(). Otherwise roll and flash_colour_code("${flashPoint?.code || "orange-blue"}").`;
  }
  if (collectCount && flashPoint) {
    return `Move to each target in order. Use collect() for item targets, and use flash_colour_code("${flashPoint.code}") when the target shows colour chips.`;
  }
  if (flashPoint) {
    return `Each target needs a colour signal. Roll to the target, then use flash_colour_code("${flashPoint.code}") or the code shown above that target.`;
  }
  return "Roll to each target in order and use collect() when the rover reaches the item.";
}

function makeBrief(rankIndex, routeIndex) {
  const briefs = [
    [
      "Drive to each beacon and flash the colour code that confirms the landing zone map.",
      "Restore the solar relay network by flashing the right codes, then collect the depot data package.",
      "Collect each Mars sample in order while steering around rough dust terrain.",
      "Gather depot gear, flash the weather mast, and collect the return clearance tag.",
    ],
    [
      "Send signal codes across the dust basin and avoid terrain hazards on the way.",
      "Reconnect the ridge relays in order, then collect the data package from the depot.",
      "Recover the ice and soil samples without driving into the dust storms.",
      "Follow the habitat loop, collect the field gear, signal the mast, and secure the capsule tag.",
    ],
    [
      "Two checkpoints only: collect the supply, then use a loop and if / else to flash the beacon.",
      "Two checkpoints only: collect the toolkit, then use a loop and if / else to activate the relay.",
      "Two checkpoints only: collect the core sample, then use a loop and if / else to send the signal.",
      "Two checkpoints only: collect the sample tube, then use a loop and if / else to open the gate.",
    ],
    [
      "Final practice: two checkpoints, one collect command, one colour flash, one simple loop, one if / else.",
      "Final practice: collect first, flash second, and keep the loop and if / else easy to read.",
      "Final practice: use a counted loop to decide between collect() and flash_colour_code().",
      "Final practice: a short two-step Mars mission designed for Year 8 loop and branching practice.",
    ],
  ];
  return briefs[rankIndex][routeIndex];
}

function makeStarter(rank, name, points, moves, requiresLoop, requiresIfElse) {
  const actionLines = points.map((point) =>
    point.action === "flash" ? `flash_colour_code("${point.code}")` : "collect()",
  );

  if (requiresLoop && requiresIfElse) {
    const flashPoint = points.find((point) => point.action === "flash");
    const loopMove = moves[0];

    return `# ${rank}
# Mission: ${name}
# Year 8 challenge:
# Collect on the early steps. Flash the colour code on the final step.

set_color("orange")

for step in range(1, ${points.length + 1}):
  roll(${loopMove[0]}, ${loopMove[1]}, ${loopMove[2]})

  if step < ${points.length}:
    collect()
  else:
    flash_colour_code("${flashPoint?.code || "orange-blue"}")

stop()`;
  }

  const lines = [`# ${rank}`, `# Mission: ${name}`, "", 'set_color("orange")'];
  moves.forEach((move, index) => {
    lines.push(`roll(${move[0]}, ${move[1]}, ${move[2]})`);
    lines.push(actionLines[index]);
  });
  lines.push("stop()");
  return lines.join("\n");
}

let currentMission = missions[0];
let robot;
let abortRun = false;
let running = false;
let commandQueue = Promise.resolve();
let selectedMentor = null;
let studentName = "";
const completedMissions = new Set();
const savedMissionCode = new Map();
const missionDrafts = new Map();
const unlockedHints = new Set();
const awardedCertificates = new Set();
let unlockedRankIndex = 3;
let lastMissionId = missions[0].id;

function resetRobot() {
  robot = {
    x: currentMission.start.x,
    y: currentMission.start.y,
    heading: currentMission.start.heading,
    color: currentMission.start.color,
    trail: [],
    visited: new Set(),
    atBeaconIndex: null,
    notifiedBeaconIndex: null,
    ignoredHazards: new Set(),
    wallPasses: 0,
    collectBoost: 0,
    flashing: false,
    crashed: false,
    message: "",
  };
  abortRun = false;
  updateMissionProgress();
  draw();
}

function resizeCanvasForDisplay() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * scale);
  canvas.height = Math.round(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function getSceneMetrics() {
  const rect = canvas.getBoundingClientRect();
  const ySquash = 0.72;
  const scale = Math.min((rect.width * 0.92) / WORLD.width, (rect.height * 0.8) / (WORLD.height * ySquash));
  const fieldWidth = WORLD.width * scale;
  const fieldHeight = WORLD.height * scale * ySquash;

  return {
    rect,
    scale,
    ySquash,
    originX: (rect.width - fieldWidth) / 2,
    originY: rect.height * 0.58 - fieldHeight / 2,
    fieldWidth,
    fieldHeight,
  };
}

function worldToCanvas(point, z = 0, scene = getSceneMetrics()) {
  return {
    x: scene.originX + point.x * scene.scale,
    y: scene.originY + point.y * scene.scale * scene.ySquash - z * scene.scale,
  };
}

function drawRoundedRect(x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
  ctx.fill();
}

function headingToCanvasRadians(heading) {
  return ((heading - 90) * Math.PI) / 180;
}

function headingToUnitVector(heading) {
  const radians = headingToCanvasRadians(heading);
  return {
    x: Math.cos(radians),
    y: Math.sin(radians),
  };
}

function draw() {
  const rect = canvas.getBoundingClientRect();
  const scene = getSceneMetrics();
  ctx.clearRect(0, 0, rect.width, rect.height);
  updateCompass();

  const sky = ctx.createLinearGradient(0, 0, 0, rect.height);
  sky.addColorStop(0, "#070910");
  sky.addColorStop(0.56, "#111827");
  sky.addColorStop(1, "#23312e");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, rect.width, rect.height);

  drawStarfield(rect);
  drawMissionMat(scene);
  drawMissionDecorations(scene);
  drawMissionArt(scene);
  drawTrail(scene);
  drawRobot(scene);
}

function updateCompass() {
  if (!robot) return;
  const heading = ((Math.round(robot.heading) % 360) + 360) % 360;
  if (compassNeedle) {
    compassNeedle.style.transform = `translate(-50%, -100%) rotate(${heading}deg)`;
  }
  if (headingReadout) {
    headingReadout.textContent = `Heading: ${heading}°`;
  }
}

function drawStarfield(rect) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.82)";
  for (let i = 0; i < 145; i += 1) {
    const x = (i * 83) % rect.width;
    const y = (i * 47) % rect.height;
    const radius = i % 9 === 0 ? 1.7 : 0.9;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.strokeStyle = "rgba(79, 217, 191, 0.22)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 7; i += 1) {
    const x = ((i * 211) % rect.width) - 60;
    const y = 92 + ((i * 67) % Math.max(120, rect.height - 180));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 90, y - 26);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(80, 184, 255, 0.18)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 11; i += 1) {
    const x = ((i * 157) % rect.width) - 140;
    const y = 60 + ((i * 89) % Math.max(120, rect.height - 120));
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 170, y + 34);
    ctx.stroke();
  }
}

function drawMissionMat(scene) {
  const floorX = scene.originX;
  const floorY = scene.originY;
  const floorW = scene.fieldWidth;
  const floorH = scene.fieldHeight;
  const depth = Math.max(18, scene.scale * 30);

  ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
  ctx.beginPath();
  ctx.ellipse(floorX + floorW / 2, floorY + floorH + depth * 1.2, floorW * 0.55, depth * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#3f342c";
  ctx.beginPath();
  ctx.moveTo(floorX, floorY + floorH);
  ctx.lineTo(floorX + floorW, floorY + floorH);
  ctx.lineTo(floorX + floorW - depth, floorY + floorH + depth);
  ctx.lineTo(floorX + depth, floorY + floorH + depth);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = currentMission.theme === "mars" ? "#4a2d1d" : "#1e2b31";
  ctx.strokeStyle = currentMission.theme === "mars" ? "#f7b267" : "#50b8ff";
  ctx.lineWidth = 2;
  drawRoundedRect(floorX, floorY, floorW, floorH, 8);
  ctx.stroke();

  ctx.strokeStyle = currentMission.theme === "mars" ? "rgba(247, 178, 103, 0.18)" : "rgba(80, 184, 255, 0.22)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= WORLD.width; x += 92) {
    const start = worldToCanvas({ x, y: 0 }, 0, scene);
    const end = worldToCanvas({ x, y: WORLD.height }, 0, scene);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
  for (let y = 0; y <= WORLD.height; y += 92) {
    const start = worldToCanvas({ x: 0, y }, 0, scene);
    const end = worldToCanvas({ x: WORLD.width, y }, 0, scene);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
}

function drawMissionDecorations(scene) {
  for (const item of currentMission.decorations || []) {
    if (item.kind === "planet") drawPlanetMark(item, scene);
    if (item.kind === "orbit") drawOrbitPath(item, scene);
    if (item.kind === "crater") drawCrater(item, scene);
    if (item.kind === "habitat") drawHabitat(item, scene);
    if (item.kind === "command") drawCommandPost(item, scene);
  }
}

function drawMissionArt(scene) {
  for (const hazard of currentMission.hazards) {
    drawHazard(hazard, scene);
  }

  currentMission.beacons.forEach((beacon, index) => {
    drawMissionTarget(beacon, robot.visited.has(index), scene);
  });
}

function drawHazard(hazard, scene) {
  if (hazard.kind === "rock" || hazard.kind === "asteroid") {
    drawRockField(hazard, scene);
    return;
  }
  if (hazard.kind === "sand" || hazard.kind === "radiation") {
    drawSandTrap(hazard, scene);
    return;
  }
  if (hazard.kind === "dust") {
    drawDustStorm(hazard, scene);
    return;
  }
  if (hazard.kind === "debris") {
    drawDebrisCloud(hazard, scene);
    return;
  }
  drawHazardBlock(hazard, scene, "#d33f49", "#a8232d");
}

function drawHazardBlock(hazard, scene, topColor = "#d33f49", sideColor = "#a8232d") {
  const height = 34;
  const topLeft = worldToCanvas({ x: hazard.x, y: hazard.y }, height, scene);
  const topRight = worldToCanvas({ x: hazard.x + hazard.w, y: hazard.y }, height, scene);
  const bottomRight = worldToCanvas({ x: hazard.x + hazard.w, y: hazard.y + hazard.h }, height, scene);
  const bottomLeft = worldToCanvas({ x: hazard.x, y: hazard.y + hazard.h }, height, scene);
  const floorRight = worldToCanvas({ x: hazard.x + hazard.w, y: hazard.y + hazard.h }, 0, scene);
  const floorLeft = worldToCanvas({ x: hazard.x, y: hazard.y + hazard.h }, 0, scene);

  ctx.fillStyle = "rgba(25, 34, 30, 0.2)";
  ctx.beginPath();
  ctx.ellipse((floorLeft.x + floorRight.x) / 2, floorRight.y + 11, (floorRight.x - floorLeft.x) * 0.58, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = sideColor;
  ctx.beginPath();
  ctx.moveTo(bottomLeft.x, bottomLeft.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.lineTo(floorRight.x, floorRight.y);
  ctx.lineTo(floorLeft.x, floorLeft.y);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(bottomRight.x, bottomRight.y);
  ctx.lineTo(bottomLeft.x, bottomLeft.y);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
  ctx.lineWidth = 5;
  for (let stripe = hazard.x - hazard.h; stripe < hazard.x + hazard.w; stripe += 42) {
    const a = worldToCanvas({ x: stripe, y: hazard.y + hazard.h }, height + 1, scene);
    const b = worldToCanvas({ x: stripe + hazard.h, y: hazard.y }, height + 1, scene);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}

function drawRockField(hazard, scene) {
  drawHazardBlock(hazard, scene, "#7f6757", "#4c3a31");
  const count = Math.max(4, Math.round((hazard.w + hazard.h) / 55));
  for (let i = 0; i < count; i += 1) {
    const rock = {
      x: hazard.x + 18 + ((i * 43) % Math.max(24, hazard.w - 28)),
      y: hazard.y + 14 + ((i * 31) % Math.max(18, hazard.h - 22)),
    };
    const point = worldToCanvas(rock, 42, scene);
    const radius = (9 + (i % 3) * 4) * scene.scale;
    ctx.fillStyle = i % 2 ? "#b48b6a" : "#8d684e";
    ctx.beginPath();
    ctx.ellipse(point.x, point.y, radius * 1.25, radius, 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#e4c7ac";
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawSandTrap(hazard, scene) {
  drawHazardBlock(hazard, scene, "#d59a52", "#8f5e2a");
  const center = worldToCanvas({ x: hazard.x + hazard.w / 2, y: hazard.y + hazard.h / 2 }, 44, scene);
  ctx.strokeStyle = "rgba(255, 234, 199, 0.72)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i += 1) {
    const radius = (22 + i * 18) * scene.scale;
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, Math.PI * 0.9, Math.PI * 1.85);
    ctx.stroke();
  }
}

function drawDustStorm(hazard, scene) {
  drawHazardBlock(hazard, scene, "#b96b42", "#6d3926");
  ctx.strokeStyle = "rgba(255, 225, 172, 0.58)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 5; i += 1) {
    const start = worldToCanvas({ x: hazard.x + i * 18, y: hazard.y + hazard.h - 10 }, 45, scene);
    const end = worldToCanvas({ x: hazard.x + hazard.w - i * 10, y: hazard.y + 10 + i * 9 }, 45, scene);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(start.x + 38, start.y - 24, end.x - 42, end.y + 18, end.x, end.y);
    ctx.stroke();
  }
}

function drawDebrisCloud(hazard, scene) {
  drawHazardBlock(hazard, scene, "#45515f", "#242b34");
  ctx.fillStyle = "#cfd8e3";
  for (let i = 0; i < 9; i += 1) {
    const bit = {
      x: hazard.x + 12 + ((i * 19) % Math.max(20, hazard.w - 22)),
      y: hazard.y + 10 + ((i * 17) % Math.max(16, hazard.h - 18)),
    };
    const point = worldToCanvas(bit, 43, scene);
    const size = (5 + (i % 3) * 3) * scene.scale;
    ctx.save();
    ctx.translate(point.x, point.y);
    ctx.rotate(i * 0.7);
    ctx.fillRect(-size / 2, -size / 2, size, size * 0.7);
    ctx.restore();
  }
}

function drawMissionTarget(beacon, complete, scene) {
  if (beacon.kind === "capsule") drawCapsule(beacon, complete, scene);
  else if (beacon.kind === "satellite") drawSatellite(beacon, complete, scene);
  else if (beacon.kind === "dock") drawDock(beacon, complete, scene);
  else if (beacon.kind === "sample") drawSample(beacon, complete, scene);
  else drawSample(beacon, complete, scene);
}

function drawTargetBase(beacon, complete, scene) {
  const point = worldToCanvas(beacon, 7, scene);
  const ground = worldToCanvas(beacon, 0, scene);
  const radius = beacon.r * scene.scale;
  ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y + 9, radius * 1.2, radius * scene.ySquash * 0.78, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = complete ? "#1f8a70" : "#f5b942";
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, radius, radius * scene.ySquash, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = complete ? "#9affea" : "#ffe49a";
  ctx.lineWidth = 3;
  ctx.stroke();
  if (beacon.code) drawColorCodeChips(beacon.code, point, radius);
  return { point, radius };
}

function drawColorCodeChips(code, point, radius) {
  const colors = normalizeColorCode(code).split("-");
  const chipSize = Math.max(5, radius * 0.17);
  const totalWidth = colors.length * chipSize + (colors.length - 1) * chipSize * 0.45;
  let x = point.x - totalWidth / 2;
  const y = point.y - radius * 1.2;
  colors.forEach((color) => {
    ctx.fillStyle = colorValue(color);
    ctx.fillRect(x, y, chipSize, chipSize);
    ctx.strokeStyle = "rgba(255,255,255,0.76)";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, chipSize, chipSize);
    x += chipSize * 1.45;
  });
}

function drawCapsule(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.fillStyle = complete ? "#effff6" : "#e7efe9";
  drawRoundedRect(point.x - radius * 0.18, point.y - radius * 1.02, radius * 0.36, radius * 1.1, radius * 0.16);
  ctx.fillStyle = "#6bd2ff";
  ctx.fillRect(point.x - radius * 0.58, point.y - radius * 0.42, radius * 1.16, radius * 0.12);
  ctx.strokeStyle = "#c8f0ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - radius * 1.02);
  ctx.lineTo(point.x, point.y - radius * 1.34);
  ctx.stroke();
  drawTargetLabel(beacon.label, point, radius);
}

function drawSatellite(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.fillStyle = complete ? "#e6fff6" : "#cdd7de";
  drawRoundedRect(point.x - radius * 0.2, point.y - radius * 0.7, radius * 0.4, radius * 0.95, 4);
  ctx.fillStyle = "#2db4d6";
  ctx.fillRect(point.x - radius * 0.95, point.y - radius * 0.46, radius * 0.58, radius * 0.2);
  ctx.fillRect(point.x + radius * 0.37, point.y - radius * 0.46, radius * 0.58, radius * 0.2);
  ctx.strokeStyle = "#eef8ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - radius * 0.7);
  ctx.lineTo(point.x + radius * 0.2, point.y - radius * 1.08);
  ctx.stroke();
  drawTargetLabel(beacon.label, point, radius);
}

function drawDock(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.strokeStyle = complete ? "#9affea" : "#ffffff";
  ctx.lineWidth = 4;
  ctx.strokeRect(point.x - radius * 0.58, point.y - radius * 0.42, radius * 1.16, radius * 0.84);
  ctx.fillStyle = complete ? "#9affea" : "#f3c178";
  ctx.fillRect(point.x - radius * 0.46, point.y - radius * 0.14, radius * 0.92, radius * 0.28);
  ctx.fillStyle = "#5f4638";
  ctx.fillRect(point.x - radius * 0.18, point.y - radius * 0.54, radius * 0.36, radius * 0.34);
  drawTargetLabel(beacon.label, point, radius);
}

function drawSample(beacon, complete, scene) {
  const { point, radius } = drawTargetBase(beacon, complete, scene);
  ctx.fillStyle = beacon.label === "Ice" ? "#9fdfff" : beacon.label === "Soil" ? "#cf7d43" : "#9f8e7a";
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius * 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = complete ? "#9affea" : "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.arc(point.x - radius * 0.12, point.y - radius * 0.12, radius * 0.16, 0, Math.PI * 2);
  ctx.fill();
  drawTargetLabel(beacon.label, point, radius);
}

function drawTargetLabel(label, point, radius) {
  ctx.fillStyle = "#eef8f2";
  ctx.strokeStyle = "rgba(0, 0, 0, 0.7)";
  ctx.lineWidth = 4;
  ctx.font = `800 ${Math.max(11, radius * 0.36)}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.strokeText(label, point.x, point.y + radius * 0.98);
  ctx.fillText(label, point.x, point.y + radius * 0.98);
}

function drawPlanetMark(item, scene) {
  const point = worldToCanvas(item, 2, scene);
  const radius = item.size * scene.scale;
  ctx.fillStyle = "rgba(80, 184, 255, 0.16)";
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(80, 184, 255, 0.38)";
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawOrbitPath(item, scene) {
  const point = worldToCanvas(item, 1, scene);
  ctx.strokeStyle = "rgba(116, 231, 255, 0.25)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, (item.w * scene.scale) / 2, (item.h * scene.scale * scene.ySquash) / 2, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCrater(item, scene) {
  const point = worldToCanvas(item, 1, scene);
  const radius = item.size * scene.scale;
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(point.x, point.y, radius, radius * scene.ySquash * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.13)";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawHabitat(item, scene) {
  const point = worldToCanvas(item, 18, scene);
  const size = 44 * scene.scale;
  ctx.fillStyle = "#d8d4c7";
  ctx.beginPath();
  ctx.arc(point.x, point.y, size * 0.55, Math.PI, 0);
  ctx.lineTo(point.x + size * 0.55, point.y + size * 0.35);
  ctx.lineTo(point.x - size * 0.55, point.y + size * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f7b267";
  ctx.fillRect(point.x - size * 0.72, point.y + size * 0.06, size * 1.44, size * 0.16);
  drawSmallLabel(item.label, point.x, point.y + size * 0.6);
}

function drawCommandPost(item, scene) {
  const point = worldToCanvas(item, 18, scene);
  const size = 42 * scene.scale;
  ctx.fillStyle = "#d8d4c7";
  drawRoundedRect(point.x - size * 0.5, point.y - size * 0.36, size, size * 0.72, 6);
  ctx.strokeStyle = "#6bd2ff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - size * 0.36);
  ctx.lineTo(point.x, point.y - size * 0.95);
  ctx.lineTo(point.x + size * 0.42, point.y - size * 0.7);
  ctx.stroke();
  drawSmallLabel(item.label, point.x, point.y + size * 0.65);
}

function drawSmallLabel(label, x, y) {
  ctx.fillStyle = "#eef8f2";
  ctx.font = "700 12px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
}

function drawTrail(scene) {
  if (robot.trail.length < 2) return;
  ctx.strokeStyle = robot.color;
  ctx.lineWidth = Math.max(4, scene.scale * 7);
  ctx.lineCap = "round";
  ctx.beginPath();
  robot.trail.forEach((point, index) => {
    const mapped = worldToCanvas(point, 4, scene);
    if (index === 0) ctx.moveTo(mapped.x, mapped.y);
    else ctx.lineTo(mapped.x, mapped.y);
  });
  ctx.stroke();
}

function drawRobot(scene) {
  const ground = worldToCanvas(robot, 0, scene);
  const point = worldToCanvas(robot, robotRadius * 0.72, scene);
  const radius = robotRadius * scene.scale;
  const headingRadians = headingToCanvasRadians(robot.heading);
  const headingVector = headingToUnitVector(robot.heading);
  const arrowX = headingVector.x;
  const arrowY = headingVector.y * scene.ySquash;

  ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
  ctx.beginPath();
  ctx.ellipse(ground.x, ground.y + 10, radius * 1.5, radius * 0.52, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.rotate(headingRadians);
  drawRoverBody(radius);
  drawRoverWheels(radius);
  drawRoverMast(radius);
  ctx.rotate(-headingRadians);
  ctx.translate(-point.x, -point.y);

  ctx.strokeStyle = robot.color;
  ctx.lineWidth = Math.max(2, radius * 0.08);
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(point.x + arrowX * radius * 0.95, point.y + arrowY * radius * 0.95);
  ctx.lineTo(point.x + arrowX * radius * 1.26, point.y + arrowY * radius * 1.26);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();

  if (robot.message) {
    ctx.fillStyle = "#eef8f2";
    ctx.strokeStyle = "rgba(0,0,0,0.75)";
    ctx.lineWidth = 4;
    ctx.font = "700 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    const messageY = point.y - radius - 18;
    ctx.strokeText(robot.message, point.x, messageY);
    ctx.fillText(robot.message, point.x, messageY);
  }
}

function drawRoverBody(radius) {
  const body = ctx.createLinearGradient(0, -radius, 0, radius);
  body.addColorStop(0, "#efe8d6");
  body.addColorStop(1, "#a2876f");
  ctx.fillStyle = body;
  drawRoundedRect(-radius * 0.95, -radius * 0.36, radius * 1.9, radius * 0.88, 8);
  ctx.fillStyle = robot.flashing || "#f47b20";
  ctx.fillRect(-radius * 0.42, -radius * 0.18, radius * 0.84, radius * 0.16);
  ctx.fillStyle = "#6e7176";
  ctx.fillRect(-radius * 0.22, radius * 0.04, radius * 0.44, radius * 0.16);
}

function drawRoverWheels(radius) {
  ctx.fillStyle = "#35393f";
  const wheelX = radius * 0.88;
  const wheelY = radius * 0.44;
  const wheelW = radius * 0.34;
  const wheelH = radius * 0.22;
  [
    [-wheelX, -wheelY],
    [wheelX - wheelW, -wheelY],
    [-wheelX, wheelY],
    [wheelX - wheelW, wheelY],
  ].forEach(([x, y]) => {
    ctx.fillRect(x, y, wheelW, wheelH);
  });
}

function drawRoverMast(radius) {
  ctx.strokeStyle = "#d9dde2";
  ctx.lineWidth = Math.max(2, radius * 0.07);
  ctx.beginPath();
  ctx.moveTo(radius * 0.22, -radius * 0.22);
  ctx.lineTo(radius * 0.42, -radius * 0.82);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(radius * 0.46, -radius * 0.9, radius * 0.18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#202a32";
  ctx.beginPath();
  ctx.arc(radius * 0.5, -radius * 0.9, radius * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

function addLog(message, type = "") {
  const line = document.createElement("div");
  line.className = `log-line ${type}`.trim();
  line.textContent = message;
  logOutput.append(line);
  logOutput.scrollTop = logOutput.scrollHeight;
}

function clearLog() {
  logOutput.textContent = "";
}

function populateMissions() {
  missionSelect.textContent = "";
  const groups = new Map();
  missions.forEach((mission) => {
    if (!groups.has(mission.rank)) {
      const group = document.createElement("optgroup");
      group.label = mission.rank;
      groups.set(mission.rank, group);
      missionSelect.append(group);
    }
    const option = document.createElement("option");
    option.value = mission.id;
    option.textContent = missionOptionLabel(mission);
    option.disabled = mission.rankIndex > unlockedRankIndex;
    groups.get(mission.rank).append(option);
  });
}

function missionOptionLabel(mission) {
  return completedMissions.has(mission.id) ? `★ ${mission.name}` : mission.name;
}

function refreshMissionOptionLabels() {
  missionSelect.querySelectorAll("option").forEach((option) => {
    const mission = missions.find((item) => item.id === option.value);
    if (mission) option.textContent = missionOptionLabel(mission);
  });
}

function refreshMissionLocks() {
  missionSelect.querySelectorAll("option").forEach((option) => {
    const mission = missions.find((item) => item.id === option.value);
    option.disabled = mission.rankIndex > unlockedRankIndex;
  });
}

function loadMission(id) {
  const requestedMission = missions.find((mission) => mission.id === id) || missions[0];
  currentMission = requestedMission;
  lastMissionId = currentMission.id;
  missionSelect.value = currentMission.id;
  missionTitle.textContent = `${currentMission.rank}: ${currentMission.name}`;
  missionBrief.textContent = currentMission.brief;
  storyOutput.textContent = currentMission.story;
  codeEditor.value = missionDrafts.get(currentMission.id) || savedMissionCode.get(currentMission.id) || currentMission.starter;
  renderObjectives();
  clearLog();
  addLog(`Loaded ${currentMission.name}.`);
  resetRobot();
  updateHintUI();
  updateStudentReadout();
  updateCertificateUI();
  persistProgress();
}

function renderObjectives() {
  objectiveList.textContent = "";
  currentMission.beacons.forEach((beacon, index) => {
    const item = document.createElement("li");
    item.dataset.index = String(index);
    item.className = "objective-item pending";

    const status = document.createElement("span");
    status.className = "objective-status";
    status.textContent = "○";

    const text = document.createElement("span");
    text.className = "objective-text";
    const commandHint =
      beacon.action === "flash"
        ? ` using flash_colour_code("${beacon.code}")`
        : beacon.action === "collect"
          ? " using collect()"
          : "";
    text.textContent = `${beacon.objective || `Reach ${beacon.label}`}${commandHint}`;
    item.append(status, text);
    objectiveList.append(item);
  });
  updateMissionProgress();
}

function updateHintUI() {
  const hasMentorHint = selectedMentor?.id === "comms";
  const unlocked = hasMentorHint || unlockedHints.has(currentMission.id);
  hintBtn.disabled = !unlocked;
  hintOutput.textContent = unlocked
    ? "Hint unlocked. Press Power Hint when you want help."
    : "Locked. Complete the previous mission to unlock this power hint.";
}

function showHint() {
  const hasMentorHint = selectedMentor?.id === "comms";
  if (!hasMentorHint && !unlockedHints.has(currentMission.id)) {
    hintOutput.textContent = "This hint is still locked. Complete the previous mission first.";
    return;
  }
  hintOutput.textContent = currentMission.hint;
  addLog(`${selectedMentor?.name || "Specialist"} shared a power hint.`);
}

function completeMissionProgress() {
  if (completedMissions.has(currentMission.id)) return;
  completedMissions.add(currentMission.id);
  refreshMissionOptionLabels();
  revealRankLetter(currentMission.rankIndex, currentMission.routeIndex);
  applyMentorRankPower(currentMission.rankIndex);
  const letter = rankCodeWords[currentMission.rankIndex][currentMission.routeIndex];
  addLog(`Rank code letter earned: ${letter}`, "success");

  const nextMission = missions[missions.findIndex((mission) => mission.id === currentMission.id) + 1];
  if (nextMission && nextMission.rankIndex <= unlockedRankIndex) {
    unlockedHints.add(nextMission.id);
    addLog(`Power hint unlocked for: ${nextMission.name}`, "success");
  }
  if (allRankMissionsComplete(currentMission.rankIndex)) {
    addLog(`All missions complete for this rank. Guess the word: ${rankDisplayWord(currentMission.rankIndex)}`, "success");
  }
  updateHintUI();
  updateRankWordUI();
}

function updateMentorReadout() {
  if (!selectedMentor) {
    mentorReadout.textContent = "";
    return;
  }
  const passText = robot?.wallPasses ? ` ${robot.wallPasses} terrain pass${robot.wallPasses === 1 ? "" : "es"} ready.` : "";
  mentorReadout.textContent = `${selectedMentor.name}: ${selectedMentor.power}${passText}`;
}

function revealRankLetter(rankIndex, letterIndex) {
  if (rankIndex < 0 || rankIndex >= rankCodeWords.length) return;
  if (letterIndex < 0 || letterIndex >= rankCodeWords[rankIndex].length) return;
  rankLetters[rankIndex].add(letterIndex);
}

function applyMentorRankPower(rankIndex) {
  if (!selectedMentor) return;
  if (selectedMentor.id === "navigation") revealRankLetter(rankIndex, 0);
  if (selectedMentor.id === "comms") revealRankLetter(rankIndex, 1);
  if (selectedMentor.id === "geology" && completedMissionCount(rankIndex) >= 1) revealRankLetter(rankIndex, 2);
}

function completedMissionCount(rankIndex) {
  return missions.filter((mission) => mission.rankIndex === rankIndex && completedMissions.has(mission.id)).length;
}

function allRankMissionsComplete(rankIndex) {
  return completedMissionCount(rankIndex) === 4;
}

function rankDisplayWord(rankIndex) {
  return rankCodeWords[rankIndex]
    .split("")
    .map((letter, index) => (rankLetters[rankIndex].has(index) ? letter : "_"))
    .join(" ");
}

function updateRankWordUI() {
  const rankIndex = currentMission.rankIndex;
  applyMentorRankPower(rankIndex);
  const solved = solvedRanks.has(rankIndex);
  const allComplete = allRankMissionsComplete(rankIndex);
  rankWordOutput.textContent = `${currentMission.rank}: ${rankDisplayWord(rankIndex)}`;
  rankGuessInput.disabled = solved || !allComplete || rankAttemptsLeft[rankIndex] <= 0;
  rankGuessBtn.disabled = solved || !allComplete || rankAttemptsLeft[rankIndex] <= 0;

  if (solved) {
    rankGuessOutput.textContent = "Code word solved. Next rank unlocked.";
  } else if (!allComplete) {
    rankGuessOutput.textContent = `Complete all four missions in this rank to guess the word. Attempts left: ${rankAttemptsLeft[rankIndex]}.`;
  } else {
    rankGuessOutput.textContent = `All letters found. Guess the word to unlock the next rank. Attempts left: ${rankAttemptsLeft[rankIndex]}.`;
  }
}

function submitRankGuess() {
  const rankIndex = currentMission.rankIndex;
  const guess = rankGuessInput.value.trim().toUpperCase();
  if (!allRankMissionsComplete(rankIndex)) {
    rankGuessOutput.textContent = "Finish all four missions in this rank before guessing.";
    return;
  }
  if (!guess) {
    rankGuessOutput.textContent = "Enter the rank code word.";
    return;
  }
  if (guess === rankCodeWords[rankIndex]) {
    solvedRanks.add(rankIndex);
    unlockedRankIndex = Math.max(unlockedRankIndex, Math.min(rankIndex + 1, rankCodeWords.length - 1));
    const firstMissionInNextRank = missions.find((mission) => mission.rankIndex === unlockedRankIndex);
    if (firstMissionInNextRank) unlockedHints.add(firstMissionInNextRank.id);
    rankGuessInput.value = "";
    refreshMissionLocks();
    applyMentorRankPower(unlockedRankIndex);
    updateRankWordUI();
    addLog(`Correct code word: ${guess}. Next rank unlocked.`, "success");
    return;
  }

  if (selectedMentor?.id === "systems" && !finnSavedGuessRanks.has(rankIndex)) {
    finnSavedGuessRanks.add(rankIndex);
    rankGuessOutput.textContent = `Systems Technician used the recovery patch. That wrong guess did not cost an attempt. Attempts left: ${rankAttemptsLeft[rankIndex]}.`;
    addLog("Systems Technician blocked one wrong rank-code attempt.", "success");
    return;
  }

  rankAttemptsLeft[rankIndex] = Math.max(0, rankAttemptsLeft[rankIndex] - 1);
  rankGuessOutput.textContent =
    rankAttemptsLeft[rankIndex] > 0
      ? `Incorrect code word. Attempts left: ${rankAttemptsLeft[rankIndex]}.`
      : "No attempts left for this rank. Ask your teacher to reset the rank code.";
  updateRankWordUI();
}

function updateMissionProgress() {
  const goals = currentMission.beacons.length;
  scoreReadout.textContent = `${robot?.visited.size || 0} / ${goals} goals`;
  if (!robot) return;
  objectiveList.querySelectorAll("li").forEach((item) => {
    const complete = robot.visited.has(Number(item.dataset.index));
    const status = item.querySelector(".objective-status");
    item.classList.toggle("complete", complete);
    item.classList.toggle("pending", !complete);
    if (status) status.textContent = complete ? "★" : "○";
  });
  if (robot.crashed) {
    missionStatus.textContent = "Crashed";
  } else if (robot.visited.size === goals) {
    missionStatus.textContent = "Mission complete";
  } else if (running) {
    missionStatus.textContent = "Running";
  } else {
    missionStatus.textContent = "Ready";
  }
}

function checkProgress() {
  const nextBeacon = currentMission.beacons[robot.visited.size];
  robot.atBeaconIndex = null;
  if (nextBeacon) {
    const distance = Math.hypot(robot.x - nextBeacon.x, robot.y - nextBeacon.y);
    if (distance <= nextBeacon.r + robotRadius * 0.5 + robot.collectBoost) {
      robot.atBeaconIndex = robot.visited.size;
      if (!nextBeacon.action || nextBeacon.action === "visit") {
        completeCurrentGoal(`Goal reached: ${nextBeacon.label}`);
      } else if (robot.notifiedBeaconIndex !== robot.atBeaconIndex) {
        robot.notifiedBeaconIndex = robot.atBeaconIndex;
        addLog(`At ${nextBeacon.label}. Use ${requiredCommandText(nextBeacon)}.`);
      }
    }
  }

  for (const [hazardIndex, hazard] of currentMission.hazards.entries()) {
    const nearestX = Math.max(hazard.x, Math.min(robot.x, hazard.x + hazard.w));
    const nearestY = Math.max(hazard.y, Math.min(robot.y, hazard.y + hazard.h));
    if (Math.hypot(robot.x - nearestX, robot.y - nearestY) < robotRadius) {
      if (robot.ignoredHazards.has(hazardIndex)) continue;
      if (robot.wallPasses > 0) {
        robot.wallPasses -= 1;
        robot.ignoredHazards.add(hazardIndex);
        addLog(`${selectedMentor?.name || "Specialist"} helped the rover pass through a hazard. ${robot.wallPasses} pass${robot.wallPasses === 1 ? "" : "es"} left.`, "success");
        updateMentorReadout();
        continue;
      }
      robot.crashed = true;
      abortRun = true;
      addLog("Collision detected. Reset and try a new route.", "error");
      break;
    }
  }

  if (
    robot.x < robotRadius ||
    robot.x > WORLD.width - robotRadius ||
    robot.y < robotRadius ||
    robot.y > WORLD.height - robotRadius
  ) {
    if (robot.wallPasses > 0 && !robot.usedBoundaryPass) {
      robot.wallPasses -= 1;
      robot.usedBoundaryPass = true;
      robot.x = Math.min(WORLD.width - robotRadius, Math.max(robotRadius, robot.x));
      robot.y = Math.min(WORLD.height - robotRadius, Math.max(robotRadius, robot.y));
      addLog(`${selectedMentor?.name || "Specialist"} guided the rover back through the boundary. ${robot.wallPasses} pass${robot.wallPasses === 1 ? "" : "es"} left.`, "success");
      updateMentorReadout();
      updateMissionProgress();
      return;
    }
    robot.crashed = true;
    abortRun = true;
    addLog("The rover left the mission mat.", "error");
  }

  updateMissionProgress();
}

function completeCurrentGoal(message) {
  const index = robot.visited.size;
  if (index >= currentMission.beacons.length) return;
  robot.visited.add(index);
  robot.notifiedBeaconIndex = null;
  addLog(message, "success");
  updateMissionProgress();
}

function requiredCommandText(beacon) {
  if (beacon.action === "flash") return `flash_colour_code("${beacon.code}")`;
  if (beacon.action === "collect") return "collect()";
  return "the next command";
}

function enqueueCommand(action) {
  commandQueue = commandQueue.then(async () => {
    assertRunning();
    await action();
  });
  return commandQueue;
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function assertRunning() {
  if (abortRun) throw new Error("Run stopped");
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function roll(speed = 50, heading = robot.heading, seconds = 1) {
  return enqueueCommand(async () => {
    const safeSpeed = clampNumber(speed, 0, 100, 50);
    const safeHeading = clampNumber(heading, 0, 359, robot.heading);
    const safeSeconds = clampNumber(seconds, 0, 10, 1);
    robot.heading = safeHeading;
    addLog(`roll(${safeSpeed}, ${safeHeading}, ${safeSeconds})`);

    const started = performance.now();
    const duration = safeSeconds * 1000;
    const pixelsPerSecond = safeSpeed * 1.28;
    let last = started;

    while (performance.now() - started < duration) {
      assertRunning();
      const now = performance.now();
      const delta = (now - last) / 1000;
      last = now;
      const direction = headingToUnitVector(safeHeading);
      robot.x += direction.x * pixelsPerSecond * delta;
      robot.y += direction.y * pixelsPerSecond * delta;
      robot.trail.push({ x: robot.x, y: robot.y });
      checkProgress();
      draw();
      await sleep(16);
    }
  });
}

function turn(degrees = 90) {
  return enqueueCommand(async () => {
    const amount = clampNumber(degrees, -360, 360, 90);
    robot.heading = (robot.heading + amount + 360) % 360;
    addLog(`turn(${amount}) -> heading ${Math.round(robot.heading)}`);
    draw();
    await sleep(250);
  });
}

function setHeading(degrees = 0) {
  return enqueueCommand(async () => {
    robot.heading = clampNumber(degrees, 0, 359, 0);
    addLog(`set_heading(${Math.round(robot.heading)})`);
    draw();
    await sleep(160);
  });
}

function setColor(color = "cyan") {
  return enqueueCommand(() => {
    robot.color = colorValue(color);
    addLog(`set_color("${color}")`);
    draw();
  });
}

function colorValue(color = "orange") {
  const namedColors = {
    blue: "#35a7ff",
    cyan: "#3ddbd9",
    green: "#48c774",
    lime: "#a7d948",
    orange: "#f47b20",
    pink: "#ff5c8a",
    red: "#d33f49",
    yellow: "#f5b942",
    white: "#f8faf7",
  };
  return namedColors[String(color).toLowerCase()] || String(color);
}

function normalizeColorCode(code) {
  if (Array.isArray(code)) return code.map((part) => String(part).toLowerCase()).join("-");
  return String(code)
    .toLowerCase()
    .replace(/[\s,>]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function collect() {
  return enqueueCommand(async () => {
    const beacon = currentMission.beacons[robot.visited.size];
    if (!beacon || robot.atBeaconIndex !== robot.visited.size) {
      addLog("collect() only works when the rover is on the next mission target.", "error");
      abortRun = true;
      throw new Error("Move the rover onto the target before using collect().");
    }
    if (beacon.action !== "collect") {
      addLog(`This target needs ${requiredCommandText(beacon)}, not collect().`, "error");
      abortRun = true;
      throw new Error(`Wrong command for ${beacon.label}. Use ${requiredCommandText(beacon)}.`);
    }
    robot.message = "Collected";
    draw();
    await sleep(260);
    robot.message = "";
    completeCurrentGoal(`Collected: ${beacon.label}`);
    draw();
  });
}

function flashColorCode(code = "orange") {
  return enqueueCommand(async () => {
    const beacon = currentMission.beacons[robot.visited.size];
    const normalized = normalizeColorCode(code);
    if (!beacon || robot.atBeaconIndex !== robot.visited.size) {
      addLog("flash_colour_code() only works when the rover is on the next signal target.", "error");
      abortRun = true;
      throw new Error("Move the rover onto the signal target before using flash_colour_code().");
    }
    if (beacon.action !== "flash") {
      addLog(`This target needs ${requiredCommandText(beacon)}, not a colour flash.`, "error");
      abortRun = true;
      throw new Error(`Wrong command for ${beacon.label}. Use ${requiredCommandText(beacon)}.`);
    }

    const colors = normalized.split("-").filter(Boolean);
    addLog(`flash_colour_code("${normalized}")`);
    for (const color of colors) {
      robot.flashing = colorValue(color);
      draw();
      await sleep(180);
      robot.flashing = false;
      draw();
      await sleep(90);
    }

    if (normalized === beacon.code) {
      completeCurrentGoal(`Signal accepted at ${beacon.label}`);
    } else {
      addLog(`Signal rejected. Expected ${beacon.code}.`, "error");
      abortRun = true;
      throw new Error(`Incorrect colour code at ${beacon.label}. Expected ${beacon.code}.`);
    }
    draw();
  });
}

const flashColourCode = flashColorCode;

function wait(seconds = 1) {
  return enqueueCommand(async () => {
    const safeSeconds = clampNumber(seconds, 0, 10, 1);
    addLog(`wait(${safeSeconds})`);
    await sleep(safeSeconds * 1000);
  });
}

function stop() {
  return enqueueCommand(() => {
    addLog("stop()");
  });
}

function say(message = "") {
  return enqueueCommand(() => {
    robot.message = String(message).slice(0, 28);
    addLog(`say("${robot.message}")`);
    draw();
  });
}

function convertPythonCondition(condition) {
  return condition
    .replace(/\band\b/g, "&&")
    .replace(/\bor\b/g, "||")
    .replace(/\bnot\b/g, "!")
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false");
}

function stripPythonComment(line) {
  let quote = "";
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const previous = line[index - 1];
    if ((char === '"' || char === "'") && previous !== "\\") {
      quote = quote === char ? "" : quote || char;
    }
    if (char === "#" && !quote) {
      return line.slice(0, index);
    }
  }
  return line;
}

function translatePythonCode(source) {
  const output = [];
  const stack = [];
  const lines = source.replace(/\t/g, "  ").split(/\r?\n/);

  function closeTo(indent) {
    while (stack.length && stack[stack.length - 1].indent >= indent) {
      output.push(" ".repeat(stack[stack.length - 1].indent) + "}");
      stack.pop();
    }
  }

  lines.forEach((rawLine, lineIndex) => {
    const indent = rawLine.match(/^ */)[0].length;
    const withoutComment = stripPythonComment(rawLine);
    const trimmed = withoutComment.trim();

    if (!trimmed) {
      output.push(rawLine.trim().startsWith("#") ? `${" ".repeat(indent)}//${rawLine.trim().slice(1)}` : "");
      return;
    }

    if (trimmed === "else:") {
      while (stack.length && stack[stack.length - 1].indent > indent) {
        output.push(" ".repeat(stack[stack.length - 1].indent) + "}");
        stack.pop();
      }
      if (!stack.length || stack[stack.length - 1].type !== "if" || stack[stack.length - 1].indent !== indent) {
        throw new Error(`Python line ${lineIndex + 1}: else must match an if at the same indentation.`);
      }
      stack.pop();
      output.push(`${" ".repeat(indent)}} else {`);
      stack.push({ indent, type: "else" });
      return;
    }

    closeTo(indent);

    const forMatch = trimmed.match(/^for\s+([A-Za-z_]\w*)\s+in\s+range\(([^)]*)\):$/);
    if (forMatch) {
      const variable = forMatch[1];
      const parts = forMatch[2].split(",").map((part) => part.trim()).filter(Boolean);
      const start = parts.length === 1 ? "0" : parts[0];
      const end = parts.length === 1 ? parts[0] : parts[1];
      output.push(`${" ".repeat(indent)}for (let ${variable} = ${start}; ${variable} < ${end}; ${variable} += 1) {`);
      stack.push({ indent, type: "for" });
      return;
    }

    const ifMatch = trimmed.match(/^if\s+(.+):$/);
    if (ifMatch) {
      output.push(`${" ".repeat(indent)}if (${convertPythonCondition(ifMatch[1])}) {`);
      stack.push({ indent, type: "if" });
      return;
    }

    const whileMatch = trimmed.match(/^while\s+(.+):$/);
    if (whileMatch) {
      output.push(`${" ".repeat(indent)}while (${convertPythonCondition(whileMatch[1])}) {`);
      stack.push({ indent, type: "while" });
      return;
    }

    if (trimmed.endsWith(":")) {
      throw new Error(`Python line ${lineIndex + 1}: I only understand for, if, else, and while blocks.`);
    }

    const statement = trimmed.endsWith(";") ? trimmed : `${trimmed};`;
    output.push(`${" ".repeat(indent)}${statement}`);
  });

  closeTo(-1);
  return output.join("\n");
}

function validateMissionConcepts(code) {
  if (currentMission.requiresLoop && !/\bfor\s+\w+\s+in\s+range\s*\(|\bwhile\s+.+:/.test(code)) {
    return "This rank practises loops. Keep it simple: use a loop like for step in range(1, 3):";
  }
  if (currentMission.requiresIfElse && !/\bif\s+[\s\S]*?:[\s\S]*\belse\s*:/.test(code)) {
    return "This rank practises branching. Add one if / else decision to choose between collect() and flash_colour_code().";
  }
  return "";
}

async function runStudentCode() {
  if (running) return;
  if (!selectedMentor) {
    addLog("Enter your name before starting the mission.", "error");
    mentorOverlay.classList.remove("hidden");
    return;
  }
  running = true;
  abortRun = false;
  runBtn.disabled = true;
  clearLog();
  resetRobot();
  commandQueue = Promise.resolve();
  updateMissionProgress();

  const conceptError = validateMissionConcepts(codeEditor.value);
  if (conceptError) {
    addLog(conceptError, "error");
    running = false;
    runBtn.disabled = false;
    updateMissionProgress();
    return;
  }

  const api = {
    roll,
    turn,
    setHeading,
    setColor,
    flashColorCode,
    flashColourCode,
    set_heading: setHeading,
    set_color: setColor,
    flash_color_code: flashColorCode,
    flash_colour_code: flashColorCode,
    collect,
    wait,
    stop,
    say,
  };

  try {
    const translatedCode = translatePythonCode(codeEditor.value);
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const studentProgram = new AsyncFunction(
      ...Object.keys(api),
      `"use strict";\n${translatedCode}`,
    );
    await studentProgram(...Object.values(api));
    await commandQueue;
    await sleep(missionCompleteDelay);
    if (!robot.crashed && robot.visited.size === currentMission.beacons.length) {
      savedMissionCode.set(currentMission.id, codeEditor.value);
      addLog("Mission complete. Nicely coded.", "success");
      completeMissionProgress();
    } else if (!robot.crashed && !abortRun) {
      addLog("Run finished. Some objectives are still waiting.");
    }
  } catch (error) {
    if (error.message !== "Run stopped") {
      addLog(error.message, "error");
    }
  } finally {
    running = false;
    runBtn.disabled = false;
    updateMissionProgress();
    draw();
  }
}

function stopRun() {
  abortRun = true;
  running = false;
  runBtn.disabled = false;
  addLog("Stopped by user.");
  updateMissionProgress();
}

function getStorageSnapshot() {
  return {
    studentName,
    completedMissions: [...completedMissions],
    savedMissionCode: Object.fromEntries(savedMissionCode),
    missionDrafts: Object.fromEntries(missionDrafts),
    unlockedHints: [...unlockedHints],
    awardedCertificates: [...awardedCertificates],
    lastMissionId,
  };
}

function persistProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getStorageSnapshot()));
}

function hydrateProgress() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    studentName = data.studentName || "";
    completedMissions.clear();
    (data.completedMissions || []).forEach((id) => completedMissions.add(id));
    savedMissionCode.clear();
    Object.entries(data.savedMissionCode || {}).forEach(([id, code]) => savedMissionCode.set(id, code));
    missionDrafts.clear();
    Object.entries(data.missionDrafts || {}).forEach(([id, code]) => missionDrafts.set(id, code));
    unlockedHints.clear();
    if (Array.isArray(data.unlockedHints) && data.unlockedHints.length) {
      data.unlockedHints.forEach((id) => unlockedHints.add(id));
    } else {
      missions.forEach((mission) => unlockedHints.add(mission.id));
    }
    awardedCertificates.clear();
    (data.awardedCertificates || []).forEach((rank) => awardedCertificates.add(rank));
    lastMissionId = data.lastMissionId || missions[0].id;
  } catch (error) {
    console.warn("Could not load saved progress", error);
  }
}

function updateStudentReadout() {
  mentorReadout.textContent = studentName
    ? `${studentName} is logged in on this computer. Completed missions stay saved locally.`
    : "";
}

function updateCompass() {
  if (!robot) return;
  const heading = ((Math.round(robot.heading) % 360) + 360) % 360;
  if (compassNeedle) compassNeedle.style.transform = `translate(-50%, -100%) rotate(${heading}deg)`;
  if (headingReadout) headingReadout.textContent = `Heading: ${heading}`;
}

function updateHintUI() {
  const unlocked = unlockedHints.has(currentMission.id) || completedMissions.has(currentMission.id);
  hintBtn.disabled = !unlocked;
  hintOutput.textContent = unlocked
    ? "Hint ready. Press Power Hint when you want help."
    : "Locked. Complete more missions to unlock this hint.";
}

function updateCertificateUI() {
  const rankIndex = currentMission.rankIndex;
  const allComplete = allRankMissionsComplete(rankIndex);
  const awarded = awardedCertificates.has(rankIndex);
  rankWordOutput.textContent = `${currentMission.rank}: ${completedMissionCount(rankIndex)} of 4 missions complete.`;
  rankGuessBtn.textContent = awarded ? "Download Again" : "Download Certificate";
  rankGuessBtn.disabled = !allComplete || !studentName;
  rankGuessOutput.textContent = !studentName
    ? "Enter your name to personalise certificates."
    : allComplete
      ? "Certificate unlocked for this rank."
      : "Complete all four missions in this rank to unlock the certificate.";
}

function drawCertificate(rankIndex) {
  const missionRank = missions.find((mission) => mission.rankIndex === rankIndex)?.rank || `Rank ${rankIndex + 1}`;
  const certCanvas = document.createElement("canvas");
  certCanvas.width = 1600;
  certCanvas.height = 1100;
  const certCtx = certCanvas.getContext("2d");

  const bg = certCtx.createLinearGradient(0, 0, certCanvas.width, certCanvas.height);
  bg.addColorStop(0, "#0b1220");
  bg.addColorStop(1, "#402515");
  certCtx.fillStyle = bg;
  certCtx.fillRect(0, 0, certCanvas.width, certCanvas.height);

  certCtx.strokeStyle = "#f7c948";
  certCtx.lineWidth = 16;
  certCtx.strokeRect(44, 44, certCanvas.width - 88, certCanvas.height - 88);
  certCtx.lineWidth = 4;
  certCtx.strokeStyle = "#6bd2ff";
  certCtx.strokeRect(78, 78, certCanvas.width - 156, certCanvas.height - 156);

  certCtx.fillStyle = "#eef8f2";
  certCtx.textAlign = "center";
  certCtx.font = "700 46px Georgia, serif";
  certCtx.fillText("Mars Rover Missions", certCanvas.width / 2, 180);
  certCtx.font = "700 78px Georgia, serif";
  certCtx.fillText("Certificate of Achievement", certCanvas.width / 2, 300);
  certCtx.font = "500 34px Inter, Arial, sans-serif";
  certCtx.fillText("This certifies that", certCanvas.width / 2, 420);
  certCtx.font = "700 72px Georgia, serif";
  certCtx.fillStyle = "#ffd0a8";
  certCtx.fillText(studentName, certCanvas.width / 2, 535);
  certCtx.fillStyle = "#eef8f2";
  certCtx.font = "500 34px Inter, Arial, sans-serif";
  certCtx.fillText("successfully completed all missions in", certCanvas.width / 2, 635);
  certCtx.font = "700 54px Georgia, serif";
  certCtx.fillText(missionRank, certCanvas.width / 2, 730);
  certCtx.font = "500 28px Inter, Arial, sans-serif";
  certCtx.fillText(`Awarded on ${new Date().toLocaleDateString("en-AU")}`, certCanvas.width / 2, 845);
  certCtx.fillText("Mars Mission Training Program", certCanvas.width / 2, 900);

  const link = document.createElement("a");
  link.href = certCanvas.toDataURL("image/png");
  link.download = `${studentName.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${missionRank.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-certificate.png`;
  link.click();
}

function downloadCurrentCertificate() {
  const rankIndex = currentMission.rankIndex;
  if (!studentName) {
    rankGuessOutput.textContent = "Enter your name before downloading a certificate.";
    mentorOverlay.classList.remove("hidden");
    return;
  }
  if (!allRankMissionsComplete(rankIndex)) {
    rankGuessOutput.textContent = "Complete all four missions in this rank before downloading the certificate.";
    return;
  }
  awardedCertificates.add(rankIndex);
  drawCertificate(rankIndex);
  updateCertificateUI();
  persistProgress();
  addLog(`Certificate downloaded for ${currentMission.rank}.`, "success");
}

function completeMissionProgress() {
  if (!completedMissions.has(currentMission.id)) {
    completedMissions.add(currentMission.id);
    refreshMissionOptionLabels();
    addLog(`Mission saved as complete: ${currentMission.name}`, "success");
  }
  missions.forEach((mission) => unlockedHints.add(mission.id));
  if (allRankMissionsComplete(currentMission.rankIndex) && !awardedCertificates.has(currentMission.rankIndex)) {
    addLog(`All missions complete for ${currentMission.rank}. Certificate unlocked.`, "success");
  }
  updateHintUI();
  updateCertificateUI();
  persistProgress();
}

function updateMissionProgress() {
  const goals = currentMission.beacons.length;
  scoreReadout.textContent = `${robot?.visited.size || 0} / ${goals} goals`;
  if (!robot) return;
  objectiveList.querySelectorAll("li").forEach((item) => {
    const complete = robot.visited.has(Number(item.dataset.index));
    const status = item.querySelector(".objective-status");
    item.classList.toggle("complete", complete);
    item.classList.toggle("pending", !complete);
    if (status) status.textContent = complete ? "★" : "○";
  });
  missionStatus.textContent = robot.crashed ? "Crashed" : robot.visited.size === goals ? "Mission complete" : running ? "Running" : "Ready";
}

async function runStudentCode() {
  if (running) return;
  if (!studentName) {
    addLog("Enter your name before starting the mission.", "error");
    mentorOverlay.classList.remove("hidden");
    return;
  }
  running = true;
  abortRun = false;
  runBtn.disabled = true;
  clearLog();
  resetRobot();
  commandQueue = Promise.resolve();
  updateMissionProgress();

  const conceptError = validateMissionConcepts(codeEditor.value);
  if (conceptError) {
    addLog(conceptError, "error");
    running = false;
    runBtn.disabled = false;
    updateMissionProgress();
    return;
  }

  const api = {
    roll,
    turn,
    setHeading,
    setColor,
    flashColorCode,
    flashColourCode,
    set_heading: setHeading,
    set_color: setColor,
    flash_color_code: flashColorCode,
    flash_colour_code: flashColorCode,
    collect,
    wait,
    stop,
    say,
  };

  try {
    const translatedCode = translatePythonCode(codeEditor.value);
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const studentProgram = new AsyncFunction(...Object.keys(api), `"use strict";\n${translatedCode}`);
    await studentProgram(...Object.values(api));
    await commandQueue;
    await sleep(missionCompleteDelay);
    if (!robot.crashed && robot.visited.size === currentMission.beacons.length) {
      savedMissionCode.set(currentMission.id, codeEditor.value);
      missionDrafts.set(currentMission.id, codeEditor.value);
      addLog("Mission complete. Nicely coded.", "success");
      completeMissionProgress();
    } else if (!robot.crashed && !abortRun) {
      addLog("Run finished. Some objectives are still waiting.");
      persistProgress();
    }
  } catch (error) {
    if (error.message !== "Run stopped") addLog(error.message, "error");
  } finally {
    running = false;
    runBtn.disabled = false;
    updateMissionProgress();
    draw();
  }
}

function saveStudentName() {
  const nextName = (studentNameInput?.value || "").trim();
  if (!nextName) {
    addLog("Please enter your name to begin.", "error");
    return;
  }
  studentName = nextName;
  mentorOverlay.classList.add("hidden");
  updateStudentReadout();
  updateCertificateUI();
  persistProgress();
  addLog(`${studentName} is ready to continue the Mars rover missions.`, "success");
}

function boot() {
  hydrateProgress();
  missions.forEach((mission) => unlockedHints.add(mission.id));
  populateMissions();
  refreshMissionOptionLabels();
  refreshMissionLocks();
  missionSelect.addEventListener("change", () => loadMission(missionSelect.value));
  runBtn.addEventListener("click", runStudentCode);
  stopBtn.addEventListener("click", stopRun);
  hintBtn.addEventListener("click", showHint);
  rankGuessBtn.addEventListener("click", downloadCurrentCertificate);
  document.querySelector("#saveNameBtn")?.addEventListener("click", saveStudentName);
  document.querySelector("#studentNameInput")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveStudentName();
  });
  codeEditor.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    event.preventDefault();
    const start = codeEditor.selectionStart;
    const end = codeEditor.selectionEnd;
    codeEditor.value = `${codeEditor.value.slice(0, start)}  ${codeEditor.value.slice(end)}`;
    codeEditor.selectionStart = start + 2;
    codeEditor.selectionEnd = start + 2;
  });
  codeEditor.addEventListener("input", () => {
    missionDrafts.set(currentMission.id, codeEditor.value);
    persistProgress();
  });
  resetBtn.addEventListener("click", () => {
    abortRun = true;
    resetRobot();
    addLog("Robot reset.");
  });
  resetCodeBtn.addEventListener("click", () => {
    codeEditor.value = currentMission.starter;
    missionDrafts.set(currentMission.id, codeEditor.value);
    persistProgress();
    addLog("Starter code restored.");
  });
  window.addEventListener("resize", () => {
    resizeCanvasForDisplay();
    draw();
  });

  resizeCanvasForDisplay();
  loadMission(lastMissionId);
  updateHintUI();
  updateStudentReadout();
  updateCertificateUI();
  if (studentName) {
    mentorOverlay.classList.add("hidden");
    if (studentNameInput) studentNameInput.value = studentName;
  } else {
    mentorOverlay.classList.remove("hidden");
  }
}

boot();
