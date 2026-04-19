import { useMachine } from "@xstate/vue";
import { assign, setup } from "xstate";
import { saveGame } from "./game-history";

export type Scoring = {
  round: number;
  player: string;
  score: "undercut" | "gin" | "big-gin" | number;
};

export interface Context {
  players: string[];
  scoring: Scoring[];
  game?: {
    round: number;
    playerOne: string;
    playerTwo: string;
    roundEndedBy?: string;
    firstPlayerDeadWood?: number;
  };
}

function createContext(): Context {
  return {
    players: [],
    scoring: [],
  };
}

type Events =
  | { type: "show-history" }
  | { type: "new-game" }
  | { type: "start-game"; one: string; two: string }
  | { type: "round-ending" }
  | { type: "end-round-by"; player: string }
  | { type: "end-round-with-knock" }
  | { type: "end-round-with-gin" }
  | { type: "end-round-with-big-gin" }
  | { type: "counted-dead-wood"; player: string; value: number }
  | { type: "continue-game" }
  | { type: "correct-score" }
  | { type: "back-to-title" };

type Tags = "display-scoreboard-link";

export function getScoreForPlayer(player: string, scoring: Context["scoring"]) {
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

export function getPlayerScores(context: Context) {
  return context.players.map((p) => ({
    player: p,
    score: getScoreForPlayer(p, context.scoring),
  }));
}

export function getWinner(context: Context) {
  return getPlayerScores(context).toSorted((a, b) => b.score - a.score)[0]
    .player;
}

const gameMachine = setup({
  types: {
    context: {} as Context,
    events: {} as Events,
    tags: {} as Tags,
  },
  guards: {
    noPlayerWon: ({ context }) =>
      getPlayerScores(context).every((ps) => ps.score < 100),
  },
}).createMachine({
  id: "app",
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
    history: {},
    playerSelection: {
      on: {
        "start-game": {
          actions: assign({
            game: ({ event }) => ({
              playerOne: event.one,
              playerTwo: event.two,
              round: 1,
            }),
            players: ({ event }) => [event.one, event.two],
          }),
          target: "game",
        },
      },
    },
    game: {
      initial: "roundRunning",
      states: {
        roundRunning: {
          tags: ["display-scoreboard-link"],
          on: {
            "round-ending": {
              target: "roundEnding",
            },
          },
        },
        roundEnding: {
          tags: ["display-scoreboard-link"],
          on: {
            "end-round-by": {
              actions: assign({
                game: ({ context: { game }, event }) => ({
                  ...game!,
                  roundEndedBy: event.player,
                }),
              }),
              target: "roundEndSelection",
            },
          },
        },
        roundEndSelection: {
          tags: ["display-scoreboard-link"],
          on: {
            "end-round-with-gin": {
              actions: assign({
                scoring: ({ context: { scoring, game } }) => [
                  ...scoring,
                  {
                    round: game!.round,
                    player: game!.roundEndedBy!,
                    score: "gin",
                  },
                ],
              }),
              target: "countOtherPlayerDeadWood",
            },
            "end-round-with-big-gin": {
              actions: assign({
                scoring: ({ context: { scoring, game } }) => [
                  ...scoring,
                  {
                    round: game!.round,
                    player: game!.roundEndedBy!,
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
          tags: ["display-scoreboard-link"],
          on: {
            "counted-dead-wood": {
              actions: assign({
                scoring: ({ context: { scoring, game }, event }) => [
                  ...scoring,
                  {
                    round: game!.round,
                    player: game!.roundEndedBy!,
                    score: event.value,
                  },
                ],
              }),
              target: "finalizeRound",
            },
          },
        },
        countFirstPlayerDeadWood: {
          tags: ["display-scoreboard-link"],
          on: {
            "counted-dead-wood": {
              actions: assign({
                game: ({ context: { game }, event }) => ({
                  ...game!,
                  firstPlayerDeadWood: event.value,
                }),
              }),
              target: "countSecondPlayerDeadWood",
            },
          },
        },
        countSecondPlayerDeadWood: {
          tags: ["display-scoreboard-link"],
          on: {
            "counted-dead-wood": {
              actions: assign({
                scoring: ({ context: { game, scoring }, event }) => {
                  const firstPlayer = game!.roundEndedBy!;
                  const secondPlayer =
                    firstPlayer === game!.playerOne
                      ? game!.playerTwo!
                      : game!.playerOne!;
                  const firstPlayerDeadWood = game!.firstPlayerDeadWood!;
                  const secondPlayerDeadWood = event.value;

                  if (firstPlayerDeadWood < secondPlayerDeadWood) {
                    return [
                      ...scoring,
                      {
                        round: game!.round,
                        player: firstPlayer,
                        score: secondPlayerDeadWood - firstPlayerDeadWood,
                      },
                    ];
                  } else {
                    return [
                      ...scoring,
                      {
                        round: game!.round,
                        player: secondPlayer,
                        score: "undercut",
                      },
                      {
                        round: game!.round,
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
                scoring: ({ context: { scoring, game } }) =>
                  scoring.filter((s) => s.round !== game!.round),
              }),
              target: "roundEnding",
            },
          },
        },
        continueGame: {
          always: [
            {
              target: "roundRunning",
              guard: "noPlayerWon",
              actions: assign({
                game: ({ context: { game } }) => ({
                  ...game!,
                  roundEndedBy: undefined,
                  firstPlayerDeadWood: undefined,
                  round: game!.round + 1,
                }),
              }),
            },
            { target: "gameOver" },
          ],
        },
        gameOver: {
          type: "final",
        },
      },
      onDone: {
        actions: [
          ({ context: { players, scoring } }) => {
            saveGame(players, scoring);
          },
          assign(() => createContext()),
        ],
      },
    },
  },
  on: {
    "back-to-title": {
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
