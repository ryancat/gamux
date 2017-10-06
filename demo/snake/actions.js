// Action types
export const GAME_RESIZE = 'GAME_RESIZE' 
export const SET_STAR_POSITION = 'SET_STAR_POSITION' 
export const SET_SNAKE_BODY = 'SET_SNAKE_BODY' 
export const LEFT_KEYDOWN = 'LEFT_KEYDOWN'
export const RIGHT_KEYDOWN = 'RIGHT_KEYDOWN'
export const UP_KEYDOWN = 'UP_KEYDOWN'
export const DOWN_KEYDOWN = 'DOWN_KEYDOWN'
export const GAME_OVER = 'GAME_OVER'
export const NEXT_LEVEL = 'NEXT_LEVEL'

// Action creators
export function gameResize (width, height) {
  return {
    type: GAME_RESIZE,
    width,
    height
  }
}

export function setStarPosition (row, column) {
  return {
    type: SET_STAR_POSITION,
    row,
    column
  }
}

export function setSnakeBody (body) {
  return {
    type: SET_SNAKE_BODY,
    body
  }
}

export function leftKeyDown () {
  return {
    type: LEFT_KEYDOWN
  }
}

export function rightKeyDown () {
  return {
    type: RIGHT_KEYDOWN
  }
}

export function upKeyDown () {
  return {
    type: UP_KEYDOWN
  }
}

export function downKeyDown () {
  return {
    type: DOWN_KEYDOWN
  }
}

export function gameOver () {
  return {
    type: GAME_OVER
  }
}

export function nextLevel (snakeBody) {
  return {
    type: NEXT_LEVEL,
    snakeBody
  }
}
