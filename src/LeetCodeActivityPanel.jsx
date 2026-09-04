import { useEffect, useRef, useState } from 'react'

function LeetCodeActivityPanel() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (stats && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [stats])

  useEffect(() => {
    let cancelled = false

    fetch('/api/leetcode-stats')
      .then((response) => {
        if (!response.ok) throw new Error('Request failed')
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
    return <p className="stat-panel-status">Couldn't load LeetCode activity.</p>
  }

  if (!stats) {
    return <p className="stat-panel-status">Loading LeetCode activity…</p>
  }

  const totalSolved = stats.solved.find((item) => item.difficulty === 'All')?.count ?? 0

  return (
    <div>
      <ul className="stat-panel-list">
        <li>{totalSolved} problems solved</li>
        {stats.solved
          .filter((item) => item.difficulty !== 'All')
          .map((item) => (
            <li key={item.difficulty}>
              {item.difficulty}: {item.count}
            </li>
          ))}
      </ul>

      <ul className="stat-panel-list">
        <li>
          Current streak: {stats.streak} day{stats.streak === 1 ? '' : 's'}
        </li>
        <li>Total active days: {stats.totalActiveDays}</li>
      </ul>

      <div className="contribution-calendar" ref={scrollRef}>
        {stats.calendar.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="contribution-week">
            {week.contributionDays.map((day) => (
              <div
                key={day.date}
                className="contribution-day"
                style={{ backgroundColor: day.color }}
                title={`${day.contributionCount} submissions on ${day.date}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LeetCodeActivityPanel
