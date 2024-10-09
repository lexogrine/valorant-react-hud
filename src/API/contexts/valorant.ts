type ScoreboardPlayerDataInstance = {
  username: string;
  agent: string;
  kills: number;
  assists: number;
  deaths: number;
  ultProgress: number;
  maxUltProgress: number;
  credits: number;
  weapon: string | null;
  lastOCRIteration: number;
};

type RoundEndType = "diffuse" | "explosion" | "killall" | "time" | "empty";

type ObservedPlayerDataInstance = {
  username: string;
  agent: string;
  credits: number;
  health: number;
  armor: number;
  weapon: string | null;
  lastOCRIteration: number;
};

export interface PlayerData {
  username: string;
  agent: string;
  hp: number;
  scoreboard?: ScoreboardPlayerDataInstance;
  observed?: ObservedPlayerDataInstance;
};
export interface Player extends PlayerData {
  defaultName: string; // steamid in lhm
  avatar?: string;
  team: Team;
  credits: number;
  weapon?: string;
  state: {
    health: number;
    kills: number;
    assists: number;
    deaths: number;
    ultimate: {
      state: number;
      max: number;
    };
  };
};
export type ValorantRaw = {
  timer: number | null;
  spikeState: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "dropped" | "planted";
  left: {
    score: number;
    players: PlayerData[];
    roundHistory: RoundEndType[];
  };
  right: {
    score: number;
    players: PlayerData[];
    roundHistory: RoundEndType[];
  };
};


export type Valorant = {
  timer: number | null;
  spikeState: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "dropped" | "planted";
  left: Team;
  right: Team;
};

export type Team = {
    name: string,
    score: number,
    players: Player[],
    roundHistory: RoundEndType[],
    series: number,
    side: "ATTACKER" | "DEFENDER",
    logo?: string
  }
