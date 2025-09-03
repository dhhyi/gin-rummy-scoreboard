<script setup lang="ts">
import { type Context } from "../game-machine";

const props = defineProps({
  context: { type: Object as () => Context, required: true },
});

const emit = defineEmits<{
  (e: "round-ends"): void;
}>();

const dealer =
  props.context.rounds % 2 === 0
    ? props.context.playerOne
    : props.context.playerTwo;

const round = props.context.rounds + 1;
</script>

<template>
  <h1>Runde {{ round }} läuft</h1>
  <h2>{{ dealer }} muss geben.</h2>
  <button @click="emit('round-ends')">Runde beenden</button>
</template>
