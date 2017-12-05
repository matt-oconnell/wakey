const Cronofy = require('cronofy')
const moment = require('moment-timezone')
moment.tz.setDefault('America/New_York')

module.exports = {
  calendar: async () => {
    let access_token
    access_token = process.env.CALENDAR_KEY
    const client = new Cronofy({
      access_token,
    })
    const options = {
      tzid: 'America/New_York',
      from: moment().format('YYYY-MM-DD'),
      to: moment().add(2, 'days').format('YYYY-MM-DD'),
      localized_times: true,
    }
    const response = await client.readEvents(options)
    return mapEvents(response.events)
  }
}

function mapEvents(events) {
  const mappedEvents = {
    today: {
      events: [],
    },
    tomorrow: {
      events: [],
    }
  }
  events.forEach(event => {
    const mappedEvent = {
      name: event.summary,
      start: moment(event.start.time).format('hh:mm a'),
      end: moment(event.end.time).format('hh:mm a'),
    }
    if (moment().isSame(event.start.time, 'd') && !/Stand/i.test(event.summary)) {
      mappedEvents.today.events.push(mappedEvent)
    }
    else {
      if (!/Stand/i.test(event.summary)) {
        mappedEvents.tomorrow.events.push(mappedEvent)
      }
    }
  })
  mappedEvents.today.isEmpty = !mappedEvents.today.events.length
  mappedEvents.tomorrow.isEmpty = !mappedEvents.tomorrow.events.length
  return mappedEvents
}
