import TeamBox from "./../Players/TeamBox";
import MatchBar from "../MatchBar/MatchBar";
import { Match } from "../../API/types";
import { Valorant, Player, Team } from "../../API/contexts/valorant";
import { Scoreboard } from "../Scoreboard";

interface Props {
  game: Valorant,
  match: Match | null
}


const Layout = ({game,match}: Props) => {



  // const left = game.map.team_ct.orientation === "left" ? game.map.team_ct : game.map.team_t;
  // const right = game.map.team_ct.orientation === "left" ? game.map.team_t : game.map.team_ct;

  // const leftPlayers = game.players.filter(player => player.team.side === left.side);
  // const rightPlayers = game.players.filter(player => player.team.side === right.side);
  // const isFreezetime = (game.round && game.round.phase === "freezetime") || game.phase_countdowns.phase === "freezetime";
  const round = game.left.score + game.right.score + 1;
  return (
    <div className="layout">
      <Scoreboard left={game.left} right={game.right} />
      <MatchBar spikeState={game.spikeState} time={game.timer} left={game.left} right={game.right} maxRounds={24} currentRound={round}  match={match} />


      <TeamBox players={game.left.players} orientation="left"  />
      <TeamBox players={game.right.players} orientation="right" />

    </div>
  );
}
export default Layout;
