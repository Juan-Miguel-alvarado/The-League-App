const BASE = '/api'
const LEAGUE = 'PD'
const _cache = {}
const REQUEST_DELAY = 800

function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}

let queue = []
let processing = false

async function queuedFetch(path) {
  return new Promise((resolve, reject) => {
    queue.push({ path, resolve, reject })
    processQueue()
  })
}

async function processQueue() {
  if (processing || queue.length === 0) return
  processing = true
  while (queue.length > 0) {
    const { path, resolve, reject } = queue.shift()
    try { resolve(await apiFetch(path)) } catch (e) { reject(e) }
    await delay(REQUEST_DELAY)
  }
  processing = false
}

async function apiFetch(path) {
  if (_cache[path]) return _cache[path]
  const res = await fetch(`${BASE}${path}`)
  if (res.status === 429) {
    await delay(3000)
    return apiFetch(path)
  }
  if (!res.ok) throw new Error(`API Error ${res.status}: ${res.statusText}`)
  const data = await res.json()
  _cache[path] = data
  return data
}

function parseForm(str) {
  if (!str) return ['D', 'D', 'D', 'D', 'D']
  return str.split(',').filter(Boolean).slice(-5).map(r => r.trim())
}

function calcAge(dob) {
  if (!dob) return null
  return Math.floor((Date.now() - new Date(dob)) / (1000 * 60 * 60 * 24 * 365.25))
}

function shortPos(pos) {
  const map = {
    Goalkeeper: 'GK', Defender: 'DEF', Midfielder: 'MID', Forward: 'FW',
    Offence: 'FW', Defence: 'DEF', Midfield: 'MID',
    'Centre-Back': 'CB', 'Left-Back': 'LB', 'Right-Back': 'RB',
    'Central Midfield': 'CM', 'Attacking Midfield': 'AM',
    'Left Winger': 'LW', 'Right Winger': 'RW', 'Centre-Forward': 'CF',
  }
  return map[pos] || pos || '—'
}

export function transformStandings(apiData) {
  const total = apiData.standings.find(s => s.type === 'TOTAL')
  if (!total) throw new Error('No TOTAL standings found')
  return total.table.map(row => ({
    rank: row.position,
    name: row.team.name,
    abbr: row.team.tla,
    crest: row.team.crest,
    teamId: row.team.id,
    wins: row.won,
    losses: row.lost,
    draws: row.draw,
    pts: row.points,
    gf: row.goalsFor,
    ga: row.goalsAgainst,
    played: row.playedGames,
    form: parseForm(row.form),
  }))
}

export function transformScorers(apiData) {
  return (apiData.scorers || []).map(e => ({
    name: e.player.name,
    nationality: e.player.nationality || '—',
    age: calcAge(e.player.dateOfBirth),
    position: shortPos(e.player.section || e.player.position),
    team: e.team.name,
    teamId: e.team.id,
    teamCrest: e.team.crest,
    goals: e.goals || 0,
    assists: e.assists || 0,
    penalties: e.penalties || 0,
    matches: e.playedMatches || 0,
  }))
}

export function transformMatches(apiData) {
  return (apiData.matches || [])
    .filter(m => m.status === 'FINISHED')
    .map(m => ({
      id: m.id,
      matchday: m.matchday,
      date: m.utcDate,
      homeTeam: m.homeTeam.name,
      awayTeam: m.awayTeam.name,
      homeScore: m.score?.fullTime?.home ?? 0,
      awayScore: m.score?.fullTime?.away ?? 0,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function calculateFormFromMatches(standings, matches) {
  standings.forEach(team => {
    const tm = matches
      .filter(m => m.homeTeam === team.name || m.awayTeam === team.name)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)

    team.form = tm.map(m => {
      const isHome = m.homeTeam === team.name
      const ts = isHome ? m.homeScore : m.awayScore
      const os = isHome ? m.awayScore : m.homeScore
      return ts > os ? 'W' : ts < os ? 'L' : 'D'
    }).reverse()

    while (team.form.length < 5) team.form.unshift('D')
  })
}

export async function loadAllData() {
  const [sRaw, scRaw, mRaw] = await Promise.all([
    queuedFetch(`/competitions/${LEAGUE}/standings`),
    queuedFetch(`/competitions/${LEAGUE}/scorers?limit=20`),
    queuedFetch(`/competitions/${LEAGUE}/matches?status=FINISHED&limit=100`),
  ])
  const standings = transformStandings(sRaw)
  const scorers = transformScorers(scRaw)
  const matches = transformMatches(mRaw)
  calculateFormFromMatches(standings, matches)
  return { standings, scorers, matches }
}
