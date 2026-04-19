<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { inViewTransition } from "../../view-transition";

const { t: $t } = useI18n();

const emit = defineEmits<{
  (e: "start-game", players: [string, string] | [string, string, string]): void;
}>();

const playerPrefix = "gin-rummy-scoreboard-";
const playerOne = ref(localStorage.getItem(playerPrefix + "player-one") ?? "");
const playerTwo = ref(localStorage.getItem(playerPrefix + "player-two") ?? "");
const playerThree = ref(
  localStorage.getItem(playerPrefix + "player-three") ?? "",
);

function startGame() {
  const n1 = playerOne.value.trim();
  const n2 = playerTwo.value.trim();
  const n3 = playerThree.value.trim();

  // save names to localStorage
  localStorage.setItem(playerPrefix + "player-one", n1);
  localStorage.setItem(playerPrefix + "player-two", n2);
  localStorage.setItem(playerPrefix + "player-three", n3);

  let players: [string, string] | [string, string, string];
  if (n3) {
    players = [n1, n2, n3];
  } else {
    players = [n1, n2];
  }

  emit("start-game", players);
}

const canSubmit = computed(() => {
  return !!playerOne.value?.trim() && !!playerTwo.value?.trim();
});

function switchNames(type: "1<>2" | "2<>3") {
  inViewTransition(() => {
    if (type === "1<>2") {
      const name = playerOne.value;
      playerOne.value = playerTwo.value;
      playerTwo.value = name;
    } else if (type === "2<>3") {
      const name = playerTwo.value;
      playerTwo.value = playerThree.value;
      playerThree.value = name;
    }
  });
}
</script>

<template>
  <h1>{{ $t("start") }}</h1>
  <form id="namesForm" @submit.prevent="startGame()">
    <h2>{{ $t("enter-names") }}</h2>
    <input
      v-model="playerOne"
      type="text"
      :placeholder="$t('player-1-placeholder')"
    />
    <button class="self-center" @click.prevent="switchNames('1<>2')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="currentColor"
        class="h-6 w-6 rotate-90 transform"
      >
        <path
          d="M280-280 80-480l200-200 56 56-103 104h494L624-624l56-56 200 200-200 200-56-56 103-104H233l103 104-56 56Z"
        />
      </svg>
    </button>
    <input
      v-model="playerTwo"
      type="text"
      :placeholder="$t('player-2-placeholder')"
    />
    <button class="self-center" @click.prevent="switchNames('2<>3')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="currentColor"
        class="h-6 w-6 rotate-90 transform"
      >
        <path
          d="M280-280 80-480l200-200 56 56-103 104h494L624-624l56-56 200 200-200 200-56-56 103-104H233l103 104-56 56Z"
        />
      </svg>
    </button>
    <input
      v-model="playerThree"
      type="text"
      :placeholder="$t('player-3-placeholder')"
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
  "player-1-placeholder": "Spieler 1",
  "player-2-placeholder": "Spieler 2",
  "player-3-placeholder": "Spieler 3 (optional)"
}
</i18n>

<i18n lang="json" locale="en">
{
  "start": "Start",
  "start-game": "Start Game",
  "enter-names": "Please enter your names:",
  "player-1-placeholder": "Player 1",
  "player-2-placeholder": "Player 2",
  "player-3-placeholder": "Player 3 (optional)"
}
</i18n>
