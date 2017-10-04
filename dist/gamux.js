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

    _init();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwOTA1ZjM0MGFlY2YxMDRhZjIxZiIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtdXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJfYW5pbWF0aW9uTG9vcEtleSIsIl9hY2N1bXVsYXRvciIsIl9mcHMiLCJfaW5pdCIsIl91cGRhdGUiLCJfcmVuZGVyIiwiX3N0b3JlIiwiX2xvb3AiLCJsYXN0VGltZXN0YW1wIiwid2luZG93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibm93IiwiRGF0ZSIsImR0IiwiZ2FtdXgiLCJjb25maWciLCJ1cGRhdGUiLCJyZW5kZXIiLCJpbml0IiwiZnBzIiwiY29udGFpbmVyIiwibGF5ZXJzIiwiZm9yRWFjaCIsImxheWVyTmFtZSIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwiY2FudmFzQ3R4IiwiZ2V0Q29udGV4dCIsInJlZHVjZXJNYXAiLCJ1cGRhdGVyTWFwIiwia2V5IiwiY29uc29sZSIsIndhcm4iLCJzdGFydCIsImRpc3BhdGNoIiwiYWN0aW9uIiwiY3JlYXRlU3RvcmUiLCJjb21iaW5lUmVkdWNlciIsInJlZHVjZXIiLCJzdGF0ZSIsImdyb3VwIiwidHlwZSIsImluZm8iLCJncm91cEVuZCIsImdldFN0YXRlIiwic3RhdGVLZXkiLCJuZXdTdGF0ZSIsImRpcnR5S2V5cyIsInJlZHVjZWRTdGF0ZSIsInB1c2giLCJkaXJ0eUtleSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QTRCLHVFQUFwQixFQUFvQjtBQUFBLFFBQWhCSixNQUFnQix1RUFBUCxFQUFPOztBQUNsQyxRQUFJVyxXQUFXLEVBQWY7QUFBQSxRQUNJQyxZQUFZLEVBRGhCOztBQUdBO0FBQ0EsU0FBSyxJQUFJakIsR0FBVCxJQUFnQkYsVUFBaEIsRUFBNEI7QUFDMUI7QUFDQTtBQUNBLFVBQUlvQixlQUFlcEIsV0FBV0UsR0FBWCxFQUFnQlMsTUFBTVQsR0FBTixDQUFoQixFQUE0QkssTUFBNUIsRUFBb0NJLEtBQXBDLENBQW5COztBQUVBLFVBQUlTLGlCQUFpQlQsTUFBTVQsR0FBTixDQUFyQixFQUFpQztBQUMvQmlCLGtCQUFVRSxJQUFWLENBQWVuQixHQUFmO0FBQ0Q7O0FBRURnQixlQUFTaEIsR0FBVCxJQUFnQmtCLFlBQWhCO0FBQ0Q7O0FBRUQ7QUFDQUQsY0FBVTNCLE9BQVYsQ0FBa0IsVUFBQzhCLFFBQUQsRUFBYztBQUM5QnJCLGlCQUFXcUIsUUFBWCxFQUFxQkosUUFBckIsRUFBK0JJLFFBQS9CO0FBQ0QsS0FGRDs7QUFJQSxXQUFPSixRQUFQO0FBQ0QsR0F2QkQ7QUF3QkQsQyIsImZpbGUiOiJnYW11eC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImdhbXV4XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImdhbXV4XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwOTA1ZjM0MGFlY2YxMDRhZjIxZiIsImltcG9ydCB7Y29tYmluZVJlZHVjZXIsIGNyZWF0ZVN0b3JlfSBmcm9tICcuL3N0YXRlTWFuYWdlcidcblxuLyoqXG4gKiBUaGUgYW5pbWF0aW9uIGxvb3Aga2V5IGZvciBjYW5jZWwgYW5pbWF0aW9uXG4gKi9cbmxldCBfYW5pbWF0aW9uTG9vcEtleSA9IG51bGxcbi8qKlxuICogQWNjdW11bGF0b3IgZm9yIHRpbWUtYmFzZWQgYW5pbWF0aW9uXG4gKi9cbmxldCBfYWNjdW11bGF0b3IgPSAwXG4vKipcbiAqIFRoZSBkZWZhdWx0IGZwc1xuICovXG5sZXQgX2ZwcyA9IDYwXG4vKipcbiAqIFJlZmVyZW5jZSB0byB0aGUgaW5pdCBmdW5jdGlvblxuICovXG5sZXQgX2luaXQgPSAoKSA9PiB7fVxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gdGhlIHVwZGF0ZSBmdW5jdGlvblxuICovXG5sZXQgX3VwZGF0ZSA9ICgpID0+IHt9XG4vKipcbiAqIFJlZmVyZW5jZSB0byB0aGUgcmVuZGVyIGZ1bmN0aW9uXG4gKi9cbmxldCBfcmVuZGVyID0gKCkgPT4ge31cbi8qKlxuICogVGhlIHN0b3JlIGZvciBnYW1lXG4gKi9cbmxldCBfc3RvcmUgPSBudWxsXG5cbi8qKlxuICogVHJpZ2dlciBnYW1lIGxvb3BcbiAqL1xuZnVuY3Rpb24gX2xvb3AgKGxhc3RUaW1lc3RhbXApIHtcbiAgX2FuaW1hdGlvbkxvb3BLZXkgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpXG4gICAgY29uc3QgZHQgPSAxMDAwIC8gX2Zwc1xuICAgIF9hY2N1bXVsYXRvciArPSBub3cgLSBsYXN0VGltZXN0YW1wXG5cbiAgICBpZiAoX2FjY3VtdWxhdG9yID49IGR0KSB7XG4gICAgICB3aGlsZSAoX2FjY3VtdWxhdG9yID49IGR0KSB7XG4gICAgICAgIC8vIF91cGRhdGUoKVxuICAgICAgICBfYWNjdW11bGF0b3IgLT0gZHRcbiAgICAgIH1cbiAgICAgIF9yZW5kZXIoZHQpXG4gICAgfVxuICAgIF9sb29wKG5vdylcbiAgfSlcbn1cblxuY29uc3QgZ2FtdXggPSB7XG4gIGNvbmZpZzogKGNvbmZpZyA9IHt9KSA9PiB7XG5cbiAgICAvLyBDb25maWcgdGhlIHByaXZhdGUgZ2xvYmFsc1xuICAgIF91cGRhdGUgPSBjb25maWcudXBkYXRlIHx8IF91cGRhdGVcbiAgICBfcmVuZGVyID0gY29uZmlnLnJlbmRlciB8fCBfcmVuZGVyXG4gICAgX2luaXQgPSBjb25maWcuaW5pdCB8fCBfaW5pdFxuICAgIF9mcHMgPSBjb25maWcuZnBzIHx8IF9mcHNcblxuICAgIF9pbml0KClcblxuICAgIGxldCBjb250YWluZXIgPSBjb25maWcuY29udGFpbmVyXG5cbiAgICAvLyBDcmVhdGUgZ2FtZSBsYXllcnNcbiAgICBjb25maWcubGF5ZXJzLmZvckVhY2goKGxheWVyTmFtZSkgPT4ge1xuICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKVxuXG4gICAgICBnYW11eC5sYXllcnNbbGF5ZXJOYW1lXSA9IHtcbiAgICAgICAgY2FudmFzLFxuICAgICAgICBjYW52YXNDdHg6IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXG4gICAgICB9XG4gICAgfSlcblxuICAgIC8vIENyZWF0ZSBnYW1lIHN0b3JlXG4gICAgbGV0IHJlZHVjZXJNYXAgPSBjb25maWcucmVkdWNlck1hcCxcbiAgICAgICAgdXBkYXRlck1hcCA9IHt9XG5cbiAgICBpZiAoIWNvbmZpZy51cGRhdGVyTWFwKSB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gcmVkdWNlck1hcCkge1xuICAgICAgICB1cGRhdGVyTWFwW2tleV0gPSBfdXBkYXRlXG4gICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgLy8gV2Ugd2lsbCBpZ25vcmUgY29uZmlnLnVwZGF0ZSBpZiB1cGRhdGVyTWFwIGV4aXN0c1xuICAgICAgaWYgKHByb2Nlc3MuZW52LmNvZGUgPT09ICdERVYnICYmIGNvbmZpZy51cGRhdGUpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdJZ25vcmUgY29uZmlnLnVwZGF0ZSBhbmQgdXNlIGNvbmZpZy51cGRhdGVyTWFwJylcbiAgICAgIH1cbiAgICAgIHVwZGF0ZXJNYXAgPSBjb25maWcudXBkYXRlck1hcFxuICAgIH1cblxuICAgIF9zdG9yZSA9IGNyZWF0ZVN0b3JlKGNvbWJpbmVSZWR1Y2VyKHJlZHVjZXJNYXAsIHVwZGF0ZXJNYXApKVxuICB9LFxuXG4gIGxheWVyczoge30sXG5cbiAgc3RhcnQ6ICgpID0+IHtcbiAgICBfbG9vcChEYXRlLm5vdygpKVxuICB9LFxuXG4gIGRpc3BhdGNoOiAoYWN0aW9uKSA9PiB7XG4gICAgX3N0b3JlLmRpc3BhdGNoKGFjdGlvbilcbiAgfVxuXG4gIC8vICpcbiAgLy8gICogR2FtZSB3aWxsIGJlIGF2YWlsYWJsZSBvbmNlIGNvbmZpZ3VyZWRcbiAgIFxuICAvLyBnYW1lOiBudWxsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdhbXV4XG5cblxuLy8gVE9ET1xuLy8gMS4gQnVpbGQgZmlsZSBmb3IgRVM2IG1vZHVsZXNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZ2FtdXguanMiLCJleHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RvcmUgKHJlZHVjZXIpIHtcbiAgLy8gSW5pdCBzdGF0ZVxuICBsZXQgc3RhdGUgPSByZWR1Y2VyKClcblxuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIERpc3BhdGNoIGFjdGlvbiB0byB0cmlnZ2VyIHN0YXRlIGNoYW5nZXNcbiAgICAgKi9cbiAgICBkaXNwYXRjaDogKGFjdGlvbiA9IHt9KSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuY29kZSA9PT0gJ0RFVicpIHtcbiAgICAgICAgLy8gbG9nIGFjdGlvbnMgaW4gY29uc29sZVxuICAgICAgICBjb25zb2xlLmdyb3VwKGFjdGlvbi50eXBlKVxuICAgICAgICBjb25zb2xlLmluZm8oJyVjYmVmb3JlOicsICdjb2xvcjogZ3JlZW4nLCBzdGF0ZSlcbiAgICAgICAgY29uc29sZS5pbmZvKCclY2FjdGlvbjonLCAnY29sb3I6IHJlZCcsIGFjdGlvbilcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gVXBkYXRlIHN0YXRlXG4gICAgICBzdGF0ZSA9IHJlZHVjZXIoc3RhdGUsIGFjdGlvbilcbiAgICAgIC8vIFN0YXRlIG1hbmFnZXIgZG9lc24ndCBjYXJlIGFib3V0IG5vdGljaW5nXG4gICAgICAvLyBnYW1lIHRvIHVwZGF0ZSBzdGF0ZS4gSW5zdGVhZCByZWR1Y2Vyc1xuICAgICAgLy8gc2hvdWxkIHNldCBkaXJ0eSBzdGF0ZSBmb3IgZ2FtZSBsb29wIHRvXG4gICAgICAvLyB0cmlnZ2VyIHVwZGF0ZVxuXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuY29kZSA9PT0gJ0RFVicpIHtcbiAgICAgICAgLy8gbG9nIGFjdGlvbnMgaW4gY29uc29sZVxuICAgICAgICBjb25zb2xlLmluZm8oJyVjYWZ0ZXI6JywgJ2NvbG9yOiBncmVlbicsIHN0YXRlKVxuICAgICAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgY3VycmVudCBzdGF0ZSBmb3IgZ2l2ZW4ga2V5XG4gICAgICogVGhpcyBpcyB0byBhbGxvdyBhcHBsaWNhdGlvbiB0byAnY29ubmVjdCcgdG8gc3RhdGVcbiAgICAgKi9cbiAgICBnZXRTdGF0ZTogKHN0YXRlS2V5KSA9PiB7XG4gICAgICBpZiAoIXN0YXRlS2V5KSB7XG4gICAgICAgIHJldHVybiBzdGF0ZVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBzdGF0ZVtzdGF0ZUtleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gQXNzdW1lIHRoZSByZWN1ZXJNYXAgaXMgYSBmbGF0IG1hcCB0byBhbGwgcmVkdWNlcnNcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lUmVkdWNlciAocmVkdWNlck1hcCA9IHt9LCB1cGRhdGVyTWFwID0ge30pIHtcblxuICAvLyBHZW5lcmF0ZSBhIGNvbWJpbmVkIHJlZHVjZXIgZnVuY3Rpb25cbiAgcmV0dXJuIChzdGF0ZSA9IHt9LCBhY3Rpb24gPSB7fSkgPT4ge1xuICAgIHZhciBuZXdTdGF0ZSA9IHt9LFxuICAgICAgICBkaXJ0eUtleXMgPSBbXVxuXG4gICAgLy8gU3ByZWFkIHRoZSBhY3Rpb24gdG8gYWxsIHJlZHVjZXJzIGluc2lkZSB0aGUgY29tYmluZWQgb25lXG4gICAgZm9yIChsZXQga2V5IGluIHJlZHVjZXJNYXApIHtcbiAgICAgIC8vIFBhc3MgdGhlIHdob2xlIHN0YXRlIGRvd24gYXMgYXJndW1lbnQgZm9yXG4gICAgICAvLyBjcm9zcyBzdGF0ZSBrZXkgYWNjZXNzXG4gICAgICBsZXQgcmVkdWNlZFN0YXRlID0gcmVkdWNlck1hcFtrZXldKHN0YXRlW2tleV0sIGFjdGlvbiwgc3RhdGUpXG5cbiAgICAgIGlmIChyZWR1Y2VkU3RhdGUgIT09IHN0YXRlW2tleV0pIHtcbiAgICAgICAgZGlydHlLZXlzLnB1c2goa2V5KVxuICAgICAgfVxuXG4gICAgICBuZXdTdGF0ZVtrZXldID0gcmVkdWNlZFN0YXRlXG4gICAgfVxuXG4gICAgLy8gQ2FsbCB1cGRhdGUgZnVuY3Rpb24gZm9yIGVhY2ggcmVkdWNlZCBzdGF0ZVxuICAgIGRpcnR5S2V5cy5mb3JFYWNoKChkaXJ0eUtleSkgPT4ge1xuICAgICAgdXBkYXRlck1hcFtkaXJ0eUtleV0obmV3U3RhdGUsIGRpcnR5S2V5KVxuICAgIH0pXG5cbiAgICByZXR1cm4gbmV3U3RhdGVcbiAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdGF0ZU1hbmFnZXIuanMiXSwic291cmNlUm9vdCI6IiJ9