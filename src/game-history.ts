import { type Context } from "./game-machine";

type HistoryContext = Context & { date: number };

const localStorageHistoryKey = "gin-rummy-scoreboard-history";

export function getHistory() {
  const item = localStorage.getItem(localStorageHistoryKey) || "[]";
  try {
    return JSON.parse(item) as HistoryContext[];
  } catch {
    return [];
  }
}

function setHistory(value: HistoryContext[]) {
  localStorage.setItem(
    localStorageHistoryKey,
    JSON.stringify(value.toSorted((a, b) => b.date - a.date)),
  );
}

export function saveGame(context: Context) {
  const history = getHistory();
  history.push({ ...context, date: Date.now() });
  setHistory(history);
}
