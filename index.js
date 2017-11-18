const express = require('express')
const mustacheExpress = require('mustache-express')
const path = require('path')
const { waves } = require('./requests/waves.js')
const { weather } = require('./requests/weather.js')
const { parking } = require('./requests/parking.js')
const { calendar } = require('./requests/calendar.js')

const app = express()
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')))

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

app.get('/', asyncMiddleware(async (req, res, next) => {
  const [calendarResp, weatherResp, parkingResp, wavesResp] = await Promise.all([
    calendar(), weather(), parking(), waves()
  ])
  res.render('index', {
    calendar: calendarResp,
    weather: weatherResp,
    parking: parkingResp,
    waves: wavesResp
  })
}))

app.get('/d', asyncMiddleware(async (req, res, next) => {
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
