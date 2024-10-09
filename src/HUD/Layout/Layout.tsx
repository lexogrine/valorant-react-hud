import { useState } from "react";
import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import Observed from "./../Players/Observed";
import { Match } from "../../API/types";
import { useAction } from "../../API/contexts/actions";
import { Valorant } from "../../API/contexts/valorant";
import { Team } from "../MatchBar/TeamScore";

interface Props {
  game: Valorant,
  match: Match | null
}


const Layout = ({game,match}: Props) => {
  const [ forceHide, setForceHide ] = useState(false);

  useAction('boxesState', (state) => {
    if (state === "show") {
       setForceHide(false);
    } else if (state === "hide") {
      setForceHide(true);
    }
  });

  // const left = game.map.team_ct.orientation === "left" ? game.map.team_ct : game.map.team_t;
  // const right = game.map.team_ct.orientation === "left" ? game.map.team_t : game.map.team_ct;

  // const leftPlayers = game.players.filter(player => player.team.side === left.side);
  // const rightPlayers = game.players.filter(player => player.team.side === right.side);
  // const isFreezetime = (game.round && game.round.phase === "freezetime") || game.phase_countdowns.phase === "freezetime";
  const left: Team = {
    name: "Ts",
    side: "ATTACKER",
    score: 5,
    series: 1
  }
  const right: Team = {
    name: "CTs",
    side: "DEFENDER",
    score: 3,
    series: 0
  }
  return (
    <div className="layout">

      <MatchBar time={30} left={left} right={right} maxRounds={13} currentRound={9}  match={match} />


      <TeamBox team={left} players={leftPlayers} side="left" current={game.player} />
      <TeamBox team={right} players={rightPlayers} side="right" current={game.player} />

    </div>
  );
}
export default Layout;
