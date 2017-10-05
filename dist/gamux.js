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
var _store = null;

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
      _render(dt);
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
    _config.layers.forEach(function (layerName) {
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);

      gamux.layers[layerName] = {
        canvas: canvas,
        canvasCtx: canvas.getContext('2d')
      };
    });

    // Create game store
    var reducerMap = _config.reducerMap,
        updaterMap = {};

    if (!_config.updaterMap) {
      for (var key in reducerMap) {
        updaterMap[key] = _update;
      }
    } else {
      // We will ignore config.update if updaterMap exists
      if ("DEV" === 'DEV' && _config.update) {
        console.warn('Ignore config.update and use config.updaterMap');
      }
      updaterMap = _config.updaterMap;
    }

    _store = (0, _stateManager.createStore)((0, _stateManager.combineReducer)(reducerMap, updaterMap));
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
  var updaterMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


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
    dirtyKeys.forEach(function (dirtyKey) {
      updaterMap[dirtyKey](newState, dirtyKey);
    });

    return newState;
  };
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2MDVlMDY1OTc3MzlkNDY3NmRkZSIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtdXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJfYW5pbWF0aW9uTG9vcEtleSIsIl9hY2N1bXVsYXRvciIsIl9mcHMiLCJfaW5pdCIsIl91cGRhdGUiLCJfcmVuZGVyIiwiX3N0b3JlIiwiX2xvb3AiLCJsYXN0VGltZXN0YW1wIiwid2luZG93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibm93IiwiRGF0ZSIsImR0IiwiZ2FtdXgiLCJjb25maWciLCJ1cGRhdGUiLCJyZW5kZXIiLCJpbml0IiwiZnBzIiwiY29udGFpbmVyIiwibGF5ZXJzIiwiZm9yRWFjaCIsImxheWVyTmFtZSIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwiY2FudmFzQ3R4IiwiZ2V0Q29udGV4dCIsInJlZHVjZXJNYXAiLCJ1cGRhdGVyTWFwIiwia2V5IiwiY29uc29sZSIsIndhcm4iLCJnZXRTdGF0ZSIsInN0YXJ0IiwiZGlzcGF0Y2giLCJhY3Rpb24iLCJjcmVhdGVTdG9yZSIsImNvbWJpbmVSZWR1Y2VyIiwicmVkdWNlciIsInN0YXRlIiwiZ3JvdXAiLCJ0eXBlIiwiaW5mbyIsImdyb3VwRW5kIiwic3RhdGVLZXkiLCJuZXdTdGF0ZSIsImRpcnR5S2V5cyIsInJlZHVjZWRTdGF0ZSIsInB1c2giLCJkaXJ0eUtleSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QU8sWUFBNkI7QUFBQSxRQUE1QlcsS0FBNEIsdUVBQXBCLEVBQW9CO0FBQUEsUUFBaEJKLE1BQWdCLHVFQUFQLEVBQU87O0FBQ2xDLFFBQUlVLFdBQVcsRUFBZjtBQUFBLFFBQ0lDLFlBQVksRUFEaEI7O0FBR0E7QUFDQSxTQUFLLElBQUlqQixHQUFULElBQWdCRixVQUFoQixFQUE0QjtBQUMxQjtBQUNBO0FBQ0EsVUFBSW9CLGVBQWVwQixXQUFXRSxHQUFYLEVBQWdCVSxNQUFNVixHQUFOLENBQWhCLEVBQTRCTSxNQUE1QixFQUFvQ0ksS0FBcEMsQ0FBbkI7O0FBRUEsVUFBSVEsaUJBQWlCUixNQUFNVixHQUFOLENBQXJCLEVBQWlDO0FBQy9CaUIsa0JBQVVFLElBQVYsQ0FBZW5CLEdBQWY7QUFDRDs7QUFFRGdCLGVBQVNoQixHQUFULElBQWdCa0IsWUFBaEI7QUFDRDs7QUFFRDtBQUNBRCxjQUFVM0IsT0FBVixDQUFrQixVQUFDOEIsUUFBRCxFQUFjO0FBQzlCckIsaUJBQVdxQixRQUFYLEVBQXFCSixRQUFyQixFQUErQkksUUFBL0I7QUFDRCxLQUZEOztBQUlBLFdBQU9KLFFBQVA7QUFDRCxHQXZCRDtBQXdCRCxDIiwiZmlsZSI6ImdhbXV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZ2FtdXhcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiZ2FtdXhcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDYwNWUwNjU5NzczOWQ0Njc2ZGRlIiwiaW1wb3J0IHtjb21iaW5lUmVkdWNlciwgY3JlYXRlU3RvcmV9IGZyb20gJy4vc3RhdGVNYW5hZ2VyJ1xuXG4vKipcbiAqIFRoZSBhbmltYXRpb24gbG9vcCBrZXkgZm9yIGNhbmNlbCBhbmltYXRpb25cbiAqL1xubGV0IF9hbmltYXRpb25Mb29wS2V5ID0gbnVsbFxuLyoqXG4gKiBBY2N1bXVsYXRvciBmb3IgdGltZS1iYXNlZCBhbmltYXRpb25cbiAqL1xubGV0IF9hY2N1bXVsYXRvciA9IDBcbi8qKlxuICogVGhlIGRlZmF1bHQgZnBzXG4gKi9cbmxldCBfZnBzID0gNjBcbi8qKlxuICogUmVmZXJlbmNlIHRvIHRoZSBpbml0IGZ1bmN0aW9uXG4gKi9cbmxldCBfaW5pdCA9ICgpID0+IHt9XG4vKipcbiAqIFJlZmVyZW5jZSB0byB0aGUgdXBkYXRlIGZ1bmN0aW9uXG4gKi9cbmxldCBfdXBkYXRlID0gKCkgPT4ge31cbi8qKlxuICogUmVmZXJlbmNlIHRvIHRoZSByZW5kZXIgZnVuY3Rpb25cbiAqL1xubGV0IF9yZW5kZXIgPSAoKSA9PiB7fVxuLyoqXG4gKiBUaGUgc3RvcmUgZm9yIGdhbWVcbiAqL1xubGV0IF9zdG9yZSA9IG51bGxcblxuLyoqXG4gKiBUcmlnZ2VyIGdhbWUgbG9vcFxuICovXG5mdW5jdGlvbiBfbG9vcCAobGFzdFRpbWVzdGFtcCkge1xuICBfYW5pbWF0aW9uTG9vcEtleSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICBjb25zdCBkdCA9IDEwMDAgLyBfZnBzXG4gICAgX2FjY3VtdWxhdG9yICs9IG5vdyAtIGxhc3RUaW1lc3RhbXBcblxuICAgIGlmIChfYWNjdW11bGF0b3IgPj0gZHQpIHtcbiAgICAgIHdoaWxlIChfYWNjdW11bGF0b3IgPj0gZHQpIHtcbiAgICAgICAgLy8gX3VwZGF0ZSgpXG4gICAgICAgIF9hY2N1bXVsYXRvciAtPSBkdFxuICAgICAgfVxuICAgICAgX3JlbmRlcihkdClcbiAgICB9XG4gICAgX2xvb3Aobm93KVxuICB9KVxufVxuXG5jb25zdCBnYW11eCA9IHtcbiAgY29uZmlnOiAoY29uZmlnID0ge30pID0+IHtcbiAgICAvLyBDb25maWcgdGhlIHByaXZhdGUgZ2xvYmFsc1xuICAgIF91cGRhdGUgPSBjb25maWcudXBkYXRlIHx8IF91cGRhdGVcbiAgICBfcmVuZGVyID0gY29uZmlnLnJlbmRlciB8fCBfcmVuZGVyXG4gICAgX2luaXQgPSBjb25maWcuaW5pdCB8fCBfaW5pdFxuICAgIF9mcHMgPSBjb25maWcuZnBzIHx8IF9mcHNcblxuXG4gICAgbGV0IGNvbnRhaW5lciA9IGNvbmZpZy5jb250YWluZXJcblxuICAgIC8vIENyZWF0ZSBnYW1lIGxheWVyc1xuICAgIGNvbmZpZy5sYXllcnMuZm9yRWFjaCgobGF5ZXJOYW1lKSA9PiB7XG4gICAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJylcbiAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjYW52YXMpXG5cbiAgICAgIGdhbXV4LmxheWVyc1tsYXllck5hbWVdID0ge1xuICAgICAgICBjYW52YXMsXG4gICAgICAgIGNhbnZhc0N0eDogY2FudmFzLmdldENvbnRleHQoJzJkJylcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgLy8gQ3JlYXRlIGdhbWUgc3RvcmVcbiAgICBsZXQgcmVkdWNlck1hcCA9IGNvbmZpZy5yZWR1Y2VyTWFwLFxuICAgICAgICB1cGRhdGVyTWFwID0ge31cblxuICAgIGlmICghY29uZmlnLnVwZGF0ZXJNYXApIHtcbiAgICAgIGZvciAobGV0IGtleSBpbiByZWR1Y2VyTWFwKSB7XG4gICAgICAgIHVwZGF0ZXJNYXBba2V5XSA9IF91cGRhdGVcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAvLyBXZSB3aWxsIGlnbm9yZSBjb25maWcudXBkYXRlIGlmIHVwZGF0ZXJNYXAgZXhpc3RzXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuY29kZSA9PT0gJ0RFVicgJiYgY29uZmlnLnVwZGF0ZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0lnbm9yZSBjb25maWcudXBkYXRlIGFuZCB1c2UgY29uZmlnLnVwZGF0ZXJNYXAnKVxuICAgICAgfVxuICAgICAgdXBkYXRlck1hcCA9IGNvbmZpZy51cGRhdGVyTWFwXG4gICAgfVxuXG4gICAgX3N0b3JlID0gY3JlYXRlU3RvcmUoY29tYmluZVJlZHVjZXIocmVkdWNlck1hcCwgdXBkYXRlck1hcCkpXG4gICAgX2luaXQoX3N0b3JlLmdldFN0YXRlKCkpXG4gIH0sXG5cbiAgbGF5ZXJzOiB7fSxcblxuICBzdGFydDogKCkgPT4ge1xuICAgIF9sb29wKERhdGUubm93KCkpXG4gIH0sXG5cbiAgZGlzcGF0Y2g6IChhY3Rpb24pID0+IHtcbiAgICBfc3RvcmUuZGlzcGF0Y2goYWN0aW9uKVxuICB9XG5cbiAgLy8gKlxuICAvLyAgKiBHYW1lIHdpbGwgYmUgYXZhaWxhYmxlIG9uY2UgY29uZmlndXJlZFxuICAgXG4gIC8vIGdhbWU6IG51bGxcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2FtdXhcblxuXG4vLyBUT0RPXG4vLyAxLiBCdWlsZCBmaWxlIGZvciBFUzYgbW9kdWxlc1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9nYW11eC5qcyIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdG9yZSAocmVkdWNlcikge1xuICAvLyBJbml0IHN0YXRlXG4gIGxldCBzdGF0ZSA9IHJlZHVjZXIoKVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHRyaWdnZXIgc3RhdGUgY2hhbmdlc1xuICAgICAqL1xuICAgIGRpc3BhdGNoOiAoYWN0aW9uID0ge30pID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5jb2RlID09PSAnREVWJykge1xuICAgICAgICAvLyBsb2cgYWN0aW9ucyBpbiBjb25zb2xlXG4gICAgICAgIGNvbnNvbGUuZ3JvdXAoYWN0aW9uLnR5cGUpXG4gICAgICAgIGNvbnNvbGUuaW5mbygnJWNiZWZvcmU6JywgJ2NvbG9yOiBncmVlbicsIHN0YXRlKVxuICAgICAgICBjb25zb2xlLmluZm8oJyVjYWN0aW9uOicsICdjb2xvcjogcmVkJywgYWN0aW9uKVxuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBVcGRhdGUgc3RhdGVcbiAgICAgIHN0YXRlID0gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKVxuICAgICAgLy8gU3RhdGUgbWFuYWdlciBkb2Vzbid0IGNhcmUgYWJvdXQgbm90aWNpbmdcbiAgICAgIC8vIGdhbWUgdG8gdXBkYXRlIHN0YXRlLiBJbnN0ZWFkIHJlZHVjZXJzXG4gICAgICAvLyBzaG91bGQgc2V0IGRpcnR5IHN0YXRlIGZvciBnYW1lIGxvb3AgdG9cbiAgICAgIC8vIHRyaWdnZXIgdXBkYXRlXG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5jb2RlID09PSAnREVWJykge1xuICAgICAgICAvLyBsb2cgYWN0aW9ucyBpbiBjb25zb2xlXG4gICAgICAgIGNvbnNvbGUuaW5mbygnJWNhZnRlcjonLCAnY29sb3I6IGdyZWVuJywgc3RhdGUpXG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBjdXJyZW50IHN0YXRlIGZvciBnaXZlbiBrZXlcbiAgICAgKiBUaGlzIGlzIHRvIGFsbG93IGFwcGxpY2F0aW9uIHRvICdjb25uZWN0JyB0byBzdGF0ZVxuICAgICAqL1xuICAgIGdldFN0YXRlOiAoc3RhdGVLZXkpID0+IHtcbiAgICAgIGlmICghc3RhdGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlW3N0YXRlS2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBBc3N1bWUgdGhlIHJlY3Vlck1hcCBpcyBhIGZsYXQgbWFwIHRvIGFsbCByZWR1Y2Vyc1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVSZWR1Y2VyIChyZWR1Y2VyTWFwID0ge30sIHVwZGF0ZXJNYXAgPSB7fSkge1xuXG4gIC8vIEdlbmVyYXRlIGEgY29tYmluZWQgcmVkdWNlciBmdW5jdGlvblxuICByZXR1cm4gKHN0YXRlID0ge30sIGFjdGlvbiA9IHt9KSA9PiB7XG4gICAgdmFyIG5ld1N0YXRlID0ge30sXG4gICAgICAgIGRpcnR5S2V5cyA9IFtdXG5cbiAgICAvLyBTcHJlYWQgdGhlIGFjdGlvbiB0byBhbGwgcmVkdWNlcnMgaW5zaWRlIHRoZSBjb21iaW5lZCBvbmVcbiAgICBmb3IgKGxldCBrZXkgaW4gcmVkdWNlck1hcCkge1xuICAgICAgLy8gUGFzcyB0aGUgd2hvbGUgc3RhdGUgZG93biBhcyBhcmd1bWVudCBmb3JcbiAgICAgIC8vIGNyb3NzIHN0YXRlIGtleSBhY2Nlc3NcbiAgICAgIGxldCByZWR1Y2VkU3RhdGUgPSByZWR1Y2VyTWFwW2tleV0oc3RhdGVba2V5XSwgYWN0aW9uLCBzdGF0ZSlcblxuICAgICAgaWYgKHJlZHVjZWRTdGF0ZSAhPT0gc3RhdGVba2V5XSkge1xuICAgICAgICBkaXJ0eUtleXMucHVzaChrZXkpXG4gICAgICB9XG5cbiAgICAgIG5ld1N0YXRlW2tleV0gPSByZWR1Y2VkU3RhdGVcbiAgICB9XG5cbiAgICAvLyBDYWxsIHVwZGF0ZSBmdW5jdGlvbiBmb3IgZWFjaCByZWR1Y2VkIHN0YXRlXG4gICAgZGlydHlLZXlzLmZvckVhY2goKGRpcnR5S2V5KSA9PiB7XG4gICAgICB1cGRhdGVyTWFwW2RpcnR5S2V5XShuZXdTdGF0ZSwgZGlydHlLZXkpXG4gICAgfSlcblxuICAgIHJldHVybiBuZXdTdGF0ZVxuICB9XG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N0YXRlTWFuYWdlci5qcyJdLCJzb3VyY2VSb290IjoiIn0=