<template>
  <div class="game-wrapper">
    <div class="game">
      <table class="game-table" :key="gameString">
        <tbody>
          <tr class="game-row" v-for="row in game.rows" :key="row">
            <td v-for="col in game.cols" :key="col" class="game-col">
              <Square
                :value="game.values[row + col]"
                :isSelected="selectedSquare === row + col"
                :isGameSquare="game.gameSquares[row + col]"
                :isHighlighted="peers && peers.has(row + col)"
                :isIncorrect="game.incorrectSquares[row + col]"
                :notes="game.notes[row + col]"
                @click-square="handleSelectSquare(row + col)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Controls @click="handleControls" :notesMode="isNotesMode" />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Square from './Square.vue';
import Controls from './Controls.vue';

import Sudoku from '../services/Sudoku';

@Options({
  components: {
    Controls,
    Square
  },
  props: {
    onControlsClicked: Array
  }
})
export default class Game extends Vue {
  game = new Sudoku();
  values!: object;
  gameString = '';
  selectedSquare = '';
  isNotesMode = false;
  selectedPeers: string[] = [];

  get peers(): Set<string> {
    return new Set(this.selectedPeers);
  }

  created() {
    this.gameString = this.game.createNewGame();
  }

  mounted() {
    window.addEventListener('keydown', this.handleKeyPress);
  }

  handleKeyPress = (e: KeyboardEvent) => {
    let value = e.key;
    if (value.substr(0, 5) === 'Arrow') {
      const direction = value.substr(5);
      this.moveSquare(direction);
      return;
    }

    if (e.code === 'Delete' || e.code === 'Backspace') {
      value = 'Delete';
    }

    this.onNumberImput(value);
  };

  handleSolveGame = () => {
    this.gameString = this.game.solve();
  };

  handleSelectSquare = (square: string) => {
    this.selectedSquare = square;
    this.selectedPeers = this.game.getSelectedPeers(square);
  };

  handleControls(args: (string | number)[]) {
    switch (args[0]) {
      case 'numpad': {
        this.onNumberImput(args[1] as string);
        break;
      }
      case 'delete': {
        this.game.setSquareValue('Delete', this.selectedSquare);
        break;
      }
      case 'notes': {
        this.isNotesMode = !this.isNotesMode;
        break;
      }
      case 'new': {
        this.gameString = this.game.createNewGame(args[1] as number);
        break;
      }
      case 'solve': {
        this.gameString = this.game.solve();
        break;
      }
      case 'reset': {
        this.gameString = '';
        this.gameString = this.game.resetGame();
        this.selectedSquare = '';
        break;
      }
      default:
        console.log(args);
    }
  }

  onNumberImput = (value: string) => {
    if (this.selectedSquare !== '' && Sudoku.DIGITS.includes(value)) {
      if (!this.isNotesMode) {
        this.game.setSquareValue(value, this.selectedSquare);
      } else {
        this.game.setSquareNote(value, this.selectedSquare);
      }
    }
  };

  moveSquare = (direction: string) => {
    let row = this.selectedSquare.charAt(0);
    let col = parseInt(this.selectedSquare.charAt(1));
    switch (direction.toLowerCase()) {
      case 'up':
        row = String.fromCharCode(row.charCodeAt(0) - 1);
        break;
      case 'down':
        row = String.fromCharCode(row.charCodeAt(0) + 1);
        break;
      case 'left':
        col = col - 1;
        break;
      case 'right':
        col = col + 1;
        break;
      default:
        return;
    }

    if (Sudoku.ROWS.includes(row) && col > 0 && col < 10) {
      const square = row + col;
      this.selectedSquare = square;
      this.selectedPeers = this.game.getSelectedPeers(square);
    }
  };
}
</script>

<style lang="scss">
.game-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  min-width: 250px;
  background-color: #f3f6fa;

  &::after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }

  .game {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}

.limit-reached .game-wrapper {
  opacity: 0;
  pointer-events: none;
}

.game-table {
  width: 100%;
  margin: 0 auto;
  padding: 0;
  background: #ffffff;
  user-select: none;
  border: 2px solid #344861;

  &,
  &::after {
    display: block;
    box-sizing: border-box;
    height: 100%;
  }

  &::after {
    content: '';
    position: absolute;
    left: 33.3333%;
    width: 33.3333%;
    top: 0;
    border-left: 2px solid #344861;
    border-right: 2px solid #344861;
    pointer-events: none;
  }

  tbody {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;

    &::after {
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
  }
}

.game-row,
.game-table tbody:after {
  box-sizing: border-box;
  width: 100%;
}

.game-row {
  height: 11.11111%;
}

.game-col,
.game-row {
  display: flex;
  padding: 0;
  margin: 0;
}

.game-col {
  flex-basis: 11.1111%;
  box-sizing: border-box;
  position: relative;
  border-right: 1px solid #bec6d4;
  border-bottom: 1px solid #bec6d4;
  cursor: pointer;
  transform: translateZ(0);
  color: #080808;
}

.paused {
  .game-col {
    &.highlight-table {
      background-color: transparent;
    }

    &.highlight-table {
      background-color: transparent;
    }

    &.highlight-number {
      background-color: transparent;
    }

    &.incorrect {
      background-color: transparent;
    }

    &.cell-selected {
      background-color: transparent;
    }
  }
}
</style>
