<template>
  <div class="controls">
    <div class="numpad">
      <div class="numpad-row" v-for="(row, index) in numpad" :key="index">
        <template v-for="num in row" :key="num">
          <button
            class="numpad-button"
            :value="num"
            @click="$emit('click', ['numpad', num])"
          >
            {{ num }}
          </button>
        </template>
      </div>
      <div class="numpad-row">
        <div class="numpad-bottom">
          <button
            class="notes-button"
            :class="{ 'notes-mode-on': notesMode }"
            @click="$emit('click', ['notes'])"
          >
            Notes: <span>{{ notesMode ? 'On' : 'Off' }}</span>
          </button>
          <button class="delete-button" @click="$emit('click', ['delete'])">
            Delete
          </button>
        </div>
      </div>
    </div>

    <div class="game-settings">
      <button
        class="new-game-button"
        :class="{ opened: isDropdownOpen }"
        @click="toggleDropdown"
      >
        New Game
      </button>
      <div class="dropdown" v-if="isDropdownOpen">
        <div class="dropdown-content">
          <button
            :key="item"
            class="dropdown-item"
            v-for="item in difficulties"
            @click="onClickNew(item.value)"
          >
            {{ item.name }}
          </button>
        </div>
      </div>
      <button @click="$emit('click', ['solve'])">Solve</button>
      <button @click="$emit('click', ['reset'])">Reset</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Sudoku from '../services/Sudoku';

@Options({
  emits: ['click'],
  props: {
    notesMode: Boolean
  }
})
export default class Controls extends Vue {
  difficulties = Sudoku.DIFFICULTY;
  isDropdownOpen = false;
  numpad = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ];

  toggleDropdown = () => {
    this.isDropdownOpen = !this.isDropdownOpen;
  };

  onClickNew = (value: number) => {
    this.$emit('click', ['new', value]);
    this.isDropdownOpen = false;
  };
}
</script>

<style lang="scss">
.controls {
  display: flex;
  flex-direction: column;
  padding: 0 1em;
  min-width: 350px;
}

.dropdown-item,
.controls button {
  width: 100%;
  padding: 12px;
  color: #222222;
  font-size: 16px;
  border: 2px solid #222222;
  background-color: #ffffff;
  cursor: pointer;

  &:focus,
  &:hover {
    outline: none;
    background-color: #a4d2ff;
  }

  &:active {
    outline: none;
    background-color: #005fbf;
    color: #ffffff;
  }
}

.numpad {
  width: 100%;
  border-collapse: collapse;
  display: flex;
  flex-flow: column;
  border: solid 1px #222222;

  .numpad-row {
    display: flex;
    flex-flow: row;

    .numpad-button {
      border-width: 1px;
      height: 70px;
      font-size: 40px;
    }
  }

  .numpad-bottom {
    width: 100%;
    display: flex;

    button {
      border-width: 1px;
      height: auto;
    }
  }

  .notes-button {
    span {
      background: #8d8d8d;
      color: #ffffff;
      padding: 4px;
      border-radius: 4px;
    }

    &.notes-mode-on {
      span {
        background: #005fbf;
      }
    }
  }
}

.game-settings {
  margin-top: 24px;
  display: table;
  border-collapse: collapse;

  button {
    display: table-cell;
    margin: -1px 0;
    height: 50px;
  }

  .new-game-button {
    position: relative;

    &::after {
      position: absolute;
      content: '';
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 20px solid #222222;
      right: 15px;
    }

    &.opened::after {
      transform: rotate(180deg);
    }
  }
}

.dropdown {
  position: relative;
}

.dropdown-content {
  position: absolute;
  background: #3e9eff;
  width: 100%;
  //   border: solid 2px #222;
}

.dropdown-item {
  display: flex;
  flex-direction: column;
  padding: 12px;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .controls {
    padding: 12px;
  }
}
</style>
