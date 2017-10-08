import {
  GAME_RESIZE,
  SET_STAR_POSITION,
  NEXT_LEVEL,
  GAME_OVER,
  CUT_SNAKE_BODY
} from './actions'
import {gameDefault} from './theme'

const initState = {
  width: -1,
  height: -1,
  rows: gameDefault.rows,
  columns: gameDefault.columns,
  starPosition: {
    row: -1,
    column: -1
  },
  level: 1,
  highLevel: 1,
  isGameover: false
}

function isOverlap (starPosition, snakeBody) {
  return !snakeBody.every((bodyBlock) => {
    return bodyBlock.row !== starPosition.row
        && bodyBlock.column !== starPosition.column
  })
}

export default (state = initState, action) => {
  switch (action.type) {

    case GAME_RESIZE: {
      let gameSize = Math.min(Math.min(action.width, action.height), 600)
      
      return Object.assign({}, state, {
        width: gameSize,
        height: gameSize
      })
    }

    case SET_STAR_POSITION:
      return Object.assign({}, state, {
        starPosition: {
          row: action.row,
          column: action.column
        }
      })

    case NEXT_LEVEL: {
      let snakeBody = action.snakeBody,
          newStarPosition = {},
          newLevel = state.level + 1

      do {
        newStarPosition.row = Math.floor(Math.random() * state.rows)
        newStarPosition.column = Math.floor(Math.random() * state.columns)
      }
      while (isOverlap(newStarPosition, snakeBody))

      return Object.assign({}, state, {
        starPosition: newStarPosition,
        level: newLevel,
        highLevel: Math.max(state.highLevel, newLevel)
      })
    }

    case GAME_OVER: {
      return Object.assign({}, state, {
        isGameover: true
      })
    }

    case CUT_SNAKE_BODY: {
      return Object.assign({}, state, {
        level: action.cutBodyIndex - 1
      })
    }

    default:
      return state
  }
}