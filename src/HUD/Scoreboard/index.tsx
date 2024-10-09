/// <reference types="vite-plugin-svgr/client" />
import { useAction, useConfig } from "../../API/contexts/actions"
import { Player, Team } from "../../API/contexts/valorant";
import { nameToImage } from "../../assets/heros/heros";
import "./scoreboard.scss";
import Credits from './credits.svg?react';
import Weapon from "../Weapon/Weapon";
import { useEffect, useState } from "react";

const ScoreboardPlayer = ({ player }: { player: Player }) => {
    const img = player.avatar || nameToImage[player.agent];
    return (
        <div className={`player-entry ${player.team.side}`}>
            <div className={`player-bg ${player.team.side}`}></div>
        {img ? <img src={img} className={`player-img`}/> : null}
            <div className="username-cell">{player.username}</div>
            <div className="kda-container">
                <div className="cellkda">{player.state.kills}</div>
                <div className="cellkda">{player.state.deaths}</div>
                <div className="cellkda">{player.state.assists}</div>
            </div>
            <div className="ultimate-container">
                ULTIMATE
            </div>
            <div className="weapon-container">
                <Weapon weapon={player.weapon} />
            </div>
            <div className="credits-container"><Credits/>{player.credits}</div>
        </div>
    )
}

const ScoreboardTeam = ({ team }: { team: Team}) => {
    if(!team) return null;
    return <div className={`scoreboard-team ${team.orientation}`}>
        <div className={`team-name-container ${team.side} ${team.orientation}`}>
            {
               team.logo ? <img src={team.logo} className="team-logo" /> : null
            }
            <div className="team-name">{team.shortName || team.name}</div>
            <div className="team-score">{team.score}</div>

        </div>
        <div className={`player-table ${team.orientation}`}>
            <div className="header">
                <div className="username-cell">Players</div>
                <div className="kda-container">
                    <div className="cellkda">K</div>
                    <div className="cellkda">D</div>
                    <div className="cellkda">A</div>
                </div>
                <div className="ultimate-container">Ultimate</div>
                <div className="weapon-container">Loadout</div>
                <div className="credits-container">Creeds</div>
            </div>
            {
                team.players.map(player => (
                    <ScoreboardPlayer player={player} />
                ))
            }
        </div>
    </div>
}

export const Scoreboard = ({ left, right }: { left: Team, right: Team}) => {
    const [ show, setShow ] = useState(false);
    const config = useConfig("display_settings");
    useEffect(() => {
        setShow(config?.view_type === "scoreboard");
    },[config?.view_type]);

    useAction("toggleScoreboard", () => {
        setShow(p => !p);
    }, []);

    return <div className={`scoreboard ${show ? 'show':''}`}>
        <ScoreboardTeam team={left} />
        <ScoreboardTeam team={right} />
    </div> 
}