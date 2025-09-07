import { useMachine } from "@xstate/vue";
import { assign, setup } from "xstate";
import { saveGame } from "./game-history";

export type Scoring = {
  round: number;
  player: 1 | 2;
  score: "undercut" | "gin" | "big-gin" | number;
};

export interface Context {
  playerOne: string | null;
  playerTwo: string | null;
  scoring: Scoring[];
  round: number;
  roundEndedBy?: 1 | 2;
  firstPlayerDeadWood?: number;
}

function createContext(): Context {
  return {
    playerOne: null,
    playerTwo: null,
    scoring: [],
    round: 0,
    roundEndedBy: undefined,
    firstPlayerDeadWood: undefined,
  };
}

type Events =
  | { type: "show-history" }
  | { type: "new-game" }
  | { type: "reset" }
  | { type: "start-game"; one: string; two: string }
  | { type: "round-ending" }
  | { type: "end-round-by"; player: 1 | 2 }
  | { type: "end-round-with-knock" }
  | { type: "end-round-with-gin" }
  | { type: "end-round-with-big-gin" }
  | { type: "counted-dead-wood"; player: 1 | 2; value: number }
  | { type: "continue-game" }
  | { type: "correct-score" }
  | { type: "back-to-title" };

type Tags = "in-game";

export function getScoreForPlayer(player: 1 | 2, scoring: Context["scoring"]) {
  return scoring
    .filter((s) => s.player === player)
    .reduce((acc, s) => {
      switch (s.score) {
        case "undercut":
          return acc + 15;
        case "gin":
          return acc + 25;
        case "big-gin":
          return acc + 31;
        default:
          return acc + s.score;
      }
    }, 0);
}

const gameMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    tags: {} as Tags,
  },
  guards: {
    noPlayerWon: ({ context: { scoring } }) =>
      getScoreForPlayer(1, scoring) < 100 &&
      getScoreForPlayer(2, scoring) < 100,
  },
}).createMachine({
  id: "game",
  initial: "idle",
  context: createContext(),
  states: {
    idle: {
      on: {
        "new-game": {
          target: "playerSelection",
          actions: assign(createContext),
        },
        "show-history": {
          target: "history",
        },
      },
    },
    history: {
      on: {
        "back-to-title": {
          target: "idle",
        },
      },
    },
    playerSelection: {
      on: {
        "start-game": {
          actions: assign({
            playerOne: ({ event }) => event.one,
            playerTwo: ({ event }) => event.two,
            round: ({ context }) => context.round + 1,
          }),
          target: "roundRunning",
        },
      },
    },
    roundRunning: {
      tags: ["in-game"],
      on: {
        "round-ending": {
          target: "roundEnding",
        },
      },
    },
    roundEnding: {
      tags: ["in-game"],
      on: {
        "end-round-by": {
          actions: assign({
            roundEndedBy: ({ event }) => event.player,
          }),
          target: "roundEndSelection",
        },
      },
    },
    roundEndSelection: {
      tags: ["in-game"],
      on: {
        "end-round-with-gin": {
          actions: assign({
            scoring: ({ context }) => [
              ...context.scoring,
              {
                round: context.round,
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
                round: context.round,
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
      tags: ["in-game"],
      on: {
        "counted-dead-wood": {
          actions: assign({
            scoring: ({ context, event }) => [
              ...context.scoring,
              {
                round: context.round,
                player: context.roundEndedBy!,
                score: event.value,
              },
            ],
          }),
          target: "finalizeRound",
        },
      },
    },
    countFirstPlayerDeadWood: {
      tags: ["in-game"],
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
      tags: ["in-game"],
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
                    round: context.round,
                    player: firstPlayer,
                    score: secondPlayerDeadWood - firstPlayerDeadWood,
                  },
                ];
              } else {
                return [
                  ...context.scoring,
                  {
                    round: context.round,
                    player: secondPlayer,
                    score: "undercut",
                  },
                  {
                    round: context.round,
                    player: secondPlayer,
                    score: firstPlayerDeadWood - secondPlayerDeadWood,
                  },
                ];
              }
            },
          }),
          target: "finalizeRound",
        },
      },
    },
    finalizeRound: {
      on: {
        "continue-game": "continueGame",
        "correct-score": {
          actions: assign({
            scoring: ({ context }) =>
              context.scoring.filter((s) => s.round !== context.round),
          }),
          target: "roundEnding",
        },
      },
    },
    continueGame: {
      tags: ["in-game"],
      always: [
        {
          target: "roundRunning",
          guard: "noPlayerWon",
          actions: assign({
            roundEndedBy: () => undefined,
            firstPlayerDeadWood: () => undefined,
            round: ({ context }) => context.round + 1,
          }),
        },
        { target: "gameOver" },
      ],
    },
    gameOver: {
      entry: ({ context }) => {
        saveGame(context);
      },
      on: {
        "back-to-title": {
          target: "idle",
        },
      },
    },
  },
  on: {
    reset: {
      target: ".idle",
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
