(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["gamux"] = factory();
	else
		root["gamux"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stateManager = __webpack_require__(2);

/**
 * The animation loop key for cancel animation
 */
var _animationLoopKey = null;
/**
 * Accumulator for time-based animation
 */
var _accumulator = 0;
/**
 * The default fps
 */
var _fps = 60;
/**
 * Reference to the init function
 */
var _init = function _init() {};
/**
 * Reference to the update function
 */
var _update = function _update() {};
/**
 * Reference to the render function
 */
var _render = function _render() {};
/**
 * The store for game
 */
var _store = {};

var _updaterMap = {};

var _rendererMap = {};

/**
 * Trigger game loop
 */
function _loop(lastTimestamp) {
  _animationLoopKey = window.requestAnimationFrame(function () {
    var now = Date.now();
    var dt = 1000 / _fps;
    _accumulator += now - lastTimestamp;

    if (_accumulator >= dt) {
      while (_accumulator >= dt) {
        // _update()
        _accumulator -= dt;
      }
      for (var key in _rendererMap) {
        var renderer = _rendererMap[key];
        renderer.renderState = renderer(renderer.renderState, renderer.finalRenderState, dt);
      }
    }
    _loop(now);
  });
}

var gamux = {
  config: function config() {
    var _config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    // Config the private globals
    _update = _config.update || _update;
    _render = _config.render || _render;
    _init = _config.init || _init;
    _fps = _config.fps || _fps;

    var container = _config.container;

    // Create game layers
    _config.layers.forEach(function (layer) {
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);

      _updaterMap[layer.name] = layer.updater;
      _rendererMap[layer.name] = layer.render.bind(null, canvas);

      // gamux.layers[layer.name] = {
      //   canvas,
      //   canvasCtx: canvas.getContext('2d')
      // }
    });

    // Create game store
    var reducerMap = _config.reducerMap;
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

    _store = (0, _stateManager.createStore)((0, _stateManager.combineReducer)(reducerMap, (0, _stateManager.combineUpdater)(_updaterMap, _rendererMap)));
    _init(_store.getState());
  },

  layers: {},

  start: function start() {
    _loop(Date.now());
  },

  dispatch: function dispatch(action) {
    _store.dispatch(action);
  }

  // *
  //  * Game will be available once configured

  // game: null
};

exports.default = gamux;

// TODO
// 1. Build file for ES6 modules

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createStore = createStore;
exports.combineReducer = combineReducer;
exports.combineUpdater = combineUpdater;
function createStore(reducer) {
  // Init state
  var state = reducer();

  return {
    /**
     * Dispatch action to trigger state changes
     */
    dispatch: function dispatch() {
      var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (true) {
        // log actions in console
        console.group(action.type);
        console.info('%cbefore:', 'color: green', state);
        console.info('%caction:', 'color: red', action);
      }

      // Update state
      state = reducer(state, action);
      // State manager doesn't care about noticing
      // game to update state. Instead reducers
      // should set dirty state for game loop to
      // trigger update

      if (true) {
        // log actions in console
        console.info('%cafter:', 'color: green', state);
        console.groupEnd();
      }
    },
    /**
     * Return the current state for given key
     * This is to allow application to 'connect' to state
     */
    getState: function getState(stateKey) {
      if (!stateKey) {
        return state;
      } else {
        return state[stateKey];
      }
    }
  };
}

// Assume the recuerMap is a flat map to all reducers
function combineReducer() {
  var reducerMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var updater = arguments[1];


  // Generate a combined reducer function
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var newState = {},
        dirtyKeys = [];

    // Spread the action to all reducers inside the combined one
    for (var key in reducerMap) {
      // Pass the whole state down as argument for
      // cross state key access
      var reducedState = reducerMap[key](state[key], action, state);

      if (reducedState !== state[key]) {
        dirtyKeys.push(key);
      }

      newState[key] = reducedState;
    }

    // Call update function for each reduced state
    updater(newState, dirtyKeys);

    // dirtyKeys.forEach((dirtyKey) => {
    //   updaterMap[dirtyKey](newState, dirtyKey)
    // })

    return newState;
  };
}

function combineUpdater() {
  var updaterMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var rendererMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Generate combined updater function for all updaters
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var dirtyKeys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var newFinalRenderState = {};
    for (var key in updaterMap) {
      // Compute the final render state and pass into renderer
      rendererMap[key].finalRenderState = updaterMap[key](rendererMap[key].finalRenderState, state, dirtyKeys);
    }
  };
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBjMjIwNjQ2Mjk0ODYzZjc5YjY0YiIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtdXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJfYW5pbWF0aW9uTG9vcEtleSIsIl9hY2N1bXVsYXRvciIsIl9mcHMiLCJfaW5pdCIsIl91cGRhdGUiLCJfcmVuZGVyIiwiX3N0b3JlIiwiX3VwZGF0ZXJNYXAiLCJfcmVuZGVyZXJNYXAiLCJfbG9vcCIsImxhc3RUaW1lc3RhbXAiLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJub3ciLCJEYXRlIiwiZHQiLCJrZXkiLCJyZW5kZXJlciIsInJlbmRlclN0YXRlIiwiZmluYWxSZW5kZXJTdGF0ZSIsImdhbXV4IiwiY29uZmlnIiwidXBkYXRlIiwicmVuZGVyIiwiaW5pdCIsImZwcyIsImNvbnRhaW5lciIsImxheWVycyIsImZvckVhY2giLCJsYXllciIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwibmFtZSIsInVwZGF0ZXIiLCJiaW5kIiwicmVkdWNlck1hcCIsImdldFN0YXRlIiwic3RhcnQiLCJkaXNwYXRjaCIsImFjdGlvbiIsImNyZWF0ZVN0b3JlIiwiY29tYmluZVJlZHVjZXIiLCJjb21iaW5lVXBkYXRlciIsInJlZHVjZXIiLCJzdGF0ZSIsImNvbnNvbGUiLCJncm91cCIsInR5cGUiLCJpbmZvIiwiZ3JvdXBFbmQiLCJzdGF0ZUtleSIsIm5ld1N0YXRlIiwiZGlydHlLZXlzIiwicmVkdWNlZFN0YXRlIiwicHVzaCIsInVwZGF0ZXJNYXAiLCJyZW5kZXJlck1hcCIsIm5ld0ZpbmFsUmVuZGVyU3RhdGUiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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a0JBQVkxQyxHQUFaLEVBQWlCRyxnQkFBakIsR0FBb0NzQyxXQUFXekMsR0FBWCxFQUFnQjBDLFlBQVkxQyxHQUFaLEVBQWlCRyxnQkFBakMsRUFBbUQyQixLQUFuRCxFQUEwRFEsU0FBMUQsQ0FBcEM7QUFDRDtBQUNGLEdBTkQ7QUFPRCxDIiwiZmlsZSI6ImdhbXV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZ2FtdXhcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiZ2FtdXhcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGMyMjA2NDYyOTQ4NjNmNzliNjRiIiwiaW1wb3J0IHtjb21iaW5lUmVkdWNlciwgY3JlYXRlU3RvcmUsIGNvbWJpbmVVcGRhdGVyfSBmcm9tICcuL3N0YXRlTWFuYWdlcidcblxuLyoqXG4gKiBUaGUgYW5pbWF0aW9uIGxvb3Aga2V5IGZvciBjYW5jZWwgYW5pbWF0aW9uXG4gKi9cbmxldCBfYW5pbWF0aW9uTG9vcEtleSA9IG51bGxcbi8qKlxuICogQWNjdW11bGF0b3IgZm9yIHRpbWUtYmFzZWQgYW5pbWF0aW9uXG4gKi9cbmxldCBfYWNjdW11bGF0b3IgPSAwXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZwc1xuICovXG5sZXQgX2ZwcyA9IDYwXG4vKipcbiAqIFJlZmVyZW5jZSB0byB0aGUgaW5pdCBmdW5jdGlvblxuICovXG5sZXQgX2luaXQgPSAoKSA9PiB7fVxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gdGhlIHVwZGF0ZSBmdW5jdGlvblxuICovXG5sZXQgX3VwZGF0ZSA9ICgpID0+IHt9XG4vKipcbiAqIFJlZmVyZW5jZSB0byB0aGUgcmVuZGVyIGZ1bmN0aW9uXG4gKi9cbmxldCBfcmVuZGVyID0gKCkgPT4ge31cbi8qKlxuICogVGhlIHN0b3JlIGZvciBnYW1lXG4gKi9cbmxldCBfc3RvcmUgPSB7fVxuXG5sZXQgX3VwZGF0ZXJNYXAgPSB7fVxuXG5sZXQgX3JlbmRlcmVyTWFwID0ge31cblxuLyoqXG4gKiBUcmlnZ2VyIGdhbWUgbG9vcFxuICovXG5mdW5jdGlvbiBfbG9vcCAobGFzdFRpbWVzdGFtcCkge1xuICBfYW5pbWF0aW9uTG9vcEtleSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICBjb25zdCBkdCA9IDEwMDAgLyBfZnBzXG4gICAgX2FjY3VtdWxhdG9yICs9IG5vdyAtIGxhc3RUaW1lc3RhbXBcblxuICAgIGlmIChfYWNjdW11bGF0b3IgPj0gZHQpIHtcbiAgICAgIHdoaWxlIChfYWNjdW11bGF0b3IgPj0gZHQpIHtcbiAgICAgICAgLy8gX3VwZGF0ZSgpXG4gICAgICAgIF9hY2N1bXVsYXRvciAtPSBkdFxuICAgICAgfVxuICAgICAgZm9yIChsZXQga2V5IGluIF9yZW5kZXJlck1hcCkge1xuICAgICAgICBsZXQgcmVuZGVyZXIgPSBfcmVuZGVyZXJNYXBba2V5XVxuICAgICAgICByZW5kZXJlci5yZW5kZXJTdGF0ZSA9IHJlbmRlcmVyKHJlbmRlcmVyLnJlbmRlclN0YXRlLCByZW5kZXJlci5maW5hbFJlbmRlclN0YXRlLCBkdClcbiAgICAgIH1cbiAgICB9XG4gICAgX2xvb3Aobm93KVxuICB9KVxufVxuXG5jb25zdCBnYW11eCA9IHtcbiAgY29uZmlnOiAoY29uZmlnID0ge30pID0+IHtcbiAgICAvLyBDb25maWcgdGhlIHByaXZhdGUgZ2xvYmFsc1xuICAgIF91cGRhdGUgPSBjb25maWcudXBkYXRlIHx8IF91cGRhdGVcbiAgICBfcmVuZGVyID0gY29uZmlnLnJlbmRlciB8fCBfcmVuZGVyXG4gICAgX2luaXQgPSBjb25maWcuaW5pdCB8fCBfaW5pdFxuICAgIF9mcHMgPSBjb25maWcuZnBzIHx8IF9mcHNcblxuICAgIGxldCBjb250YWluZXIgPSBjb25maWcuY29udGFpbmVyXG5cbiAgICAvLyBDcmVhdGUgZ2FtZSBsYXllcnNcbiAgICBjb25maWcubGF5ZXJzLmZvckVhY2goKGxheWVyKSA9PiB7XG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW52YXMpXG5cbiAgICAgIF91cGRhdGVyTWFwW2xheWVyLm5hbWVdID0gbGF5ZXIudXBkYXRlclxuICAgICAgX3JlbmRlcmVyTWFwW2xheWVyLm5hbWVdID0gbGF5ZXIucmVuZGVyLmJpbmQobnVsbCwgY2FudmFzKVxuXG4gICAgICAvLyBnYW11eC5sYXllcnNbbGF5ZXIubmFtZV0gPSB7XG4gICAgICAvLyAgIGNhbnZhcyxcbiAgICAgIC8vICAgY2FudmFzQ3R4OiBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxuICAgICAgLy8gfVxuICAgIH0pXG5cbiAgICAvLyBDcmVhdGUgZ2FtZSBzdG9yZVxuICAgIGxldCByZWR1Y2VyTWFwID0gY29uZmlnLnJlZHVjZXJNYXBcbiAgICAgICAgLy8gdXBkYXRlck1hcCA9IHt9XG5cbiAgICAvLyBpZiAoIWNvbmZpZy51cGRhdGVyTWFwKSB7XG4gICAgLy8gICBmb3IgKGxldCBrZXkgaW4gcmVkdWNlck1hcCkge1xuICAgIC8vICAgICB1cGRhdGVyTWFwW2tleV0gPSBfdXBkYXRlXG4gICAgLy8gICB9XG4gICAgLy8gfVxuICAgIC8vIGVsc2Uge1xuICAgIC8vICAgLy8gV2Ugd2lsbCBpZ25vcmUgY29uZmlnLnVwZGF0ZSBpZiB1cGRhdGVyTWFwIGV4aXN0c1xuICAgIC8vICAgaWYgKHByb2Nlc3MuZW52LmNvZGUgPT09ICdERVYnICYmIGNvbmZpZy51cGRhdGUpIHtcbiAgICAvLyAgICAgY29uc29sZS53YXJuKCdJZ25vcmUgY29uZmlnLnVwZGF0ZSBhbmQgdXNlIGNvbmZpZy51cGRhdGVyTWFwJylcbiAgICAvLyAgIH1cbiAgICAvLyAgIHVwZGF0ZXJNYXAgPSBjb25maWcudXBkYXRlck1hcFxuICAgIC8vIH1cblxuICAgIF9zdG9yZSA9IGNyZWF0ZVN0b3JlKGNvbWJpbmVSZWR1Y2VyKHJlZHVjZXJNYXAsIGNvbWJpbmVVcGRhdGVyKF91cGRhdGVyTWFwLCBfcmVuZGVyZXJNYXApKSlcbiAgICBfaW5pdChfc3RvcmUuZ2V0U3RhdGUoKSlcbiAgfSxcblxuICBsYXllcnM6IHt9LFxuXG4gIHN0YXJ0OiAoKSA9PiB7XG4gICAgX2xvb3AoRGF0ZS5ub3coKSlcbiAgfSxcblxuICBkaXNwYXRjaDogKGFjdGlvbikgPT4ge1xuICAgIF9zdG9yZS5kaXNwYXRjaChhY3Rpb24pXG4gIH1cblxuICAvLyAqXG4gIC8vICAqIEdhbWUgd2lsbCBiZSBhdmFpbGFibGUgb25jZSBjb25maWd1cmVkXG4gICBcbiAgLy8gZ2FtZTogbnVsbFxufVxuXG5leHBvcnQgZGVmYXVsdCBnYW11eFxuXG5cbi8vIFRPRE9cbi8vIDEuIEJ1aWxkIGZpbGUgZm9yIEVTNiBtb2R1bGVzXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2dhbXV4LmpzIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVN0b3JlIChyZWR1Y2VyKSB7XG4gIC8vIEluaXQgc3RhdGVcbiAgbGV0IHN0YXRlID0gcmVkdWNlcigpXG5cbiAgcmV0dXJuIHtcbiAgICAvKipcbiAgICAgKiBEaXNwYXRjaCBhY3Rpb24gdG8gdHJpZ2dlciBzdGF0ZSBjaGFuZ2VzXG4gICAgICovXG4gICAgZGlzcGF0Y2g6IChhY3Rpb24gPSB7fSkgPT4ge1xuICAgICAgaWYgKHByb2Nlc3MuZW52LmNvZGUgPT09ICdERVYnKSB7XG4gICAgICAgIC8vIGxvZyBhY3Rpb25zIGluIGNvbnNvbGVcbiAgICAgICAgY29uc29sZS5ncm91cChhY3Rpb24udHlwZSlcbiAgICAgICAgY29uc29sZS5pbmZvKCclY2JlZm9yZTonLCAnY29sb3I6IGdyZWVuJywgc3RhdGUpXG4gICAgICAgIGNvbnNvbGUuaW5mbygnJWNhY3Rpb246JywgJ2NvbG9yOiByZWQnLCBhY3Rpb24pXG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFVwZGF0ZSBzdGF0ZVxuICAgICAgc3RhdGUgPSByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pXG4gICAgICAvLyBTdGF0ZSBtYW5hZ2VyIGRvZXNuJ3QgY2FyZSBhYm91dCBub3RpY2luZ1xuICAgICAgLy8gZ2FtZSB0byB1cGRhdGUgc3RhdGUuIEluc3RlYWQgcmVkdWNlcnNcbiAgICAgIC8vIHNob3VsZCBzZXQgZGlydHkgc3RhdGUgZm9yIGdhbWUgbG9vcCB0b1xuICAgICAgLy8gdHJpZ2dlciB1cGRhdGVcblxuICAgICAgaWYgKHByb2Nlc3MuZW52LmNvZGUgPT09ICdERVYnKSB7XG4gICAgICAgIC8vIGxvZyBhY3Rpb25zIGluIGNvbnNvbGVcbiAgICAgICAgY29uc29sZS5pbmZvKCclY2FmdGVyOicsICdjb2xvcjogZ3JlZW4nLCBzdGF0ZSlcbiAgICAgICAgY29uc29sZS5ncm91cEVuZCgpXG4gICAgICB9XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZXR1cm4gdGhlIGN1cnJlbnQgc3RhdGUgZm9yIGdpdmVuIGtleVxuICAgICAqIFRoaXMgaXMgdG8gYWxsb3cgYXBwbGljYXRpb24gdG8gJ2Nvbm5lY3QnIHRvIHN0YXRlXG4gICAgICovXG4gICAgZ2V0U3RhdGU6IChzdGF0ZUtleSkgPT4ge1xuICAgICAgaWYgKCFzdGF0ZUtleSkge1xuICAgICAgICByZXR1cm4gc3RhdGVcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gc3RhdGVbc3RhdGVLZXldXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8vIEFzc3VtZSB0aGUgcmVjdWVyTWFwIGlzIGEgZmxhdCBtYXAgdG8gYWxsIHJlZHVjZXJzXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZVJlZHVjZXIgKHJlZHVjZXJNYXAgPSB7fSwgdXBkYXRlcikge1xuXG4gIC8vIEdlbmVyYXRlIGEgY29tYmluZWQgcmVkdWNlciBmdW5jdGlvblxuICByZXR1cm4gKHN0YXRlID0ge30sIGFjdGlvbiA9IHt9KSA9PiB7XG4gICAgbGV0IG5ld1N0YXRlID0ge30sXG4gICAgICAgIGRpcnR5S2V5cyA9IFtdXG5cbiAgICAvLyBTcHJlYWQgdGhlIGFjdGlvbiB0byBhbGwgcmVkdWNlcnMgaW5zaWRlIHRoZSBjb21iaW5lZCBvbmVcbiAgICBmb3IgKGxldCBrZXkgaW4gcmVkdWNlck1hcCkge1xuICAgICAgLy8gUGFzcyB0aGUgd2hvbGUgc3RhdGUgZG93biBhcyBhcmd1bWVudCBmb3JcbiAgICAgIC8vIGNyb3NzIHN0YXRlIGtleSBhY2Nlc3NcbiAgICAgIGxldCByZWR1Y2VkU3RhdGUgPSByZWR1Y2VyTWFwW2tleV0oc3RhdGVba2V5XSwgYWN0aW9uLCBzdGF0ZSlcblxuICAgICAgaWYgKHJlZHVjZWRTdGF0ZSAhPT0gc3RhdGVba2V5XSkge1xuICAgICAgICBkaXJ0eUtleXMucHVzaChrZXkpXG4gICAgICB9XG5cbiAgICAgIG5ld1N0YXRlW2tleV0gPSByZWR1Y2VkU3RhdGVcbiAgICB9XG5cbiAgICAvLyBDYWxsIHVwZGF0ZSBmdW5jdGlvbiBmb3IgZWFjaCByZWR1Y2VkIHN0YXRlXG4gICAgdXBkYXRlcihuZXdTdGF0ZSwgZGlydHlLZXlzKVxuXG4gICAgLy8gZGlydHlLZXlzLmZvckVhY2goKGRpcnR5S2V5KSA9PiB7XG4gICAgLy8gICB1cGRhdGVyTWFwW2RpcnR5S2V5XShuZXdTdGF0ZSwgZGlydHlLZXkpXG4gICAgLy8gfSlcblxuICAgIHJldHVybiBuZXdTdGF0ZVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lVXBkYXRlciAodXBkYXRlck1hcCA9IHt9LCByZW5kZXJlck1hcCA9IHt9KSB7XG4gIC8vIEdlbmVyYXRlIGNvbWJpbmVkIHVwZGF0ZXIgZnVuY3Rpb24gZm9yIGFsbCB1cGRhdGVyc1xuICByZXR1cm4gKHN0YXRlID0ge30sIGRpcnR5S2V5cyA9IFtdKSA9PiB7XG4gICAgbGV0IG5ld0ZpbmFsUmVuZGVyU3RhdGUgPSB7fVxuICAgIGZvciAobGV0IGtleSBpbiB1cGRhdGVyTWFwKSB7XG4gICAgICAvLyBDb21wdXRlIHRoZSBmaW5hbCByZW5kZXIgc3RhdGUgYW5kIHBhc3MgaW50byByZW5kZXJlclxuICAgICAgcmVuZGVyZXJNYXBba2V5XS5maW5hbFJlbmRlclN0YXRlID0gdXBkYXRlck1hcFtrZXldKHJlbmRlcmVyTWFwW2tleV0uZmluYWxSZW5kZXJTdGF0ZSwgc3RhdGUsIGRpcnR5S2V5cylcbiAgICB9XG4gIH1cbn1cblxuXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdGF0ZU1hbmFnZXIuanMiXSwic291cmNlUm9vdCI6IiJ9