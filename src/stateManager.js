export function createStore (reducer) {
  // Init state
  let state = reducer()

  return {
    /**
     * Dispatch action to trigger state changes
     */
    dispatch: (action = {}) => {
      if (process.env.code === 'DEV') {
        // log actions in console
        console.group(action.type)
        console.info('%cbefore:', 'color: green', state)
        console.info('%caction:', 'color: red', action)
      }
      
      // Update state
      state = reducer(state, action)
      // State manager doesn't care about noticing
      // game to update state. Instead reducers
      // should set dirty state for game loop to
      // trigger update

      if (process.env.code === 'DEV') {
        // log actions in console
        console.info('%cafter:', 'color: green', state)
        console.groupEnd()
      }
    },
    /**
     * Return the current state for given key
     * This is to allow application to 'connect' to state
     */
    getState: (stateKey) => {
      if (!stateKey) {
        return state
      }
      else {
        return state[stateKey]
      }
    }
  }
}

// Assume the recuerMap is a flat map to all reducers
export function combineReducer (reducerMap = {}, updater) {

  // Generate a combined reducer function
  return (state = {}, action = {}) => {
    let newState = {},
        dirtyKeys = []

    // Spread the action to all reducers inside the combined one
    for (let key in reducerMap) {
      // Pass the whole state down as argument for
      // cross state key access
      let reducedState = reducerMap[key](state[key], action, state)

      if (reducedState !== state[key]) {
        dirtyKeys.push(key)
      }

      newState[key] = reducedState
    }

    // Call update function for each reduced state
    updater(newState, dirtyKeys)

    // dirtyKeys.forEach((dirtyKey) => {
    //   updaterMap[dirtyKey](newState, dirtyKey)
    // })

    return newState
  }
}

export function combineUpdater (updaterMap = {}, rendererMap = {}) {
  // Generate combined updater function for all updaters
  return (state = {}, dirtyKeys = []) => {
    let newFinalRenderState = {}
    for (let key in updaterMap) {
      // Compute the final render state and pass into renderer
      rendererMap[key].finalRenderState = updaterMap[key](rendererMap[key].finalRenderState, state, dirtyKeys)
    }
  }
}
