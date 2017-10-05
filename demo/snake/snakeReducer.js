import {
  MOVE_UP,
  MOVE_DOWN,
  MOVE_LEFT,
  MOVE_RIGHT,

  SET_SNAKE_BODY
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
  isMove: false,
  speed: 10
}

export default (state = initState, action) => {
  switch (action.type) {
    case SET_SNAKE_BODY: {
      let {
        body,
      } = action

      return Object.assign({}, state, {
        body,
        isMove: true
      })
    }

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