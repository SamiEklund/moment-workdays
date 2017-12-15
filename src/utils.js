
exports.workDaysLeftInWeek = date => Math.max(5 - date.day(), 0)
exports.workDaysPassedInWeek = date => Math.min(date.day(), 5)
