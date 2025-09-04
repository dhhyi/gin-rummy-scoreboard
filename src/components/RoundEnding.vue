<script setup lang="ts">
import { type Context } from "../game-machine";

defineProps({
  context: { type: Object as () => Context, required: true },
});

const emit = defineEmits<{
  (e: "player-one-ends"): void;
  (e: "player-two-ends"): void;
}>();
</script>

<template>
  <h1>Runde {{ context.round }} beendet</h1>
  <div>
    <h2>Wer hat die Runde beendet?</h2>
    <button @click="emit('player-one-ends')">
      {{ context.playerOne }}
    </button>
    <button @click="emit('player-two-ends')">
      {{ context.playerTwo }}
    </button>
  </div>
</template>
