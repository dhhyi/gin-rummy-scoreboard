<script lang="ts" setup>
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

defineProps({
  player: {
    type: String,
    required: true,
  },
});

const emit = defineEmits<{
  (e: "knock"): void;
  (e: "gin"): void;
  (e: "big-gin"): void;
}>();
</script>

<template>
  <h1>{{ $t("round-ended") }}</h1>
  <div>
    <h2>{{ $t("how-ended", { player }) }}</h2>
    <button @click="emit('knock')">{{ $t("knock") }}</button>
    <button @click="emit('gin')">{{ $t("gin") }}</button>
    <button @click="emit('big-gin')">{{ $t("big-gin") }}</button>
  </div>
</template>

<i18n lang="json" locale="de">
{
  "round-ended": "Runde beendet",
  "how-ended": "{player}, wie hast du beendet?",
  "knock": "Klopfen",
  "gin": "Gin",
  "big-gin": "Big Gin"
}
</i18n>

<i18n lang="json" locale="en">
{
  "round-ended": "Round ended",
  "how-ended": "{player}, how did you end?",
  "knock": "Knock",
  "gin": "Gin",
  "big-gin": "Big Gin"
}
</i18n>
