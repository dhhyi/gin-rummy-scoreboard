<script setup lang="ts">
import { type Context, getScoreForPlayer } from "../game-machine";

const props = defineProps({
  context: { type: Object as () => Context, required: true },
});

const emit = defineEmits<{
  (e: "player-one-ends"): void;
  (e: "player-two-ends"): void;
}>();

function score(player: 1 | 2) {
  return getScoreForPlayer(player, props.context);
}
</script>

<template>
  <h1>Spiel läuft</h1>
  <div class="flex flex-col gap-8">
    <h2>Wer hat das Spiel beendet?</h2>
    <button @click="emit('player-one-ends')">
      {{ context.playerOne }} ({{ score(1) }})
    </button>
    <button @click="emit('player-two-ends')">
      {{ context.playerTwo }} ({{ score(2) }})
    </button>
  </div>
</template>
