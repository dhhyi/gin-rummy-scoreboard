<script setup lang="ts">
import { ref } from "vue";
import CountDeadWood from "./components/CountDeadWood.vue";
import FinalizeRound from "./components/FinalizeRound.vue";
import GameIdle from "./components/GameIdle.vue";
import GameOver from "./components/GameOver.vue";
import RoundEnding from "./components/RoundEnding.vue";
import RoundEndSelection from "./components/RoundEndSelection.vue";
import RoundRunning from "./components/RoundRunning.vue";
import ScoringSVG from "./components/ScoringSVG.vue";
import SelectNames from "./components/SelectNames.vue";
import { setupGameMachine, type Context } from "./game-machine";

const { send, snapshot } = setupGameMachine();
function endingPlayer(context: Context) {
  return context.roundEndedBy === 1 ? context.playerOne! : context.playerTwo!;
}
function otherPlayer(context: Context) {
  return context.roundEndedBy === 1 ? context.playerTwo! : context.playerOne!;
}
const displayScoreBoard = ref(false);
</script>

<template>
  <button
    v-if="snapshot.hasTag('in-game')"
    @click="displayScoreBoard = !displayScoreBoard"
  >
    Punkte {{ displayScoreBoard ? "ausblenden" : "anzeigen" }}
  </button>
  <template v-if="displayScoreBoard">
    <ScoringSVG :context="snapshot.context" class="mt-4 mb-auto" />
    <button
      @click="
        send({ type: 'reset' });
        displayScoreBoard = false;
      "
    >
      Reset
    </button>
  </template>
  <template v-else>
    <GameIdle
      v-if="snapshot.matches('idle')"
      @new-game="send({ type: 'new-game' })"
    />
    <SelectNames
      v-else-if="snapshot.matches('playerSelection')"
      @start-game="(one, two) => send({ type: 'start-game', one, two })"
    />
    <RoundRunning
      v-else-if="snapshot.matches('roundRunning')"
      :context="snapshot.context"
      @round-ends="send({ type: 'round-ending' })"
    />
    <RoundEnding
      v-else-if="snapshot.matches('roundEnding')"
      :context="snapshot.context"
      @player-one-ends="send({ type: 'end-round-by', player: 1 })"
      @player-two-ends="send({ type: 'end-round-by', player: 2 })"
    />
    <RoundEndSelection
      v-else-if="snapshot.matches('roundEndSelection')"
      :player="endingPlayer(snapshot.context)"
      @knock="send({ type: 'end-round-with-knock' })"
      @gin="send({ type: 'end-round-with-gin' })"
      @big-gin="send({ type: 'end-round-with-big-gin' })"
    />
    <CountDeadWood
      v-else-if="snapshot.matches('countOtherPlayerDeadWood')"
      :player="otherPlayer(snapshot.context)"
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
      :player="endingPlayer(snapshot.context)"
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
      :player="otherPlayer(snapshot.context)"
      :allow-zero="true"
      @dead-wood-counted="
        (value) =>
          send({
            type: 'counted-dead-wood',
            player: snapshot.context.roundEndedBy === 1 ? 2 : 1,
            value,
          })
      "
    />
    <FinalizeRound
      v-else-if="snapshot.matches('finalizeRound')"
      :context="snapshot.context"
      @continue-game="send({ type: 'continue-game' })"
      @correct-score="send({ type: 'correct-score' })"
    />
    <GameOver
      v-else-if="snapshot.matches('gameOver')"
      :context="snapshot.context"
      @new-game="send({ type: 'new-game' })"
    />
  </template>
</template>

<style></style>
