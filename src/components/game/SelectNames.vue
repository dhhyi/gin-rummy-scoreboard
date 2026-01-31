<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

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

function switchNames() {
  const name = playerOne.value;
  playerOne.value = playerTwo.value;
  playerTwo.value = name;
}
</script>

<template>
  <h1>{{ $t("start") }}</h1>
  <form id="namesForm" @submit.prevent="startGame()">
    <h2>{{ $t("enter-names") }}</h2>
    <input
      v-model="playerOne"
      type="text"
      name="Spieler1"
      placeholder="Spieler 1"
    />
    <button class="self-center" @click.prevent="switchNames()">
      {{ $t("switch-players") }}
    </button>
    <input
      v-model="playerTwo"
      type="text"
      name="Spieler2"
      placeholder="Spieler 2"
    />
  </form>
  <button form="namesForm" :disabled="!canSubmit" type="submit">
    {{ $t("start-game") }}
  </button>
</template>

<i18n lang="json" locale="de">
{
  "start": "Start",
  "start-game": "Spiel starten",
  "enter-names": "Bitte gebt eure Namen ein:",
  "switch-players": "˄˅"
}
</i18n>

<i18n lang="json" locale="en">
{
  "start": "Start",
  "start-game": "Start Game",
  "enter-names": "Please enter your names:",
  "switch-players": "˄˅"
}
</i18n>
