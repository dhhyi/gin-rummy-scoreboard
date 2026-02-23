<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { type Context } from "../../game-machine";

const { t: $t } = useI18n();

const props = defineProps({
  context: { type: Object as () => Context, required: true },
});

const emit = defineEmits<{
  (e: "round-ends"): void;
}>();

const dealer =
  props.context.round % 2 === 1
    ? props.context.playerOne
    : props.context.playerTwo;

const player =
  props.context.round % 2 === 1
    ? props.context.playerTwo
    : props.context.playerOne;
</script>

<template>
  <h1>{{ $t("round-running", { round: context.round }) }}</h1>
  <div>
    <h2>{{ $t("dealer-message", { dealer }) }}</h2>
    <h2>{{ $t("player-message", { player }) }}</h2>
  </div>
  <button @click="emit('round-ends')">{{ $t("end-round") }}</button>
</template>

<i18n lang="json" locale="de">
{
  "round-running": "Runde {round} läuft",
  "dealer-message": "{dealer} muss geben.",
  "player-message": "{player} spielt aus.",
  "end-round": "Runde beenden"
}
</i18n>

<i18n lang="json" locale="en">
{
  "round-running": "Round {round} is running",
  "dealer-message": "{dealer} is the dealer.",
  "player-message": "{player} is playing the first card.",
  "end-round": "End Round"
}
</i18n>
