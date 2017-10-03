// Action types
export const MOVE_UP = 'MOVE_UP' 
export const MOVE_DOWN = 'MOVE_DOWN' 
export const MOVE_LEFT = 'MOVE_LEFT' 
export const MOVE_RIGHT = 'MOVE_RIGHT' 
export const INIT_SNAKE = 'INIT_SNAKE' 

export const GAME_RESIZE = 'GAME_RESIZE' 

// Action creators
export const gameResize = (width, height) => {
  return {
    type: GAME_RESIZE,
    width,
    height
  }
}