# gamux

## In a nutshell
gamux is a predictable state container for HTML5 games. It borrows the concept from [Redux](https://github.com/reactjs/redux) by using a single store for all game states, and using reducers to update them. Besides that, gamux adds the concept of final render state (FRS) to reflect the actual game state. FRS is calculated based on current game state, and in each render cycle, gamux will allow user define how the game should render what's on the screen towards the current FRS, until the render state gets to FRS. 

## More details
When game starts, gamux will kick off a loop based on requestAnimationFrame and use a [time based animation](http://blog.sklambert.com/using-time-based-animation-implement/) to keep the two main parts running: **update** and **render**. update functions will be called whenever something changed in game state to give you a chance to update corresponding FRS. render functions, on the other hand, will be called in each frame to trigger rendering work based on the current FRS and current render state. gamux provides you the framework but it's up to you how you want to render the frames for your game.

In the main file you will need to call the config function to pass your game configuration. The important parts are **reducerMap**, in which you will provide your reducers to update game states, and **layers**, in which you will provide your updaters and renderers to receive the updated game states and trigger render jobs. You can check the demo for [a snake game](https://ryancat.github.io/2017/10/06/snake/) as reference. 

There are often sprites and stages for game rendering engines which allow you to easily control entities and levels in a game. At this point gamux doesn't provide you anything like that. You will have to use the main update and render function to handle all your requirements. 

## Todo list
- Add more demos
- Bug fixes
