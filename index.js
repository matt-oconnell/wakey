const express = require('express')
const mustacheExpress = require('mustache-express')
const path = require('path')
const moment = require('moment-timezone')
const { waves } = require('./requests/waves.js')
const { weather } = require('./requests/weather.js')
const { parking } = require('./requests/parking.js')
const { calendar } = require('./requests/calendar.js')
const { yoga } = require('./requests/yoga.js')
moment.tz.setDefault('America/New_York')

var Redis = require('ioredis')
var redis = new Redis(process.env.REDIS_URL)

const app = express()
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'dist')))

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

app.get('/', asyncMiddleware(async (req, res, next) => {
  const startOfDayTimestamp = moment().startOf('day').unix()

  const cachedData = await redis.get(`${startOfDayTimestamp}`)
  if (cachedData) {
    res.render('index', JSON.parse(cachedData))
    return
  }
 
  const [yogaResp, calendarResp, weatherResp, parkingResp, wavesResp] = await Promise.all([
    yoga(), calendar(), weather(), parking(), waves()
  ])
  const collectedResponses = {
    yoga: yogaResp,
    calendar: calendarResp,
    weather: weatherResp,
    parking: parkingResp,
    waves: wavesResp,
    summary: {
      day: moment().format('dddd'),
      date: moment().format('MMMM Do YYYY'),
    }
  };
  res.render('index', collectedResponses)
  redis.set(`${startOfDayTimestamp}`, JSON.stringify(collectedResponses))
}))

app.get('/debug', asyncMiddleware(async (req, res, next) => {
  const [yogaResp, calendarResp, weatherResp, parkingResp, wavesResp] = await Promise.all([
    yoga(), calendar(), weather(), parking(), waves()
  ])
  res.send({
    yoga: yogaResp,
    calendar: calendarResp,
    weather: weatherResp,
    parking: parkingResp,
    waves: wavesResp
  })
}))

app.listen(process.env.PORT || 5000)
