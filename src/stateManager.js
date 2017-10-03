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
        console.info('before:', state)
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
        console.info('after:', state)
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
export function combineReducer (reducerMap = {}) {
  return (state = {}, action = {}) => {
    var newState = {}
    for (let key in reducerMap) {
      // Pass the whole state down as argument for
      // cross state key access
      newState[key] = reducerMap[key](state[key], action, state)
    }
    return newState
  }
}