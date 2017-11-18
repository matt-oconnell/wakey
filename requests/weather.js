const weatherjs = require('weather-js')

module.exports = {
  weather: (res) => {
    weatherjs.find({search: 'Brooklyn, NY', degreeType: 'F'}, (err, result) => {
      if (err) { throw new Error(err) }
      res.send(JSON.stringify(result, null, 2))
    });
  }
}
