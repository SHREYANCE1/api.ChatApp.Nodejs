const moment = require('moment')
const momentzz = require('moment-timezone')
const timeZone = 'Asia/Calcutta'
let now = () => {
    return moment.utc().format()
}

let getLocalTime = () => {
    return moment.tz(timeZone).format()
}

let convertToLocalTime = (time) => {
    return momentzz.tz(time, timeZone).format('LLLL')
}

/**
 * exporting functions
 */
module.exports = {
    now: now,
    getLocalTime: getLocalTime,
    convertToLocalTime: convertToLocalTime
}