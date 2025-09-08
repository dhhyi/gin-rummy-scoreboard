import { ref, watchEffect } from "vue";
import { type Context } from "./game-machine";

type HistoryContext = Context & { date: number };

const localStorageHistoryKey = "gin-rummy-scoreboard-history";

function getHistory() {
  const item = localStorage.getItem(localStorageHistoryKey) || "[]";
  try {
    return JSON.parse(item) as HistoryContext[];
  } catch {
    return [];
  }
}

export const history = ref(getHistory());

watchEffect(() => {
  const sorted = history.value.toSorted((a, b) => b.date - a.date);
  localStorage.setItem(localStorageHistoryKey, JSON.stringify(sorted));
  history.value = sorted;
});

export function saveGame(context: Context) {
  history.value = [...history.value, { ...context, date: Date.now() }];
}

export function deleteHistoryEntry(index: number) {
  if (index < 0 || index >= history.value.length) return;
  history.value = history.value.filter((_, i) => i !== index);
}
