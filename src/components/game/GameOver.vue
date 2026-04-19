<script lang="ts" setup>
import confetti from "canvas-confetti";
import { onBeforeUnmount, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { type Context, getPlayerScores, getWinner } from "../../game-machine";
import ScoringSVG from "../ScoringSVG.vue";

const { t: $t } = useI18n();

const props = defineProps({
  context: {
    type: Object as () => Context,
    required: true,
  },
});

defineEmits<{
  (e: "back-to-title"): void;
}>();

const playerScores = getPlayerScores(props.context, "map");
const winningPlayer = getWinner(props.context);

type Player = { name: string; score: number };
const winner: Player = {
  name: winningPlayer,
  score: playerScores[winningPlayer],
};

const confettiSettings = () => ({
  particleCount: Math.random() * 100 + 50,
  spread: Math.random() * 50 + 50,
  origin: { y: 0.6, x: Math.random() * 0.4 + 0.3 },
});
let timeoutRef: number;
function scheduleConfetti(delay = 3000) {
  timeoutRef = setTimeout(
    () => {
      confetti(confettiSettings());
      scheduleConfetti();
    },
    Math.random() * delay + 500,
  );
}
onMounted(() => {
  scheduleConfetti(0);
});
onBeforeUnmount(() => {
  clearTimeout(timeoutRef);
});
</script>

<template>
  <h1>{{ $t("game-over") }}</h1>
  <div>
    <h2>{{ $t("winner", { player: winner.name, score: winner.score }) }}</h2>
    <ScoringSVG :context="context" :highlight-winner="true" />
  </div>
  <button @click="$emit('back-to-title')">{{ $t("back-to-title") }}</button>
</template>

<i18n lang="json" locale="de">
{
  "game-over": "Spiel beendet",
  "winner": "{player} hat mit {score} Punkten gewonnen!",
  "back-to-title": "Startbildschirm"
}
</i18n>

<i18n lang="json" locale="en">
{
  "game-over": "Game over",
  "winner": "{player} has won with {score} points!",
  "back-to-title": "Back to title"
}
</i18n>
