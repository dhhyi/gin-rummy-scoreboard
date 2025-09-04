<script lang="ts" setup>
import { type Context } from "../game-machine";
import ScoringSVG from "./ScoringSVG.vue";

defineProps({
  context: {
    type: Object as () => Context,
    required: true,
  },
});

const emits = defineEmits<{
  (e: "continue-game"): void;
  (e: "correct-score"): void;
}>();
</script>

<template>
  <h1>Zwischenstand</h1>
  <div>
    <ScoringSVG :context="context" :highlight="true" />
    <button @click="emits('correct-score')">Punkte korrigieren</button>
  </div>
  <button @click="emits('continue-game')">Weiter</button>
</template>
