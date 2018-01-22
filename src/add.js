const moment = require('moment')
const { workDaysLeftInWeek, workDaysPassedInWeek, daysLeftInWeek, daysPassedInWeek } = require('./utils')
const { reduce } = require('lodash')

function workdaysToDays (date, workdays) {
  const daysLeft = daysLeftInWeek(date)

  const weekdays = Math.floor((workdays - daysLeft) / 5) * 7
  const leftover = (workdays - daysLeft) % 5

  return weekdays + leftover + daysLeft
}

export default function addWorkDays (workdays, holidays = []) {
  return this.add(workdaysToDays(this, workdays), 'days')
  /*
  for (let holiday of holidays) {
    const newRanges = []
    const newHoliday = holiday.clone()
    newHoliday.start.subtract(1, 'days')
    for (let range of ranges) {
      newRanges.push(...range.subtract(newHoliday))
    }
    ranges = newRanges
  }
  return reduce(ranges, (days, range) => days + diff(range), 0)      */
}
