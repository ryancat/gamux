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
    _fps = _config.fps || _fps;

    var container = _config.container;

    // Create game layers
    _config.layers.forEach(function (layer) {
      var canvas = document.createElement('canvas');
      container.appendChild(canvas);

      _updaterMap[layer.name] = layer.updater;
      _rendererMap[layer.name] = layer.render.bind(null, canvas);
    });

    // Create game store
    _store = (0, _stateManager.createStore)((0, _stateManager.combineReducer)(_config.reducerMap, (0, _stateManager.combineUpdater)(_updaterMap, _rendererMap)));
    if (_config.init) {
      _config.init(_store.getState());
    }
  },

  getState: function getState(stateKey) {
    return _store.getState(stateKey);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA2MDVhNzBlMjgyNGVkZjBjZmVhNiIsIndlYnBhY2s6Ly8vLi9zcmMvZ2FtdXguanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJfYW5pbWF0aW9uTG9vcEtleSIsIl9hY2N1bXVsYXRvciIsIl9mcHMiLCJfc3RvcmUiLCJfdXBkYXRlck1hcCIsIl9yZW5kZXJlck1hcCIsIl9sb29wIiwibGFzdFRpbWVzdGFtcCIsIndpbmRvdyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm5vdyIsIkRhdGUiLCJkdCIsImtleSIsInJlbmRlcmVyIiwicmVuZGVyU3RhdGUiLCJmaW5hbFJlbmRlclN0YXRlIiwiZ2FtdXgiLCJjb25maWciLCJmcHMiLCJjb250YWluZXIiLCJsYXllcnMiLCJmb3JFYWNoIiwibGF5ZXIiLCJjYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsIm5hbWUiLCJ1cGRhdGVyIiwicmVuZGVyIiwiYmluZCIsInJlZHVjZXJNYXAiLCJpbml0IiwiZ2V0U3RhdGUiLCJzdGF0ZUtleSIsInN0YXJ0IiwiZGlzcGF0Y2giLCJhY3Rpb24iLCJjcmVhdGVTdG9yZSIsImNvbWJpbmVSZWR1Y2VyIiwiY29tYmluZVVwZGF0ZXIiLCJyZWR1Y2VyIiwic3RhdGUiLCJjb25zb2xlIiwiZ3JvdXAiLCJ0eXBlIiwiaW5mbyIsImdyb3VwRW5kIiwibmV3U3RhdGUiLCJkaXJ0eUtleXMiLCJyZWR1Y2VkU3RhdGUiLCJwdXNoIiwidXBkYXRlck1hcCIsInJlbmRlcmVyTWFwIiwibmV3RmluYWxSZW5kZXJTdGF0ZSJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELE87QUNWQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0RBOztBQUVBOzs7QUFHQSxJQUFJQSxvQkFBb0IsSUFBeEI7QUFDQTs7O0FBR0EsSUFBSUMsZUFBZSxDQUFuQjtBQUNBOzs7QUFHQSxJQUFJQyxPQUFPLEVBQVg7QUFDQTs7O0FBR0EsSUFBSUMsU0FBUyxFQUFiOztBQUVBLElBQUlDLGNBQWMsRUFBbEI7O0FBRUEsSUFBSUMsZUFBZSxFQUFuQjs7QUFFQTs7O0FBR0EsU0FBU0MsS0FBVCxDQUFnQkMsYUFBaEIsRUFBK0I7QUFDN0JQLHNCQUFvQlEsT0FBT0MscUJBQVAsQ0FBNkIsWUFBTTtBQUNyRCxRQUFNQyxNQUFNQyxLQUFLRCxHQUFMLEVBQVo7QUFDQSxRQUFNRSxLQUFLLE9BQU9WLElBQWxCO0FBQ0FELG9CQUFnQlMsTUFBTUgsYUFBdEI7O0FBRUEsUUFBSU4sZ0JBQWdCVyxFQUFwQixFQUF3QjtBQUN0QixhQUFPWCxnQkFBZ0JXLEVBQXZCLEVBQTJCO0FBQ3pCWCx3QkFBZ0JXLEVBQWhCO0FBQ0Q7QUFDRCxXQUFLLElBQUlDLEdBQVQsSUFBZ0JSLFlBQWhCLEVBQThCO0FBQzVCLFlBQUlTLFdBQVdULGFBQWFRLEdBQWIsQ0FBZjtBQUNBQyxpQkFBU0MsV0FBVCxHQUF1QkQsU0FBU0EsU0FBU0MsV0FBbEIsRUFBK0JELFNBQVNFLGdCQUF4QyxFQUEwREosRUFBMUQsQ0FBdkI7QUFDRDtBQUNGO0FBQ0ROLFVBQU1JLEdBQU47QUFDRCxHQWZtQixDQUFwQjtBQWdCRDs7QUFFRCxJQUFNTyxRQUFRO0FBQ1pDLFVBQVEsa0JBQWlCO0FBQUEsUUFBaEJBLE9BQWdCLHVFQUFQLEVBQU87O0FBQ3ZCO0FBQ0FoQixXQUFPZ0IsUUFBT0MsR0FBUCxJQUFjakIsSUFBckI7O0FBRUEsUUFBSWtCLFlBQVlGLFFBQU9FLFNBQXZCOztBQUVBO0FBQ0FGLFlBQU9HLE1BQVAsQ0FBY0MsT0FBZCxDQUFzQixVQUFDQyxLQUFELEVBQVc7QUFDL0IsVUFBSUMsU0FBU0MsU0FBU0MsYUFBVCxDQUF1QixRQUF2QixDQUFiO0FBQ0FOLGdCQUFVTyxXQUFWLENBQXNCSCxNQUF0Qjs7QUFFQXBCLGtCQUFZbUIsTUFBTUssSUFBbEIsSUFBMEJMLE1BQU1NLE9BQWhDO0FBQ0F4QixtQkFBYWtCLE1BQU1LLElBQW5CLElBQTJCTCxNQUFNTyxNQUFOLENBQWFDLElBQWIsQ0FBa0IsSUFBbEIsRUFBd0JQLE1BQXhCLENBQTNCO0FBQ0QsS0FORDs7QUFRQTtBQUNBckIsYUFBUywrQkFBWSxrQ0FBZWUsUUFBT2MsVUFBdEIsRUFBa0Msa0NBQWU1QixXQUFmLEVBQTRCQyxZQUE1QixDQUFsQyxDQUFaLENBQVQ7QUFDQSxRQUFJYSxRQUFPZSxJQUFYLEVBQWlCO0FBQ2ZmLGNBQU9lLElBQVAsQ0FBWTlCLE9BQU8rQixRQUFQLEVBQVo7QUFDRDtBQUNGLEdBckJXOztBQXVCWkEsWUFBVSxrQkFBQ0MsUUFBRCxFQUFjO0FBQ3RCLFdBQU9oQyxPQUFPK0IsUUFBUCxDQUFnQkMsUUFBaEIsQ0FBUDtBQUNELEdBekJXOztBQTJCWmQsVUFBUSxFQTNCSTs7QUE2QlplLFNBQU8saUJBQU07QUFDWDlCLFVBQU1LLEtBQUtELEdBQUwsRUFBTjtBQUNELEdBL0JXOztBQWlDWjJCLFlBQVUsa0JBQUNDLE1BQUQsRUFBWTtBQUNwQm5DLFdBQU9rQyxRQUFQLENBQWdCQyxNQUFoQjtBQUNEOztBQUVEO0FBQ0E7QUF0Q1ksQ0FBZDs7a0JBeUNlckIsSzs7QUFHZjtBQUNBLGdDOzs7Ozs7Ozs7Ozs7UUMxRmdCc0IsVyxHQUFBQSxXO1FBNkNBQyxjLEdBQUFBLGM7UUErQkFDLGMsR0FBQUEsYztBQTVFVCxTQUFTRixXQUFULENBQXNCRyxPQUF0QixFQUErQjtBQUNwQztBQUNBLE1BQUlDLFFBQVFELFNBQVo7O0FBRUEsU0FBTztBQUNMOzs7QUFHQUwsY0FBVSxvQkFBaUI7QUFBQSxVQUFoQkMsTUFBZ0IsdUVBQVAsRUFBTzs7QUFDekIsVUFBSSxJQUFKLEVBQWdDO0FBQzlCO0FBQ0FNLGdCQUFRQyxLQUFSLENBQWNQLE9BQU9RLElBQXJCO0FBQ0FGLGdCQUFRRyxJQUFSLENBQWEsV0FBYixFQUEwQixjQUExQixFQUEwQ0osS0FBMUM7QUFDQUMsZ0JBQVFHLElBQVIsQ0FBYSxXQUFiLEVBQTBCLFlBQTFCLEVBQXdDVCxNQUF4QztBQUNEOztBQUVEO0FBQ0FLLGNBQVFELFFBQVFDLEtBQVIsRUFBZUwsTUFBZixDQUFSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsVUFBSSxJQUFKLEVBQWdDO0FBQzlCO0FBQ0FNLGdCQUFRRyxJQUFSLENBQWEsVUFBYixFQUF5QixjQUF6QixFQUF5Q0osS0FBekM7QUFDQUMsZ0JBQVFJLFFBQVI7QUFDRDtBQUNGLEtBeEJJO0FBeUJMOzs7O0FBSUFkLGNBQVUsa0JBQUNDLFFBQUQsRUFBYztBQUN0QixVQUFJLENBQUNBLFFBQUwsRUFBZTtBQUNiLGVBQU9RLEtBQVA7QUFDRCxPQUZELE1BR0s7QUFDSCxlQUFPQSxNQUFNUixRQUFOLENBQVA7QUFDRDtBQUNGO0FBcENJLEdBQVA7QUFzQ0Q7O0FBRUQ7QUFDTyxTQUFTSyxjQUFULEdBQW1EO0FBQUEsTUFBMUJSLFVBQTBCLHVFQUFiLEVBQWE7QUFBQSxNQUFUSCxPQUFTOzs7QUFFeEQ7QUFDQSxTQUFPLFlBQTZCO0FBQUEsUUFBNUJjLEtBQTRCLHVFQUFwQixFQUFvQjtBQUFBLFFBQWhCTCxNQUFnQix1RUFBUCxFQUFPOztBQUNsQyxRQUFJVyxXQUFXLEVBQWY7QUFBQSxRQUNJQyxZQUFZLEVBRGhCOztBQUdBO0FBQ0EsU0FBSyxJQUFJckMsR0FBVCxJQUFnQm1CLFVBQWhCLEVBQTRCO0FBQzFCO0FBQ0E7QUFDQSxVQUFJbUIsZUFBZW5CLFdBQVduQixHQUFYLEVBQWdCOEIsTUFBTTlCLEdBQU4sQ0FBaEIsRUFBNEJ5QixNQUE1QixFQUFvQ0ssS0FBcEMsQ0FBbkI7O0FBRUEsVUFBSVEsaUJBQWlCUixNQUFNOUIsR0FBTixDQUFyQixFQUFpQztBQUMvQnFDLGtCQUFVRSxJQUFWLENBQWV2QyxHQUFmO0FBQ0Q7O0FBRURvQyxlQUFTcEMsR0FBVCxJQUFnQnNDLFlBQWhCO0FBQ0Q7O0FBRUQ7QUFDQXRCLFlBQVFvQixRQUFSLEVBQWtCQyxTQUFsQjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBT0QsUUFBUDtBQUNELEdBekJEO0FBMEJEOztBQUVNLFNBQVNSLGNBQVQsR0FBNEQ7QUFBQSxNQUFuQ1ksVUFBbUMsdUVBQXRCLEVBQXNCO0FBQUEsTUFBbEJDLFdBQWtCLHVFQUFKLEVBQUk7O0FBQ2pFO0FBQ0EsU0FBTyxZQUFnQztBQUFBLFFBQS9CWCxLQUErQix1RUFBdkIsRUFBdUI7QUFBQSxRQUFuQk8sU0FBbUIsdUVBQVAsRUFBTzs7QUFDckMsUUFBSUssc0JBQXNCLEVBQTFCO0FBQ0EsU0FBSyxJQUFJMUMsR0FBVCxJQUFnQndDLFVBQWhCLEVBQTRCO0FBQzFCO0FBQ0FDLGtCQUFZekMsR0FBWixFQUFpQkcsZ0JBQWpCLEdBQW9DcUMsV0FBV3hDLEdBQVgsRUFBZ0J5QyxZQUFZekMsR0FBWixFQUFpQkcsZ0JBQWpDLEVBQW1EMkIsS0FBbkQsRUFBMERPLFNBQTFELENBQXBDO0FBQ0Q7QUFDRixHQU5EO0FBT0QsQyIsImZpbGUiOiJnYW11eC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcImdhbXV4XCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImdhbXV4XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCA2MDVhNzBlMjgyNGVkZjBjZmVhNiIsImltcG9ydCB7Y29tYmluZVJlZHVjZXIsIGNyZWF0ZVN0b3JlLCBjb21iaW5lVXBkYXRlcn0gZnJvbSAnLi9zdGF0ZU1hbmFnZXInXG5cbi8qKlxuICogVGhlIGFuaW1hdGlvbiBsb29wIGtleSBmb3IgY2FuY2VsIGFuaW1hdGlvblxuICovXG5sZXQgX2FuaW1hdGlvbkxvb3BLZXkgPSBudWxsXG4vKipcbiAqIEFjY3VtdWxhdG9yIGZvciB0aW1lLWJhc2VkIGFuaW1hdGlvblxuICovXG5sZXQgX2FjY3VtdWxhdG9yID0gMFxuLyoqXG4gKiBUaGUgZGVmYXVsdCBmcHNcbiAqL1xubGV0IF9mcHMgPSA2MFxuLyoqXG4gKiBUaGUgc3RvcmUgZm9yIGdhbWVcbiAqL1xubGV0IF9zdG9yZSA9IHt9XG5cbmxldCBfdXBkYXRlck1hcCA9IHt9XG5cbmxldCBfcmVuZGVyZXJNYXAgPSB7fVxuXG4vKipcbiAqIFRyaWdnZXIgZ2FtZSBsb29wXG4gKi9cbmZ1bmN0aW9uIF9sb29wIChsYXN0VGltZXN0YW1wKSB7XG4gIF9hbmltYXRpb25Mb29wS2V5ID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxuICAgIGNvbnN0IGR0ID0gMTAwMCAvIF9mcHNcbiAgICBfYWNjdW11bGF0b3IgKz0gbm93IC0gbGFzdFRpbWVzdGFtcFxuXG4gICAgaWYgKF9hY2N1bXVsYXRvciA+PSBkdCkge1xuICAgICAgd2hpbGUgKF9hY2N1bXVsYXRvciA+PSBkdCkge1xuICAgICAgICBfYWNjdW11bGF0b3IgLT0gZHRcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGtleSBpbiBfcmVuZGVyZXJNYXApIHtcbiAgICAgICAgbGV0IHJlbmRlcmVyID0gX3JlbmRlcmVyTWFwW2tleV1cbiAgICAgICAgcmVuZGVyZXIucmVuZGVyU3RhdGUgPSByZW5kZXJlcihyZW5kZXJlci5yZW5kZXJTdGF0ZSwgcmVuZGVyZXIuZmluYWxSZW5kZXJTdGF0ZSwgZHQpXG4gICAgICB9XG4gICAgfVxuICAgIF9sb29wKG5vdylcbiAgfSlcbn1cblxuY29uc3QgZ2FtdXggPSB7XG4gIGNvbmZpZzogKGNvbmZpZyA9IHt9KSA9PiB7XG4gICAgLy8gQ29uZmlnIHRoZSBwcml2YXRlIGdsb2JhbHNcbiAgICBfZnBzID0gY29uZmlnLmZwcyB8fCBfZnBzXG5cbiAgICBsZXQgY29udGFpbmVyID0gY29uZmlnLmNvbnRhaW5lclxuXG4gICAgLy8gQ3JlYXRlIGdhbWUgbGF5ZXJzXG4gICAgY29uZmlnLmxheWVycy5mb3JFYWNoKChsYXllcikgPT4ge1xuICAgICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpXG4gICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKVxuXG4gICAgICBfdXBkYXRlck1hcFtsYXllci5uYW1lXSA9IGxheWVyLnVwZGF0ZXJcbiAgICAgIF9yZW5kZXJlck1hcFtsYXllci5uYW1lXSA9IGxheWVyLnJlbmRlci5iaW5kKG51bGwsIGNhbnZhcylcbiAgICB9KVxuXG4gICAgLy8gQ3JlYXRlIGdhbWUgc3RvcmVcbiAgICBfc3RvcmUgPSBjcmVhdGVTdG9yZShjb21iaW5lUmVkdWNlcihjb25maWcucmVkdWNlck1hcCwgY29tYmluZVVwZGF0ZXIoX3VwZGF0ZXJNYXAsIF9yZW5kZXJlck1hcCkpKVxuICAgIGlmIChjb25maWcuaW5pdCkge1xuICAgICAgY29uZmlnLmluaXQoX3N0b3JlLmdldFN0YXRlKCkpXG4gICAgfVxuICB9LFxuXG4gIGdldFN0YXRlOiAoc3RhdGVLZXkpID0+IHtcbiAgICByZXR1cm4gX3N0b3JlLmdldFN0YXRlKHN0YXRlS2V5KVxuICB9LFxuXG4gIGxheWVyczoge30sXG5cbiAgc3RhcnQ6ICgpID0+IHtcbiAgICBfbG9vcChEYXRlLm5vdygpKVxuICB9LFxuXG4gIGRpc3BhdGNoOiAoYWN0aW9uKSA9PiB7XG4gICAgX3N0b3JlLmRpc3BhdGNoKGFjdGlvbilcbiAgfVxuXG4gIC8vICpcbiAgLy8gICogR2FtZSB3aWxsIGJlIGF2YWlsYWJsZSBvbmNlIGNvbmZpZ3VyZWRcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2FtdXhcblxuXG4vLyBUT0RPXG4vLyAxLiBCdWlsZCBmaWxlIGZvciBFUzYgbW9kdWxlc1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9nYW11eC5qcyIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVTdG9yZSAocmVkdWNlcikge1xuICAvLyBJbml0IHN0YXRlXG4gIGxldCBzdGF0ZSA9IHJlZHVjZXIoKVxuXG4gIHJldHVybiB7XG4gICAgLyoqXG4gICAgICogRGlzcGF0Y2ggYWN0aW9uIHRvIHRyaWdnZXIgc3RhdGUgY2hhbmdlc1xuICAgICAqL1xuICAgIGRpc3BhdGNoOiAoYWN0aW9uID0ge30pID0+IHtcbiAgICAgIGlmIChwcm9jZXNzLmVudi5jb2RlID09PSAnREVWJykge1xuICAgICAgICAvLyBsb2cgYWN0aW9ucyBpbiBjb25zb2xlXG4gICAgICAgIGNvbnNvbGUuZ3JvdXAoYWN0aW9uLnR5cGUpXG4gICAgICAgIGNvbnNvbGUuaW5mbygnJWNiZWZvcmU6JywgJ2NvbG9yOiBncmVlbicsIHN0YXRlKVxuICAgICAgICBjb25zb2xlLmluZm8oJyVjYWN0aW9uOicsICdjb2xvcjogcmVkJywgYWN0aW9uKVxuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBVcGRhdGUgc3RhdGVcbiAgICAgIHN0YXRlID0gcmVkdWNlcihzdGF0ZSwgYWN0aW9uKVxuICAgICAgLy8gU3RhdGUgbWFuYWdlciBkb2Vzbid0IGNhcmUgYWJvdXQgbm90aWNpbmdcbiAgICAgIC8vIGdhbWUgdG8gdXBkYXRlIHN0YXRlLiBJbnN0ZWFkIHJlZHVjZXJzXG4gICAgICAvLyBzaG91bGQgc2V0IGRpcnR5IHN0YXRlIGZvciBnYW1lIGxvb3AgdG9cbiAgICAgIC8vIHRyaWdnZXIgdXBkYXRlXG5cbiAgICAgIGlmIChwcm9jZXNzLmVudi5jb2RlID09PSAnREVWJykge1xuICAgICAgICAvLyBsb2cgYWN0aW9ucyBpbiBjb25zb2xlXG4gICAgICAgIGNvbnNvbGUuaW5mbygnJWNhZnRlcjonLCAnY29sb3I6IGdyZWVuJywgc3RhdGUpXG4gICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKVxuICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmV0dXJuIHRoZSBjdXJyZW50IHN0YXRlIGZvciBnaXZlbiBrZXlcbiAgICAgKiBUaGlzIGlzIHRvIGFsbG93IGFwcGxpY2F0aW9uIHRvICdjb25uZWN0JyB0byBzdGF0ZVxuICAgICAqL1xuICAgIGdldFN0YXRlOiAoc3RhdGVLZXkpID0+IHtcbiAgICAgIGlmICghc3RhdGVLZXkpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlW3N0YXRlS2V5XVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBBc3N1bWUgdGhlIHJlY3Vlck1hcCBpcyBhIGZsYXQgbWFwIHRvIGFsbCByZWR1Y2Vyc1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVSZWR1Y2VyIChyZWR1Y2VyTWFwID0ge30sIHVwZGF0ZXIpIHtcblxuICAvLyBHZW5lcmF0ZSBhIGNvbWJpbmVkIHJlZHVjZXIgZnVuY3Rpb25cbiAgcmV0dXJuIChzdGF0ZSA9IHt9LCBhY3Rpb24gPSB7fSkgPT4ge1xuICAgIGxldCBuZXdTdGF0ZSA9IHt9LFxuICAgICAgICBkaXJ0eUtleXMgPSBbXVxuXG4gICAgLy8gU3ByZWFkIHRoZSBhY3Rpb24gdG8gYWxsIHJlZHVjZXJzIGluc2lkZSB0aGUgY29tYmluZWQgb25lXG4gICAgZm9yIChsZXQga2V5IGluIHJlZHVjZXJNYXApIHtcbiAgICAgIC8vIFBhc3MgdGhlIHdob2xlIHN0YXRlIGRvd24gYXMgYXJndW1lbnQgZm9yXG4gICAgICAvLyBjcm9zcyBzdGF0ZSBrZXkgYWNjZXNzXG4gICAgICBsZXQgcmVkdWNlZFN0YXRlID0gcmVkdWNlck1hcFtrZXldKHN0YXRlW2tleV0sIGFjdGlvbiwgc3RhdGUpXG5cbiAgICAgIGlmIChyZWR1Y2VkU3RhdGUgIT09IHN0YXRlW2tleV0pIHtcbiAgICAgICAgZGlydHlLZXlzLnB1c2goa2V5KVxuICAgICAgfVxuXG4gICAgICBuZXdTdGF0ZVtrZXldID0gcmVkdWNlZFN0YXRlXG4gICAgfVxuXG4gICAgLy8gQ2FsbCB1cGRhdGUgZnVuY3Rpb24gZm9yIGVhY2ggcmVkdWNlZCBzdGF0ZVxuICAgIHVwZGF0ZXIobmV3U3RhdGUsIGRpcnR5S2V5cylcblxuICAgIC8vIGRpcnR5S2V5cy5mb3JFYWNoKChkaXJ0eUtleSkgPT4ge1xuICAgIC8vICAgdXBkYXRlck1hcFtkaXJ0eUtleV0obmV3U3RhdGUsIGRpcnR5S2V5KVxuICAgIC8vIH0pXG5cbiAgICByZXR1cm4gbmV3U3RhdGVcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZVVwZGF0ZXIgKHVwZGF0ZXJNYXAgPSB7fSwgcmVuZGVyZXJNYXAgPSB7fSkge1xuICAvLyBHZW5lcmF0ZSBjb21iaW5lZCB1cGRhdGVyIGZ1bmN0aW9uIGZvciBhbGwgdXBkYXRlcnNcbiAgcmV0dXJuIChzdGF0ZSA9IHt9LCBkaXJ0eUtleXMgPSBbXSkgPT4ge1xuICAgIGxldCBuZXdGaW5hbFJlbmRlclN0YXRlID0ge31cbiAgICBmb3IgKGxldCBrZXkgaW4gdXBkYXRlck1hcCkge1xuICAgICAgLy8gQ29tcHV0ZSB0aGUgZmluYWwgcmVuZGVyIHN0YXRlIGFuZCBwYXNzIGludG8gcmVuZGVyZXJcbiAgICAgIHJlbmRlcmVyTWFwW2tleV0uZmluYWxSZW5kZXJTdGF0ZSA9IHVwZGF0ZXJNYXBba2V5XShyZW5kZXJlck1hcFtrZXldLmZpbmFsUmVuZGVyU3RhdGUsIHN0YXRlLCBkaXJ0eUtleXMpXG4gICAgfVxuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3RhdGVNYW5hZ2VyLmpzIl0sInNvdXJjZVJvb3QiOiIifQ==