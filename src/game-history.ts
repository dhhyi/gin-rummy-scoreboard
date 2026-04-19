import { computed, ref, watch } from "vue";
import { getPlayerScores, type Context } from "./game-machine";

type HistoryContext = Pick<Context, "players" | "scoring"> & { date: number };

const localStorageHistoryKey = "gin-rummy-scoreboard-history";

function sorted(arr: HistoryContext[]): HistoryContext[] {
  return arr.toSorted((a, b) => b.date - a.date);
}

function getHistory() {
  const item = localStorage.getItem(localStorageHistoryKey) || "[]";
  try {
    return sorted(JSON.parse(item) as HistoryContext[]);
  } catch {
    return [];
  }
}

export const history = ref(getHistory());

watch(history, (newHistory) => {
  localStorage.setItem(localStorageHistoryKey, JSON.stringify(newHistory));
});

export function saveGame(
  players: Context["players"],
  scoring: Context["scoring"],
) {
  history.value = [{ players, scoring, date: Date.now() }, ...history.value];
}

export function deleteHistoryEntry(index: number) {
  if (index < 0 || index >= history.value.length) return;
  history.value = history.value.filter((_, i) => i !== index);
}

export const statistics = computed(() => {
  return history.value.reduce<Record<string, { one: number; two: number }>>(
    (acc, game) => {
      const { players } = game;
      const title = players.join(" - ");
      if (!acc[title]) {
        acc[title] = { one: 0, two: 0 };
      }
      const playerScoring = getPlayerScores(game);
      const playerOneScore = playerScoring.find(
        (s) => s.player === players[0],
      )!.score;
      const playerTwoScore = playerScoring.find(
        (s) => s.player === players[1],
      )!.score;
      if (playerOneScore > playerTwoScore) {
        acc[title].one += 1;
      } else {
        acc[title].two += 1;
      }
      return acc;
    },
    {},
  );
});
