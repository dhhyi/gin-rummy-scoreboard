<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from "vue";

defineProps({
  player: {
    type: String,
    required: true,
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
</script>

<template>
  <h1>Abrechnung</h1>
  <form
    class="flex flex-col gap-8"
    @submit.prevent="emit('dead-wood-counted', deadWood)"
  >
    <h2>{{ player }}, wie viel Totholz hast du?</h2>
    <input ref="dead-wood" v-model="deadWood" type="number" name="dead-wood" />
    <button type="submit">OK</button>
  </form>
</template>
