<script lang="ts" setup>
import { computed, ref } from "vue";
import { type Context, getScoreForPlayer } from "../game-machine";
const props = defineProps({
  context: {
    type: Object as () => Context,
    required: true,
  },
});

const playerOneScoreBoard = ref([] as number[]);
const playerOneScore = computed(() =>
  playerOneScoreBoard.value.reduce((a, b) => a + b, 0),
);
const playerTwoScoreBoard = ref([] as number[]);
const playerTwoScore = computed(() =>
  playerTwoScoreBoard.value.reduce((a, b) => a + b, 0),
);
const length = ref(200);

function updateScores() {
  const scoring = props.context.scoring;

  const groups = Object.groupBy(scoring, (s) => s.player);

  playerOneScoreBoard.value =
    groups[1]?.map((s) => getScoreForPlayer(1, [s])) ?? [];

  playerTwoScoreBoard.value =
    groups[2]?.map((s) => getScoreForPlayer(2, [s])) ?? [];

  const numberOfItems = Math.max(
    playerOneScoreBoard.value.length,
    playerTwoScoreBoard.value.length,
  );
  length.value = Math.max(50 + numberOfItems * 15, 100);
}

updateScores();
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 200 ` + length"
    fill="none"
    stroke="currentColor"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="h-auto w-full"
  >
    <rect x="1" y="1" width="198" :height="length - 2" rx="15" ry="15" />
    <line x1="100" y1="1" x2="100" :y2="length - 1" />
    <line x1="1" y1="20" x2="199" y2="20" />
    <line x1="1" :y1="length - 20" x2="199" :y2="length - 20" />
    <text x="50" y="15" text-anchor="middle" font-size="12">
      {{ context.playerOne }}
    </text>
    <text x="150" y="15" text-anchor="middle" font-size="12">
      {{ context.playerTwo }}
    </text>
    <template v-for="(value, index) in playerOneScoreBoard" :key="index">
      <text x="60" :y="35 + index * 15" text-anchor="end" font-size="12">
        + {{ value }}
      </text>
    </template>
    <template v-for="(value, index) in playerTwoScoreBoard" :key="index">
      <text x="160" :y="35 + index * 15" text-anchor="end" font-size="12">
        + {{ value }}
      </text>
    </template>
    <text x="50" :y="length - 5" text-anchor="middle" font-size="12">
      {{ playerOneScore }}
    </text>
    <text x="150" :y="length - 5" text-anchor="middle" font-size="12">
      {{ playerTwoScore }}
    </text>
  </svg>
</template>
