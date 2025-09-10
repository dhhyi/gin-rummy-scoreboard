<script lang="ts" setup>
import { deleteHistoryEntry, history } from "../../game-history";
import ScoringSVG from "../ScoringSVG.vue";

defineEmits<{
  (e: "back"): void;
}>();

function formatDate(date: number) {
  return new Intl.DateTimeFormat("de", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

let lastClickedIndex: number | null = null;
let clickCount = 0;
function clickEntry(index: number) {
  if (lastClickedIndex === index) {
    clickCount++;
  } else {
    lastClickedIndex = index;
    clickCount = 1;
  }
  if (clickCount >= 10) {
    if (confirm("Willst du diesen Eintrag wirklich löschen?")) {
      deleteHistoryEntry(index);
    }
    lastClickedIndex = null;
    clickCount = 0;
  }
}
</script>

<template>
  <button class="nav" @click="$emit('back')">Zurück</button>
  <h1>Spielverlauf</h1>
  <div v-if="history.length">
    <div
      v-for="(entry, index) in history"
      :key="index"
      class="flex flex-col gap-2"
      @click="clickEntry(index)"
    >
      <h2>
        Spiel am <span class="e2e-hidden">{{ formatDate(entry.date) }}</span>
      </h2>
      <ScoringSVG :context="entry" />
    </div>
    <p class="pb-4 text-xs">
      Klicke 10 Mal auf einen Eintrag, um ihn zu löschen.
    </p>
  </div>
  <p v-else>Es sind noch keine Spiele gespeichert.</p>
</template>
