import "./matchbar.scss";
import TeamScore from "./TeamScore";
import { Match } from './../../API/types';
import { Team, Valorant } from "../../API/contexts/valorant";


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

interface IProps {
  match: Match | null;

  maxRounds: number;
  currentRound: number;
  time: number | null

  left: Team;
  right: Team;
  spikeState: Valorant["spikeState"]
}


const Matchbar = (props: IProps) => {
    const {match, left, right, spikeState, maxRounds,  currentRound, time } = props;
    //const time = stringToClock(phase.phase_ends_in);
    //const isPlanted = bomb && (bomb.state === "defusing" || bomb.state === "planted");
    const bo = (match && Number(match.matchType.substr(-1))) || 1;

    //const bombData = useBombTimer();
    //const plantTimer: Timer | null = bombData.state === "planting" ? { time:bombData.plantTime, active: true, side: bombData.player?.team.orientation || "right", player: bombData.player, type: "planting"} : null;
    //const defuseTimer: Timer | null = bombData.state === "defusing" ? { time:bombData.defuseTime, active: true, side: bombData.player?.team.orientation || "left", player: bombData.player, type: "defusing"} : null;

    return (
        <div id={`matchbar`}>
          <TeamScore team={left} orientation={"left"} bo={bo} />
          <div id="timer" className={bo === 0 ? 'no-bo' : ''}>
            {
              time && spikeState !== "planted" ? (
                <>
                  <div className="time">{stringToClock(time)}</div>
                  <div className="round">{currentRound > maxRounds ? 'Overtime' : `Round ${currentRound}/${maxRounds}`}</div>
                </>
              ) : null
            }
          </div>
          <TeamScore team={right} orientation={"right"} bo={bo} />
        </div>
    );
}

export default Matchbar;
