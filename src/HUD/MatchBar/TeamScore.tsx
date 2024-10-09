import TeamLogo from './TeamLogo';
import PlantDefuse from "../Timers/PlantDefuse"
import { useState } from "react";
import { Team } from '../../API/contexts/valorant';




interface IProps {
  orientation: "left" | "right";
  team: Team;
  bo: number
}

const TeamScore = ({orientation, team, bo }: IProps) => {
    const toWin = Math.floor((bo+1)/2)
    const scr = new Array(toWin).fill(0).map((_, i) => i+1);

    return (
      <div className={`team-container ${orientation}`}>
        <div className={`logo-container ${!team.logo ? 'no-logo': ''}  ${team.side}`}>
          {team.logo && <img src={team.logo} alt="Team logo" />}
        </div>
        <div className="team-name">
          {team.name ?? team.side}
        </div>
        <div className={`series-container ${team.side}`}>
          {
            bo <= 1 ? null : scr.map(s => (
              <div className={`series-box ${s <= team.series ? 'win':''}`} />
            ))
          }
        </div>
        <div className={`score-container `}>
          {team.score}
        </div>
      </div>
    );
}

export default TeamScore;