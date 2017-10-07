import gamux from '../../dist/gamux'
import {
  direction
} from './theme'
import { 
  leftKeyDown,
  rightKeyDown,
  upKeyDown,
  downKeyDown,
  gameOver,
  nextLevel,
  cutSnakeBody
} from './actions'

/**
 * Function detect hit world edge
 */
function hitStar (snakeHead, star) {
  return snakeHead.x < star.x + star.width
      && snakeHead.x + snakeHead.width > star.x
      && snakeHead.y < star.y + star.height
      && snakeHead.y + snakeHead.height > star.y
}

function hitSelfByHead (snakeBody, headDirection) {
  // let head = snakeBody[0]
  // if (!head) {
  //   return false
  // }

  // return snakeBody.slice(3).some((bodyBlock) => {
  //   switch (headDirection) {
  //     case direction.UP:
  //       return hitOnTop(head, bodyBlock)

  //     case direction.DOWN: {
  //       return hitOnBottom(head, bodyBlock)
  //     }

  //     case direction.LEFT: {
  //       return hitOnLeft(head, bodyBlock)
  //     }

  //     case direction.RIGHT: {
  //       return hitOnRight(head, bodyBlock)
  //     }
  //   }
  // })

  return getHitBodyIndex(snakeBody, headDirection) >= 0
}

function hitOnRight (focus, other) {
  return focus.x + focus.width > other.x
      && focus.x + focus.width < other.x + other.width
      && focus.y + focus.height > other.y
      && focus.y < other.y + other.height
}

function hitOnLeft (focus, other) {
  return focus.x < other.x + other.width
      && focus.x > other.x
      && focus.y + focus.height > other.y
      && focus.y < other.y + other.height
}

function hitOnBottom (focus, other) {
  return focus.y + focus.height > other.y
      && focus.y + focus.height < other.y + other.height
      && focus.x + focus.width > other.x
      && focus.x < other.x + other.width
}

function hitOnTop (focus, other) {
  return focus.y < other.y + other.height
      && focus.y > other.y
      && focus.x + focus.width > other.x
      && focus.x < other.x + other.width
}

function getHitBodyIndex (snakeBody, headDirection) {
  let head = snakeBody[0]

  if (!head) {
    return -1
  }

  for (let i = 3; i < snakeBody.length; i++) {
    let bodyBlock = snakeBody[i]

    if ((headDirection === direction.UP && hitOnTop(head, bodyBlock))
      || (headDirection === direction.DOWN && hitOnBottom(head, bodyBlock))
      || (headDirection === direction.LEFT && hitOnLeft(head, bodyBlock))
      || (headDirection === direction.RIGHT && hitOnRight(head, bodyBlock))) {
      return i
    }
  }

  return -1
}

function cutSelfByHead (snakeBody, headDirection) {
  let hitBodyIndex = getHitBodyIndex(snakeBody, headDirection)

  if (hitBodyIndex < 0) {
    return 
  }

  gamux.dispatch(cutSnakeBody(hitBodyIndex))
}

/**
 * Function to fill a free dimension rect
 * example:
 * fillFreeRect(context, -10, -10, 20, 20) will render four
 * rect at each corner with 10 pixel dimension
 */
function fillFreeRect (context, x, y, width, height) {
  let canvasWidth = context.canvas.width,
      canvasHeight = context.canvas.height

  if (x < 0) {
    fillFreeRect(context, canvasWidth + x, y, Math.min(-x, width), height)
  }

  if (x > canvasWidth - width) {
    fillFreeRect(context, Math.max(0, x - canvasWidth), y, width - Math.max(0, canvasWidth - x), height)
  }
  
  if (y < 0) {
    fillFreeRect(context, x, canvasHeight + y, width, Math.min(-y, height))
  }

  if (y > canvasHeight - height) {
    fillFreeRect(context, x, Math.max(0, y - canvasHeight), width, height - Math.max(0, canvasHeight - y))
  }

  context.fillRect(x, y, width, height)
}

const initFinalRenderState  = {}

export const snakeLayerUpdater = (finalRenderState = initFinalRenderState, gameState, dirtyKeys) => {
  if (dirtyKeys.indexOf('snake') >= 0) {
    let {
          width,
          height,
          rows,
          columns,
          starPosition
        } = gameState['world'],
        {
          body,
          direction,
          isMove,
          speed
        } = gameState['snake'],
        cellWidth = width / columns,
        cellHeight = height / rows

    return Object.assign({}, finalRenderState, {
      width,
      height,
      body: body.map((bodyBlock, index) => {
        let x = bodyBlock.column * cellWidth,
            y = bodyBlock.row * cellHeight

        return {
          x: bodyBlock.column * cellWidth,
          y: bodyBlock.row * cellHeight,
          width: cellWidth,
          height: cellHeight
          // column: bodyBlock.column,
          // row: bodyBlock.row
        }
      }),
      isMove,
      speed,
      direction,
      star: {
        x: starPosition.column * cellWidth,
        y: starPosition.row * cellHeight,
        width: cellWidth,
        height: cellHeight
      }
    })
  }
  else {
    return finalRenderState
  }
}

export const snakeLayerRender = (canvas, renderState, finalRenderState, dt) => {
  if (renderState !== finalRenderState) {
    let context = canvas.getContext('2d'),
        dirty = false

    if (!renderState) {
      renderState = finalRenderState
      dirty = true
    }

    // Set things that are not animated
    Object.assign(renderState, {
      direction: finalRenderState.direction,
      isMove: finalRenderState.isMove,
      speed: finalRenderState.speed,
      width: finalRenderState.width,
      height: finalRenderState.height
    })

    if (canvas.width !== renderState.width
      || canvas.height !== renderState.height) {
      canvas.width = renderState.width
      canvas.height = renderState.height
      // Clear canvas manually
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    if (!renderState.isMove) {
      // Snake stops move
      return renderState
    }

    let {
          speed,
          body
        } = renderState,
        bodyFRS = finalRenderState.body,
        starFRS = finalRenderState.star

    // Make sure body and bodyFRS are in sync
    if (body.length < bodyFRS.length) {
      // Body grows
      for (let i = body.length; i < bodyFRS.length; i++) {
        let bodyFRSBlock = bodyFRS[i]
        body[i] = {
          x: bodyFRSBlock.x,
          y: bodyFRSBlock.y,
          width: bodyFRSBlock.width,
          height: bodyFRSBlock.height
        }
      }
    }
    else if (body.length > bodyFRS.length) {
      // Body got cut
      body.splice(bodyFRS.length)
    }

    // Set the actual render dimensions for the snake head
    body.forEach((bodyBlock, index) => {
      let {
            x,
            y,
            width,
            height
          } = bodyBlock

      if (bodyFRS[index].x !== x) {
        let directionUnit = (bodyFRS[index].x - x) / Math.abs(bodyFRS[index].x - x),
            distance = Math.min(speed * dt, Math.abs(bodyFRS[index].x - x))

        bodyBlock.x += distance * directionUnit
        dirty = true
      }

      if (bodyFRS[index].y !== y) {
        let directionUnit = (bodyFRS[index].y - y) / Math.abs(bodyFRS[index].y - y),
            distance = Math.min(speed * dt, Math.abs(bodyFRS[index].y - y))
        
        bodyBlock.y += distance * directionUnit
        dirty = true
      }
    })

    if (dirty) {
      // We have someting to render here
      context.clearRect(0, 0, canvas.width, canvas.height)

      // Render
      body.forEach((bodyBlock, index) => {
        if (index === 0) {
          context.fillStyle = '#ea6969'
        }
        else {
          context.fillStyle = '#3f3f3f'
        }
        fillFreeRect(context, bodyBlock.x, bodyBlock.y, bodyBlock.width, bodyBlock.height)
      })

      // Hit detection
      // Check if snake head hit itself
      // Cut the body if hit itself
      cutSelfByHead(body, renderState.direction)

      // Check if snake head hit star
      let head = body[0],
          headX = head.x % renderState.width,
          headY = head.y % renderState.height,
          headPosition 

      headX = headX < 0 ? renderState.width + headX : headX
      headY = headY < 0 ? renderState.height + headY : headY
      if (hitStar({
        x: headX,
        y: headY,
        width: head.width,
        height: head.height
      }, starFRS)) {
        gamux.dispatch(nextLevel(bodyFRS))
      }
    }
    else {
      // Now that the current final render state has arrived
      // we need to update the final render state
      switch(renderState.direction) {
        case direction.UP:
          gamux.dispatch(upKeyDown())
          break

        case direction.DOWN:
          gamux.dispatch(downKeyDown())
          break

        case direction.LEFT:
          gamux.dispatch(leftKeyDown())
          break

        case direction.RIGHT:
          gamux.dispatch(rightKeyDown())
          break
      }
    }
  }
  
  return renderState
}