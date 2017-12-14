
const moment = require('moment')
const { extendMoment } = require('../')

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
  })
})
