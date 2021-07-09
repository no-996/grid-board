import './style/normalize-8.0.1.css'

import Grid from '@/lib/components/grid'
import GridBox from '@/lib/components/grid-box'
import GridBoxItem from '@/lib/components/grid-box-item'
import GridBoard from '@/lib/components/grid-board'
import GridBoardItem from '@/lib/components/grid-board-item'

const install = {
  install(Vue) {
    Vue.component('grid', Grid)
    Vue.component('grid-box', GridBox)
    Vue.component('grid-box-item', GridBoxItem)
    Vue.component('grid-board', GridBoard)
    Vue.component('grid-board-item', GridBoardItem)
  },
}

export default install

export { Grid, GridBox, GridBoxItem, GridBoard, GridBoardItem }
