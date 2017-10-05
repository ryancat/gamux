import {
  LEFT_KEYDOWN,
  RIGHT_KEYDOWN,
  UP_KEYDOWN,
  DOWN_KEYDOWN,
  SET_SNAKE_BODY,
} from './actions'
import {gameDefault} from './theme'

const initState = {
  /**
   * A linked list for snake body
   */
  body: [],
  isMove: false,
  speed: 10,
  rows: gameDefault.rows,
  columns: gameDefault.columns
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

      body.reduce((first, second) => {
        second.row = first.row
        second.column = first.column
      })

      body[0].row = body[0].row === 0 ? state.rows - 1 : body[0].row - 1

      return Object.assign({}, state, {
        isMove: true,
        body
      })
    }

    case DOWN_KEYDOWN: {
      let body = state.body.slice()

      body.reduce((first, second) => {
        second.row = first.row
        second.column = first.column
      })

      body[0].row = body[0].row === state.rows - 1 ? 0 : body[0].row + 1

      return Object.assign({}, state, {
        isMove: true,
        body
      })
    }

    case LEFT_KEYDOWN: {
      let body = state.body.slice()

      body.reduce((first, second) => {
        second.row = first.row
        second.column = first.column
      })

      body[0].column = body[0].column === 0 ? state.columns - 1 : body[0].column - 1

      return Object.assign({}, state, {
        isMove: true,
        body
      })
    }

    case RIGHT_KEYDOWN: {
      let body = state.body.slice()

      body.reduce((first, second) => {
        second.row = first.row
        second.column = first.column
      })

      body[0].column = body[0].column === state.columns - 1 ? 0 : body[0].column + 1

      return Object.assign({}, state, {
        isMove: true,
        body
      })
    }

    default:
      return state
  }
}