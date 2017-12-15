
const moment = require('moment')
const { extendMoment } = require('moment-range')
const { workDaysLeftInWeek, workDaysPassedInWeek } = require('./src/utils')
const { reduce } = require('lodash')

extendMoment(moment)

function diff (range) {
  const startWeek = range.start.clone().startOf('week')
  const endWeek = range.end.clone().startOf('week')
  const weekDiff = endWeek.diff(startWeek, 'weeks') - 1
  return (weekDiff * 5) +
    workDaysLeftInWeek(range.start) + workDaysPassedInWeek(range.end)
}

function workDayDiff (end, holidays = []) {
  let ranges = [ moment.range(this, end) ]
  for (let holiday of holidays) {
    const newRanges = []
    const newHoliday = holiday.clone()
    newHoliday.start.subtract(1, 'days')
    for (let range of ranges) {
      newRanges.push(...range.subtract(newHoliday))
    }
    ranges = newRanges
  }
  return reduce(ranges, (days, range) => days + diff(range), 0)
}

exports.extendMoment = moment => {
  const diff = moment.prototype.diff

  moment.prototype.diff = function (date, unit, holidays) {
    if (unit === 'workdays') {
      return workDayDiff.call(this, date, holidays)
    }
    return diff.call(this, ...arguments)
  }
}
