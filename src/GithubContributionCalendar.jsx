import { useEffect, useRef, useState } from 'react'

function GithubContributionCalendar() {
  const [calendar, setCalendar] = useState(null)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (calendar && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [calendar])

  useEffect(() => {
    let cancelled = false

    fetch('/api/github-contributions')
      .then((response) => {
        if (!response.ok) throw new Error('Request failed')
        return response.json()
      })
      .then((data) => {
        if (!cancelled) setCalendar(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (error) {
    return <p className="stat-panel-status">Couldn't load contribution calendar.</p>
  }

  if (!calendar) {
    return <p className="stat-panel-status">Loading contribution calendar…</p>
  }

  return (
    <div>
      <p className="stat-panel-status">{calendar.totalContributions} contributions this year</p>
      <div className="contribution-calendar" ref={scrollRef}>
        {calendar.weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="contribution-week">
            {week.contributionDays.map((day) => (
              <div
                key={day.date}
                className="contribution-day"
                style={{ backgroundColor: day.color }}
                title={`${day.contributionCount} contributions on ${day.date}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GithubContributionCalendar
