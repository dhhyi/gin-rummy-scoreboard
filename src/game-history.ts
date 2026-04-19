import { computed, ref, watch } from "vue";
import { getPlayerScores, type Context } from "./game-machine";

type HistoryContext = Pick<Context, "players" | "scoring"> & { date: number };

const localStorageHistoryKey = "gin-rummy-scoreboard-history-v2";

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
  return history.value.reduce<Record<string, number[]>>((acc, game) => {
    try {
      const { players } = game;
      const sortedPlayers = players.toSorted();
      const title = sortedPlayers.join(" - ");
      if (!acc[title]) {
        acc[title] = players.length === 2 ? [0, 0] : [0, 0, 0];
      }
      const playerScoring = getPlayerScores(game, "sorted-list");
      const indexOfWinner = sortedPlayers.findIndex(
        (p) => p === playerScoring[0].player,
      );
      if (indexOfWinner === -1) return acc;
      acc[title][indexOfWinner] += 1;
      return acc;
    } catch {
      return acc;
    }
  }, {});
});
