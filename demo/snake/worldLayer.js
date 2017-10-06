const initFinalRenderState  = {}

export const worldLayerUpdater = (finalRenderState = initFinalRenderState, gameState, dirtyKeys) => {
  if (dirtyKeys.indexOf('world') >= 0) {
    let {
          width,
          height,
          rows,
          columns,
          starPosition
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
      }
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

    let context = canvas.getContext('2d')

    canvas.width = renderState.width
    canvas.height = renderState.height
    context.strokeStyle = '#f9f9f9'
    context.lineWidth = 1
    context.beginPath()

    renderState.xs.forEach((verticalLine) => {
      context.moveTo(verticalLine.x, verticalLine.y0)
      context.lineTo(verticalLine.x, verticalLine.y1)
      context.stroke()
    })

    renderState.ys.forEach((horizontalLine) => {
      context.moveTo(horizontalLine.x0, horizontalLine.y)
      context.lineTo(horizontalLine.x1, horizontalLine.y)
      context.stroke()
    })

    let star = renderState.star
    context.fillStyle = '#ffae00'
    context.fillRect(star.x, star.y, star.width, star.height)

    return renderState
  }

  return finalRenderState
}