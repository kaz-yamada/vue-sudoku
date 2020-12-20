<template>
  <div
    :id="'square-' + square"
    class="cell"
    :class="{
      'cell-selected': isSelected,
      'game-square': isGameSquare,
      'highlight-peer': isPeer,
      'highlight-number': isSameValue,
      incorrect: isIncorrect
    }"
    @click="$emit('click-square', square)"
  >
    <div class="cell-value">
      <div class="cell-value-inner">
        <template v-if="value !== '.' && value !== '0'">
          {{ value }}
        </template>
      </div>
    </div>
    <div class="notes-grid">
      <template v-if="notes && (value === '.' || value === '0')">
        <div
          :key="noteKey"
          class="notes-grid-cell"
          v-for="(noteValue, noteKey) in notes"
        >
          <template v-if="noteValue">{{ noteKey }}</template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

@Options({
  props: {
    square: String,
    value: String,
    isGameSquare: Boolean,
    isSelected: Boolean,
    isPeer: Boolean,
    isSameValue: Boolean,
    isIncorrect: Boolean,
    notes: Object
  },
  emits: ['click-square']
})
export default class Square extends Vue {
  value!: string;
}
</script>

<style scoped lang="scss">
.cell {
  width: 100%;
  height: 100%;

  &.game-square .cell-value {
    color: #545454;
  }

  &:not(.game-square) .cell-value {
    color: #0052a3;
  }

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  &:hover {
    background-color: #1489ff !important;

    .cell-value {
      color: #ffffff;
    }
  }

  &:nth-child(3n) {
    border-right: 0;
  }

  &:nth-child(3n + 4) {
    border-left: 1px solid #bec6d4;
  }

  &.highlight-peer {
    background-color: #f7f7f7;
  }

  &.highlight-number {
    background-color: #c4e1ff;
  }

  &.cell-selected {
    background-color: #1489ff;

    .cell-value,
    .notes-grid-cell {
      color: #ffffff;
    }
  }

  &.incorrect {
    background-color: #f76e64;

    &.game-square {
      color: #080808;
    }

    &:not(.game-square) {
      & .cell-value {
        color: #ffffff;
        background-color: #a30b00;
      }

      &.cell-selected .cell-value {
        background-color: #74047c;
        color: #ffffff;
      }
    }
  }
}

.cell-value {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-weight: 100;
  text-align: center;
}

.cell-value-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 40px;
}

.notes-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  line-height: 0;
  font-size: 0;

  .notes-grid-cell {
    position: relative;
    flex: calc(100% / 3);
    height: calc(100% / 3);
    font-size: 14px;
    line-height: 1;
    justify-content: center;
    align-items: center;
    display: inline-flex;
  }
}
</style>
