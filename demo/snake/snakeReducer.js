import {
  INIT_SNAKE,
  MOVE_UP,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT
} from './actions'

const direction = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down'
}

const initState = {
  /**
   * A linked list for snake body
   */
  body: [],
  direction: null,
  isMove: false
}

export default (state = initState, action) => {
  switch (action.type) {
    case INIT_SNAKE:
      let {
        body,
        direction
      } = action

      return Object.assign({}, state, {
        body,
        direction,
        isMove: true
      })

    case MOVE_UP:
      return Object.assign({}, state, {
        direction: direction.UP,
        isMove: true
      })

    case MOVE_DOWN:
      return Object.assign({}, state, {
        direction: direction.DOWN,
        isMove: true
      })

    case MOVE_LEFT:
      return Object.assign({}, state, {
        direction: direction.LEFT,
        isMove: true
      })

    case MOVE_RIGHT:
      return Object.assign({}, state, {
        direction: direction.RIGHT,
        isMove: true
      })

    default:
      return state
  }
}