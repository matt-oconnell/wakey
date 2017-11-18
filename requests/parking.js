const axios = require('axios')

module.exports = {
  parking: async () => {
    const parkingResponse = await axios.get('https://nyc-asp-twitter.herokuapp.com')
    parkingResponse.data.splice(3)
    return parkingResponse.data
  }
}
