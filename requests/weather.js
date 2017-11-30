const weatherjs = require('weather-js')
const axios = require('axios')

function getAvg(low, high) {
  return Math.round((+low + +high) / 2)
}

module.exports = {
  weather: async () => {
    const today = await axios.get(`http://api.wunderground.com/api/${process.env.WEATHER_KEY}/forecast10day/q/NY/Brooklyn.json`)
    const yesterday = await axios.get(`http://api.wunderground.com/api/${process.env.WEATHER_KEY}/yesterday/q/NY/Brooklyn.json`)
    const todayData = today.data.forecast.simpleforecast.forecastday[0]
    const yesterdayData = yesterday.data.history.dailysummary[0]
    const fourDays = []
    for (var i = 1; i < 5; i++) {
      const dayData = today.data.forecast.simpleforecast.forecastday[i]
      fourDays.push({ avg: getAvg(dayData.high.fahrenheit, dayData.low.fahrenheit) })
    }

    return {
      today: {
        low: todayData.low.fahrenheit,
        high: todayData.high.fahrenheit,
        avg: getAvg(todayData.high.fahrenheit, todayData.low.fahrenheit),
        desc: today.data.forecast.txt_forecast.forecastday[0].fcttext,
        chanceOfRain: todayData.pop
      },
      yesterday: {
        low: yesterdayData.mintempi,
        high: yesterdayData.maxtempi,
        avg: getAvg(yesterdayData.mintempi, yesterdayData.maxtempi)
      },
      fourDays
    }

    return new Promise((res, rej) => {
      weatherjs.find({
        search: 'Brooklyn, NY',
        degreeType: 'F'
      }, (err, data) => {
        if (err) rej(err)
        const yesterday = data[0].forecast[0]
        const today = data[0].forecast[1]
        const weatherResponse = {
          today: {
            low: today.low,
            high: today.high,
            type: today.skytextday,
            chanceOfRain: today.precip
          }
        }
        res(weatherResponse)
      })
    }) 
  }
}
