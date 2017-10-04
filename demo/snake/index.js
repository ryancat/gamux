import gamux from '../../dist/gamux'
import snakeReducer from './snakeReducer'
import worldReducer from './worldReducer'
import { gameResize } from './actions'

import './index.scss'

const container = document.getElementById('root')

gamux.config({
  fps: 60,

  container,

  layers: [
    'worldLayer',
    'snakeLayer'
  ],

  /**
   * init game. Getting called before game loop starts
   */
  init: () => {
    console.log('init')

    // Setup listener
    window.onload = window.onresize = () => {
      gamux.dispatch(gameResize(
        container.offsetWidth,
        container.offsetHeight
      ))
    }
  },

  /**
   * update function getting called when game states change
   * @param  {object} gameState - the game state
   * @param  {string} stateKey - the state key from reducerMap
   * @return {[type]}           [description]
   */
  update: (gameState, stateKey) => {
    console.log('update', gameState, stateKey)

    let dirtyState = gameState[stateKey],
        worldLayer = gamux.layers['worldLayer'],
        snakeLayer = gamux.layers['snakeLayer']

    if (stateKey === 'world') {
      let {
          width,
          height,
          rows,
          columns
        } = dirtyState,
        cellWidth = width / columns,
        cellHeight = height / rows

      worldLayer.finalRenderState = {
        width,
        height,
        xs: Array(columns + 1).fill(0).map((x, xIndex) => {
          return {
            x: xIndex * cellWidth,
            y0: 0,
            y1: height
          }}),
        ys: Array(rows + 1).fill(0).map((y, yIndex) => {
          return {
            y: yIndex * cellHeight,
            x0: 0,
            x1: width
          }})
      }
    }
  },

  /**
   * render getting called at each frame
   * @param  {number} dt - The time span since last update
   */
  render: (dt) => {
    let worldLayer = gamux.layers['worldLayer'],
        worldLayerFRS = worldLayer.finalRenderState,
        worldLayerCRS = worldLayer.renderState,
        worldLayerCanvas = worldLayer.canvas,
        worldLayerContext = worldLayer.canvasCtx,
        snakeLayer = gamux.layers['snakeLayer'],
        snakeLayerFRS = snakeLayer.finalRenderState,
        snakeLayerCRS = snakeLayer.renderState,
        snakeLayerCanvas = snakeLayer.canvas,
        snakeLayerContext = snakeLayer.canvasCtx

    // World layer
    if (worldLayerCRS !== worldLayerFRS) {
      worldLayerCanvas.width = worldLayerFRS.width
      worldLayerCanvas.height = worldLayerFRS.height
      worldLayerContext.strokeStyle = '#eeeeee'
      worldLayerContext.lineWidth = 1
      worldLayerContext.beginPath()

      worldLayerFRS.xs.forEach((verticalLine) => {
        worldLayerContext.moveTo(verticalLine.x, verticalLine.y0)
        worldLayerContext.lineTo(verticalLine.x, verticalLine.y1)
        worldLayerContext.stroke()
      })

      worldLayerFRS.ys.forEach((horizontalLine) => {
        worldLayerContext.moveTo(horizontalLine.x0, horizontalLine.y)
        worldLayerContext.lineTo(horizontalLine.x1, horizontalLine.y)
        worldLayerContext.stroke()
      })

      worldLayer.renderState = worldLayerFRS
    }

    // Snake layer
    if (snakeLayerCRS !== snakeLayerFRS) {
      snakeLayerCanvas.width = snakeLayerFRS.width
      snakeLayerCanvas.height = snakeLayerFRS.height
    }
    
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
