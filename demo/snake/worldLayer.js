const initFinalRenderState  = {}

export const worldLayerUpdater = (finalRenderState = initFinalRenderState, gameState, dirtyKeys) => {
  if (dirtyKeys.indexOf('world') >= 0) {
    let {
          width,
          height,
          rows,
          columns,
          starPosition,
          level
        } = gameState['world'],
        cellWidth = width / columns,
        cellHeight = height / rows

    return Object.assign({}, finalRenderState, {
      width,
      height,
      xs: Array(columns + 1).fill(0).map((x, xIndex) => {
        return {
          x: xIndex * cellWidth,
          y0: 0,
          y1: height
        }}),
      ys: Array(rows + 1).fill(0).map((y, yIndex) => {
        return {
          y: yIndex * cellHeight,
          x0: 0,
          x1: width
        }}),
      star: {
        x: starPosition.column * cellWidth,
        y: starPosition.row * cellHeight,
        width: cellWidth,
        height: cellHeight
      },
      level
    })
  }
  else {
    return finalRenderState
  }
}

export const worldLayerRender = (canvas, renderState, finalRenderState, dt) => {
  if (renderState !== finalRenderState) {
    if (!renderState) {
      renderState = finalRenderState
    }

    // No animation to world layer
    renderState = finalRenderState

    let {
      width,
      height,
      xs,
      ys,
      level,
      star
    } = renderState

    let context = canvas.getContext('2d')

    if (canvas.width !== width
      || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      // Clear canvas manually
      context.clearRect(0, 0, canvas.width, canvas.height)
    }

    // Clear canvas manually before redraw
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.strokeStyle = '#f9f9f9'
    context.lineWidth = 1
    context.beginPath()

    xs.forEach((verticalLine) => {
      context.moveTo(verticalLine.x, verticalLine.y0)
      context.lineTo(verticalLine.x, verticalLine.y1)
      context.stroke()
    })

    ys.forEach((horizontalLine) => {
      context.moveTo(horizontalLine.x0, horizontalLine.y)
      context.lineTo(horizontalLine.x1, horizontalLine.y)
      context.stroke()
    })

    // Draw text
    context.fillStyle = '#bfbfbf'
    context.font = Math.min(width, height) + 'px arial, helvetica, sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(level, width / 2, height / 2)

    // Draw star
    context.fillStyle = '#ffae00'
    context.fillRect(star.x, star.y, star.width, star.height)
  }

  return renderState
}