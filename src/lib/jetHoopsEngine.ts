import {
  JET_HOOPS_BALL_DRIBBLE,
  JET_HOOPS_BALL_PASS,
  JET_HOOPS_BALL_RADIUS,
  JET_HOOPS_COURT_HEIGHT,
  JET_HOOPS_COURT_WIDTH,
  JET_HOOPS_JOG,
  JET_HOOPS_PLAYER_ACCEL,
  JET_HOOPS_PLAYER_RADIUS,
  JET_HOOPS_ROLE_OFFSETS,
  JET_HOOPS_ROSTER,
  JET_HOOPS_RUN,
  JET_HOOPS_SPRINT,
  type JetHoopsRole,
  type JetHoopsRosterEntry,
  type JetHoopsTeamId,
} from "../data/jetHoops";

export type JetHoopsPlayer = {
  slot: number;
  label: string;
  team: JetHoopsTeamId;
  role: JetHoopsRole;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
};

export type JetHoopsBall = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  possessedBy: number | null;
  passTimer: number;
};

export type JetHoopsSim = {
  players: JetHoopsPlayer[];
  ball: JetHoopsBall;
  offense: JetHoopsTeamId;
};

const COURT_PAD = 28;
const BASKET_BLUE = { x: COURT_PAD + 36, y: JET_HOOPS_COURT_HEIGHT / 2 };
const BASKET_RED = { x: JET_HOOPS_COURT_WIDTH - COURT_PAD - 36, y: JET_HOOPS_COURT_HEIGHT / 2 };

function teamBasket(team: JetHoopsTeamId): { x: number; y: number } {
  return team === "blue" ? BASKET_BLUE : BASKET_RED;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(bx - ax, by - ay);
}

function angleTo(ax: number, ay: number, bx: number, by: number): number {
  return (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
}

function accelerate(player: JetHoopsPlayer, tx: number, ty: number, maxSpeed: number, dt: number): void {
  const dvx = tx - player.vx;
  const dvy = ty - player.vy;
  const delta = Math.hypot(dvx, dvy);
  if (delta < 0.5) return;
  const step = Math.min(delta, JET_HOOPS_PLAYER_ACCEL * dt);
  player.vx += (dvx / delta) * step;
  player.vy += (dvy / delta) * step;
  const speed = Math.hypot(player.vx, player.vy);
  if (speed > maxSpeed) {
    player.vx = (player.vx / speed) * maxSpeed;
    player.vy = (player.vy / speed) * maxSpeed;
  }
}

function resolveWalls(body: { x: number; y: number; vx: number; vy: number; r: number }, restitution = 0.84): void {
  if (body.x - body.r < COURT_PAD) {
    body.x = COURT_PAD + body.r;
    body.vx = Math.abs(body.vx) * restitution;
  }
  if (body.x + body.r > JET_HOOPS_COURT_WIDTH - COURT_PAD) {
    body.x = JET_HOOPS_COURT_WIDTH - COURT_PAD - body.r;
    body.vx = -Math.abs(body.vx) * restitution;
  }
  if (body.y - body.r < COURT_PAD) {
    body.y = COURT_PAD + body.r;
    body.vy = Math.abs(body.vy) * restitution;
  }
  if (body.y + body.r > JET_HOOPS_COURT_HEIGHT - COURT_PAD) {
    body.y = JET_HOOPS_COURT_HEIGHT - COURT_PAD - body.r;
    body.vy = -Math.abs(body.vy) * restitution;
  }
}

function spawnPlayer(entry: JetHoopsRosterEntry): JetHoopsPlayer {
  const basket = teamBasket(entry.team);
  const offset = JET_HOOPS_ROLE_OFFSETS[entry.role];
  const attackSign = entry.team === "blue" ? 1 : -1;
  return {
    slot: entry.slot,
    label: entry.label,
    team: entry.team,
    role: entry.role,
    x: basket.x + offset.x * attackSign,
    y: basket.y + offset.y,
    vx: 0,
    vy: 0,
    angle: attackSign > 0 ? 0 : 180,
  };
}

export function createJetHoopsSim(): JetHoopsSim {
  const players = JET_HOOPS_ROSTER.map(spawnPlayer);
  const pgBlue = players.find((player) => player.team === "blue" && player.role === "pg");
  return {
    players,
    ball: {
      x: pgBlue?.x ?? JET_HOOPS_COURT_WIDTH * 0.35,
      y: pgBlue?.y ?? JET_HOOPS_COURT_HEIGHT / 2,
      vx: JET_HOOPS_BALL_DRIBBLE,
      vy: 0,
      possessedBy: pgBlue?.slot ?? null,
      passTimer: 1.8,
    },
    offense: "blue",
  };
}

function offensiveSpot(player: JetHoopsPlayer, ball: JetHoopsBall, players: JetHoopsPlayer[]): { x: number; y: number } {
  const handler = players.find((entry) => entry.slot === ball.possessedBy);
  const anchor = handler ?? { x: ball.x, y: ball.y };
  const attackSign = player.team === "blue" ? 1 : -1;
  const offset = JET_HOOPS_ROLE_OFFSETS[player.role];

  if (player.slot === ball.possessedBy) {
    return { x: anchor.x, y: anchor.y };
  }

  return {
    x: anchor.x + offset.x * attackSign * 0.72,
    y: anchor.y + offset.y * 0.85,
  };
}

function defensiveSpot(player: JetHoopsPlayer, ball: JetHoopsBall): { x: number; y: number } {
  const hoop = teamBasket(player.team);
  const towardBallX = ball.x + (hoop.x - ball.x) * 0.22;
  const towardBallY = ball.y + (hoop.y - ball.y) * 0.12;
  const offset = JET_HOOPS_ROLE_OFFSETS[player.role];
  const guardSign = player.team === "blue" ? 1 : -1;
  return {
    x: towardBallX + offset.x * guardSign * 0.18,
    y: towardBallY + offset.y * 0.22,
  };
}

function closestDefender(players: JetHoopsPlayer[], offense: JetHoopsTeamId, ball: JetHoopsBall): JetHoopsPlayer | undefined {
  const defenseTeam: JetHoopsTeamId = offense === "blue" ? "red" : "blue";
  return players
    .filter((player) => player.team === defenseTeam)
    .sort((a, b) => dist(a.x, a.y, ball.x, ball.y) - dist(b.x, b.y, ball.x, ball.y))[0];
}

function passToTeammate(sim: JetHoopsSim, rng: () => number): void {
  const { ball, players, offense } = sim;
  const teammates = players.filter((player) => player.team === offense && player.slot !== ball.possessedBy);
  if (teammates.length === 0 || ball.possessedBy == null) return;

  const target = teammates[Math.floor(rng() * teammates.length)];
  const dx = target.x - ball.x;
  const dy = target.y - ball.y;
  const len = Math.hypot(dx, dy) || 1;
  const speed = JET_HOOPS_BALL_PASS * (0.88 + rng() * 0.18);
  ball.vx = (dx / len) * speed;
  ball.vy = (dy / len) * speed;
  ball.possessedBy = null;
  ball.passTimer = 1.4 + rng() * 1.8;
}

export function stepJetHoopsSim(sim: JetHoopsSim, dt: number, rng: () => number): void {
  const { players, ball } = sim;
  const defenseTeam: JetHoopsTeamId = sim.offense === "blue" ? "red" : "blue";

  ball.passTimer -= dt;
  if (ball.possessedBy != null && ball.passTimer <= 0) {
    passToTeammate(sim, rng);
  }

  for (const player of players) {
    const onOffense = player.team === sim.offense;
    const spot = onOffense ? offensiveSpot(player, ball, players) : defensiveSpot(player, ball);
    const toBall = dist(player.x, player.y, ball.x, ball.y);
    const chaseBoost = !onOffense && toBall < 140 ? JET_HOOPS_SPRINT : onOffense ? JET_HOOPS_RUN : JET_HOOPS_JOG;
    const targetVx = spot.x - player.x;
    const targetVy = spot.y - player.y;
    const targetDist = Math.hypot(targetVx, targetVy) || 1;
    const desiredSpeed = clamp(chaseBoost * (0.75 + Math.min(targetDist, 180) / 220), JET_HOOPS_JOG, JET_HOOPS_SPRINT);
    accelerate(player, (targetVx / targetDist) * desiredSpeed, (targetVy / targetDist) * desiredSpeed, JET_HOOPS_SPRINT, dt);
    player.x += player.vx * dt;
    player.y += player.vy * dt;
    player.angle = angleTo(player.x, player.y, ball.x, ball.y);
    resolveWalls(player, 0.72);
  }

  if (ball.possessedBy != null) {
    const handler = players.find((player) => player.slot === ball.possessedBy);
    if (handler) {
      const dribbleOffset = handler.team === "blue" ? 14 : -14;
      ball.x = handler.x + dribbleOffset;
      ball.y = handler.y + 6;
      ball.vx = handler.vx * 0.92;
      ball.vy = handler.vy * 0.92;
    } else {
      ball.possessedBy = null;
    }
  } else {
    ball.vx *= 0.992;
    ball.vy *= 0.992;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    resolveWalls(ball, 0.86);

    let catcher: JetHoopsPlayer | undefined;
    for (const player of players) {
      if (dist(player.x, player.y, ball.x, ball.y) <= JET_HOOPS_PLAYER_RADIUS + JET_HOOPS_BALL_RADIUS + 2) {
        catcher = player;
        break;
      }
    }

    if (catcher) {
      ball.possessedBy = catcher.slot;
      sim.offense = catcher.team;
      ball.vx = catcher.vx;
      ball.vy = catcher.vy;
      ball.passTimer = 1.2 + rng() * 1.6;
    } else if (Math.hypot(ball.vx, ball.vy) < 70) {
      const recover = players
        .filter((player) => player.team === sim.offense)
        .sort((a, b) => dist(a.x, a.y, ball.x, ball.y) - dist(b.x, b.y, ball.x, ball.y))[0];
      if (recover && dist(recover.x, recover.y, ball.x, ball.y) < 120) {
        ball.possessedBy = recover.slot;
        ball.passTimer = 1.1 + rng() * 1.2;
      }
    }
  }

  const pressure = closestDefender(players, sim.offense, ball);
  if (pressure && ball.possessedBy != null && dist(pressure.x, pressure.y, ball.x, ball.y) < JET_HOOPS_PLAYER_RADIUS + 10) {
    if (rng() < 0.018) {
      ball.possessedBy = null;
      sim.offense = defenseTeam;
      ball.vx = (rng() - 0.5) * JET_HOOPS_BALL_PASS;
      ball.vy = (rng() - 0.5) * JET_HOOPS_BALL_PASS * 0.7;
      ball.passTimer = 0.8;
    }
  }
}
