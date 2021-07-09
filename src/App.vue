<template>
  <div id="app">
    <div style="width: 100%">
      <!-- grid组件，不限box、box-item、board布局 -->
      <grid>
        <!-- 素材库 -->
        <!-- <grid-box> -->
        <div class="com-list">
          <div class="com-item">
            <grid-box-item :w="1" :h="1" com-name="compA">
              <div style="color: #fff; background: #000">节点A 1x1</div>
            </grid-box-item>
          </div>
          <div class="com-item">
            <grid-box-item :w="4" :h="2" com-name="compB">
              <div>
                <el-button type="primary" v-text="btnText" @click="btnText = Math.round(Math.random())"></el-button>
              </div>
            </grid-box-item>
          </div>
          <div class="com-item" v-for="(item, index) in items" :key="index">
            <grid-box-item :w="item.w" :h="item.h" :com-name="item.comName">
              <component :is="item.com" v-if="item.com"></component>
              <span v-if="!item.com"> 组件{{ item.comName }} </span>
            </grid-box-item>
          </div>
          <div class="com-item">
            <grid-box-item :w="4" :h="4" com-name="compP">
              <grid>
                <grid-board :width="4" :height="4" :gap="0"> </grid-board>
              </grid>
            </grid-box-item>
          </div>
          <div class="com-item">
            <grid-box-item :w="3" :h="3" com-name="compP">
              <grid>
                <grid-board :width="3" :height="3"> </grid-board>
              </grid>
            </grid-box-item>
          </div>
        </div>
        <!-- </grid-box> -->
        <!-- 布局面板 -->
        <div class="com-board">
          <grid-board :load-com="loadCom"> </grid-board>
        </div>
      </grid>
    </div>
  </div>
</template>

<script>
  import 'regenerator-runtime/runtime'

  import Vue from 'vue'

  import ElementUI from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'

  import GridBoard from './lib'

  Vue.use(ElementUI)
  Vue.use(GridBoard)

  //   const compA = {
  //     template: '<div class="test">A(动态)</div>',
  //   }
  const compC = {
    template: '<div style="background:yellow;">组件C(全局注册) 3x4</div>',
  }
  const compD = {
    template: '<div style="background:green; color:#fff;">组件D(页内注册) 4x3</div>',
  }
  Vue.component('compC', compC)
  //
  export default {
    components: { compD },
    data() {
      return {
        btnText: '节点B(包含组件) 3x2',
        // compA,
        cells: [
          //   {
          //     pos: { xs: 3, xe: 6, ys: 4, ye: 8 },
          //     name: 'compB',
          //   },
          //   {
          //     pos: { xs: 7, xe: 10, ys: 3, ye: 8 },
          //     name: 'compC',
          //   },
        ],
        items: [],
      }
    },
    methods: {
      loadCom(comName) {
        // 自行加载
        return comName === 'compF' ? { template: '<div style="background:red; color:#fff;">组件F(手动加载)</div>' } : null
      },
    },
    mounted() {
      this.items = [
        {
          w: 3,
          h: 4,
          comName: 'compC',
        },
        {
          w: 4,
          h: 3,
          comName: 'compD',
        },
        {
          w: 3,
          h: 3,
          comName: 'compE',
          com: { template: '<div style="background:red; color:#fff;">组件E(对象)</div>' },
        },
        {
          w: 4,
          h: 4,
          comName: 'compF',
        },
      ]
    },
  }
</script>

<style lang="less">
  .com-list {
    .com-item {
      position: relative;
      margin: 10px;
      padding: 10px;
      background-color: rosybrown;
      & ~ .com-item {
        margin-left: 10px;
      }
    }
  }
  .com-board {
    padding: 10px;
  }
  .grid {
    display: flex;
  }
</style>
