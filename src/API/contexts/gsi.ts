import { Valorant } from "./valorant";

export type Events = {
  data: (data: Valorant) => void;
};
type AnyEventName<T> = T | (string & {});

type BaseEvents = keyof Events;

type EmptyListener = () => void;

type Callback<K> = K extends BaseEvents ? Events[K] | EmptyListener : EmptyListener;


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

  digest = (data: Valorant): Valorant | null => {
    this.emit("data", data);
    return data;
  };
}

export {
    type Valorant,
    VALOGSI
};
