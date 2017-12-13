
exports.workDaysLeftInWeek = (date) => {
  return Math.max(5 - date.day(), 0)
}

exports.workDaysPassedInWeek = (date) => {
  return Math.min(date.day(), 5)
}
