const axios = require('axios')

module.exports = {
  parking: async () => {
    const parkingResponse = await axios.get('https://nyc-asp-twitter.herokuapp.com')
    return parkingResponse.data[0]
  }
}
