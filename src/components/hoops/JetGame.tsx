import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  JET_HOOPS_BALL_RADIUS,
  JET_HOOPS_COURT_HEIGHT,
  JET_HOOPS_COURT_WIDTH,
  JET_HOOPS_ROSTER,
  JET_HOOPS_TEAM_STYLES,
  getJetHoopsSpritePath,
  type JetHoopsRosterEntry,
  type JetHoopsTeamId,
} from "../../data/jetHoops";
import { createJetHoopsSim } from "../../lib/jetHoopsEngine";
import JetHoopsBall from "./JetHoopsBall";
import JetHoopsCourtSvg from "./JetHoopsCourtSvg";

const PLAYER_SIZE = 44;
const INITIAL_BALL_SLOT = 0;

export type JetGameState = {
  playerWithBall: number;
  selectedPlayer: number | null;
};

type PlayerPosition = {
  x: number;
  y: number;
};

type PassFlight = {
  id: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  toSlot: number;
  duration: number;
};

function teamForSlot(slot: number): JetHoopsTeamId | undefined {
  return JET_HOOPS_ROSTER.find((entry) => entry.slot === slot)?.team;
}

function ballAtPlayer(pos: PlayerPosition, team: JetHoopsTeamId): PlayerPosition {
  const sign = team === "blue" ? 1 : -1;
  return { x: pos.x + sign * 14, y: pos.y + 6 };
}

function passDuration(from: PlayerPosition, to: PlayerPosition): number {
  const dist = Math.hypot(to.x - from.x, to.y - from.y);
  return Math.min(0.72, Math.max(0.38, dist / 520));
}

type JetPlayerProps = {
  entry: JetHoopsRosterEntry;
  position: PlayerPosition;
  isSelected: boolean;
  hasBall: boolean;
  disabled: boolean;
  onSelect: (slot: number) => void;
};

function JetPlayer({ entry, position, isSelected, hasBall, disabled, onSelect }: JetPlayerProps) {
  const teamStyle = JET_HOOPS_TEAM_STYLES[entry.team];
  const angle = entry.team === "blue" ? 0 : 180;

  return (
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
      animate={{ x: position.x, y: position.y, rotate: angle }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      style={{
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        marginLeft: -PLAYER_SIZE / 2,
        marginTop: -PLAYER_SIZE / 2,
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
  );
}

/** Interactive turn-based Jet Hoops — click to select, click teammate to pass. */
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
  const [passFlight, setPassFlight] = useState<PassFlight | null>(null);
  const [passSeq, setPassSeq] = useState(0);

  const holderTeam = teamForSlot(gameState.playerWithBall) ?? "blue";
  const holderPos = positions.get(gameState.playerWithBall);
  const idleBallPos =
    holderPos != null ? ballAtPlayer(holderPos, holderTeam) : { x: JET_HOOPS_COURT_WIDTH / 2, y: JET_HOOPS_COURT_HEIGHT / 2 };

  const handleSelectJet = useCallback(
    (slot: number) => {
      if (passFlight) return;

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

        setPassFlight({
          id: passSeq,
          fromX: fromBall.x,
          fromY: fromBall.y,
          toX: toBall.x,
          toY: toBall.y,
          toSlot: slot,
          duration: passDuration(fromBall, toBall),
        });
        setPassSeq((value) => value + 1);
        setGameState((prev) => ({ ...prev, selectedPlayer: slot }));
        return;
      }

      setGameState((prev) => ({ ...prev, selectedPlayer: slot }));
    },
    [gameState.playerWithBall, gameState.selectedPlayer, passFlight, passSeq, positions],
  );

  const completePass = useCallback(() => {
    if (!passFlight) return;
    setGameState({
      playerWithBall: passFlight.toSlot,
      selectedPlayer: passFlight.toSlot,
    });
    setPassFlight(null);
  }, [passFlight]);

  const holderEntry = JET_HOOPS_ROSTER.find((entry) => entry.slot === gameState.playerWithBall);
  const selectedEntry = gameState.selectedPlayer != null
    ? JET_HOOPS_ROSTER.find((entry) => entry.slot === gameState.selectedPlayer)
    : undefined;

  return (
    <div className="jet-hoops__game">
      <div
        className="jet-hoops__arena"
        style={{
          width: JET_HOOPS_COURT_WIDTH,
          height: JET_HOOPS_COURT_HEIGHT,
        }}
      >
        <JetHoopsCourtSvg />

        <div className="jet-hoops__layer jet-hoops__layer--interactive">
          {JET_HOOPS_ROSTER.map((entry) => {
            const position = positions.get(entry.slot);
            if (!position) return null;
            return (
              <JetPlayer
                key={entry.slot}
                entry={entry}
                position={position}
                isSelected={gameState.selectedPlayer === entry.slot}
                hasBall={gameState.playerWithBall === entry.slot && passFlight == null}
                disabled={passFlight != null}
                onSelect={handleSelectJet}
              />
            );
          })}

          {passFlight ? (
            <JetHoopsBall
              key={passFlight.id}
              mode="pass"
              fromX={passFlight.fromX}
              fromY={passFlight.fromY}
              toX={passFlight.toX}
              toY={passFlight.toY}
              duration={passFlight.duration}
              onPassComplete={completePass}
            />
          ) : (
            <JetHoopsBall mode="idle" x={idleBallPos.x} y={idleBallPos.y} />
          )}
        </div>
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
          <span className="jet-hoops__hud-pill">Tap a jet to select · tap a teammate to pass</span>
        )}
      </p>
    </div>
  );
}
