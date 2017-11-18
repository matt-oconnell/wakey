const express = require('express')
const { waves } = require('./requests/waves.js')
const { weather } = require('./requests/weather.js')
const { parking } = require('./requests/parking.js')
const { calendar } = require('./requests/calendar.js')

const app = express()

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

app.get('/', asyncMiddleware(async (req, res, next) => {
  const [calendarResp, weatherResp, parkingResp, wavesResp] = await Promise.all([
    calendar(), weather(), parking(), waves()
  ])
  res.send({
    calendar: calendarResp,
    weather: weatherResp,
    parking: parkingResp,
    waves: wavesResp
  })
}))

app.listen(3000, () => console.log('http://localhost:3000/'))
