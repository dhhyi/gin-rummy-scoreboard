<script setup lang="ts">
import { useMachine } from "@xstate/vue";
import CountDeadWood from "./components/CountDeadWood.vue";
import GameIdle from "./components/GameIdle.vue";
import GameOver from "./components/GameOver.vue";
import GameRunning from "./components/GameRunning.vue";
import RoundEndSelection from "./components/RoundEndSelection.vue";
import SelectNames from "./components/SelectNames.vue";
import { gameMachine } from "./game-machine";

const stateString = localStorage.getItem("state");
const saved = stateString ? JSON.parse(stateString) : undefined;

const { snapshot, send, actorRef } = useMachine(gameMachine, {
  snapshot: saved,
});

actorRef.subscribe(() => {
  const persistedState = actorRef.getPersistedSnapshot();
  localStorage.setItem("state", JSON.stringify(persistedState));
});

function startGame(n1: string, n2: string) {
  send({ type: "start-game", one: n1, two: n2 });
}
</script>

<template>
  <GameIdle
    v-if="snapshot.matches('idle')"
    @new-game="send({ type: 'new-game' })"
  />
  <SelectNames
    v-else-if="snapshot.matches('playerSelection')"
    @start-game="startGame"
  />
  <GameRunning
    v-else-if="snapshot.matches('running')"
    :context="snapshot.context"
    @player-one-ends="send({ type: 'end-round', player: 1 })"
    @player-two-ends="send({ type: 'end-round', player: 2 })"
  />
  <RoundEndSelection
    v-else-if="snapshot.matches('roundEndSelection')"
    :player="
      snapshot.context.roundEndedBy === 1
        ? snapshot.context.playerOne!
        : snapshot.context.playerTwo!
    "
    @knock="send({ type: 'end-round-with-knock' })"
    @gin="send({ type: 'end-round-with-gin' })"
    @big-gin="send({ type: 'end-round-with-big-gin' })"
  />
  <CountDeadWood
    v-else-if="snapshot.matches('countOtherPlayerDeadWood')"
    :player="
      snapshot.context.roundEndedBy === 1
        ? snapshot.context.playerTwo!
        : snapshot.context.playerOne!
    "
    @dead-wood-counted="
      (value) =>
        send({
          type: 'counted-dead-wood',
          player: snapshot.context.roundEndedBy === 1 ? 2 : 1,
          value,
        })
    "
  />
  <CountDeadWood
    v-else-if="snapshot.matches('countFirstPlayerDeadWood')"
    :player="
      snapshot.context.roundEndedBy === 1
        ? snapshot.context.playerOne!
        : snapshot.context.playerTwo!
    "
    @dead-wood-counted="
      (value) =>
        send({
          type: 'counted-dead-wood',
          player: snapshot.context.roundEndedBy!,
          value,
        })
    "
  />
  <CountDeadWood
    v-else-if="snapshot.matches('countSecondPlayerDeadWood')"
    :player="
      snapshot.context.roundEndedBy === 1
        ? snapshot.context.playerTwo!
        : snapshot.context.playerOne!
    "
    @dead-wood-counted="
      (value) =>
        send({
          type: 'counted-dead-wood',
          player: snapshot.context.roundEndedBy === 1 ? 2 : 1,
          value,
        })
    "
  />
  <GameOver
    v-else-if="snapshot.matches('gameOver')"
    :context="snapshot.context"
  />
  <button v-if="!snapshot.matches('idle')" @click="send({ type: 'reset' })">
    Reset
  </button>
</template>

<style></style>
