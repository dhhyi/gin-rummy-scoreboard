<script lang="ts" setup>
const emit = defineEmits<{
  (e: "new-game"): void;
}>();
</script>

<template>
  <img alt="App logo" src="../assets/gin-rummy-scoreboard.svg" width="200" />
  <h1>Gin Rummy Scoreboard</h1>
  <button @click="emit('new-game')">Neues Spiel</button>
</template>
