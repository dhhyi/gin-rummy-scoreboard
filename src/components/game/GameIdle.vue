<script lang="ts" setup>
import { inject } from "vue";
import { Send } from "../../game-machine";

const gitHash = GIT_HASH;
const send = inject(Send)!;
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
  <button class="nav" @click="send({ type: 'show-history' })">
    Spielverlauf
  </button>
  <button @click="send({ type: 'new-game' })">Neues Spiel</button>
</template>
