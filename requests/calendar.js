const Cronofy = require('cronofy')
const keys = require('./../.keys.js')
const moment = require('moment')

module.exports = {
  calendar: async () => {
    const client = new Cronofy({
      access_token: keys.calendar,
    })
    const options = {
      tzid: 'Etc/UTC',
      from: moment().format('YYYY-MM-DD'),
      to: moment().add(1, 'days').format('YYYY-MM-DD'),
      localized_times: true,
    }
    const response = await client.readEvents(options)
    const mappedEvents = mapEvents(response.events)
    console.log(mappedEvents);
    
    return mappedEvents
  }
}

function mapEvents(events) {
  return events.map(event => {
    return {
      name: event.summary,
      start: moment(event.start.time).format('hh:mm a'),
      end: moment(event.end.time).format('hh:mm a'),
    }
  })
}
