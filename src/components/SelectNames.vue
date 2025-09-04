<script setup lang="ts">
import { computed, ref } from "vue";

const emit = defineEmits<{
  (e: "start-game", n1: string, n2: string): void;
}>();

const playerPrefix = "gin-rummy-scoreboard-";
const playerOne = ref(localStorage.getItem(playerPrefix + "player-one") ?? "");
const playerTwo = ref(localStorage.getItem(playerPrefix + "player-two") ?? "");

function startGame() {
  const n1 = playerOne.value.trim();
  const n2 = playerTwo.value.trim();

  // save names to localStorage
  localStorage.setItem(playerPrefix + "player-one", n1);
  localStorage.setItem(playerPrefix + "player-two", n2);

  emit("start-game", n1, n2);
}

const canSubmit = computed(() => {
  return !!playerOne.value?.trim() && !!playerTwo.value?.trim();
});
</script>

<template>
  <h1>Start</h1>
  <form id="namesForm" @submit.prevent="startGame()">
    <h2>Bitte gebt eure Namen ein:</h2>
    <input
      v-model="playerOne"
      type="text"
      name="Spieler1"
      placeholder="Spieler 1"
    />
    <input
      v-model="playerTwo"
      type="text"
      name="Spieler2"
      placeholder="Spieler 2"
    />
  </form>
  <button form="namesForm" :disabled="!canSubmit" type="submit">
    Spiel starten
  </button>
</template>
