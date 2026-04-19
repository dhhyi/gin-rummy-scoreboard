<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { type Context } from "../../game-machine";

const { t: $t } = useI18n();

defineProps({
  context: { type: Object as () => Required<Context>["game"], required: true },
});

const emit = defineEmits<{
  (e: "player-ends", name: string): void;
}>();
</script>

<template>
  <h1>{{ $t("round-ended", { round: context.round }) }}</h1>
  <div>
    <h2>{{ $t("who-ended") }}</h2>
    <button @click="emit('player-ends', context.playerOne)">
      {{ context.playerOne }}
    </button>
    <button @click="emit('player-ends', context.playerTwo)">
      {{ context.playerTwo }}
    </button>
  </div>
</template>

<i18n lang="json" locale="de">
{
  "round-ended": "Runde {round} beendet",
  "who-ended": "Wer hat die Runde beendet?"
}
</i18n>

<i18n lang="json" locale="en">
{
  "round-ended": "Round {round} ended",
  "who-ended": "Who ended the round?"
}
</i18n>
