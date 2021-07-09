<template>
  <div class="grid" resize>
    <slot></slot>
  </div>
</template>

<script>
  /**
   * grid：承载grid-box（待选区）和gird-board（布局区）的容器
   */
  import broadcast from '@/lib/tools/broadcast'
  export default {
    componentName: 'gird',
    data() {
      return {}
    },
    created() {
      // 接收grid-box-item的拖放事件组，dispatch，从内往外传递
      this.$on('box-item-dragstart', this.onBoxItemDragstart)
      this.$on('box-item-dragend', this.onBoxItemDragend)
    },
    mounted() {},
    methods: {
      // 广播grid-box-item的拖放事件组，broadcast，从外往内传递
      onBoxItemDragstart(e, node, info) {
        console.log('grid<-box<-item dragstart')
        broadcast.call(this, 'gird-board', 'box-item-dragstart', e, node, info)
      },
      onBoxItemDragend(e, node, info) {
        console.log('grid<-box<-item dragend')
        broadcast.call(this, 'gird-board', 'box-item-dragend', e, node, info)
      },
    },
  }
</script>

<style lang="less">
  .grid-board {
    position: relative;
    .grid-board__box {
      position: relative;
      z-index: 1;
      display: grid;
      box-shadow: 0 0 5px 0 purple;
      & > i {
        background-color: rgba(255, 255, 0, 0.4);
      }
    }
    .grid-board__detect {
      position: absolute;
      top: 0;
      left: 0;
      // z-index: 4;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 0, 0, 0.1);
    }
  }
</style>
