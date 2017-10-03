import {combineReducer, createStore} from './stateManager'

/**
 * The animation loop key for cancel animation
 */
let _animationLoopKey = null
/**
 * Accumulator for time-based animation
 */
let _accumulator = 0
/**
 * The default fps
 */
let _fps = 60
/**
 * Reference to the init function
 */
let _init = () => {}
/**
 * Reference to the update function
 */
let _update = () => {}
/**
 * Reference to the render function
 */
let _render = () => {}
/**
 * The store for game
 */
let _store = null

/**
 * Trigger game loop
 */
function _loop (lastTimestamp) {
  _animationLoopKey = window.requestAnimationFrame(() => {
    const now = Date.now()
    const dt = 1000 / _fps
    _accumulator += now - lastTimestamp

    if (_accumulator >= dt) {
      while (_accumulator >= dt) {
        _update()
        _accumulator -= dt
      }
      _render(dt)
    }
    _loop(now)
  })
}

const gamux = {
  config: (config = {}) => {
    _update = config.update || _update
    _render = config.render || _render
    _init = config.init || _init
    _fps = config.fps || _fps
    _store = createStore(combineReducer(config.reducerMap))

    // let container = config.container || document.body

    // gamux.game = {
    //   container,
    //   width: container.offsetWidth,
    //   height: container.offsetHeight
    // }
    // 
    
    _init()
  },

  start: () => {
    _loop(Date.now())
  },

  dispatch: (action) => {
    _store.dispatch(action)
  }

  // *
  //  * Game will be available once configured
   
  // game: null
}

export default gamux


// TODO
// 1. Build file for ES6 modules