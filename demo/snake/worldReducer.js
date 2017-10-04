import {
  GAME_RESIZE
} from './actions'

const initState = {
  width: -1,
  height: -1,
  rows: 20,
  columns: 20,
  level: 1
}

export default (state = initState, action) => {
  switch (action.type) {

    case GAME_RESIZE:
      return Object.assign({}, state, {
        width: action.width,
        height: action.height
      })

    default:
      return state
  }
}