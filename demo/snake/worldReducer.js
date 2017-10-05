import {
  GAME_RESIZE,
  SET_STAR_POSITION
} from './actions'
import gamux from '../../dist/gamux'

const initState = {
  width: -1,
  height: -1,
  rows: 20,
  columns: 20,
  // starPosition: {
  //   row: Math.floor(Math.random() * ROWS),
  //   column: Math.floor(Math.random() * COLUMNS)
  // },
  starPosition: {
    row: -1,
    column: -1
  },
  level: 1
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

    default:
      return state
  }
}