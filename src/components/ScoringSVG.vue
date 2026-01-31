<script lang="ts" setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  type Context,
  getScoreForPlayer,
  getWinner,
  type Scoring,
} from "../game-machine";

const { t: $t } = useI18n();

const props = defineProps({
  context: {
    type: Object as () => Context,
    required: true,
  },
  highlightPoints: {
    type: Boolean,
    default: false,
  },
  highlightWinner: {
    type: Boolean,
    default: false,
  },
});

type ScoreViz = {
  value: number;
  underline?: boolean;
  highlight?: boolean;
};
const playerOneScoreBoard = ref([] as ScoreViz[]);
const playerTwoScoreBoard = ref([] as ScoreViz[]);
const length = ref(200);

function updateScores() {
  const scoring = props.context.scoring;

  const groups = Object.groupBy(scoring, (s) => s.player);

  const mapper = (value: Scoring, index: number, arr: Scoring[]) => {
    const score = getScoreForPlayer(value.player, [value]);
    return {
      value: score,
      underline:
        index === arr.length - 1 || arr[index + 1]?.round !== value.round,
      highlight: props.highlightPoints && value.round === props.context.round,
    };
  };

  playerOneScoreBoard.value = groups[1]?.map(mapper) ?? [];
  playerTwoScoreBoard.value = groups[2]?.map(mapper) ?? [];

  const numberOfItems = Math.max(
    playerOneScoreBoard.value.length,
    playerTwoScoreBoard.value.length,
  );
  length.value = Math.max(50 + numberOfItems * 15, 100);
}

updateScores();

const playerOneScore = computed(() =>
  getScoreForPlayer(1, props.context.scoring),
);
const playerTwoScore = computed(() =>
  getScoreForPlayer(2, props.context.scoring),
);
const winner = computed(() => getWinner(props.context.scoring));

const vHighlight = (el: SVGTextElement, binding: { value: boolean }) => {
  if (binding.value) {
    el.setAttribute("fill", "red");
    el.setAttribute("stroke", "red");
  } else {
    el.setAttribute("fill", "currentColor");
    el.setAttribute("stroke", "currentColor");
  }
};
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="`0 0 200 ` + length"
    fill="currentColor"
    font-size="12"
    text-anchor="end"
    stroke="currentColor"
    stroke-width="1"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="h-auto w-full"
  >
    <rect
      x="1"
      y="1"
      width="198"
      :height="length - 2"
      rx="15"
      ry="15"
      fill-opacity="0.1"
    />
    <line x1="100" y1="1" x2="100" :y2="length - 1" />
    <line x1="1" y1="20" x2="199" y2="20" />
    <line x1="1" :y1="length - 20" x2="199" :y2="length - 20" />
    <text
      v-highlight="props.highlightWinner && winner === 1"
      x="50"
      y="15"
      text-anchor="middle"
    >
      {{ context.playerOne }}
    </text>
    <text
      v-highlight="props.highlightWinner && winner === 2"
      x="150"
      y="15"
      text-anchor="middle"
    >
      {{ context.playerTwo }}
    </text>
    <template v-for="(value, index) in playerOneScoreBoard" :key="index">
      <text v-highlight="value.highlight" x="60" :y="35 + index * 15">
        {{ $t("value", { value: value.value }) }}
      </text>
      <line
        v-if="value.underline"
        x1="30"
        :y1="38 + index * 15"
        x2="70"
        :y2="38 + index * 15"
      />
    </template>
    <template v-for="(value, index) in playerTwoScoreBoard" :key="index">
      <text v-highlight="value.highlight" x="160" :y="35 + index * 15">
        {{ $t("value", { value: value.value }) }}
      </text>
      <line
        v-if="value.underline"
        x1="130"
        :y1="38 + index * 15"
        x2="170"
        :y2="38 + index * 15"
      />
    </template>
    <text
      v-highlight="props.highlightWinner && winner === 1"
      x="60"
      :y="length - 6"
    >
      {{ playerOneScore }}
    </text>
    <text
      v-highlight="props.highlightWinner && winner === 2"
      x="160"
      :y="length - 6"
    >
      {{ playerTwoScore }}
    </text>
  </svg>
</template>

<i18n lang="json" locale="de">
{
  "value": "+ {value}"
}
</i18n>

<i18n lang="json" locale="en">
{
  "value": "+ {value}"
}
</i18n>
