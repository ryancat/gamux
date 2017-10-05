import gamux from '../../dist/gamux'
import snakeReducer from './snakeReducer'
import worldReducer from './worldReducer'
import { 
  gameResize,
  setStarPosition,
  setSnakeBody
} from './actions'

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
            columns,
            starPosition
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
          }}),
        star: {
          x: starPosition.column * cellWidth,
          y: starPosition.row * cellHeight,
          width: cellWidth,
          height: cellHeight
        }
      }
    }

    if (stateKey === 'snake') {
      let worldState = gameState['world'],
          {
            body,
            direction,
            isMove,
            speed
          } = dirtyState,
          {
            width,
            height,
            rows,
            columns
          } = worldState,
          cellWidth = width / columns,
          cellHeight = height / rows

      snakeLayer.finalRenderState = {
        width,
        height,
        body: body.map((bodyBlock) => {
          return {
            x: bodyBlock.column * cellWidth,
            y: bodyBlock.row * cellHeight,
            width: cellWidth,
            height: cellHeight
          }
        }),
        isMove
      }
      // // Set snake head direction
      // if (body.length > 0) {
      //   snakeLayer.finalRenderState.body[0].direction = direction  
      // }
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
      if (!worldLayerCRS) {
        worldLayerCRS = worldLayerFRS
      }

      worldLayerCanvas.width = worldLayerCRS.width
      worldLayerCanvas.height = worldLayerCRS.height
      worldLayerContext.strokeStyle = '#f9f9f9'
      worldLayerContext.lineWidth = 1
      worldLayerContext.beginPath()

      worldLayerCRS.xs.forEach((verticalLine) => {
        worldLayerContext.moveTo(verticalLine.x, verticalLine.y0)
        worldLayerContext.lineTo(verticalLine.x, verticalLine.y1)
        worldLayerContext.stroke()
      })

      worldLayerCRS.ys.forEach((horizontalLine) => {
        worldLayerContext.moveTo(horizontalLine.x0, horizontalLine.y)
        worldLayerContext.lineTo(horizontalLine.x1, horizontalLine.y)
        worldLayerContext.stroke()
      })

      let star = worldLayerCRS.star
      worldLayerContext.fillStyle = '#ffae00'
      worldLayerContext.fillRect(star.x, star.y, star.width, star.height)

      worldLayer.renderState = worldLayerCRS
    }

    // Snake layer
    if (snakeLayerCRS !== snakeLayerFRS) {
      if (!snakeLayerCRS) {
        snakeLayerCRS = snakeLayerFRS
      }

      snakeLayerCanvas.width = snakeLayerCRS.width
      snakeLayerCanvas.height = snakeLayerCRS.height

      let {
            speed,
            body
          } = snakeLayerCRS,
          bodyFRS = snakeLayerFRS.body

      // Set the direction for the snake head
      body.forEach((bodyBlock, index) => {
        // Each body block will move towards direction
        // for a given speed 
        let {
              x,
              y,
              width,
              height
            } = bodyBlock

        if (bodyFRS[index].x !== x) {
          x += speed * dt * (bodyFRS[index].x - x) / Math.abs(bodyFRS[index].x - x)
        }

        if (bodyFRS[index].y !== y) {
          y += speed * dt * (bodyFRS[index].y - y) / Math.abs(bodyFRS[index].y - y)
        }
        
        if (index === 0) {
          snakeLayerContext.fillStyle = '#ea6969'
        }
        else {
          snakeLayerContext.fillStyle = '#3f3f3f'
        }
        snakeLayerContext.fillRect(x, y, bodyBlock.width, bodyBlock.height)
      })
      // snakeLayer.renderState
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
