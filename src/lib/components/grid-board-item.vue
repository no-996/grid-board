<template>
  <div
    class="grid-board-item"
    @dragstart.stop="onDragstart"
    @dragend.stop="onDragend"
    :style="{
      zIndex: zIndex,
      'grid-column-start': x,
      'grid-column-end': x + w,
      'grid-row-start': y,
      'grid-row-end': y + h,
    }"
    draggable>
    <!-- <div>
{{ index }}:{{ comName }}({{ w }}x{{ h }} {{ x }},{{ y }})</div> -->
    <div>
      <slot></slot>
    </div>
    <section :style="{ width: `calc(100% + ${ow - ox}px)`, height: `calc(100% + ${oh - oy}px)`, left: `${ox}px`, top: `${oy}px` }">
      <!-- 四角 -->
      <b
        v-for="i in 4"
        :key="i + 4"
        @mousedown.prevent
        @mousemove.prevent
        @mouseup.prevent
        @mouseout.prevent
        :data-index="index"
        :data-resize="['top-left', 'top-right', 'bottom-right', 'bottom-left'][i - 1]">
      </b>
      <!-- 四边 -->
      <i
        v-for="i in 4"
        :key="i"
        @mousedown.prevent
        @mousemove.prevent
        @mouseup.prevent
        @mouseout.prevent
        :data-index="index"
        :data-resize="['top', 'right', 'bottom', 'left'][i - 1]">
      </i>
    </section>
  </div>
</template>

<script>
  /**
   * grid-board-item：布局项
   */
  export default {
    props: {
      // 横向格子数
      w: {
        type: Number,
        default: 1,
      },
      // 纵向格子数
      h: {
        type: Number,
        default: 1,
      },
      // 横坐标
      x: {
        type: Number,
        default: 1,
      },
      // 纵坐标
      y: {
        type: Number,
        default: 1,
      },
      // 节点
      node: {
        type: Object,
      },
      // 组件名称
      comName: {
        type: String,
        default: '',
      },
      // 序号（用于查找布局项数组）
      index: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        zIndex: 1,
        // 开始
        sx: 0,
        sy: 0,
        sw: 0,
        sh: 0,
        // 移动
        mx: 0,
        my: 0,
        // 偏移（通过大小控制）
        ow: 0,
        oh: 0,
        // 偏移（通过坐标控制）
        ox: 0,
        oy: 0,
      }
    },
    computed: {
      // 当前布局项中是否为grid（层层嵌套）
      isGrid() {
        if (this.$children.length > 0) {
          return this.$children[0].constructor === this.$parent.$parent.$parent.$options.components['grid']
        }
        return false
      },
    },
    methods: {
      onDragstart(e) {
        console.log('board-item dragstart')
        // 拖动时的层次
        this.zIndex = 5
        this.$emit('board-item-dragstart', e, this.index, this.$slots.default ? this.$slots.default[0] : undefined, {
          w: this.w,
          h: this.h,
          comName: this.comName,
        })
      },
      onDragend(e) {
        console.log('board-item dragend')
        // 摆放时的层次，grid需高于“检测层”
        this.zIndex = this.isGrid ? 8 : 1
        this.$emit('board-item-dragend', e, this.index, this.$slots.default ? this.$slots.default[0] : undefined, {
          w: this.w,
          h: this.h,
          comName: this.comName,
        })
      },
      // 预留给外部grid-board修改当前item的大小
      onSizeMousedown(type, x, y) {
        this.sx = x - this.ox
        this.sy = y - this.oy
        this.sw = x - this.ow
        this.sh = y - this.oh
      },
      onSizeMousemove(type, x, y) {
        this.mx = x
        this.my = y
        if (type.includes('right')) {
          this.ow = this.mx - this.sw
        }
        if (type.includes('left')) {
          this.ox = this.mx - this.sx
        }
        if (type.includes('bottom')) {
          this.oh = this.my - this.sh
        }
        if (type.includes('top')) {
          this.oy = this.my - this.sy
        }
      },
      // 大小改变结束重置状态值
      onSizeChange() {
        this.ox = 0
        this.oy = 0
        this.ow = 0
        this.oh = 0
      },
    },
    mounted() {
      // 摆放时的层次，grid需高于“检测层”
      this.zIndex = this.isGrid ? 8 : 1
    },
  }
</script>

<style lang="less">
  .grid-board-item {
    cursor: pointer;
    position: relative;
    @op-size: 10px;
    & > div {
      overflow: hidden;
    }
    & > section {
      position: absolute;
      top: 0;
      left: 0;
      border: 1px dashed #ccc;
      & > b {
        position: absolute;
        width: @op-size;
        height: @op-size;
        background-color: #fff;
        border: 1px solid red;
        &:nth-of-type(1) {
          cursor: nw-resize;
          top: -@op-size * 0.5;
          left: -@op-size * 0.5;
        }
        &:nth-of-type(2) {
          cursor: ne-resize;
          top: -@op-size * 0.5;
          right: -@op-size * 0.5;
        }
        &:nth-of-type(3) {
          cursor: se-resize;
          right: -@op-size * 0.5;
          bottom: -@op-size * 0.5;
        }
        &:nth-of-type(4) {
          cursor: sw-resize;
          left: -@op-size * 0.5;
          bottom: -@op-size * 0.5;
        }
      }
      & > i {
        position: absolute;
        // background-color: rgba(0, 0, 255, 0.4);

        &:nth-of-type(1) {
          cursor: ns-resize;
          top: -@op-size * 0.5;
          left: @op-size * 0.5;
          width: calc(100% - @op-size);
          height: @op-size;
        }
        &:nth-of-type(2) {
          cursor: ew-resize;
          top: @op-size * 0.5;
          right: -@op-size * 0.5;
          width: @op-size;
          height: calc(100% - @op-size);
        }
        &:nth-of-type(3) {
          cursor: ns-resize;
          left: @op-size * 0.5;
          bottom: -@op-size * 0.5;
          width: calc(100% - @op-size);
          height: @op-size;
        }
        &:nth-of-type(4) {
          cursor: ew-resize;
          top: @op-size * 0.5;
          left: -@op-size * 0.5;
          width: @op-size;
          height: calc(100% - @op-size);
        }
      }
    }
  }
</style>
