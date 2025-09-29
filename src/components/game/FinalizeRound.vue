<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import { type Context } from "../../game-machine";
import ScoringSVG from "../ScoringSVG.vue";

const { t: $t } = useI18n();

defineProps({
  context: {
    type: Object as () => Context,
    required: true,
  },
});

const emits = defineEmits<{
  (e: "continue-game"): void;
  (e: "correct-score"): void;
}>();
</script>

<template>
  <h1>{{ $t("intermediate-score") }}</h1>
  <div>
    <ScoringSVG :context="context" :highlight-points="true" />
    <button @click="emits('correct-score')">{{ $t("correct-score") }}</button>
  </div>
  <button @click="emits('continue-game')">{{ $t("continue") }}</button>
</template>

<i18n lang="json" locale="de">
{
  "intermediate-score": "Zwischenstand",
  "correct-score": "Punkte korrigieren",
  "continue": "Weiter"
}
</i18n>

<i18n lang="json" locale="en">
{
  "intermediate-score": "Intermediate score",
  "correct-score": "Correct score",
  "continue": "Continue"
}
</i18n>
