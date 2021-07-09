/**
 * gird-board：布局区
 */
import Vue from 'vue'
import broadcast from '@/lib/tools/broadcast'
import dispatch from '@/lib/tools/dispatch'

import GridBoardItem from './grid-board-item'
//
const GridBoardBox = {
  props: ['items'],
  methods: {
    onBoardItemDragstart(e, index, node, info) {
      console.log('items<-item dragstart')
      this.$emit('board-item-dragstart', e, index, node, info)
    },
    onBoardItemDragend(e, index, node, info) {
      console.log('items<-item dragend')
      this.$emit('board-item-dragend', e, index, node, info)
    },
  },
  render(createElement /*, context*/) {
    let items = []
    this.items.forEach((o, i) => {
      if (o.com) {
        items.push(
          createElement(
            GridBoardItem,
            {
              props: { node: createElement(o.com), ...o.info, index: i },
              on: { 'board-item-dragstart': this.onBoardItemDragstart, 'board-item-dragend': this.onBoardItemDragend },
            },
            [createElement(o.com)]
          )
        )
      } else {
        items.push(
          createElement(
            GridBoardItem,
            {
              props: { node: o.node, ...o.info, index: i },
              on: { 'board-item-dragstart': this.onBoardItemDragstart, 'board-item-dragend': this.onBoardItemDragend },
            },
            [o.node]
          )
        )
      }
    })
    return createElement('div', items.concat(this.$slots.default))
  },
}
export default {
  componentName: 'gird-board',
  props: {
    // 布局项
    items: {
      type: Array,
      default: () => [],
    },
    // 格子大小
    size: {
      type: Number,
      default: 40,
    },
    // 格子间隔
    gap: {
      type: Number,
      default: 6,
    },
    // 横向格子数
    width: {
      type: Number,
      default: 24,
    },
    // 纵向格子数
    height: {
      type: Number,
      default: 12,
    },
    // 输入输出？未实现
    loadCom: {
      typy: Function,
    },
  },
  data() {
    return {
      // 当前拖动项
      currentDrag: null,
      // “检测层”显示开关
      detect: false,
      // “指示层”显示开关
      indicator: false,
      // 当前指示块坐标和大小
      indicatorX: 1,
      indicatorY: 1,
      indicatorW: 1,
      indicatorH: 1,
      // 当前指示块坐标边界
      indicatorXMax: 1,
      indicatorYMax: 1,
      // 用于计算当前指示块
      mouseOffsetX: 0,
      mouseOffsetY: 0,
      // 方向暂时无用
      // directionX: '',
      // directionY: '',
      // 布局层坐标和大小
      boardX: 0,
      boardY: 0,
      boardW: 0,
      boardH: 0,
      // 拖动中坐标记录
      overX: 0,
      overY: 0,
      lastOverX: 0,
      lastOverY: 0,
      // 修改布局块大小相关信息
      // 当前缩放类型（'top-left', 'top-right', 'bottom-right', 'bottom-left'，'top', 'right', 'bottom', 'left'）
      resize: '',
      resizeIndex: 0,
      resizeStartX: 0,
      resizeStartY: 0,
      resizeStartW: 0,
      resizeStartH: 0,
      resizeMoveX: 0,
      resizeMoveY: 0,
      resizeOffsetX: 0,
      resizeOffsetY: 0,
      resizeOffsetW: 0,
      resizeOffsetH: 0,
      // 缩放时指示器变化信息
      indicatorOffsetW: 0,
      indicatorOffsetH: 0,
      indicatorOffsetX: 0,
      indicatorOffsetY: 0,
    }
  },
  methods: {
    onBoxItemDragstart(e, node, info) {
      console.log('board<-grid<-box<-item dragstart')
      //
      let { left, top, width, height } = this.$refs.board.$el.getBoundingClientRect()
      this.boardX = left
      this.boardY = top
      this.boardW = width
      this.boardH = height
      //
      this.indicatorXMax = this.width - info.w + 1
      this.indicatorYMax = this.height - info.h + 1
      //
      this.mouseOffsetX = Math.floor((info.w - 1) / 2)
      this.mouseOffsetY = Math.floor((info.h - 1) / 2)
      //
      this.detect = true

      this.currentDrag = { node, info }
    },
    onBoxItemDragend(/*e, node, info*/) {
      console.log('board<-grid<-box<-item dragend')
      //
      this.detect = false
      this.currentDrag = null
      this.indicator = false
    },
    //
    findCom(comName) {
      var parent = this.$parent || this.$root
      let com = parent.$options.components[comName]
      while (parent && !com) {
        parent = parent.$parent
        if (parent) {
          com = parent.$options.components[comName]
        }
      }
      return com
    },
    //
    onDragenter(e) {
      console.log('onDragenter')
      //
      let { clientX, clientY } = e
      this.overX = clientX
      this.overY = clientY
      this.lastOverX = this.overX
      this.lastOverY = this.overY
      //
      this.updateIndicator()
      if (this.currentDrag) {
        // 插入
        this.indicatorW = this.currentDrag.info.w
        this.indicatorH = this.currentDrag.info.h
      }
      this.indicator = true
    },
    onDragover(e) {
      // console.log('onDragover')
      //
      let { clientX, clientY } = e
      let overX = clientX - this.boardX
      let overY = clientY - this.boardY
      //
      // let offsetX = this.lastOverX - overX
      // let offsetY = this.lastOverY - overY
      // if (offsetX > 0) {
      //   this.directionX = 'left'
      // } else if (offsetX < 0) {
      //   this.directionX = 'right'
      // }
      // if (offsetY > 0) {
      //   this.directionY = 'top'
      // } else if (offsetY < 0) {
      //   this.directionY = 'bottom'
      // }
      //
      this.overX = overX
      this.overY = overY
      this.lastOverX = this.overX
      this.lastOverY = this.overY
      //
      this.updateIndicator()
      //
      e.preventDefault()
    },
    updateIndicator() {
      let ix = (this.overX - this.gap) / (this.size + this.gap)
      ix = Math.ceil(ix) - this.mouseOffsetX
      ix = ix > 1 ? (ix > this.indicatorXMax ? this.indicatorXMax : ix) : 1
      this.indicatorX = ix
      //
      let iy = (this.overY - this.gap) / (this.size + this.gap)
      iy = Math.ceil(iy) - this.mouseOffsetY
      iy = iy > 1 ? (iy > this.indicatorYMax ? this.indicatorYMax : iy) : 1
      this.indicatorY = iy
    },
    onDragleave() {
      console.log('onDragleave')
      this.indicator = false
    },
    onDrop(e) {
      console.log('onDrop')
      if (this.currentDrag) {
        // 插入
        let { node, info } = this.currentDrag
        let com = null
        if (!com) {
          let temp = Vue.options.components[info.comName]
          com = temp ? temp.options : undefined
        }
        if (!com) {
          com = this.findCom(info.comName)
        }
        if (!com && this.loadCom) {
          com = this.loadCom(info.comName)
        }
        info.x = this.indicatorX
        info.y = this.indicatorY
        this.items.push({ com, node, info })

        dispatch.call(this, 'gird-board', 'board-drop', e, this.currentDrag)

        this.currentDrag = null
      } else {
        // 移动
      }
    },
    //
    onBoardItemDragstart(e, index, node, info) {
      console.log('board<-items<-item dragstart')
      let { clientX, clientY } = e
      let { left: itemLeft, top: itemTop } = e.target.getBoundingClientRect()
      // 更新
      let { left, top, width, height } = this.$refs.board.$el.getBoundingClientRect()
      this.boardX = left
      this.boardY = top
      this.boardW = width
      this.boardH = height
      //
      this.mouseOffsetX = Math.floor((clientX - itemLeft - this.gap) / (this.size + this.gap))
      this.mouseOffsetY = Math.floor((clientY - itemTop - this.gap) / (this.size + this.gap))
      //
      this.indicatorXMax = this.width - this.items[index].info.w + 1
      this.indicatorYMax = this.height - this.items[index].info.h + 1
      //
      this.indicatorW = this.items[index].info.w
      this.indicatorH = this.items[index].info.h
      //

      this.$set(this.items, index, this.items[index])
      // 拖动目标zIndex>监听层zIndex，但是要延后监听层的出现，否则会中断拖动操作。
      setTimeout(() => {
        this.detect = true
      })

      broadcast.call(this, 'gird-board', 'box-item-dragstart', e, node, info)
    },
    onBoardItemDragend(e, index, node, info) {
      console.log('board<-items<-item dragend')
      this.items[index].info.x = this.indicatorX
      this.items[index].info.y = this.indicatorY
      this.$set(this.items, index, this.items[index])

      this.detect = false
      this.indicator = false

      broadcast.call(this, 'gird-board', 'box-item-dragend', e, node, info)
    },
    /* 改变大小部分 */
    onBoardMousedown(e) {
      let { clientX, clientY, target } = e
      if (target.tagName === 'I' || target.tagName === 'B') {
        let { left, top, width, height } = this.$refs.board.$el.getBoundingClientRect()
        this.boardX = left
        this.boardY = top
        this.boardW = width
        this.boardH = height
        //
        let index = parseInt(target.dataset.index)
        this.resize = target.dataset.resize
        this.resizeIndex = index
        //
        let current = this.$refs.board.$children[this.resizeIndex]
        //
        current.onSizeMousedown(this.resize, clientX, clientY)
        //
        this.indicatorX = current.x
        this.indicatorY = current.y
        this.indicatorW = current.w
        this.indicatorH = current.h
        this.indicator = true
        //
        this.resizeStartW = clientX
        this.resizeStartH = clientY
        this.resizeStartX = clientX
        this.resizeStartY = clientY
      }
    },
    onBoardMousemove(e) {
      let { clientX, clientY } = e
      if (clientX < this.boardX || clientX > this.boardX + this.boardW || clientY < this.boardY || clientY > this.boardY + this.boardH) {
        this.stopResize()
      }
      if (this.resize) {
        this.$refs.board.$children[this.resizeIndex].onSizeMousemove(this.resize, clientX, clientY)
        //
        this.resizeMoveX = clientX
        this.resizeMoveY = clientY
        //
        if (this.resize.includes('right')) {
          this.resizeOffsetW = this.resizeMoveX - this.resizeStartW
          this.indicatorOffsetW = Math.round((this.resizeOffsetW - this.gap) / (this.size + this.gap))
        }
        if (this.resize.includes('left')) {
          this.resizeOffsetX = this.resizeMoveX - this.resizeStartX
          this.indicatorOffsetX = Math.round(this.resizeOffsetX / (this.size + this.gap))
        }
        if (this.resize.includes('bottom')) {
          this.resizeOffsetH = this.resizeMoveY - this.resizeStartH
          this.indicatorOffsetH = Math.round((this.resizeOffsetH - this.gap) / (this.size + this.gap))
        }
        if (this.resize.includes('top')) {
          this.resizeOffsetY = this.resizeMoveY - this.resizeStartY
          this.indicatorOffsetY = Math.round(this.resizeOffsetY / (this.size + this.gap))
        }
      }
    },
    onBoardMouseup() {
      this.stopResize()
    },
    onBoardMouseout(e) {
      let { clientX, clientY } = e
      if (clientX < this.boardX || clientX > this.boardX + this.boardW || clientY < this.boardY || clientY > this.boardY + this.boardH) {
        this.stopResize()
      }
    },
    //
    stopResize() {
      if (this.resize) {
        this.resize = ''
        this.updateIndicatorResize()
        //
        this.indicator = false
      }
    },
    updateIndicatorResize() {
      let current = this.$refs.board.$children[this.resizeIndex]
      //
      this.items[this.resizeIndex].info.x = this.indicatorX + this.indicatorOffsetX
      this.items[this.resizeIndex].info.y = this.indicatorY + this.indicatorOffsetY
      this.items[this.resizeIndex].info.w = this.indicatorW + this.indicatorOffsetW - this.indicatorOffsetX
      this.items[this.resizeIndex].info.h = this.indicatorH + this.indicatorOffsetH - this.indicatorOffsetY
      this.$set(this.items, this.resizeIndex, this.items[this.resizeIndex])
      //
      this.resizeOffsetW = 0
      this.resizeOffsetH = 0
      this.resizeOffsetX = 0
      this.resizeOffsetY = 0
      //
      this.indicatorOffsetW = 0
      this.indicatorOffsetH = 0
      this.indicatorOffsetX = 0
      this.indicatorOffsetY = 0
      //
      current.onSizeChange()
    },
    onBoardDrop(e, data) {
      const index = this.items.findIndex((o) => o.node === data.node)
      this.items.splice(index, 1)
    },
  },
  created() {
    this.$on('box-item-dragstart', this.onBoxItemDragstart)
    this.$on('box-item-dragend', this.onBoxItemDragend)
    // this.$on('board-drop', this.onBoardDrop)
    // TODO: 状态需要修复
  },
  mounted() {},
  render() {
    return (
      <div
        class="p-grid-board"
        style={{
          width: `${this.width * this.size + this.gap * (this.width - 1)}px`,
          height: `${this.height * this.size + this.gap * (this.height - 1)}px`,
        }}>
        {/* <div style={{ position: 'absolute', left: 0, top: 0 }}>
          indicatorX: {this.indicatorX} indicatorY {this.indicatorY}
          <br />
          indicatorW: {this.indicatorW} indicatorH: {this.indicatorH}
          <br />
          boardX: {this.boardX} boardY: {this.boardY}
          <br />
          boardW: {this.boardW} boardH: {this.boardH}
          <br />
          overX: {this.overX} overY: {this.overY}
          <br />
          directionX: {this.directionX} directionY: {this.directionY}
          <br />
          indicatorXMax: {this.indicatorXMax} indicatorYMax: {this.indicatorYMax}
          <br />
          indicatorColumnStart: {this.indicatorX} indicatorColumnEnd: {this.indicatorX + this.indicatorW}
          <br />
          indicatorRowEnd: {this.indicatorY} indicatorRowEnd: {this.indicatorY + this.indicatorH}
          <br />
          mouseOffsetX: {this.mouseOffsetX} mouseOffsetY {this.mouseOffsetY}
        </div> */}
        <GridBoardBox
          ref="board"
          items={this.items}
          class="p-grid-board__box"
          on={{
            'board-item-dragstart': this.onBoardItemDragstart,
            'board-item-dragend': this.onBoardItemDragend,
          }}
          nativeOnMousedown={this.onBoardMousedown}
          nativeOnMousemove={this.onBoardMousemove}
          nativeOnMouseup={this.onBoardMouseup}
          nativeOnMouseout={this.onBoardMouseout}
          style={{
            'background-color': '#fff',
            'background-image': `linear-gradient(90deg, rgba(0, 0, 255, 0.05) 1px, transparent 1px)
            , linear-gradient(90deg, rgba(0, 0, 255, 0.05) 1px, transparent 1px)
            , linear-gradient(rgba(0, 0, 255, 0.05) 1px, transparent 1px)
            , linear-gradient(rgba(0, 0, 255, 0.05) 1px, transparent 1px)`,
            'background-repeat': `repeat,repeat,repeat,repeat`,
            'background-position': `${-this.gap}px 0, 0 0,0 ${-this.gap}px, 0 0`,
            'background-size': `${this.size + this.gap}px ${this.size + this.gap}px
            , ${this.size + this.gap}px ${this.size + this.gap}px
            , ${this.size + this.gap}px ${this.size + this.gap}px
            , ${this.size + this.gap}px ${this.size + this.gap}px`,
            'grid-template-columns': `repeat(${this.width}, ${this.size}px)`,
            'grid-template-rows': `repeat(${this.height}, ${this.size}px)`,
            'grid-gap': `${this.gap}px ${this.gap}px`,
          }}>
          {/* 指示层 */}
          {this.indicator ? (
            <i
              style={{
                'grid-column-start': this.indicatorX + this.indicatorOffsetX,
                'grid-column-end': this.indicatorX + this.indicatorW + this.indicatorOffsetW,
                'grid-row-start': this.indicatorY + this.indicatorOffsetY,
                'grid-row-end': this.indicatorY + this.indicatorH + this.indicatorOffsetH,
                'z-index': 6,
              }}></i>
          ) : (
            ''
          )}
          {/* 检测层 */}
          {this.detect ? (
            <div
              class="p-grid-board__detect"
              style={{
                'z-index': 7,
              }}
              on={{
                dragenter: this.onDragenter,
                dragleave: this.onDragleave,
                dragover: this.onDragover,
                drop: this.onDrop,
              }}></div>
          ) : null}
        </GridBoardBox>
        {/* {this.detect || true ? (
          <div
            class="p-grid-board__detect"
            on={{
              dragenter: this.onDragenter,
              dragleave: this.onDragleave,
              dragover: this.onDragover,
              drop: this.onDrop,
            }}></div>
        ) : (
          null
        )} */}
      </div>
    )
  },
}
