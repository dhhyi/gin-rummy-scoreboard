<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef } from "vue";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

const props = defineProps({
  player: {
    type: String,
    required: true,
  },
  allowZero: {
    type: Boolean,
    default: false,
  },
});

const deadWood = ref(0);

const emit = defineEmits<{
  (e: "dead-wood-counted", value: number): void;
}>();

const deadWoodInput = useTemplateRef("dead-wood");

onMounted(() => {
  deadWoodInput.value?.focus();
});

const okDisabled = computed(() => {
  return deadWood.value < 0 || (!props.allowZero && deadWood.value === 0);
});
</script>

<template>
  <h1>{{ $t("count-dead-wood") }}</h1>
  <form id="deadWoodForm" @submit.prevent="emit('dead-wood-counted', deadWood)">
    <h2>{{ $t("how-much-dead-wood", { player }) }}</h2>
    <input ref="dead-wood" v-model="deadWood" type="number" name="dead-wood" />
  </form>
  <button form="deadWoodForm" :disabled="okDisabled" type="submit">
    {{ $t("ok") }}
  </button>
</template>

<i18n lang="json" locale="de">
{
  "count-dead-wood": "Totholz zählen",
  "how-much-dead-wood": "{player}, wie viel Totholz hast du?",
  "ok": "OK"
}
</i18n>

<i18n lang="json" locale="en">
{
  "count-dead-wood": "Count dead wood",
  "how-much-dead-wood": "{player}, how much dead wood do you have?",
  "ok": "OK"
}
</i18n>
