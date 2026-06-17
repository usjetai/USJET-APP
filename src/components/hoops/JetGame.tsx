import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  JET_HOOPS_COURT_HEIGHT,
  JET_HOOPS_COURT_WIDTH,
  JET_HOOPS_ROSTER,
  JET_HOOPS_TEAM_STYLES,
  getJetHoopsSpritePath,
  type JetHoopsRosterEntry,
  type JetHoopsTeamId,
} from "../../data/jetHoops";
import {
  nbaCourtMidY,
  nbaLeftRimX,
  nbaRightRimX,
} from "../../data/jetHoopsCourtGeometry";
import { createJetHoopsSim } from "../../lib/jetHoopsEngine";
import { jetHoopsSounds } from "../../lib/jetHoopsSounds";
import JetHoopsBall, { type JetHoopsBallFlight } from "./JetHoopsBall";
import JetHoopsCourtSvg from "./JetHoopsCourtSvg";
import JetHoopsScoreboard from "./JetHoopsScoreboard";

const PLAYER_SIZE = 44;
const INITIAL_BALL_SLOT = 0;
const GAME_DURATION_SEC = 60;
const POINTS_PER_BASKET = 2;
const SCORE_ZONE_RADIUS = 34;
const SHOT_MAKE_CHANCE = 0.78;

export type JetGameState = {
  playerWithBall: number;
  selectedPlayer: number | null;
};

type PlayerPosition = { x: number; y: number };

type RimTarget = {
  team: JetHoopsTeamId;
  x: number;
  y: number;
};

function teamForSlot(slot: number): JetHoopsTeamId | undefined {
  return JET_HOOPS_ROSTER.find((entry) => entry.slot === slot)?.team;
}

function pgSlotForTeam(team: JetHoopsTeamId): number {
  return JET_HOOPS_ROSTER.find((entry) => entry.team === team && entry.role === "pg")?.slot ?? INITIAL_BALL_SLOT;
}

function ballAtPlayer(pos: PlayerPosition, team: JetHoopsTeamId): PlayerPosition {
  const sign = team === "blue" ? 1 : -1;
  return { x: pos.x + sign * 14, y: pos.y + 6 };
}

function attackRimForTeam(team: JetHoopsTeamId): RimTarget {
  const y = nbaCourtMidY();
  return team === "blue"
    ? { team: "blue", x: nbaRightRimX(), y }
    : { team: "red", x: nbaLeftRimX(), y };
}

function flightDuration(from: PlayerPosition, to: PlayerPosition, kind: "pass" | "shot"): number {
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  const base = kind === "shot" ? 520 : 480;
  return Math.min(0.82, Math.max(0.4, dist / base));
}

function isInScoreZone(x: number, y: number, rim: RimTarget): boolean {
  return Math.hypot(x - rim.x, y - rim.y) <= SCORE_ZONE_RADIUS;
}

type JetPlayerProps = {
  entry: JetHoopsRosterEntry;
  position: PlayerPosition;
  isSelected: boolean;
  hasBall: boolean;
  disabled: boolean;
  bobPhase: number;
  onSelect: (slot: number) => void;
};

function JetPlayer({
  entry,
  position,
  isSelected,
  hasBall,
  disabled,
  bobPhase,
  onSelect,
}: JetPlayerProps) {
  const reduceMotion = useReducedMotion();
  const teamStyle = JET_HOOPS_TEAM_STYLES[entry.team];
  const angle = entry.team === "blue" ? 0 : 180;
  const bobDuration = 1.55 + bobPhase * 0.12;

  return (
    <motion.div
      className="jet-hoops__player-wrap"
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
    >
      <span className="jet-hoops__player-shadow" aria-hidden />

      <motion.div
        className="jet-hoops__player-bob"
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { repeat: Infinity, duration: bobDuration, ease: "easeInOut", delay: bobPhase * 0.08 }
        }
      >
        <motion.button
          type="button"
          className={[
            "jet-hoops__player",
            "jet-hoops__player--selectable",
            isSelected ? "jet-hoops__player--selected" : "",
            hasBall ? "jet-hoops__player--with-ball" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{
            width: PLAYER_SIZE,
            height: PLAYER_SIZE,
            rotate: angle,
            ["--jet-hoops-ring" as string]: teamStyle.ring,
            ["--jet-hoops-glow" as string]: teamStyle.glow,
            ["--jet-hoops-badge" as string]: teamStyle.badge,
          }}
          disabled={disabled}
          aria-pressed={isSelected}
          aria-label={`${entry.label} · ${entry.role.toUpperCase()}${hasBall ? " · has ball" : ""}${isSelected ? " · selected" : ""}`}
          onClick={() => onSelect(entry.slot)}
          whileTap={{ scale: disabled ? 1 : 0.94 }}
        >
          <img
            className="jet-hoops__player-sprite"
            src={getJetHoopsSpritePath(entry.slot)}
            alt=""
            width={PLAYER_SIZE}
            height={PLAYER_SIZE}
            draggable={false}
          />
          <span className="jet-hoops__player-tag">{entry.role.toUpperCase()}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/** Interactive Jet Hoops — click-to-pass, rim shots, scoreboard, and timer. */
export default function JetGame() {
  const positions = useMemo(() => {
    const sim = createJetHoopsSim();
    return new Map<number, PlayerPosition>(
      sim.players.map((player) => [player.slot, { x: player.x, y: player.y }]),
    );
  }, []);

  const [gameState, setGameState] = useState<JetGameState>({
    playerWithBall: INITIAL_BALL_SLOT,
    selectedPlayer: null,
  });
  const [scores, setScores] = useState({ blue: 0, red: 0 });
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION_SEC);
  const [gameOver, setGameOver] = useState(false);
  const [lastScorer, setLastScorer] = useState<JetHoopsTeamId | null>(null);
  const [ballFlight, setBallFlight] = useState<JetHoopsBallFlight | null>(null);
  const [passSeq, setPassSeq] = useState(0);
  const scoreFlashRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const holderTeam = teamForSlot(gameState.playerWithBall) ?? "blue";
  const holderPos = positions.get(gameState.playerWithBall);
  const idleBallPos =
    holderPos != null
      ? ballAtPlayer(holderPos, holderTeam)
      : { x: JET_HOOPS_COURT_WIDTH / 2, y: JET_HOOPS_COURT_HEIGHT / 2 };

  const attackRim = attackRimForTeam(holderTeam);
  const canShoot = !gameOver && ballFlight == null;

  useEffect(() => {
    if (gameOver || ballFlight) return undefined;
    const tick = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          setGameOver(true);
          jetHoopsSounds.onBuzzer();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(tick);
  }, [gameOver, ballFlight]);

  useEffect(() => {
    return () => {
      if (scoreFlashRef.current) clearTimeout(scoreFlashRef.current);
    };
  }, []);

  const beginFlight = useCallback((flight: Omit<JetHoopsBallFlight, "id">) => {
    setBallFlight({ ...flight, id: passSeq });
    setPassSeq((value) => value + 1);
    if (flight.kind === "pass") {
      jetHoopsSounds.onPass();
    }
  }, [passSeq]);

  const resetPossession = useCallback((team: JetHoopsTeamId) => {
    const pg = pgSlotForTeam(team);
    setGameState({ playerWithBall: pg, selectedPlayer: pg });
  }, []);

  const registerScore = useCallback(
    (team: JetHoopsTeamId) => {
      setScores((prev) => ({
        ...prev,
        [team]: prev[team] + POINTS_PER_BASKET,
      }));
      setLastScorer(team);
      jetHoopsSounds.onScore();
      jetHoopsSounds.onWhistle();

      if (scoreFlashRef.current) clearTimeout(scoreFlashRef.current);
      scoreFlashRef.current = setTimeout(() => setLastScorer(null), 1600);

      const inbound = team === "blue" ? "red" : "blue";
      resetPossession(inbound);
    },
    [resetPossession],
  );

  const completeFlight = useCallback(() => {
    if (!ballFlight) return;

    if (ballFlight.kind === "pass" && ballFlight.toSlot != null) {
      setGameState({
        playerWithBall: ballFlight.toSlot,
        selectedPlayer: ballFlight.toSlot,
      });
    }

    if (ballFlight.kind === "shot") {
      const shootingTeam = holderTeam;
      const rim = attackRimForTeam(shootingTeam);
      const made = isInScoreZone(ballFlight.toX, ballFlight.toY, rim) && Math.random() < SHOT_MAKE_CHANCE;
      if (made) {
        registerScore(shootingTeam);
      } else {
        jetHoopsSounds.onWhistle();
        const defense = shootingTeam === "blue" ? "red" : "blue";
        resetPossession(defense);
      }
    }

    setBallFlight(null);
  }, [ballFlight, holderTeam, registerScore, resetPossession]);

  const handleSelectJet = useCallback(
    (slot: number) => {
      if (ballFlight || gameOver) return;

      const clickedTeam = teamForSlot(slot);
      const ballTeam = teamForSlot(gameState.playerWithBall);
      if (!clickedTeam || !ballTeam) return;

      if (gameState.selectedPlayer === slot) {
        setGameState((prev) => ({ ...prev, selectedPlayer: null }));
        return;
      }

      if (gameState.selectedPlayer != null && slot !== gameState.selectedPlayer) {
        if (clickedTeam !== ballTeam || slot === gameState.playerWithBall) {
          setGameState((prev) => ({ ...prev, selectedPlayer: slot }));
          return;
        }

        const fromPos = positions.get(gameState.playerWithBall);
        const toPos = positions.get(slot);
        if (!fromPos || !toPos) return;

        const fromBall = ballAtPlayer(fromPos, ballTeam);
        const toBall = ballAtPlayer(toPos, ballTeam);

        beginFlight({
          kind: "pass",
          fromX: fromBall.x,
          fromY: fromBall.y,
          toX: toBall.x,
          toY: toBall.y,
          duration: flightDuration(fromBall, toBall, "pass"),
          toSlot: slot,
        });
        setGameState((prev) => ({ ...prev, selectedPlayer: slot }));
        return;
      }

      setGameState((prev) => ({ ...prev, selectedPlayer: slot }));
    },
    [ballFlight, beginFlight, gameOver, gameState.playerWithBall, gameState.selectedPlayer, positions],
  );

  const handleShoot = useCallback(() => {
    if (!canShoot || !holderPos) return;

    const fromBall = ballAtPlayer(holderPos, holderTeam);
    const rim = attackRim;

    beginFlight({
      kind: "shot",
      fromX: fromBall.x,
      fromY: fromBall.y,
      toX: rim.x,
      toY: rim.y,
      duration: flightDuration(fromBall, { x: rim.x, y: rim.y }, "shot"),
    });
    setGameState((prev) => ({ ...prev, selectedPlayer: null }));
  }, [attackRim, beginFlight, canShoot, holderPos, holderTeam]);

  const holderEntry = JET_HOOPS_ROSTER.find((entry) => entry.slot === gameState.playerWithBall);
  const selectedEntry =
    gameState.selectedPlayer != null
      ? JET_HOOPS_ROSTER.find((entry) => entry.slot === gameState.selectedPlayer)
      : undefined;

  return (
    <div className="jet-hoops__game">
      <JetHoopsScoreboard
        blueScore={scores.blue}
        redScore={scores.red}
        secondsLeft={secondsLeft}
        gameOver={gameOver}
        lastScorer={lastScorer}
      />

      <div
        className="jet-hoops__arena"
        style={{ width: JET_HOOPS_COURT_WIDTH, height: JET_HOOPS_COURT_HEIGHT }}
      >
        <JetHoopsCourtSvg />

        <div className="jet-hoops__layer jet-hoops__layer--interactive">
          {JET_HOOPS_ROSTER.map((entry, index) => {
            const position = positions.get(entry.slot);
            if (!position) return null;
            return (
              <JetPlayer
                key={entry.slot}
                entry={entry}
                position={position}
                isSelected={gameState.selectedPlayer === entry.slot}
                hasBall={gameState.playerWithBall === entry.slot && ballFlight == null}
                disabled={ballFlight != null || gameOver}
                bobPhase={index}
                onSelect={handleSelectJet}
              />
            );
          })}

          {canShoot ? (
            <button
              type="button"
              className="jet-hoops__rim-zone"
              style={{
                left: attackRim.x - SCORE_ZONE_RADIUS,
                top: attackRim.y - SCORE_ZONE_RADIUS,
                width: SCORE_ZONE_RADIUS * 2,
                height: SCORE_ZONE_RADIUS * 2,
              }}
              aria-label={`Shoot at ${holderTeam} attack rim`}
              onClick={handleShoot}
            />
          ) : null}

          {ballFlight ? (
            <JetHoopsBall mode="flight" flight={ballFlight} onComplete={completeFlight} />
          ) : (
            <JetHoopsBall mode="idle" x={idleBallPos.x} y={idleBallPos.y} bob />
          )}
        </div>

        {gameOver ? (
          <div className="jet-hoops__game-over" role="status">
            <p className="jet-hoops__game-over-title">Buzzer</p>
            <p className="jet-hoops__game-over-copy">
              {scores.blue === scores.red
                ? "Tie game — run it back."
                : scores.blue > scores.red
                  ? "Blue Fleet takes the hangar."
                  : "Red Fleet takes the hangar."}
            </p>
          </div>
        ) : null}
      </div>

      <p className="jet-hoops__hud" aria-live="polite">
        <span className="jet-hoops__hud-pill jet-hoops__hud-pill--ball">
          Ball · {holderEntry?.label ?? "—"}
        </span>
        {selectedEntry ? (
          <span className="jet-hoops__hud-pill jet-hoops__hud-pill--selected">
            Selected · {selectedEntry.label}
          </span>
        ) : (
          <span className="jet-hoops__hud-pill">
            Pass · select jet then teammate · Shoot · tap attack rim
          </span>
        )}
      </p>
    </div>
  );
}
