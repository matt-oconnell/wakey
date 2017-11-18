const weatherjs = require('weather-js')

module.exports = {
  weather: async () => {
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
