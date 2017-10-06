import gamux from '../../dist/gamux'
import snakeReducer from './snakeReducer'
import worldReducer from './worldReducer'
import {worldLayerUpdater, worldLayerRender} from './worldLayer'
import {snakeLayerUpdater, snakeLayerRender} from './snakeLayer'
import { 
  gameResize,
  setStarPosition,
  setSnakeBody,
  leftKeyDown,
  rightKeyDown,
  upKeyDown,
  downKeyDown
} from './actions'

import './index.scss'

const container = document.getElementById('root')

gamux.config({
  fps: 60,

  container,

  layers: [{
    name: 'worldLayer',
    updater: worldLayerUpdater,
    render: worldLayerRender
  }, {
    name: 'snakeLayer',
    updater: snakeLayerUpdater,
    render: snakeLayerRender
  }],

  /**
   * init game. Getting called before game loop starts
   */
  init: (gameState) => {
    console.log('init')
    // Make sure container dimension is init
    gamux.dispatch(gameResize(
      container.offsetWidth,
      container.offsetHeight
    ))

    let worldState = gameState['world'],
        snakeState = gameState['snake']

    // Init world based on initial state
    let {
          rows,
          columns
        } = worldState,
        starRow = Math.floor(Math.random() * rows),
        starColumn = Math.floor(Math.random() * columns)

    gamux.dispatch(setStarPosition(starRow, starColumn))

    // Init snake based on world
    let body = []
    do {
      let headRow = Math.floor(Math.random() * rows),
          headColumn = Math.floor(Math.random() * columns)

      body[0] = {
        row: headRow,
        column: headColumn
      }

      let isHorizontal = Math.random() > 0.5
      body[1] = {
        row: headRow + (isHorizontal ? (Math.random() > 0.5 ? 1 : -1) : 0),
        column: headColumn + (isHorizontal ? 0 : (Math.random() > 0.5 ? 1 : -1)),
      }

    } while (!body.every((bodyBlock) => {
      return bodyBlock.row !== starRow 
      && bodyBlock.column !== starColumn 
      && bodyBlock.row >= 0 && bodyBlock.row < rows
      && bodyBlock.column >= 0 && bodyBlock.column < columns
    }))
    gamux.dispatch(setSnakeBody(body))

    // Setup listener
    window.onload = window.onresize = () => {
      gamux.dispatch(gameResize(
        container.offsetWidth,
        container.offsetHeight
      ))
    }

    document.addEventListener('keydown', (evt) => {
      switch (evt.keyCode) {
        case 37: // Left
          gamux.dispatch(leftKeyDown())
          break
        case 38: // Up
          gamux.dispatch(upKeyDown())
          break
        case 39: // Right
          gamux.dispatch(rightKeyDown())
          break
        case 40: // Down
          gamux.dispatch(downKeyDown())
          break
      }
    })
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
