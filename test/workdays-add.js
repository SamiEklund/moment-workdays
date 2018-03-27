
const moment = require('moment')
const range = require('moment-range')
const { extendMoment } = require('../')

range.extendMoment(moment)

const thisWeeksDay = day => moment().startOf('week').day(day)
const nextWeeksDay = day => thisWeeksDay(day).add(1, 'weeks')
const fortnightsDay = day => thisWeeksDay(day).add(2, 'weeks')

describe('moment', () => {
  before(() => {
    extendMoment(moment)
  })

  describe('#add', () => {
    it('defines the "workdays" unit for the moment#add method', () => {
      moment().add(moment(), 'workdays')
    })

    it('adds the work days on the same workweek', () => {
      thisWeeksDay('Tuesday').add(3, 'workdays')
        .isSame(thisWeeksDay('Friday')).should.equal(true)
      thisWeeksDay('Tuesday').add(1, 'workdays')
        .isSame(thisWeeksDay('Wednesday')).should.equal(true)
      thisWeeksDay('Monday').add(4, 'workdays')
        .isSame(thisWeeksDay('Friday')).should.equal(true)
    })
    
    it('adds work days correctly on weekends', () => {
      thisWeeksDay('Sunday').add(1, 'workdays')
        .isSame(thisWeeksDay('Monday')).should.equal(true)
      thisWeeksDay('Monday').add(7, 'workdays')
        .isSame(nextWeeksDay('Wednesday')).should.equal(true)
      thisWeeksDay('Friday').add(3, 'workdays')
        .isSame(nextWeeksDay('Wednesday')).should.equal(true)
      thisWeeksDay('Monday').add(9, 'workdays')
        .isSame(nextWeeksDay('Friday')).should.equal(true)
    })

    it('adds the work days correctly with crossing weekends', () => {
      thisWeeksDay('Friday').add(7, 'workdays')
        .isSame(fortnightsDay('Tuesday')).should.equal(true)
      thisWeeksDay('Monday').add(14, 'workdays')
        .isSame(fortnightsDay('Friday')).should.equal(true)
      thisWeeksDay('Friday').add(6, 'workdays')
        .isSame(fortnightsDay('Monday')).should.equal(true)
    })

    it('adds negative work days', () => {
      
    })

    it('skips holidays when adding work days', () => {
      const holiday1 = moment.range(thisWeeksDay('Tuesday'), thisWeeksDay('Wednesday'))
      const holiday2 = moment.range(thisWeeksDay('Thursday'), thisWeeksDay('Friday'))
      thisWeeksDay('Monday').add(4, 'workdays', [ holiday1 ])
        .isSame(nextWeeksDay('Tuesday')).should.equal(true)
      thisWeeksDay('Monday').add(4, 'workdays', [ holiday2 ])
        .isSame(nextWeeksDay('Tuesday')).should.equal(true)
      thisWeeksDay('Monday').add(4, 'workdays', [ holiday1, holiday2 ])
        .isSame(nextWeeksDay('Thursday')).should.equal(true)
    })

    it('does not skip unimportant holidays', () => {
      const holiday = moment.range(thisWeeksDay('Saturday'), thisWeeksDay('Sunday'))
      thisWeeksDay('Monday').add(7, 'workdays', [ holiday ])
        .isSame(nextWeeksDay('Wednesday')).should.equal(true)
    })

    it('does not skip holidays outside of the range', () => {
      const holiday = moment.range(thisWeeksDay('Thursday'), thisWeeksDay('Friday'))
      thisWeeksDay('Monday').add(2, 'workdays', [ holiday ])
        .isSame(thisWeeksDay('Wednesday')).should.equal(true)
    })

    it('skips holidays that intersect the range', () => {
      const holiday1 = moment.range(thisWeeksDay('Thursday'), nextWeeksDay('Friday'))
      const holiday2 = moment.range(thisWeeksDay('Monday').subtract(1, 'weeks'), thisWeeksDay('Wednesday'))
      thisWeeksDay('Monday').add(5, 'workdays', [ holiday1 ])
        .isSame(fortnightsDay('Wednesday')).should.equal(true)
      thisWeeksDay('Monday').add(5, 'workdays', [ holiday2 ])
        .isSame(nextWeeksDay('Wednesday')).should.equal(true)
    })

    it('skips holidays that come in range after skipping other holidays', () => {
      const holiday1 = moment.range(thisWeeksDay('Thursday'), thisWeeksDay('Friday'))
      const holiday2 = moment.range(nextWeeksDay('Wednesday'), nextWeeksDay('Thursday'))
      thisWeeksDay('Monday').add(6, 'workdays', [ holiday1, holiday2 ])
        .isSame(fortnightsDay('Monday')).should.equal(true)
    })
  })
})
