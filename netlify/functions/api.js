const API_KEY = '0d9c408b126f46a685e9127195a29d7e'
const BASE_URL = 'https://api.football-data.org/v4'

exports.handler = async (event) => {
  try {
    const url = new URL(event.rawUrl)
    const apiPath = url.pathname.replace(/^\/api/, '') || '/'
    const apiUrl = `${BASE_URL}${apiPath}${url.search}`

    const response = await fetch(apiUrl, {
      headers: { 'X-Auth-Token': API_KEY },
    })
    const body = await response.text()
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
