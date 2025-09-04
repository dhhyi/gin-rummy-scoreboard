<script setup lang="ts">
import { type Context } from "../game-machine";

const props = defineProps({
  context: { type: Object as () => Context, required: true },
});

const emit = defineEmits<{
  (e: "player-one-ends"): void;
  (e: "player-two-ends"): void;
}>();

const round = props.context.rounds + 1;
</script>

<template>
  <h1>Runde {{ round }} beendet</h1>
  <div class="flex flex-col gap-8">
    <h2>Wer hat die Runde beendet?</h2>
    <button @click="emit('player-one-ends')">
      {{ context.playerOne }}
    </button>
    <button @click="emit('player-two-ends')">
      {{ context.playerTwo }}
    </button>
  </div>
</template>
