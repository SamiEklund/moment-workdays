
const should = require('chai').should()
const moment = require('moment')
const { workDaysLeftInWeek, workDaysPassedInWeek } = require('../src/utils')

describe('utils', () => {
  describe('#workDaysLeftInWeek', () => {
    it('calculates the number of work days left in a week', () => {
      const date = moment().startOf('week')
      for (let i = 0; i < 5; i++) {
        workDaysLeftInWeek(date).should.equal(5 - i)
        date.add(1, 'days')
      }
    })

    it('returns 0 if there are no work days left in a week', () => {
      workDaysLeftInWeek(moment().day('Friday')).should.equal(0)
      workDaysLeftInWeek(moment().day('Saturday')).should.equal(0)
    })
  })

  describe('#workDaysPassedInWeek', () => {
    it('calculates the number of work days passed in a week', () => {
      const date = moment().startOf('week')
      for (let i = 0; i < 5; i++) {
        workDaysPassedInWeek(date).should.equal(i)
        date.add(1, 'days')
      }
    })

    it('returns 5 if all work days have been passed in a week', () => {
      workDaysPassedInWeek(moment().day('Friday')).should.equal(5)
      workDaysPassedInWeek(moment().day('Saturday')).should.equal(5)
    })
  })
})
