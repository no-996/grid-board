<template>
  <div class="grid-box">
    <slot></slot>
  </div>
</template>

<script>
  /**
   * grid-box：待选区（暂时可以忽略无用）
   */
  // import dispatch from '@/lib/tools/dispatch'
  export default {
    componentName: 'gird-box',
    data() {
      return {
        items: [],
      }
    },
    watch: {},
    created() {
      // // 接收grid-box-item的拖放事件组，dispatch，从内往外传递
      // this.$on('box-item-dragstart', this.onBoxItemDragstart)
      // this.$on('box-item-dragend', this.onBoxItemDragend)
    },
    mounted() {},
    methods: {
      // // 广播grid-box-item的拖放事件组，broadcast，从外往内传递
      // onBoxItemDragstart(e, node, info) {
      //   console.log('box<-item dragstart')
      //   dispatch.call(this, 'gird', 'box-item-dragstart', e, node, info)
      // },
      // onBoxItemDragend(e, node, info) {
      //   console.log('box<-item dragend')
      //   dispatch.call(this, 'gird', 'box-item-dragend', e, node, info)
      // },
    },
  }
</script>

<style lang="less"></style>
