<script lang="ts" setup>
const emit = defineEmits<{
  (e: "new-game"): void;
  (e: "show-history"): void;
}>();
const gitHash = GIT_HASH;
</script>

<template>
  <h1>Gin Rummy Scoreboard</h1>
  <div class="items-center">
    <img
      class="flex-grow"
      alt="App logo"
      src="../../assets/gin-rummy-scoreboard.svg"
      width="200"
    />
    <h2 class="text-xs">Version: {{ gitHash }}</h2>
  </div>
  <button class="nav" @click="emit('show-history')">Spielverlauf</button>
  <button @click="emit('new-game')">Neues Spiel</button>
</template>
