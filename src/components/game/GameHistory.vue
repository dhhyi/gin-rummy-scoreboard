<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { deleteHistoryEntry, history, statistics } from "../../game-history";
import ScoringSVG from "../ScoringSVG.vue";

const { t: $t } = useI18n();

defineEmits<{
  (e: "back"): void;
}>();

function formatDate(date: number) {
  return new Intl.DateTimeFormat(navigator.language, {
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
    if (confirm($t("confirm-delete"))) {
      deleteHistoryEntry(index);
    }
    lastClickedIndex = null;
    clickCount = 0;
  }
}
</script>

<template>
  <button class="nav" @click="$emit('back')">{{ $t("back") }}</button>
  <h1>{{ $t("game-history") }}</h1>
  <div v-if="history.length" class="last:pb-8">
    <div
      v-for="(entry, index) in history"
      :key="index"
      class="flex flex-col gap-2"
      @click="clickEntry(index)"
    >
      <h2>
        {{ $t("game-on")
        }}<span class="e2e-hidden">{{ formatDate(entry.date) }}</span>
      </h2>
      <ScoringSVG :context="entry" :highlight-winner="true" />
    </div>
    <p class="text-xs">
      {{ $t("click-to-delete") }}
    </p>
    <h2 class="mt-4 font-bold">{{ $t("statistics") }}</h2>
    <div
      v-for="(stats, title) in statistics"
      :key="title"
      class="flex flex-col justify-center gap-1"
    >
      <span class="font-bold">{{ title }}</span>
      <span>{{ $t("vs", stats) }}</span>
    </div>
  </div>
  <p v-else>{{ $t("no-history") }}</p>
</template>

<i18n lang="json" locale="de">
{
  "game-history": "Spielverlauf",
  "back": "Zurück",
  "game-on": "Spiel am ",
  "no-history": "Es sind noch keine Spiele gespeichert.",
  "click-to-delete": "Klicke 10 Mal auf einen Eintrag, um ihn zu löschen.",
  "confirm-delete": "Willst du diesen Eintrag wirklich löschen?",
  "statistics": "Statistik",
  "vs": "{one} : {two}"
}
</i18n>

<i18n lang="json" locale="en">
{
  "game-history": "Game History",
  "back": "Back",
  "game-on": "Game on ",
  "no-history": "No games have been saved yet.",
  "click-to-delete": "Click 10 times on an entry to delete it.",
  "confirm-delete": "Do you really want to delete this entry?",
  "statistics": "Statistics",
  "vs": "{one} : {two}"
}
</i18n>
