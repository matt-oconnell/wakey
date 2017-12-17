const axios = require('axios')
const moment = require('moment')
moment.tz.setDefault('America/New_York')

function filterYogaClasses(classEvent) {
  return /Yoga/i.test(classEvent.className)
  && 
  ((moment().weekday() === 0 || moment().weekday === 6)
  || (moment(classEvent.timestamp).isSameOrAfter(moment().startOf('day').add(12, 'hours'))))
}

module.exports = {
  yoga: async () => {
    const today = moment().format('YYYY-MM-DD')
    const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD')
    const url = `https://nyhrc-schedules.64labs.com/calendars/events?clubNumbers=5102&startDate=${today}&endDate=${tomorrow}`
    const yogaResponse = await axios.get(url)
    return yogaResponse.data.filter(filterYogaClasses).map(classEvent => ({
      class: classEvent.className,
      time: classEvent.time,
      instructor: classEvent.instructorName
    }))
  }
}
