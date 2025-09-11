<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

const emit = defineEmits<{
  (e: "new-game"): void;
  (e: "show-history"): void;
}>();
const gitHash = GIT_HASH;
</script>

<template>
  <h1>{{ $t("title") }}</h1>
  <div class="items-center">
    <img
      class="flex-grow"
      alt="App logo"
      src="../../assets/gin-rummy-scoreboard.svg"
      width="200"
    />
    <h2 class="e2e-hidden text-xs">{{ $t("version", { gitHash }) }}</h2>
  </div>
  <button class="nav" @click="emit('show-history')">
    {{ $t("game-history") }}
  </button>
  <button @click="emit('new-game')">{{ $t("new-game") }}</button>
</template>

<i18n lang="json" locale="de">
{
  "new-game": "Neues Spiel",
  "version": "Version: {gitHash}",
  "game-history": "Spielverlauf"
}
</i18n>

<i18n lang="json" locale="en">
{
  "new-game": "New Game",
  "version": "Version: {gitHash}",
  "game-history": "Game History"
}
</i18n>
