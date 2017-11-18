const axios = require('axios')

module.exports = {
  parking: async (res) => {
    const parkingResponse = await axios.get('https://nyc-asp-twitter.herokuapp.com')
    res.send(parkingResponse.data)
  }
}
