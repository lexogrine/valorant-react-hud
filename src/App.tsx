import { useEffect, useState } from 'react'
import './App.css'
import { onGameEvent, SettingsProvider } from './API/contexts/actions'
import Layout from './HUD/Layout/Layout';
import './API/socket';
import { Match } from './API/types';
import api from './API';
import { GSI } from './API/HUD';
import { socket } from './API/socket';
import { PlayerData, Valorant, ValorantRaw } from './API/contexts/valorant';
import { agentList } from './assets/heros/heros';
import { weaponList } from './assets/weapons/weapons';

export const USE_TEST_DATA = false;

const gRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

const generateFakePlayer = (i: number): PlayerData => {
  const randomWeapon = weaponList[gRandomInt(0, weaponList.length - 1)];
  return {
    username: `Player #${i}`,
    agent: agentList[gRandomInt(0, agentList.length - 1)],
    hp: gRandomInt(0, 100),
    scoreboard: {
      kills: gRandomInt(0, 100),
      deaths: gRandomInt(0, 100),
      assists: gRandomInt(0, 100),
      ultProgress: gRandomInt(0, 100),
      maxUltProgress: 100,
      credits: gRandomInt(0, 100),
      username: `Player #${i}`,
      agent: "Viper",
      weapon: randomWeapon,
      lastOCRIteration: 0,
    },
    observed: {
      username: `Player #${i}`,
      agent: "Viper",
      credits: gRandomInt(0, 100),
      health: gRandomInt(0, 100),
      armor: gRandomInt(0, 100),
      weapon: randomWeapon,
      lastOCRIteration: 0,
    }
  }
}


function App() {
  const [ game, setGame ] = useState<Valorant | null>(null);
  const [ match, setMatch ] = useState<Match | null>(null);

  useEffect(() => {
    const onMatchPing = () => {
      api.match.getCurrent().then(async match => {
          if (!match) {
              GSI.teams.left = null;
              GSI.teams.right = null;
              setMatch(null);
              return;
          }
          let isReversed = false;
          if (GSI.last) {
              // const mapName = GSI.last.map.name.substring(GSI.last.map.name.lastIndexOf('/') + 1);
              // const current = match.vetos.filter(veto => veto.mapName === mapName)[0];
              // if (current && current.reverseSide) {
              //     isReversed = true;
              // }
          }
          if (match.left.id) {
              await api.teams.getOne(match.left.id).then(left => {
                  const gsiTeamData = { id: left._id, name: left.name, country: left.country, logo: left.logo, map_score: match.left.wins, extra: left.extra, shortName: left.shortName };
  
                  if (!isReversed) {
                      GSI.teams.left = gsiTeamData;
                  }
                  else GSI.teams.right = gsiTeamData;
              });
          }
          if (match.right.id) {
              await api.teams.getOne(match.right.id).then(right => {
                  const gsiTeamData = { id: right._id, name: right.name, country: right.country, logo: right.logo, map_score: match.right.wins, extra: right.extra, shortName: right.shortName };
  
                  if (!isReversed) GSI.teams.right = gsiTeamData;
                  else GSI.teams.left = gsiTeamData;
              });
          }
          setMatch(match);
          if(USE_TEST_DATA){
            const fakeValorantData: ValorantRaw = {
              timer: 103,
              spikeState: 'dropped',
              left: {
                score: 10,
                players: new Array(5).fill(0).map((_, i) => generateFakePlayer(i)),
                roundHistory: [],
              },
              right: {
                score: 8,
                players: new Array(5).fill(0).map((_, i) => generateFakePlayer(i+5)),
                roundHistory: [],
              }
            }
            GSI.digest(fakeValorantData);
            
          }
  
  
  
  
      }).catch(() => {
        GSI.teams.left = null;
        GSI.teams.right = null;
        setMatch(null);
      });
    }
    socket.on("match", onMatchPing);
    onMatchPing();

    return () => {
      socket.off("match", onMatchPing);
    }
  }, [])
  onGameEvent('data', game => {
    setGame(game);
  }, []);

  useEffect(() => {
    if(!USE_TEST_DATA) return;
    const fakeValorantData: ValorantRaw = {
      timer: 103,
      spikeState: 'dropped',
      left: {
        score: 10,
        players: new Array(5).fill(0).map((_, i) => generateFakePlayer(i)),
        roundHistory: [],
      },
      right: {
        score: 8,
        players: new Array(5).fill(0).map((_, i) => generateFakePlayer(i+5)),
        roundHistory: [],
      }
    }

    const interval = setInterval(() => {
      GSI.digest(fakeValorantData)
    }, 2000);
    return () => clearInterval(interval);
  }, [])


  const result = game;// || ( USE_TEST_DATA ? fakeValorantData : null);
  if (!result) return null;
 
  // if(!game && USE_TEST_DATA){
  //   result.left.name = GSI.teams.left?.name ?? result.left.name;
  //   result.right.name = GSI.teams.right?.name ?? result.right.name;
  //   result.left.logo = GSI.teams.left?.logo ?? result.left.logo;
  //   result.right.logo = GSI.teams.right?.logo ?? result.right.logo;
  // }
  return (
    <SettingsProvider>
      <Layout game={result} match={match} />
    </SettingsProvider>
  );
}

export default App
