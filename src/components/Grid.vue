<template>
  <div class="game-wrapper">
    <div class="game">
      <table class="game-table">
        <tbody>
          <tr class="game-row" v-for="row in rows" :key="row">
            <td
              :key="col"
              :id="col + row"
              class="game-cell"
              v-for="col in cols"
              @click="$emit('select-cell', row + col)"
              v-bind:class="{
                'cell-selected': selectedSquare === row + col,
                'game-square': gameSquares[row + col],
                incorrect: incorrectSquares[row + col]
              }"
            >
              <Square :value="values[row + col]" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Square from './Square.vue';

@Options({
  components: {
    Square
  },
  props: {
    rows: Array,
    cols: Array,
    incorrectSquares: Object,
    selectedSquare: String,
    gameSquares: Object,
    values: Object
  },
  emits: ['select-cell']
})
export default class Grid extends Vue {
  values!: object;
  rows!: string[];
  cols!: string[];
}
</script>

<style lang="scss">
.game-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  min-width: 250px;
  background-color: #f3f6fa;
}

.game-wrapper:after {
  content: '';
  display: block;
  padding-bottom: 100%;
}

.game-wrapper .game {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.limit-reached .game-wrapper {
  opacity: 0;
  pointer-events: none;
}

.game-tip {
  display: none;
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  padding: 15px 30px;
  background-color: #4a90e2;
  border-radius: 5px;
  color: #fff;
  font-size: 15px;
  line-height: 1.67;
  text-align: center;
  z-index: 1;
}

.paused .game-tip {
  opacity: 0;
  pointer-events: none;
}

@media screen and (max-width: 460px) {
  .game-tip {
    left: 10px;
    right: 10px;
    bottom: 10px;
    padding: 10px;
  }
}

.game-table {
  width: 100%;
  margin: 0 auto;
  padding: 0;
  background: #fff;
  user-select: none;
  border: 2px solid #344861;
}

.game-table,
.game-table:after {
  display: block;
  box-sizing: border-box;
  height: 100%;
}

.game-table:after {
  content: '';
  position: absolute;
  left: 33.3333%;
  width: 33.3333%;
  top: 0;
  border-left: 2px solid #344861;
  border-right: 2px solid #344861;
  pointer-events: none;
}

.game-table tbody {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.game-table tbody:after {
  display: block;
  content: '';
  position: absolute;
  left: 0;
  top: 33.3333%;
  height: 33.4%;
  border-top: 2px solid #344861;
  border-bottom: 2px solid #344861;
  pointer-events: none;
}

.game-row,
.game-table tbody:after {
  box-sizing: border-box;
  width: 100%;
}

.game-row {
  height: 11.11111%;
}

.game-cell,
.game-row {
  display: flex;
  padding: 0;
  margin: 0;
}

.game-cell {
  flex-basis: 11.1111%;
  box-sizing: border-box;
  position: relative;
  border-right: 1px solid #bec6d4;
  border-bottom: 1px solid #bec6d4;
  cursor: pointer;
  transform: translateZ(0);
  color: #080808;
}

.game-cell:not(.game-square) .cell-value {
  color: blue;
}

.game-cell:after {
  content: '';
  display: block;
  padding-bottom: 100%;
}

.game-cell:hover {
  background-color: #def;
}

.game-cell:nth-child(3n) {
  border-right: 0;
}

.game-cell:nth-child(3n + 4) {
  border-left: 1px solid #bec6d4;
}

.game-row:nth-child(3n) .game-cell {
  border-bottom: 0;
}

.game-row:nth-child(3n + 4) .game-cell {
  border-top: 1px solid #bec6d4;
}

.game-cell.highlight-table {
  background-color: #e2e7ed;
}

.paused .game-cell.highlight-table {
  background-color: transparent;
}

.game-cell.highlight-number {
  background-color: #cbdbed;
}

.paused .game-cell.highlight-number {
  background-color: transparent;
}

.game-cell.incorrect {
  background-color: #f7cfd6;
}

.game-cell.incorrect:not(.game-square) .cell-value svg path {
  fill: red;
}

.paused .game-cell.incorrect {
  background-color: transparent;
}

.game-cell.mistake .cell-value {
  color: red;
}

.game-cell.cell-selected {
  background-color: #bbdefb;
}

.paused .game-cell.cell-selected {
  background-color: transparent;
}

.filled-animation {
  animation: filledGrid 0.3s cubic-bezier(0, 0.5, 1, 0.5);
}

.filled-animation-long {
  animation: filledGrid 0.4s cubic-bezier(0, 0.5, 1, 0.5);
}

.game-cell.cell-selected {
  background-color: #bbdefb;
}
</style>
