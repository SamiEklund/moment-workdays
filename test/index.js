
const moment = require('moment')
const range = require('moment-range')
const { extendMoment } = require('../')

range.extendMoment(moment)

describe('moment', () => {
  before(() => {
    extendMoment(moment)
  })

  describe('#diff', () => {
    it('defines the "workdays" unit for the moment#diff method', () => {
      moment().diff(moment(), 'workdays')
    })

    it('calculates the work days between two dates on the same week', () => {
      moment().day('Tuesday').diff(
        moment().day('Friday'), 'workdays').should.equal(3)
      moment().day('Tuesday').diff(
        moment().day('Wednesday'), 'workdays').should.equal(1)
      moment().day('Monday').diff(
        moment().day('Friday'), 'workdays').should.equal(4)
    })
    
    it('calculates the work days correctly on weekends', () => {
      moment().day('Sunday').diff(
        moment().day('Monday'), 'workdays').should.equal(1)
      moment().day('Saturday').subtract(7, 'days').diff(
        moment().day('Monday'), 'workdays').should.equal(1)
    })

    it('calculates the work days between two dates crossing weekends', () => {
      moment().day('Tuesday').diff(
        moment().day('Friday').add(7, 'days'), 'workdays').should.equal(8)
      moment().day('Friday').diff(
        moment().day('Monday').add(14, 'days'), 'workdays').should.equal(6)
      moment().day('Monday').diff(
        moment().day('Friday').add(14, 'days'), 'workdays').should.equal(14)
    })

    it('calculates negative work days remaining', () => {
      moment().day('Friday').diff(moment().day('Tuesday'),
        'workdays').should.equal(-3)
      moment().day('Friday').diff(moment().day('Tuesday').subtract(7, 'days'),
        'workdays').should.equal(-8)
      moment().day('Monday').diff(moment().day('Friday').subtract(14, 'days'),
        'workdays').should.equal(-6)
      moment().day('Friday').diff(moment().day('Monday').subtract(14, 'days'),
        'workdays').should.equal(-14)
    })

    it('removes holidays from the resulting work days', () => {
      const holiday1 = moment.range(moment().day('Tuesday'),
        moment().day('Wednesday'))
      const holiday2 = moment.range(moment().day('Thursday'),
        moment().day('Friday'))
      moment().day('Monday').diff(moment().day('Friday'),
        'workdays', [ holiday1 ]).should.equal(2)
      moment().day('Monday').diff(moment().day('Friday'),
        'workdays', [ holiday2 ]).should.equal(2)
      moment().day('Monday').diff(moment().day('Friday'),
        'workdays', [ holiday1, holiday2 ]).should.equal(0)
    })

    it('does not remove unimportant holidays', () => {
      const holiday = moment.range(moment().day('Saturday').subtract(7, 'days'),
        moment().day('Sunday'))
      moment().day('Monday').diff(moment().day('Friday').add(7, 'days'),
        'workdays', [ holiday ]).should.equal(9)
    })

    it('does not remove holidays outside of the range', () => {
      const holiday = moment.range(moment().day('Thursday'),
        moment().day('Friday'))
      moment().day('Monday').diff(moment().day('Wednesday'),
        'workdays', [ holiday ]).should.equal(2)
    })

    it('removes holidays that intersect the range', () => {
      const holiday1 = moment.range(moment().day('Thursday'),
        moment().day('Friday').add(7, 'days'))
      const holiday2 = moment.range(moment().day('Monday').subtract(7, 'days'),
        moment().day('Wednesday'))
      moment().day('Monday').diff(moment().day('Tuesday').add(7, 'days'),
        'workdays', [ holiday1 ]).should.equal(2)
      moment().day('Monday').diff(moment().day('Tuesday').add(7, 'days'),
        'workdays', [ holiday2 ]).should.equal(4)
    })
  })
})
