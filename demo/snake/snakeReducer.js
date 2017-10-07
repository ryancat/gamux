import {
  LEFT_KEYDOWN,
  RIGHT_KEYDOWN,
  UP_KEYDOWN,
  DOWN_KEYDOWN,
  SET_SNAKE_BODY,
  NEXT_LEVEL,
  GAME_OVER,
  CUT_SNAKE_BODY
} from './actions'
import {
  gameDefault,
  direction
} from './theme'

const initState = {
  /**
   * A linked list for snake body
   */
  body: [],
  isMove: false,
  speed: gameDefault.speed,
  rows: gameDefault.rows,
  columns: gameDefault.columns,
  level: 1
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

    case UP_KEYDOWN: {
      let body = state.body.slice()

      if (body[0].row === body[1].row + 1) {
        // Hit backwards 
        // This should trigger nothing
        return state
      }

      body.reverse().reduce((first, second) => {
        first.row = second.row
        first.column = second.column
        return second 
      })
      body.reverse()

      body[0].row -= 1

      return Object.assign({}, state, {
        isMove: true,
        body,
        direction: direction.UP
      })
    }

    case DOWN_KEYDOWN: {
      let body = state.body.slice()

      if (body[0].row === body[1].row - 1) {
        // Hit backwards 
        // This should trigger nothing
        return state
      }

      body.reverse().reduce((first, second) => {
        first.row = second.row
        first.column = second.column
        return second 
      })
      body.reverse()

      body[0].row += 1

      return Object.assign({}, state, {
        isMove: true,
        body,
        direction: direction.DOWN
      })
    }

    case LEFT_KEYDOWN: {
      let body = state.body.slice()

      if (body[0].column === body[1].column + 1) {
        // Hit backwards 
        // This should trigger nothing
        return state
      }

      body.reverse().reduce((first, second) => {
        first.row = second.row
        first.column = second.column
        return second 
      })
      body.reverse()

      body[0].column -= 1

      return Object.assign({}, state, {
        isMove: true,
        body,
        direction: direction.LEFT
      })
    }

    case RIGHT_KEYDOWN: {
      let body = state.body.slice()

      if (body[0].column === body[1].column - 1) {
        // Hit backwards 
        // This should trigger nothing
        return state
      }

      body.reverse().reduce((first, second) => {
        first.row = second.row
        first.column = second.column
        return second 
      })
      body.reverse()

      body[0].column += 1

      return Object.assign({}, state, {
        isMove: true,
        body,
        direction: direction.RIGHT
      })
    }

    case NEXT_LEVEL: {
      let body = state.body.slice(),
          head = body[0],
          headDirection = state.direction

      if (!head) {
        return state
      }

      body.unshift({
        row: headDirection === direction.UP ? head.row - 1 : headDirection === direction.DOWN ? head.row + 1 : head.row,
        column: headDirection === direction.LEFT ? head.column - 1 : headDirection === direction.RIGHT ? head.column + 1 : head.column
      })

      return Object.assign({}, state, {
        body,
        level: state.level + 1
      })
    }

    case GAME_OVER: {
      return Object.assign({}, state, {
        isMove: false
      })
    }

    case CUT_SNAKE_BODY: {
      let body = state.body.slice(),
          {cutBodyIndex} = action

      body.splice(cutBodyIndex)

      return Object.assign({}, state, {
        body,
        level: cutBodyIndex - 1
      })
    }

    default:
      return state
  }
}