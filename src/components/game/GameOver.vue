<script lang="ts" setup>
import confetti from "canvas-confetti";
import { useI18n } from "vue-i18n";
import { type Context, getScoreForPlayer } from "../../game-machine";
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

const scoring = props.context.scoring;
const pointsPlayerOne = getScoreForPlayer(1, scoring);
const pointsPlayerTwo = getScoreForPlayer(2, scoring);
const namePlayerOne = props.context.playerOne!;
const namePlayerTwo = props.context.playerTwo!;

type Player = { name: string; score: number };
const winner: Player =
  pointsPlayerOne > pointsPlayerTwo
    ? { name: namePlayerOne, score: pointsPlayerOne }
    : { name: namePlayerTwo, score: pointsPlayerTwo };

confetti({
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
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
