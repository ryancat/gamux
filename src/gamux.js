import {combineReducer, createStore, combineUpdater} from './stateManager'

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
let _store = {}

let _updaterMap = {}

let _rendererMap = {}

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
        // _update()
        _accumulator -= dt
      }
      for (let key in _rendererMap) {
        let renderer = _rendererMap[key]
        renderer.renderState = renderer(renderer.renderState, renderer.finalRenderState, dt)
      }
    }
    _loop(now)
  })
}

const gamux = {
  config: (config = {}) => {
    // Config the private globals
    _update = config.update || _update
    _render = config.render || _render
    _init = config.init || _init
    _fps = config.fps || _fps

    let container = config.container

    // Create game layers
    config.layers.forEach((layer) => {
      let canvas = document.createElement('canvas')
      container.appendChild(canvas)

      _updaterMap[layer.name] = layer.updater
      _rendererMap[layer.name] = layer.render.bind(null, canvas)

      // gamux.layers[layer.name] = {
      //   canvas,
      //   canvasCtx: canvas.getContext('2d')
      // }
    })

    // Create game store
    let reducerMap = config.reducerMap
        // updaterMap = {}

    // if (!config.updaterMap) {
    //   for (let key in reducerMap) {
    //     updaterMap[key] = _update
    //   }
    // }
    // else {
    //   // We will ignore config.update if updaterMap exists
    //   if (process.env.code === 'DEV' && config.update) {
    //     console.warn('Ignore config.update and use config.updaterMap')
    //   }
    //   updaterMap = config.updaterMap
    // }

    _store = createStore(combineReducer(reducerMap, combineUpdater(_updaterMap, _rendererMap)))
    _init(_store.getState())
  },

  layers: {},

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