<script lang="ts" setup>
import confetti from "canvas-confetti";
import { type Context, getScoreForPlayer } from "../game-machine";
import ScoringSVG from "./ScoringSVG.vue";

const props = defineProps({
  context: {
    type: Object as () => Context,
    required: true,
  },
});

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
  <h1>Spiel beendet</h1>
  <h2>{{ winner.name }} hat mit {{ winner.score }} Punkten gewonnen!<br /></h2>
  <ScoringSVG :context="context" />
</template>
