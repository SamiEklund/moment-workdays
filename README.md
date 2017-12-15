# moment-workdays
[![Build Status](https://travis-ci.org/jarondh/moment-workdays.svg?branch=master)](https://travis-ci.org/jarondh/moment-workdays)
[![Maintainability](https://api.codeclimate.com/v1/badges/d6c9beb9d58ccad35a9f/maintainability)](https://codeclimate.com/github/jarondh/moment-workdays/maintainability)

A moment plugin for working with Monday through Friday schedules.
Extends a `moment` instance's `diff` method to include the computation of workdays between any two dates.
```js
const start = moment().day('Tuesday')
const end = moment().day('Friday')

start.diff(end, 'workdays')
// 3
```

## Usage
Install using npm
```sh
$ npm install --save moment-workdays
```

Import and run the extension function
```js
const moment = require('moment')
const { extendMoment } = require('moment-workdays')

extendMoment(moment)
```

## Examples
Handles crossing weekends correctly
```js
const start = moment().day('Tuesday')
const end = moment().day('Friday').add(7, 'days')

start.diff(end, 'workdays')
// 8
```

Also handles things that are overdue
```js
const start = moment().day('Friday')
const end = moment().day('Tuesday').subtract(7, 'days')

start.diff(end, 'workdays')
// -8
```

## Holidays
`moment-workdays` adds support for an additional, optional array of holiday ranges.
The holidays should each be an instance of [moment-range](https://www.npmjs.com/package/moment-range).
For example
```js
const holiday = moment.range('2017-12-10', '2017-12-30')
const start = moment('2017-12-05')
const end = moment('2017-01-04')

start.diff(end, 'workdays', [ holiday ])
// 7
```
