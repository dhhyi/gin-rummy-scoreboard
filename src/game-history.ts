import { ref, watch } from "vue";
import { type Context } from "./game-machine";

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
