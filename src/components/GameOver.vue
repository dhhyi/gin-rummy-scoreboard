<script lang="ts" setup>
import { type Context, getScoreForPlayer } from "../game-machine";

const props = defineProps({
  context: {
    type: Object as () => Context,
    required: true,
  },
});

const pointsPlayerOne = getScoreForPlayer(1, props.context);
const pointsPlayerTwo = getScoreForPlayer(2, props.context);

const winner =
  pointsPlayerOne > pointsPlayerTwo
    ? props.context.playerOne
    : props.context.playerTwo;
const loser =
  pointsPlayerOne > pointsPlayerTwo
    ? props.context.playerTwo
    : props.context.playerOne;
const winnerPoints = Math.max(pointsPlayerOne, pointsPlayerTwo);
const loserPoints = Math.min(pointsPlayerOne, pointsPlayerTwo);
</script>

<template>
  <h1>Spiel beendet</h1>
  <div class="flex flex-col gap-8">
    <h2>{{ winner }} hat mit {{ winnerPoints }} Punkten gewonnen!<br /></h2>
    <p>{{ loser }} hat {{ loserPoints }} Punkte.</p>
  </div>
</template>
