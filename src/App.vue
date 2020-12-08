<template>
  <div class="wrapper">
    <Grid
      :key="this.gameString"
      :rows="this.game.rows"
      :cols="this.game.cols"
      :values="this.game.values"
      :incorrectSquares="this.game.incorrectSquares"
      :selectedSquare="this.selectedSquare"
      :gameSquares="this.game.gameSquares"
      @select-cell="handleSelectCell"
    />
    <Controls @click="handleControlClick" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';

import Grid from './components/Grid.vue';
import Controls from './components/Controls.vue';

import Sudoku from './services/Sudoku';

@Options({
  components: {
    Controls,
    Grid
  }
})
export default class App extends Vue {
  private game = new Sudoku();
  private gameString = '';
  private selectedSquare = '';
  private isGameOver = false;

  created() {
    this.gameString = this.game.createNewGame();
  }

  mounted() {
    window.addEventListener('keydown', ev => {
      let value = ev.key;

      if (ev.code === 'Delete' || ev.code === 'Backspace') {
        value = 'Delete';
      }

      this.game.setValue(value, this.selectedSquare);
    });
  }

  handleControlClick(option: string) {
    switch (option) {
      case 'create': {
        this.gameString = this.game.createNewGame();
        break;
      }
      case 'solve': {
        this.gameString = this.game.solve();
        this.isGameOver = true;
        break;
      }
      case 'reset': {
        this.gameString = '';
        this.gameString = this.game.resetGame();
        this.selectedSquare = '';
        break;
      }
      default:
        console.log(option);
    }
  }

  handleSolveGame() {
    this.gameString = this.game.solve();
  }

  public handleSelectCell(square: string) {
    this.selectedSquare = square;
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.wrapper {
  display: flex;
  justify-content: center;
}
</style>
