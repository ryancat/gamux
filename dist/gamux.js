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
        _update();
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

    _update = _config.update || _update;
    _render = _config.render || _render;
    _init = _config.init || _init;
    _fps = _config.fps || _fps;
    _store = (0, _stateManager.createStore)((0, _stateManager.combineReducer)(_config.reducerMap));

    // let container = config.container || document.body

    // gamux.game = {
    //   container,
    //   width: container.offsetWidth,
    //   height: container.offsetHeight
    // }
    // 

    _init();
  },

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
        console.info('before:', state);
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
        console.info('after:', state);
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

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var newState = {};
    for (var key in reducerMap) {
      // Pass the whole state down as argument for
      // cross state key access
      newState[key] = reducerMap[key](state[key], action, state);
    }
    return newState;
  };
}

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA0Y2Y3ZmQ5NDZjYTY5Y2YyNzQ4OCIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtdXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJfYW5pbWF0aW9uTG9vcEtleSIsIl9hY2N1bXVsYXRvciIsIl9mcHMiLCJfaW5pdCIsIl91cGRhdGUiLCJfcmVuZGVyIiwiX3N0b3JlIiwiX2xvb3AiLCJsYXN0VGltZXN0YW1wIiwid2luZG93IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibm93IiwiRGF0ZSIsImR0IiwiZ2FtdXgiLCJjb25maWciLCJ1cGRhdGUiLCJyZW5kZXIiLCJpbml0IiwiZnBzIiwicmVkdWNlck1hcCIsInN0YXJ0IiwiZGlzcGF0Y2giLCJhY3Rpb24iLCJjcmVhdGVTdG9yZSIsImNvbWJpbmVSZWR1Y2VyIiwicmVkdWNlciIsInN0YXRlIiwiY29uc29sZSIsImdyb3VwIiwidHlwZSIsImluZm8iLCJncm91cEVuZCIsImdldFN0YXRlIiwic3RhdGVLZXkiLCJuZXdTdGF0ZSIsImtleSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FB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Q08sU0FBU1QsY0FBVCxHQUEwQztBQUFBLE1BQWpCTCxVQUFpQix1RUFBSixFQUFJOztBQUMvQyxTQUFPLFlBQTZCO0FBQUEsUUFBNUJPLEtBQTRCLHVFQUFwQixFQUFvQjtBQUFBLFFBQWhCSixNQUFnQix1RUFBUCxFQUFPOztBQUNsQyxRQUFJWSxXQUFXLEVBQWY7QUFDQSxTQUFLLElBQUlDLEdBQVQsSUFBZ0JoQixVQUFoQixFQUE0QjtBQUMxQjtBQUNBO0FBQ0FlLGVBQVNDLEdBQVQsSUFBZ0JoQixXQUFXZ0IsR0FBWCxFQUFnQlQsTUFBTVMsR0FBTixDQUFoQixFQUE0QmIsTUFBNUIsRUFBb0NJLEtBQXBDLENBQWhCO0FBQ0Q7QUFDRCxXQUFPUSxRQUFQO0FBQ0QsR0FSRDtBQVNELEMiLCJmaWxlIjoiZ2FtdXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJnYW11eFwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJnYW11eFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNGNmN2ZkOTQ2Y2E2OWNmMjc0ODgiLCJpbXBvcnQge2NvbWJpbmVSZWR1Y2VyLCBjcmVhdGVTdG9yZX0gZnJvbSAnLi9zdGF0ZU1hbmFnZXInXG5cbi8qKlxuICogVGhlIGFuaW1hdGlvbiBsb29wIGtleSBmb3IgY2FuY2VsIGFuaW1hdGlvblxuICovXG5sZXQgX2FuaW1hdGlvbkxvb3BLZXkgPSBudWxsXG4vKipcbiAqIEFjY3VtdWxhdG9yIGZvciB0aW1lLWJhc2VkIGFuaW1hdGlvblxuICovXG5sZXQgX2FjY3VtdWxhdG9yID0gMFxuLyoqXG4gKiBUaGUgZGVmYXVsdCBmcHNcbiAqL1xubGV0IF9mcHMgPSA2MFxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gdGhlIGluaXQgZnVuY3Rpb25cbiAqL1xubGV0IF9pbml0ID0gKCkgPT4ge31cbi8qKlxuICogUmVmZXJlbmNlIHRvIHRoZSB1cGRhdGUgZnVuY3Rpb25cbiAqL1xubGV0IF91cGRhdGUgPSAoKSA9PiB7fVxuLyoqXG4gKiBSZWZlcmVuY2UgdG8gdGhlIHJlbmRlciBmdW5jdGlvblxuICovXG5sZXQgX3JlbmRlciA9ICgpID0+IHt9XG4vKipcbiAqIFRoZSBzdG9yZSBmb3IgZ2FtZVxuICovXG5sZXQgX3N0b3JlID0gbnVsbFxuXG4vKipcbiAqIFRyaWdnZXIgZ2FtZSBsb29wXG4gKi9cbmZ1bmN0aW9uIF9sb29wIChsYXN0VGltZXN0YW1wKSB7XG4gIF9hbmltYXRpb25Mb29wS2V5ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxuICAgIGNvbnN0IGR0ID0gMTAwMCAvIF9mcHNcbiAgICBfYWNjdW11bGF0b3IgKz0gbm93IC0gbGFzdFRpbWVzdGFtcFxuXG4gICAgaWYgKF9hY2N1bXVsYXRvciA+PSBkdCkge1xuICAgICAgd2hpbGUgKF9hY2N1bXVsYXRvciA+PSBkdCkge1xuICAgICAgICBfdXBkYXRlKClcbiAgICAgICAgX2FjY3VtdWxhdG9yIC09IGR0XG4gICAgICB9XG4gICAgICBfcmVuZGVyKGR0KVxuICAgIH1cbiAgICBfbG9vcChub3cpXG4gIH0pXG59XG5cbmNvbnN0IGdhbXV4ID0ge1xuICBjb25maWc6IChjb25maWcgPSB7fSkgPT4ge1xuICAgIF91cGRhdGUgPSBjb25maWcudXBkYXRlIHx8IF91cGRhdGVcbiAgICBfcmVuZGVyID0gY29uZmlnLnJlbmRlciB8fCBfcmVuZGVyXG4gICAgX2luaXQgPSBjb25maWcuaW5pdCB8fCBfaW5pdFxuICAgIF9mcHMgPSBjb25maWcuZnBzIHx8IF9mcHNcbiAgICBfc3RvcmUgPSBjcmVhdGVTdG9yZShjb21iaW5lUmVkdWNlcihjb25maWcucmVkdWNlck1hcCkpXG5cbiAgICAvLyBsZXQgY29udGFpbmVyID0gY29uZmlnLmNvbnRhaW5lciB8fCBkb2N1bWVudC5ib2R5XG5cbiAgICAvLyBnYW11eC5nYW1lID0ge1xuICAgIC8vICAgY29udGFpbmVyLFxuICAgIC8vICAgd2lkdGg6IGNvbnRhaW5lci5vZmZzZXRXaWR0aCxcbiAgICAvLyAgIGhlaWdodDogY29udGFpbmVyLm9mZnNldEhlaWdodFxuICAgIC8vIH1cbiAgICAvLyBcbiAgICBcbiAgICBfaW5pdCgpXG4gIH0sXG5cbiAgc3RhcnQ6ICgpID0+IHtcbiAgICBfbG9vcChEYXRlLm5vdygpKVxuICB9LFxuXG4gIGRpc3BhdGNoOiAoYWN0aW9uKSA9PiB7XG4gICAgX3N0b3JlLmRpc3BhdGNoKGFjdGlvbilcbiAgfVxuXG4gIC8vICpcbiAgLy8gICogR2FtZSB3aWxsIGJlIGF2YWlsYWJsZSBvbmNlIGNvbmZpZ3VyZWRcbiAgIFxuICAvLyBnYW1lOiBudWxsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGdhbXV4XG5cblxuLy8gVE9ET1xuLy8gMS4gQnVpbGQgZmlsZSBmb3IgRVM2IG1vZHVsZXNcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZ2FtdXguanMiLCJleHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RvcmUgKHJlZHVjZXIpIHtcbiAgLy8gSW5pdCBzdGF0ZVxuICBsZXQgc3RhdGUgPSByZWR1Y2VyKClcblxuICByZXR1cm4ge1xuICAgIC8qKlxuICAgICAqIERpc3BhdGNoIGFjdGlvbiB0byB0cmlnZ2VyIHN0YXRlIGNoYW5nZXNcbiAgICAgKi9cbiAgICBkaXNwYXRjaDogKGFjdGlvbiA9IHt9KSA9PiB7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuY29kZSA9PT0gJ0RFVicpIHtcbiAgICAgICAgLy8gbG9nIGFjdGlvbnMgaW4gY29uc29sZVxuICAgICAgICBjb25zb2xlLmdyb3VwKGFjdGlvbi50eXBlKVxuICAgICAgICBjb25zb2xlLmluZm8oJ2JlZm9yZTonLCBzdGF0ZSlcbiAgICAgICAgY29uc29sZS5pbmZvKCclY2FjdGlvbjonLCAnY29sb3I6IHJlZCcsIGFjdGlvbilcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gVXBkYXRlIHN0YXRlXG4gICAgICBzdGF0ZSA9IHJlZHVjZXIoc3RhdGUsIGFjdGlvbilcbiAgICAgIC8vIFN0YXRlIG1hbmFnZXIgZG9lc24ndCBjYXJlIGFib3V0IG5vdGljaW5nXG4gICAgICAvLyBnYW1lIHRvIHVwZGF0ZSBzdGF0ZS4gSW5zdGVhZCByZWR1Y2Vyc1xuICAgICAgLy8gc2hvdWxkIHNldCBkaXJ0eSBzdGF0ZSBmb3IgZ2FtZSBsb29wIHRvXG4gICAgICAvLyB0cmlnZ2VyIHVwZGF0ZVxuXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuY29kZSA9PT0gJ0RFVicpIHtcbiAgICAgICAgLy8gbG9nIGFjdGlvbnMgaW4gY29uc29sZVxuICAgICAgICBjb25zb2xlLmluZm8oJ2FmdGVyOicsIHN0YXRlKVxuICAgICAgICBjb25zb2xlLmdyb3VwRW5kKClcbiAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFJldHVybiB0aGUgY3VycmVudCBzdGF0ZSBmb3IgZ2l2ZW4ga2V5XG4gICAgICogVGhpcyBpcyB0byBhbGxvdyBhcHBsaWNhdGlvbiB0byAnY29ubmVjdCcgdG8gc3RhdGVcbiAgICAgKi9cbiAgICBnZXRTdGF0ZTogKHN0YXRlS2V5KSA9PiB7XG4gICAgICBpZiAoIXN0YXRlS2V5KSB7XG4gICAgICAgIHJldHVybiBzdGF0ZVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBzdGF0ZVtzdGF0ZUtleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLy8gQXNzdW1lIHRoZSByZWN1ZXJNYXAgaXMgYSBmbGF0IG1hcCB0byBhbGwgcmVkdWNlcnNcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lUmVkdWNlciAocmVkdWNlck1hcCA9IHt9KSB7XG4gIHJldHVybiAoc3RhdGUgPSB7fSwgYWN0aW9uID0ge30pID0+IHtcbiAgICB2YXIgbmV3U3RhdGUgPSB7fVxuICAgIGZvciAobGV0IGtleSBpbiByZWR1Y2VyTWFwKSB7XG4gICAgICAvLyBQYXNzIHRoZSB3aG9sZSBzdGF0ZSBkb3duIGFzIGFyZ3VtZW50IGZvclxuICAgICAgLy8gY3Jvc3Mgc3RhdGUga2V5IGFjY2Vzc1xuICAgICAgbmV3U3RhdGVba2V5XSA9IHJlZHVjZXJNYXBba2V5XShzdGF0ZVtrZXldLCBhY3Rpb24sIHN0YXRlKVxuICAgIH1cbiAgICByZXR1cm4gbmV3U3RhdGVcbiAgfVxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdGF0ZU1hbmFnZXIuanMiXSwic291cmNlUm9vdCI6IiJ9