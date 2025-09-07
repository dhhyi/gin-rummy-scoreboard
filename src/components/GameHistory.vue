<script lang="ts" setup>
import { ref } from "vue";
import { getHistory } from "../game-history";
import ScoringSVG from "./ScoringSVG.vue";

defineEmits<{
  (e: "back"): void;
}>();

const history = ref(getHistory());

function formatDate(date: number) {
  return new Intl.DateTimeFormat("de", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}
</script>

<template>
  <button class="nav" @click="$emit('back')">Zurück</button>
  <h1>Spielverlauf</h1>
  <div>
    <div
      v-for="(entry, index) in history"
      :key="index"
      class="flex flex-col gap-2"
    >
      <h2>Spiel am {{ formatDate(entry.date) }}</h2>
      <ScoringSVG :context="entry" />
    </div>
  </div>
</template>
