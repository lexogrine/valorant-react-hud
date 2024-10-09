import { Player } from '../../API/contexts/valorant';
import PlayerBox from './Player'
import './players.scss';

interface Props {
  players: Player[],
  //team: I.Team,
  orientation: 'right' | 'left',
  //current: I.Player | null,
}
const TeamBox = ({players, orientation }: Props) => {
  return (
    <div className={`teambox  ${orientation}`}>
      {players.map(player => <PlayerBox
        key={player.defaultName}
        player={player}
      />)}
    </div>
  );
}
export default TeamBox;