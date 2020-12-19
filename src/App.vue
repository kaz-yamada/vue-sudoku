<template>
  <div class="header">
    <h1>
      Vue-Sudoku
    </h1>
  </div>

  <div class="main">
    <Game />
  </div>
  <div class="footer">
    <p>
      A online sudoku generator/solver game written with VueJS 3 and TypeScript.
      Based on
      <a href="http://norvig.com/sudoku.html"
        >Solving Every Sudoku Puzzle by Peter Norvig</a
      >
    </p>
    <a href="https://github.com/kaz-yamada/vue-sudoku" class="github-link">
      <img src="./assets/GitHub-Mark-32px.png" />
      <span>Source</span>
    </a>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Game from './components/Game.vue';

@Options({
  components: {
    Game
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
$reponsive-width: 768px;

html,
body {
  color: #222222;
  margin: 0;
}

* {
  box-sizing: border-box;
}

a {
  color: blue;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.header {
  margin-top: 60px;
}

.main {
  width: 100%;
}

.github-link {
  display: inline-flex;
  align-items: center;

  span {
    padding: 2px 4px;
  }
}

@media screen and (max-width: $reponsive-width) {
  .main {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
