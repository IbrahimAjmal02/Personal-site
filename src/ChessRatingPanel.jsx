import { useEffect, useState } from 'react'

const CHESS_USERNAME = 'ibidude'
const GOAL_RATING = 1100

const RATING_CATEGORIES = [
  { key: 'chess_rapid', label: 'Rapid' },
  { key: 'chess_blitz', label: 'Blitz' },
  { key: 'chess_bullet', label: 'Bullet' },
  { key: 'chess_daily', label: 'Daily' },
]

function ChessRatingPanel() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    fetch(`https://api.chess.com/pub/player/${CHESS_USERNAME}/stats`)
      .then((response) => {
        if (!response.ok) throw new Error('Chess.com request failed')
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return <p className="stat-panel-status">Couldn't load Chess.com rating.</p>
  }

  if (!stats) {
    return <p className="stat-panel-status">Loading Chess.com rating…</p>
  }

  const ratings = RATING_CATEGORIES.filter((category) => stats[category.key]?.last?.rating)

  if (ratings.length === 0) {
    return <p className="stat-panel-status">No rated games yet.</p>
  }

  return (
    <ul className="stat-panel-list">
      {ratings.map((category) => (
        <li key={category.key}>
          {category.label}: {stats[category.key].last.rating}
        </li>
      ))}
      <li>Goal: {GOAL_RATING}</li>
    </ul>
  )
}

export default ChessRatingPanel
