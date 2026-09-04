import { useEffect, useRef, useState } from 'react'
import candleGif from './assets/candle_cursor.gif'
import candleHoverGif from './assets/candle_cursor_hover.gif'

function CandleCursor() {
  const candleRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    function handleMouseMove(event) {
      const candle = candleRef.current
      if (!candle) return
      candle.style.opacity = '1'
      candle.style.transform = `translate(${event.clientX - 3}px, ${event.clientY - 3}px)`
      setIsHovering(Boolean(event.target.closest('a, button')))
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <img
      ref={candleRef}
      src={isHovering ? candleHoverGif : candleGif}
      alt=""
      className="candle-cursor"
    />
  )
}

export default CandleCursor
