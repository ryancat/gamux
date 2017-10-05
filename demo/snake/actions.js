// Action types
export const GAME_RESIZE = 'GAME_RESIZE' 
export const SET_STAR_POSITION = 'SET_STAR_POSITION' 
export const SET_SNAKE_BODY = 'SET_SNAKE_BODY' 
export const LEFT_KEYDOWN = 'LEFT_KEYDOWN'
export const RIGHT_KEYDOWN = 'RIGHT_KEYDOWN'
export const UP_KEYDOWN = 'UP_KEYDOWN'
export const DOWN_KEYDOWN = 'DOWN_KEYDOWN'

// Action creators
export const gameResize = (width, height) => {
  return {
    type: GAME_RESIZE,
    width,
    height
  }
}

export const setStarPosition = (row, column) => {
  return {
    type: SET_STAR_POSITION,
    row,
    column
  }
}

export const setSnakeBody = (body) => {
  return {
    type: SET_SNAKE_BODY,
    body
  }
}

export const leftKeyDown = () => {
  return {
    type: LEFT_KEYDOWN
  }
}

export const rightKeyDown = () => {
  return {
    type: RIGHT_KEYDOWN
  }
}

export const upKeyDown = () => {
  return {
    type: UP_KEYDOWN
  }
}

export const downKeyDown = () => {
  return {
    type: DOWN_KEYDOWN
  }
}