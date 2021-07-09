<template>
  <div class="p-grid-box-item" @dragstart="onDragstart" @dragend="onDragend" draggable>
    <slot></slot>
  </div>
</template>

<script>
  /**
   * grid-box-item：待选项
   */
  import dispatch from '@/lib/tools/dispatch'
  export default {
    props: {
      // 初始横向格子数
      w: {
        type: Number,
        default: 1,
      },
      // 初始纵向格子数
      h: {
        type: Number,
        default: 1,
      },
      // 组件名称（用于根据组件名称查找已注册组件）
      comName: {
        type: String,
        default: '',
      },
    },
    mounted() {},
    methods: {
      // grid-box-item的拖放事件组，dispatch，从内往外传递至grid，再由grid广播至grid-board
      onDragstart(e) {
        console.log('item dragstart')
        dispatch.call(this, 'gird', 'box-item-dragstart', e, this.$slots.default ? this.$slots.default[0] : undefined, {
          w: this.w,
          h: this.h,
          comName: this.comName,
        })
      },
      onDragend(e) {
        console.log('item dragend')
        dispatch.call(this, 'gird', 'box-item-dragend', e, this.$slots.default ? this.$slots.default[0] : undefined, {
          w: this.w,
          h: this.h,
          comName: this.comName,
        })
      },
    },
  }
</script>

<style lang="less">
  .p-grid-box-item {
    cursor: pointer;
    position: relative;
    z-index: 5;
  }
</style>
