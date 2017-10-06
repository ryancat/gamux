const initFinalRenderState  = {}

export const snakeLayerUpdater = (finalRenderState = initFinalRenderState, gameState, dirtyKeys) => {
  if (dirtyKeys.indexOf('snake') >= 0) {
    let {
          width,
          height,
          rows,
          columns
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

        // switch (direction) {
        //   case gamux.shared.direction.UP:
        //     y -= cellHeight
        // }
        return {
          x: bodyBlock.column * cellWidth,
          y: bodyBlock.row * cellHeight,
          width: cellWidth,
          height: cellHeight
        }
      }),
      isMove,
      speed
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

    if (canvas.width !== renderState.width
      || canvas.height !== renderState.height) {
      canvas.width = renderState.width
      canvas.height = renderState.height
      // Clear canvas manually
      context.clearRect(0, 0, canvas.width, canvas.height)
    }    

    let {
          speed,
          body
        } = renderState,
        bodyFRS = finalRenderState.body

    // Set the direction for the snake head
    body.forEach((bodyBlock, index) => {
      // Each body block will move towards direction
      // for a given speed 
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

    if (!dirty) {
      return finalRenderState
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      // Render
      body.forEach((bodyBlock, index) => {
        if (index === 0) {
          context.fillStyle = '#ea6969'
        }
        else {
          context.fillStyle = '#3f3f3f'
        }
        context.fillRect(bodyBlock.x, bodyBlock.y, bodyBlock.width, bodyBlock.height)
      })

      return renderState
    }
  }

  return finalRenderState
}