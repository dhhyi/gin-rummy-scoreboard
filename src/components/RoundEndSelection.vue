<script lang="ts" setup>
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
  <h1>Runde beendet</h1>
  <div>
    <h2>{{ player }}, wie hast du beendet?</h2>
    <button @click="emit('knock')">Klopfen</button>
    <button @click="emit('gin')">Gin</button>
    <button @click="emit('big-gin')">Big Gin</button>
  </div>
</template>
