// Action types
export const MOVE_UP = 'MOVE_UP' 
export const MOVE_DOWN = 'MOVE_DOWN' 
export const MOVE_LEFT = 'MOVE_LEFT' 
export const MOVE_RIGHT = 'MOVE_RIGHT' 

export const GAME_RESIZE = 'GAME_RESIZE' 
export const SET_STAR_POSITION = 'SET_STAR_POSITION' 
export const SET_SNAKE_BODY = 'SET_SNAKE_BODY' 

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