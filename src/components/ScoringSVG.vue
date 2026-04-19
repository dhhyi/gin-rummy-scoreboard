<script lang="ts" setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import {
  type Context,
  getPlayerScores,
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
const playerScoreBoard = ref([] as [string, ScoreViz[]][]);
const width = ref(200);
const length = ref(200);

function updateScores() {
  const scoring = props.context.scoring;

  width.value = props.context.players.length * 100;

  const groups = props.context.players.reduce<Record<string, Scoring[]>>(
    (acc, player) => {
      acc[player] = scoring.filter((s) => s.player === player);
      return acc;
    },
    {},
  );

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

  const lastRound = scoring.length > 0 ? scoring[scoring.length - 1].round : 0;

  playerScoreBoard.value = Object.entries(groups).map(([player, values]) => [
    player,
    values!.map(mapper(lastRound)) ?? [],
  ]);

  const numberOfItems = Math.max(
    ...Object.values(groups).map((values) => values!.length),
  );
  length.value = Math.max(50 + numberOfItems * 15, 100);
}

updateScores();

const playerScores = getPlayerScores(props.context, "map");
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
    :viewBox="`0 0 ${width} ${length}`"
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
      :width="width - 2"
      :height="length - 2"
      rx="15"
      ry="15"
      fill-opacity="0.1"
    />
    <line x1="100" y1="1" x2="100" :y2="length - 1" />
    <line
      v-if="props.context.players.length === 3"
      x1="200"
      y1="1"
      x2="200"
      :y2="length - 1"
    />
    <line x1="1" y1="20" :x2="width - 1" y2="20" />
    <line x1="1" :y1="length - 20" :x2="width - 1" :y2="length - 20" />
    <template
      v-for="([player, data], playerIndex) in playerScoreBoard"
      :key="playerIndex"
    >
      <text
        v-highlight="props.highlightWinner && winner === player"
        :x="50 + playerIndex * 100"
        y="15"
        text-anchor="middle"
      >
        {{ player }}
      </text>
      <template
        v-for="({ value, highlight, underline }, index) in data"
        :key="index"
      >
        <text
          v-highlight="highlight"
          :x="60 + playerIndex * 100"
          :y="35 + index * 15"
        >
          {{ $t("value", { value }) }}
        </text>
        <line
          v-if="underline"
          :x1="30 + playerIndex * 100"
          :y1="38 + index * 15"
          :x2="70 + playerIndex * 100"
          :y2="38 + index * 15"
        />
      </template>
      <text
        v-highlight="props.highlightWinner && winner === player"
        :x="60 + playerIndex * 100"
        :y="length - 6"
      >
        {{ playerScores[player] ?? 0 }}
      </text>
    </template>
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
