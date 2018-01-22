
exports.workDaysLeftInWeek = date => Math.max(5 - date.day(), 0)
exports.workDaysPassedInWeek = date => Math.min(date.day(), 5)
exports.daysLeftInWeek = date => Math.max(7 - date.day(), 0)
