const axios = require('axios')
const xml2js = require('xml2js')
const groupBy = require('lodash.groupby')

module.exports = {
  waves: async () => {
    const times = ['6am', '9am', '12pm', '3pm', '6pm']
    const wavesResponse = await axios.get('https://www.swellinfo.com/data/timeline/wna_ny_rockaway.xml')
    return new Promise((res, rej) => {
      xml2js.parseString(wavesResponse.data, (err, result) => {
        if (err) rej(err)
        const mappedWavesData = groupBy(result.surfcond_xml.data.map(el => el.$), (dataPoint) => dataPoint.day_name)
        const returnData = Object.entries(mappedWavesData)
          .map(([day, data]) => { return { day, data } })
          .map(dayInfo => {
            const targetDay = dayInfo.data[0].day;
            return {
              ...dayInfo,
              data: dayInfo.data.filter(day => times.includes(day.hour) && day.day === targetDay).map(day => {
                return {
                  ...day,
                  windDirection: day.wind.trim().split(' ')[0],
                  swellDirection: day.swell1.trim().split(' ')[0],
                  swellStat: day.swell1.trim().split(' ').slice(1).join(' '),
                  hasSize: +day.swell1.trim().split(' ').slice(1)[1] >= 3.5,
                }
              })
            }
          });
        res(returnData)
      });
    });
  }
}
