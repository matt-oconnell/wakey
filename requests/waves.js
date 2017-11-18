const axios = require('axios')
const xml2js = require('xml2js')
const groupBy = require('lodash.groupby')

module.exports = {
  waves: async () => {
    const wavesResponse = await axios.get('https://www.swellinfo.com/data/timeline/wna_ny_rockaway.xml')
    return new Promise((res, rej) => {
      xml2js.parseString(wavesResponse.data, (err, result) => {
        if (err) rej(err)
        const mappedWavesData = groupBy(result.surfcond_xml.data.map(el => el.$), (dataPoint) => dataPoint.day_name)
        res(mappedWavesData)
      });
    });
  }
}
