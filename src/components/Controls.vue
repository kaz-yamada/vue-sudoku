<template>
  <div class="controls">
    <button @click="$emit('click', 'create')">New Game</button>
    <button @click="$emit('click', 'solve')">Solve</button>
    <button @click="$emit('click', 'reset')">Reset</button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  emits: ['click']
})
export default class Controls extends Vue {}
</script>

<style lang="scss">
.controls {
  display: flex;
  flex-direction: column;
  padding: 0 1em;
}

.controls button {
  width: 200px;
  padding: 12px;
  margin-bottom: 12px;
}
</style>
