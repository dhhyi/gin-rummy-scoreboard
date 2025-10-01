import { computed, ref, watch } from "vue";
import { getScoreForPlayer, type Context } from "./game-machine";

type HistoryContext = Context & { date: number };

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

export function saveGame(context: Context) {
  history.value = [{ ...context, date: Date.now() }, ...history.value];
}

export function deleteHistoryEntry(index: number) {
  if (index < 0 || index >= history.value.length) return;
  history.value = history.value.filter((_, i) => i !== index);
}

export const statistics = computed(() => {
  return history.value.reduce<Record<string, { one: number; two: number }>>(
    (acc, game) => {
      const { playerOne, playerTwo, scoring } = game;
      const title = `${playerOne} - ${playerTwo}`;
      if (!acc[title]) {
        acc[title] = { one: 0, two: 0 };
      }
      const playerOneScore = getScoreForPlayer(1, scoring);
      const playerTwoScore = getScoreForPlayer(2, scoring);
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
