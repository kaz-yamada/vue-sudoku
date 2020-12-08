<template>
  <div class="cell-value">
    <div class="cell-value-inner">
      <template v-if="value !== '.' && value !== '0'">
        {{ value }}
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
    isOriginal: Boolean
  }
})
export default class Square extends Vue {
  value!: string;
}
</script>

<style scoped lang="scss">
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
</style>
