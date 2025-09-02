<script setup lang="ts">
import { computed, ref } from "vue";

const emit = defineEmits<{
  (e: "start-game", n1: string, n2: string): void;
}>();

const playerOne = ref(localStorage.getItem("playerOne") ?? "");
const playerTwo = ref(localStorage.getItem("playerTwo") ?? "");

function startGame() {
  const n1 = playerOne.value.trim();
  const n2 = playerTwo.value.trim();

  // save names to localStorage
  localStorage.setItem("playerOne", n1);
  localStorage.setItem("playerTwo", n2);

  emit("start-game", n1, n2);
}

const canSubmit = computed(() => {
  return !!playerOne.value?.trim() && !!playerTwo.value?.trim();
});
</script>

<template>
  <h1>Start</h1>
  <form class="flex flex-col gap-8" @submit.prevent="startGame()">
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
    <button :disabled="!canSubmit" type="submit">Start Game</button>
  </form>
</template>
