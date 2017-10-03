import gamux from '../../dist/gamux'
import snakeReducer from './snakeReducer'
import worldReducer from './worldReducer'
import { gameResize } from './actions'

import './index.scss'

const container = document.getElementById('root')

gamux.config({
  fps: 60,

  container,

  /**
   * init game. Getting called before game loop starts
   */
  init: () => {
    console.log('init')

    // Setup listener
    window.onresize = () => {
      gamux.dispatch(gameResize(
        container.offsetWidth,
        container.offsetHeight
      ))
    }
  },

  /**
   * update getting called when animate available 
   * @param  {number} dt - The time span since last update
   */
  update: () => {
    // console.log('update')
    
  },

  /**
   * render getting called at each frame
   * @param  {number} dt - The time span since last update
   */
  render: (dt) => {
    // console.log('render')
  },

  /**
   * The map for all reducers the store can break down
   */
  reducerMap: {
    snake: snakeReducer,
    world: worldReducer
  } 
})

gamux.start()
