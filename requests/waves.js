const axios = require('axios')
const xml2js = require('xml2js')
const groupBy = require('lodash.groupby')

module.exports = {
  waves: async (res) => {
    const wavesResponse = await axios.get('https://www.swellinfo.com/data/timeline/wna_ny_rockaway.xml')
    xml2js.parseString(wavesResponse.data, (err, result) => {
      if (err) { throw new Error(err) }
      const mappedWavesData = groupBy(result.surfcond_xml.data.map(el => el.$), (dataPoint) => dataPoint.day_name);
      res.json(mappedWavesData)
    });
  }
}
