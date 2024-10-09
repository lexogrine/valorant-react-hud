import "./matchbar.scss";
import TeamScore from "./TeamScore";
import Bomb from "./../Timers/BombTimer";
import { useBombTimer } from "./../Timers/Countdown";
import { Match } from './../../API/types';


function stringToClock(time: string | number, pad = true) {
  if (typeof time === "string") {
    time = parseFloat(time);
  }
  const countdown = Math.abs(Math.ceil(time));
  const minutes = Math.floor(countdown / 60);
  const seconds = countdown - minutes * 60;
  if (pad && seconds < 10) {
    return `${minutes}:0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

type Team = {
  name: string,
  score: number,
  series: number,
  side: "ATTACKER" | "DEFENDER",
  logo?: string
}

interface IProps {
  match: Match | null;

  maxRounds: number;
  currentRound: number;
  time: number;

  left: Team;
  right: Team;
}

const getRoundLabel = (mapRound: number) => {
  const round = mapRound + 1;
  if (round <= 24) {
    return `Round ${round}/24`;
  }
  const additionalRounds = round - 24;
  const OT = Math.ceil(additionalRounds/6);
  return `OT ${OT} (${additionalRounds - (OT - 1)*6}/6)`;
}

const Matchbar = (props: IProps) => {
    const {match, left, right, maxRounds,  currentRound, time } = props;
    //const time = stringToClock(phase.phase_ends_in);
    //const isPlanted = bomb && (bomb.state === "defusing" || bomb.state === "planted");
    const bo = (match && Number(match.matchType.substr(-1))) || 0;

    //const bombData = useBombTimer();
    //const plantTimer: Timer | null = bombData.state === "planting" ? { time:bombData.plantTime, active: true, side: bombData.player?.team.orientation || "right", player: bombData.player, type: "planting"} : null;
    //const defuseTimer: Timer | null = bombData.state === "defusing" ? { time:bombData.defuseTime, active: true, side: bombData.player?.team.orientation || "left", player: bombData.player, type: "defusing"} : null;

    return (
      <>
        <div id={`matchbar`}>
          <TeamScore team={left} orientation={"left"} />
          <div id="timer" className={bo === 0 ? 'no-bo' : ''}>
          </div>
          <TeamScore team={right} orientation={"right"} />
        </div>
      </>
    );
}

export default Matchbar;
