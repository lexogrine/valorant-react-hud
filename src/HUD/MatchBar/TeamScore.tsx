import TeamLogo from './TeamLogo';
import PlantDefuse from "../Timers/PlantDefuse"
import WinAnnouncement from "./WinIndicator";
import { useState } from "react";


export type Team = {
  name: string,
  score: number,
  series: number,
  side: "ATTACKER" | "DEFENDER",
  logo?: string
}


interface IProps {
  orientation: "left" | "right";
  team: Team;
}

const TeamScore = ({orientation, team }: IProps) => {


    return (
      <div className={`team-container ${orientation} ${team.side}`}>
        <div className="logo-container">
          {team.logo && <img src={team.logo} alt="Team logo" />}
        </div>
        <div className="team-name">
          {team.name ?? team.side}
        </div>
        <div className="series-container">

        </div>
        <div className="score-container">
          {team.score}
        </div>
      </div>
    );
}

export default TeamScore;