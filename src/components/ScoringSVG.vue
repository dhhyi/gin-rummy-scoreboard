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
  id: {
    type: String,
    default: undefined,
  },
  context: {
    type: Object as () => Pick<Context, "players" | "scoring">,
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

  const mapper =
    (lastRound: number) => (value: Scoring, index: number, arr: Scoring[]) => {
      const score = getScoreForPlayer(value.player, [value]);
      return {
        value: score,
        underline:
          index === arr.length - 1 || arr[index + 1]?.round !== value.round,
        highlight: props.highlightPoints && value.round === lastRound,
      };
    };

  const player1 = props.context.players[0];
  const player2 = props.context.players[1];
  const lastRound = scoring.length > 0 ? scoring[scoring.length - 1].round : 0;
  playerOneScoreBoard.value = groups[player1]?.map(mapper(lastRound)) ?? [];
  playerTwoScoreBoard.value = groups[player2]?.map(mapper(lastRound)) ?? [];

  const numberOfItems = Math.max(
    playerOneScoreBoard.value.length,
    playerTwoScoreBoard.value.length,
  );
  length.value = Math.max(50 + numberOfItems * 15, 100);
}

updateScores();

const playerOneScore = computed(() =>
  getScoreForPlayer(props.context.players[0], props.context.scoring),
);
const playerTwoScore = computed(() =>
  getScoreForPlayer(props.context.players[1], props.context.scoring),
);
const winner = computed(() => getWinner(props.context));

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
    :id="props.id"
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
      v-highlight="props.highlightWinner && winner === context.players[0]"
      x="50"
      y="15"
      text-anchor="middle"
    >
      {{ context.players[0] }}
    </text>
    <text
      v-highlight="props.highlightWinner && winner === context.players[1]"
      x="150"
      y="15"
      text-anchor="middle"
    >
      {{ context.players[1] }}
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
      v-highlight="props.highlightWinner && winner === context.players[0]"
      x="60"
      :y="length - 6"
    >
      {{ playerOneScore }}
    </text>
    <text
      v-highlight="props.highlightWinner && winner === context.players[1]"
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
