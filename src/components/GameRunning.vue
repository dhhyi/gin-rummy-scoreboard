<script setup lang="ts">
import { ref } from "vue";
import { type Context, getScoreForPlayer } from "../game-machine";

const props = defineProps({
  context: { type: Object as () => Context, required: true },
});

const emit = defineEmits<{
  (e: "player-one-ends"): void;
  (e: "player-two-ends"): void;
}>();

function score(player: 1 | 2) {
  return getScoreForPlayer(player, props.context.scoring);
}

const dealer =
  props.context.rounds % 2 === 0
    ? props.context.playerOne
    : props.context.playerTwo;

const ended = ref(false);
const round = props.context.rounds + 1;
</script>

<template>
  <h1 v-if="!ended">Runde {{ round }} läuft</h1>
  <h1 v-else>Runde {{ round }} beendet</h1>
  <h2 v-if="!ended">{{ dealer }} muss geben.</h2>
  <button v-if="!ended" @click="ended = true">Runde beenden</button>
  <div v-if="ended" class="flex flex-col gap-8">
    <h2>Wer hat die Runde beendet?</h2>
    <button @click="emit('player-one-ends')">
      {{ context.playerOne }} ({{ score(1) }})
    </button>
    <button @click="emit('player-two-ends')">
      {{ context.playerTwo }} ({{ score(2) }})
    </button>
  </div>
</template>
