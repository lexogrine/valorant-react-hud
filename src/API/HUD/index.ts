
import api, { isDev } from '..';
import { PlayerExtension, VALOGSI } from '../contexts/gsi';
import { Player } from '../contexts/valorant';

export const hudIdentity = {
	name: '',
	isDev
};

export const GSI = new VALOGSI();

GSI.regulationMR = 12;

GSI.on("data", data => {
    loadPlayers([...data.left.players, ...data.right.players]);
});

const requestedNames: string[] = [];

const loadPlayers = async (players: Player[]) => {
    const leftOvers = players.filter(player => !requestedNames.includes(player.defaultName));
    const leftOverNames = leftOvers.map(player => player.defaultName);
    if(!leftOvers.length) return;

    requestedNames.push(...leftOverNames);

    const extensions = (await api.players.get()).filter(player => leftOverNames.includes(player.steamid));


    const playersExtensions: PlayerExtension[] = extensions.map(player => (
        {
            id: player._id,
            name: player.username,
            realName: `${player.firstName} ${player.lastName}`,
            steamid: player.steamid,
            country: player.country,
            avatar: player.avatar,
            extra: player.extra,
        })
    );
    GSI.players.push(...playersExtensions);
    
    leftOvers.forEach(player => {
      //  loadAvatarURL(player);
    });
}

