import { Player } from "../../API/contexts/valorant";
import { nameToImage } from "../../assets/heros/heros";
import Weapon from "./../Weapon/Weapon";
import Avatar from "./Avatar";
import React from "react";

interface IProps {
  player: Player,
  //isObserved: boolean,
}
const PlayerEntry = ({ player }: IProps) => {

  const img = player.avatar || nameToImage[player.agent];
  return (
    <div className={`player ${player.state.health === 0 ? "dead" : ""} `}>
      <div className="hero-container">
        {img ? <img src={img} className={`${img === nameToImage[player.agent] ? 'hero-img' : ''}`}/> : null}
      </div>
      <div className="player-data">

        <div className="player-name-container">
          <div className="player-name">{player.username}</div>
          <div className="player-health">{player.state.health || null}</div>
        </div>

        <div className="player-hp-container">
          <div className={`player-hp ${player.team.side}`} style={{ width: `${player.state.health}%` }}></div>
        </div>


        <div className="weapon-and-credits">
          {player.weapon ? <Weapon weapon={player.weapon} /> : null }
          <div className="player-credits">{player.credits}</div>
        </div>
      </div>


    </div>
  );
}

export default React.memo(PlayerEntry);
//export default Player;
