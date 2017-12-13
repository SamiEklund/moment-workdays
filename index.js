
const { workDaysLeftInWeek, workDaysPassedInWeek } = require('./src/utils')

function workDayDiff(date) {
  const dateStart = date.clone().startOf('week')
  const thisStart = this.clone().startOf('week')
  const weekDiff = (dateStart.diff(thisStart, 'weeks') - 1)
  return (weekDiff * 5) + workDaysLeftInWeek(this) + workDaysPassedInWeek(date)
}

exports.extendMoment = moment => {
  const diff = moment.prototype.diff

  moment.prototype.diff = function (date, unit) {
    if (unit === 'workdays') {
      return workDayDiff.call(this, date)
    }
    return diff.call(this, ...arguments)
  }
}
