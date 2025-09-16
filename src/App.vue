<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import CountDeadWood from "./components/game/CountDeadWood.vue";
import FinalizeRound from "./components/game/FinalizeRound.vue";
import GameHistory from "./components/game/GameHistory.vue";
import GameIdle from "./components/game/GameIdle.vue";
import GameOver from "./components/game/GameOver.vue";
import RoundEnding from "./components/game/RoundEnding.vue";
import RoundEndSelection from "./components/game/RoundEndSelection.vue";
import RoundRunning from "./components/game/RoundRunning.vue";
import SelectNames from "./components/game/SelectNames.vue";
import ScoringSVG from "./components/ScoringSVG.vue";
import { setupGameMachine, type Context } from "./game-machine";

const { t: $t } = useI18n();

const { send, snapshot } = setupGameMachine();
function endingPlayer(context: Context) {
  return context.roundEndedBy === 1 ? context.playerOne! : context.playerTwo!;
}
function otherPlayer(context: Context) {
  return context.roundEndedBy === 1 ? context.playerTwo! : context.playerOne!;
}
const displayScoreBoard = ref(false);

function reset() {
  if (confirm($t("reset-confirmation"))) {
    send({ type: "back-to-title" });
    displayScoreBoard.value = false;
  }
}
</script>

<template>
  <button
    v-if="snapshot.hasTag('display-scoreboard-link')"
    class="nav"
    @click="displayScoreBoard = !displayScoreBoard"
  >
    {{ displayScoreBoard ? $t("hide-scoreboard") : $t("display-scoreboard") }}
  </button>
  <template v-if="displayScoreBoard">
    <ScoringSVG :context="snapshot.context" class="mt-4 mb-auto" />
    <button @click="reset()">{{ $t("reset") }}</button>
  </template>
  <template v-else>
    <GameIdle
      v-if="snapshot.matches('idle')"
      @new-game="send({ type: 'new-game' })"
      @show-history="send({ type: 'show-history' })"
    />
    <GameHistory
      v-else-if="snapshot.matches('history')"
      @back="send({ type: 'back-to-title' })"
    />
    <SelectNames
      v-else-if="snapshot.matches('playerSelection')"
      @start-game="(one, two) => send({ type: 'start-game', one, two })"
    />
    <RoundRunning
      v-else-if="snapshot.matches({ game: 'roundRunning' })"
      :context="snapshot.context"
      @round-ends="send({ type: 'round-ending' })"
    />
    <RoundEnding
      v-else-if="snapshot.matches({ game: 'roundEnding' })"
      :context="snapshot.context"
      @player-one-ends="send({ type: 'end-round-by', player: 1 })"
      @player-two-ends="send({ type: 'end-round-by', player: 2 })"
    />
    <RoundEndSelection
      v-else-if="snapshot.matches({ game: 'roundEndSelection' })"
      :player="endingPlayer(snapshot.context)"
      @knock="send({ type: 'end-round-with-knock' })"
      @gin="send({ type: 'end-round-with-gin' })"
      @big-gin="send({ type: 'end-round-with-big-gin' })"
    />
    <CountDeadWood
      v-else-if="snapshot.matches({ game: 'countOtherPlayerDeadWood' })"
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
      v-else-if="snapshot.matches({ game: 'countFirstPlayerDeadWood' })"
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
      v-else-if="snapshot.matches({ game: 'countSecondPlayerDeadWood' })"
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
      v-else-if="snapshot.matches({ game: 'finalizeRound' })"
      :context="snapshot.context"
      @continue-game="send({ type: 'continue-game' })"
      @correct-score="send({ type: 'correct-score' })"
    />
    <GameOver
      v-else-if="snapshot.matches({ game: 'gameOver' })"
      :context="snapshot.context"
      @back-to-title="send({ type: 'back-to-title' })"
    />
  </template>
</template>

<i18n locale="de" lang="json">
{
  "display-scoreboard": "Punkte anzeigen",
  "hide-scoreboard": "Punkte ausblenden",
  "reset": "Reset",
  "reset-confirmation": "Möchtest du das Spiel wirklich zurücksetzen? Der aktuelle Spielstand geht verloren."
}
</i18n>

<i18n locale="en" lang="json">
{
  "display-scoreboard": "Display Scoreboard",
  "hide-scoreboard": "Hide Scoreboard",
  "reset": "Reset",
  "reset-confirmation": "Are you sure you want to reset the game? The current score will be lost."
}
</i18n>
