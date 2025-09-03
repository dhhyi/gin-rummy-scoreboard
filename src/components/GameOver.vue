<script lang="ts" setup>
import { type Context, getScoreForPlayer } from "../game-machine";

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
const { winner, loser }: { winner: Player; loser: Player } =
  pointsPlayerOne > pointsPlayerTwo
    ? {
        winner: { name: namePlayerOne, score: pointsPlayerOne },
        loser: { name: namePlayerTwo, score: pointsPlayerTwo },
      }
    : {
        winner: { name: namePlayerTwo, score: pointsPlayerTwo },
        loser: { name: namePlayerOne, score: pointsPlayerOne },
      };
</script>

<template>
  <h1>Spiel beendet</h1>
  <div class="flex flex-col gap-8">
    <h2>
      {{ winner.name }} hat mit {{ winner.score }} Punkten gewonnen!<br />
    </h2>
    <p>{{ loser.name }} hat {{ loser.score }} Punkte.</p>
  </div>
</template>
