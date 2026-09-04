const GITHUB_USERNAME = 'IbrahimAjmal02'

const QUERY = `
  query ($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color
            }
          }
        }
      }
    }
  }
`

export default async function handler(req, res) {
  const token = process.env.GITHUB_TOKEN

  if (!token) {
    res.status(500).json({ error: 'GITHUB_TOKEN is not configured' })
    return
  }

  try {
    const githubResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY, variables: { username: GITHUB_USERNAME } }),
    })

    if (!githubResponse.ok) {
      res.status(502).json({ error: 'GitHub GraphQL request failed' })
      return
    }

    const payload = await githubResponse.json()
    const calendar = payload?.data?.user?.contributionsCollection?.contributionCalendar

    if (!calendar) {
      res.status(502).json({ error: 'Unexpected response shape from GitHub' })
      return
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    res.status(200).json(calendar)
  } catch {
    res.status(500).json({ error: 'Server error fetching GitHub contributions' })
  }
}
