const LEETCODE_USERNAME = 'IbrahimAjmal02'
const DAY_SECONDS = 86400

const QUERY = `
  query userStats($username: String!) {
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      userCalendar {
        streak
        totalActiveDays
        submissionCalendar
      }
    }
  }
`

function colorForCount(count) {
  if (count === 0) return '#ebedf0'
  if (count <= 2) return '#9be9a8'
  if (count <= 5) return '#40c463'
  if (count <= 9) return '#30a14e'
  return '#216e39'
}

function buildCalendarWeeks(submissionMap) {
  const now = new Date()
  const todayStart = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000,
  )

  const daysToShow = 371 // ~53 weeks, matching GitHub's default window
  const rangeStart = todayStart - (daysToShow - 1) * DAY_SECONDS
  const rangeStartDow = new Date(rangeStart * 1000).getUTCDay()
  const alignedStart = rangeStart - rangeStartDow * DAY_SECONDS // back up to the prior Sunday

  const weeks = []
  let currentWeek = []

  for (let ts = alignedStart; ts <= todayStart; ts += DAY_SECONDS) {
    const count = submissionMap[ts] ?? 0
    currentWeek.push({
      date: new Date(ts * 1000).toISOString().slice(0, 10),
      contributionCount: count,
      color: colorForCount(count),
    })

    if (currentWeek.length === 7) {
      weeks.push({ contributionDays: currentWeek })
      currentWeek = []
    }
  }

  if (currentWeek.length > 0) {
    weeks.push({ contributionDays: currentWeek })
  }

  return weeks
}

export default async function handler(req, res) {
  try {
    const leetcodeResponse = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { username: LEETCODE_USERNAME } }),
    })

    if (!leetcodeResponse.ok) {
      res.status(502).json({ error: 'LeetCode request failed' })
      return
    }

    const payload = await leetcodeResponse.json()
    const user = payload?.data?.matchedUser

    if (!user) {
      res.status(404).json({ error: 'LeetCode user not found' })
      return
    }

    const submissionMap = JSON.parse(user.userCalendar.submissionCalendar || '{}')

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json({
      solved: user.submitStatsGlobal.acSubmissionNum,
      streak: user.userCalendar.streak,
      totalActiveDays: user.userCalendar.totalActiveDays,
      calendar: { weeks: buildCalendarWeeks(submissionMap) },
    })
  } catch {
    res.status(500).json({ error: 'Server error fetching LeetCode stats' })
  }
}
