import { Player, Team, Valorant, ValorantRaw } from "./valorant";

export type Events = {
  data: (data: Valorant) => void;
};
type AnyEventName<T> = T | (string & {});

type BaseEvents = keyof Events;

type EmptyListener = () => void;

type Callback<K> = K extends BaseEvents
  ? Events[K] | EmptyListener
  : EmptyListener;

type EventNames = AnyEventName<BaseEvents>;
interface EventDescriptor {
  listener: Events[BaseEvents];
  once: boolean;
}
export interface TeamExtension {
  id: string;
  name: string;
  country: string | null;
  logo: string | null;
  map_score: number;
  shortName: string;
  extra: Record<string, string>;
}
export interface PlayerExtension {
  id: string;
  name: string;
  steamid: string;
  realName: string | null;
  country: string | null;
  avatar: string | null;
  extra: Record<string, string>;
}

const defaultSides = ["DEFENDER", "ATTACKER"] as const;
const reversedSides = ["ATTACKER", "DEFENDER"] as const;

class VALOGSI {
  private descriptors: Map<EventNames, EventDescriptor[]>;
  private maxListeners: number;
  teams: {
    left: TeamExtension | null;
    right: TeamExtension | null;
  };
  players: PlayerExtension[];
  overtimeMR: number;
  regulationMR: number;
  last?: Valorant;
  current?: Valorant;

  constructor() {
    this.descriptors = new Map();
    this.teams = {
      left: null,
      right: null,
    };
    this.maxListeners = 10;
    this.players = [];
    this.overtimeMR = 3;
    this.regulationMR = 15;
  }
  eventNames = () => {
    const listeners = this.descriptors.entries();
    const nonEmptyEvents: EventNames[] = [];

    for (const entry of listeners) {
      if (entry[1] && entry[1].length > 0) {
        nonEmptyEvents.push(entry[0]);
      }
    }

    return nonEmptyEvents;
  };
  getMaxListeners = () => this.maxListeners;

  listenerCount = (eventName: EventNames) => {
    const listeners = this.listeners(eventName);
    return listeners.length;
  };

  listeners = (eventName: EventNames) => {
    const descriptors = this.descriptors.get(eventName) || [];
    return descriptors.map((descriptor) => descriptor.listener);
  };

  removeListener = <K extends EventNames>(
    eventName: K,
    listener: Callback<K>
  ) => {
    return this.off(eventName, listener);
  };

  off = <K extends EventNames>(eventName: K, listener: Callback<K>) => {
    const descriptors = this.descriptors.get(eventName) || [];

    this.descriptors.set(
      eventName,
      descriptors.filter((descriptor) => descriptor.listener !== listener)
    );
    this.emit("removeListener", eventName, listener);
    return this;
  };

  addListener = <K extends EventNames>(eventName: K, listener: Callback<K>) => {
    return this.on(eventName, listener);
  };

  on = <K extends EventNames>(eventName: K, listener: Callback<K>) => {
    this.emit("newListener", eventName, listener);
    const listOfListeners = [...(this.descriptors.get(eventName) || [])];

    listOfListeners.push({ listener, once: false });
    this.descriptors.set(eventName, listOfListeners);

    return this;
  };

  once = <K extends EventNames>(eventName: K, listener: Callback<K>) => {
    const listOfListeners = [...(this.descriptors.get(eventName) || [])];

    listOfListeners.push({ listener, once: true });
    this.descriptors.set(eventName, listOfListeners);

    return this;
  };

  prependListener = <K extends EventNames>(
    eventName: K,
    listener: Callback<K>
  ) => {
    const listOfListeners = [...(this.descriptors.get(eventName) || [])];

    listOfListeners.unshift({ listener, once: false });
    this.descriptors.set(eventName, listOfListeners);

    return this;
  };

  emit = (eventName: EventNames, arg?: any, arg2?: any) => {
    const listeners = this.descriptors.get(eventName);
    if (!listeners || listeners.length === 0) return false;

    listeners.forEach((listener) => {
      if (listener.once) {
        this.descriptors.set(
          eventName,
          listeners.filter((listenerInArray) => listenerInArray !== listener)
        );
      }
      (listener.listener as any)(arg, arg2);
    });
    return true;
  };

  prependOnceListener = <K extends EventNames>(
    eventName: K,
    listener: Callback<K>
  ) => {
    const listOfListeners = [...(this.descriptors.get(eventName) || [])];

    listOfListeners.unshift({ listener, once: true });
    this.descriptors.set(eventName, listOfListeners);

    return this;
  };

  removeAllListeners = (eventName: EventNames) => {
    this.descriptors.set(eventName, []);
    return this;
  };

  setMaxListeners = (n: number) => {
    this.maxListeners = n;
    return this;
  };

  rawListeners = (eventName: EventNames) => {
    return this.descriptors.get(eventName) || [];
  };

  digest = (raw: ValorantRaw): Valorant | null => {
    const round = raw.left.score + raw.right.score + 1;
    const isReversed = round > 12 && (round <= 24 || (round - 24) % 2 === 1);
    const [leftType, rightType] = isReversed ? reversedSides : defaultSides;

    const left: Team = {
      name: this.teams.left?.name || leftType,
      side: leftType,
      score: raw.left.score,
      roundHistory: raw.left.roundHistory,
      players: [], // raw.left.players.map(pl => this.parsePlayerData(pl, left)),
      series: this.teams.left?.map_score || 0,
      orientation: "left",
      shortName: this.teams.left?.shortName || "",
      logo: this.teams.left?.logo || undefined,
    };
    left.players = raw.left.players.map((pl) => this.parsePlayerData(pl, left));
    const right: Team = {
      name: this.teams.right?.name || rightType,
      side: rightType,
      score: raw.right.score,
      shortName: this.teams.right?.shortName || "",
      roundHistory: raw.right.roundHistory,
      orientation: "right",
      players: [], // raw.right.players.map(pl => this.parsePlayerData(pl, right)),
      series: this.teams?.right?.map_score || 0,
      logo: this.teams.right?.logo || undefined,
    };
    right.players = raw.right.players.map((pl) =>
      this.parsePlayerData(pl, right)
    );

    const valorantData: Valorant = {
      timer: raw.timer,
      spikeState: raw.spikeState,
      left: left,
      right: right,
    };
    this.emit("data", valorantData);
    return valorantData;
  };

  private parsePlayerData = (
    player: ValorantRaw["left"]["players"][number],
    team: Player["team"]
  ): Player => {
    const ext = this.players.find((p) => p.steamid === player.username);
    return {
      username: ext?.name || player.username,
      agent: player.agent,
      hp: player.hp,
      weapon: player.observed?.weapon || player.scoreboard?.weapon || undefined,
      defaultName: player.username,
      avatar: ext?.avatar ?? undefined,
      team,
      state: {
        health: player.observed?.health ?? player.hp,
        kills: player.scoreboard?.kills ?? 0,
        assists: player.scoreboard?.assists ?? 0,
        deaths: player.scoreboard?.deaths ?? 0,
        ultimate: {
          state: player.scoreboard?.ultProgress ?? 0,
          max: player.scoreboard?.maxUltProgress ?? 0,
        },
      },
      armor: player.scoreboard?.armor ?? "none",
      isCurrentlyObserved: player.isCurrentlyObserved,
      credits: player.observed?.credits ?? player.scoreboard?.credits ?? 0,
      creditsHistory: player.creditsHistory,
      ultHistory: player.ultHistory,
      loadoutKills: player.loadoutKills,
      killRoundHistory: player.killRoundHistory,
      diedAtRound: player.diedAtRound,
      lastRoundEndState: player.lastRoundEndState,
      lastLoadout: player.lastLoadout,
    };
  };
}

export { type Valorant, VALOGSI };
