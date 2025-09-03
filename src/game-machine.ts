import { useMachine } from "@xstate/vue";
import { assign, setup } from "xstate";

export interface Context {
  playerOne: string | null;
  playerTwo: string | null;
  scoring: {
    round: number;
    player: 1 | 2;
    score: "undercut" | "gin" | "big-gin" | number;
  }[];
  rounds: number;
  roundEndedBy?: 1 | 2;
  firstPlayerDeadWood?: number;
}

function createContext(): Context {
  return {
    playerOne: null,
    playerTwo: null,
    scoring: [],
    rounds: 0,
  };
}

type Events =
  | { type: "new-game" }
  | { type: "reset" }
  | { type: "start-game"; one: string; two: string }
  | { type: "end-round"; player: 1 | 2 }
  | { type: "end-round-with-knock" }
  | { type: "end-round-with-gin" }
  | { type: "end-round-with-big-gin" }
  | { type: "counted-dead-wood"; player: 1 | 2; value: number };

export function getScoreForPlayer(player: 1 | 2, context: Context) {
  return context.scoring
    .filter((s) => s.player === player)
    .reduce((acc, s) => {
      if (s.score === "undercut") {
        return acc + 15;
      } else if (s.score === "gin") {
        return acc + 25;
      } else if (s.score === "big-gin") {
        return acc + 31;
      } else {
        return acc + s.score;
      }
    }, 0);
}

const gameMachine = setup({
  types: {
    context: createContext(),
    events: {} as Events,
  },
  guards: {
    noPlayerWon: ({ context }) => {
      return (
        getScoreForPlayer(1, context) < 100 &&
        getScoreForPlayer(2, context) < 100
      );
    },
  },
}).createMachine({
  id: "game",
  initial: "idle",
  context: createContext(),
  states: {
    idle: {
      entry: ({ context, event }) => {
        console.log("idle", event, context);
      },
      on: {
        "new-game": "playerSelection",
      },
    },
    playerSelection: {
      entry: ({ context, event }) => {
        console.log("playerSelection", event, context);
      },
      on: {
        "start-game": {
          actions: assign({
            playerOne: ({ event }) => event.one,
            playerTwo: ({ event }) => event.two,
            rounds: () => 0,
            roundEndedBy: () => undefined,
          }),
          target: "running",
        },
      },
    },
    running: {
      entry: ({ context, event }) => {
        console.log("running", event, context);
      },
      on: {
        "end-round": {
          actions: assign({
            rounds: ({ context }) => context.rounds + 1,
            roundEndedBy: ({ event }) => event.player,
          }),
          target: "roundEndSelection",
        },
      },
    },
    roundEndSelection: {
      entry: ({ context, event }) => {
        console.log("roundEndSelection", event, context);
      },
      on: {
        "end-round-with-gin": {
          actions: assign({
            scoring: ({ context }) => [
              ...context.scoring,
              {
                round: context.rounds,
                player: context.roundEndedBy!,
                score: "gin",
              },
            ],
          }),
          target: "countOtherPlayerDeadWood",
        },
        "end-round-with-big-gin": {
          actions: assign({
            scoring: ({ context }) => [
              ...context.scoring,
              {
                round: context.rounds,
                player: context.roundEndedBy!,
                score: "big-gin",
              },
            ],
          }),
          target: "countOtherPlayerDeadWood",
        },
        "end-round-with-knock": {
          target: "countFirstPlayerDeadWood",
        },
      },
    },
    countOtherPlayerDeadWood: {
      entry: ({ context, event }) => {
        console.log("countOtherPlayerDeadWood", event, context);
      },
      on: {
        "counted-dead-wood": {
          actions: assign({
            scoring: ({ context, event }) => [
              ...context.scoring,
              {
                round: context.rounds,
                player: context.roundEndedBy!,
                score: event.value,
              },
            ],
            roundEndedBy: () => undefined,
          }),
          target: "continueRunning",
        },
      },
    },
    countFirstPlayerDeadWood: {
      entry: ({ context, event }) => {
        console.log("countFirstPlayerDeadWood", event, context);
      },
      on: {
        "counted-dead-wood": {
          actions: assign({
            firstPlayerDeadWood: ({ event }) => event.value,
          }),
          target: "countSecondPlayerDeadWood",
        },
      },
    },
    countSecondPlayerDeadWood: {
      entry: ({ context, event }) => {
        console.log("countSecondPlayerDeadWood", event, context);
      },
      on: {
        "counted-dead-wood": {
          actions: assign({
            scoring: ({ context, event }) => {
              const firstPlayer = context.roundEndedBy!;
              const secondPlayer = firstPlayer === 1 ? 2 : 1;
              const firstPlayerDeadWood = context.firstPlayerDeadWood!;
              const secondPlayerDeadWood = event.value;

              if (firstPlayerDeadWood < secondPlayerDeadWood) {
                return [
                  ...context.scoring,
                  {
                    round: context.rounds,
                    player: firstPlayer,
                    score: secondPlayerDeadWood - firstPlayerDeadWood,
                  },
                ];
              } else {
                return [
                  ...context.scoring,
                  {
                    round: context.rounds,
                    player: secondPlayer,
                    score: "undercut",
                  },
                  {
                    round: context.rounds,
                    player: secondPlayer,
                    score: firstPlayerDeadWood - secondPlayerDeadWood,
                  },
                ];
              }
            },
            roundEndedBy: () => undefined,
            firstPlayerDeadWood: () => undefined,
          }),
          target: "continueRunning",
        },
      },
    },
    continueRunning: {
      entry: ({ context, event }) => {
        console.log("continueRunning", event, context);
      },
      always: [
        {
          target: "running",
          guard: "noPlayerWon",
        },
        { target: "gameOver" },
      ],
    },
    gameOver: {
      entry: ({ context, event }) => {
        console.log("gameOver", event, context);
      },
      on: {
        "new-game": "playerSelection",
      },
    },
  },
  on: {
    reset: {
      target: ".idle",
      actions: assign({
        playerOne: () => null,
        playerTwo: () => null,
        rounds: () => 0,
        roundEndedBy: () => undefined,
        firstPlayerDeadWood: () => undefined,
        scoring: () => [],
      }),
    },
  },
});

export function setupGameMachine() {
  const localStorageKey = "gin-rummy-scoreboard-state";
  const stateString = localStorage.getItem(localStorageKey);
  const saved = stateString ? JSON.parse(stateString) : undefined;

  const { snapshot, send, actorRef } = useMachine(gameMachine, {
    snapshot: saved,
  });

  actorRef.subscribe(() => {
    const persistedState = actorRef.getPersistedSnapshot();
    localStorage.setItem(localStorageKey, JSON.stringify(persistedState));
  });

  return { snapshot, send };
}
