
const moment = require('moment')
const { extendMoment } = require('moment-range')
const { workDaysLeftInWeek, workDaysPassedInWeek, daysLeftInWeek } = require('./src/utils')
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

function workdaysAsDays (date, workdays) {
  let days = workdays

  // Remove the first weeks workdays from days
  days -= workDaysLeftInWeek(date)

  // If days are negative, amount added is within the current workweek
  if (days <= 0) return workdays

  // Calculate how many work weeks can fit in workdays
  const workWeeks = Math.floor(days / 5)
  // Calculate workdays left in the last week
  let leftoverDays = days % 5

  // If there are no leftover days, remove the weekend from the last full week
  if (leftoverDays === 0) leftoverDays -= 2

  return workWeeks * 7 + leftoverDays + daysLeftInWeek(date)
}

function addWorkDays (workdays, holidays = []) {
  let end = this.clone().add(workdaysAsDays(this, workdays), 'days')
  let range = moment.range(this, end)
  let newHolidays
  let holidayAdditons

  do {
    holidayAdditons = 0
    if (newHolidays) holidays = [ ...newHolidays ]
    newHolidays = []

    for (let holiday of holidays) {
      if (!holiday) continue
      const newHoliday = holiday.clone()
      newHoliday.start.subtract(1, 'days')

      const intersectingRange = range.intersect(newHoliday)
      if (!intersectingRange) {
        newHoliday.start.add(1, 'days')
        newHolidays.push(newHoliday)
        continue
      }

      const a1 = newHoliday.subtract(intersectingRange)
      if (a1.length > 0) {
        for (let i = 0; i < a1.length; i++) {
          a1[i].start.add(1, 'days')
        }

        newHolidays = [...newHolidays, ...a1]
      }

      holidayAdditons += diff(intersectingRange)
    }

    if (holidayAdditons > 0) {
      end = end.add(workdaysAsDays(end, holidayAdditons), 'days')
      range = moment.range(this, end)
    }
  } while (holidayAdditons > 0)

  return end
}

exports.extendMoment = moment => {
  const diff = moment.prototype.diff

  moment.prototype.diff = function (date, unit, holidays) {
    if (unit === 'workdays') {
      return workDayDiff.call(this, date, holidays)
    }
    return diff.call(this, ...arguments)
  }

  const add = moment.prototype.add

  moment.prototype.add = function (amount, unit, holidays) {
    if (unit && unit.toLowerCase() === 'workdays') {
      return addWorkDays.call(this, amount, holidays)
    }
    return add.call(this, ...arguments)
  }
}
