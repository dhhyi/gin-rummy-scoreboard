<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef } from "vue";

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
  <h1>Abrechnung</h1>
  <form
    class="flex flex-col gap-8"
    @submit.prevent="emit('dead-wood-counted', deadWood)"
  >
    <h2>{{ player }}, wie viel Totholz hast du?</h2>
    <input ref="dead-wood" v-model="deadWood" type="number" name="dead-wood" />
    <button :disabled="okDisabled" type="submit">OK</button>
  </form>
</template>
