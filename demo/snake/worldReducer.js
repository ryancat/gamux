import {
  GAME_RESIZE,
  SET_STAR_POSITION,
  NEXT_LEVEL
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
  level: 1
}

function isOverlap (starPosition, snakeBody) {
  return !snakeBody.every((bodyBlock) => {
    return bodyBlock.row !== starPosition.row
        && bodyBlock.column !== starPosition.column
  })
}

export default (state = initState, action) => {
  switch (action.type) {

    case GAME_RESIZE:
      return Object.assign({}, state, {
        width: action.width,
        height: action.height
      })

    case SET_STAR_POSITION:
      return Object.assign({}, state, {
        starPosition: {
          row: action.row,
          column: action.column
        }
      })

    case NEXT_LEVEL: {
      let snakeBody = action.snakeBody,
          newStarPosition = {}

      do {
        newStarPosition.row = Math.floor(Math.random() * state.rows)
        newStarPosition.column = Math.floor(Math.random() * state.columns)
      }
      while (isOverlap(newStarPosition, snakeBody))

      return Object.assign({}, state, {
        starPosition: newStarPosition
      })
    }

    default:
      return state
  }
}