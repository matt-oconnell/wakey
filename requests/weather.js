const weatherjs = require('weather-js')
const axios = require('axios')

module.exports = {
  weather: async () => {
    const today = await axios.get('http://api.wunderground.com/api/a657cb9c1419658e/forecast10day/q/NY/Brooklyn.json')
    const yesterday = await axios.get('http://api.wunderground.com/api/a657cb9c1419658e/yesterday/q/NY/Brooklyn.json')
    const todayData = today.data.forecast.simpleforecast.forecastday[0]
    const yesterdayData = yesterday.data.history.dailysummary[0]
    return {
      today: {
        low: todayData.low.fahrenheit,
        high: todayData.high.fahrenheit,
        desc: today.data.forecast.txt_forecast.forecastday[0].fcttext,
        chanceOfRain: todayData.pop,
      },
      yesterday: {
        low: yesterdayData.mintempi,
        high: yesterdayData.maxtempi,
      }
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
