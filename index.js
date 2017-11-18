const express = require('express')
const { waves } = require('./requests/waves.js')
const { weather } = require('./requests/weather.js')
const { parking } = require('./requests/parking.js')
const { calendar } = require('./requests/calendar.js')

const app = express()

const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

app.get('/', (req, res) => res.send('Wakey.'))
app.get('/waves', asyncMiddleware(async (req, res, next) => waves(res)))
app.get('/weather', (req, res) => weather(res))
app.get('/parking', asyncMiddleware(async (req, res, next) => parking(res)))
app.get('/calendar', (req, res) => calendar(res))

app.listen(3000, () => console.log('http://localhost:3000/'))
