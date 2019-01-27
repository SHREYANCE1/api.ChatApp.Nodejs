'use strict'
const logger = require('pino')()
const moment = require('moment')

/** to log the errors
 * parameters are three error message , error origin , severity level
 */
let captureError = (errorMessage, errorOrigin, severity) => {
    let currentTime = moment().format('LLLL')

    let errorResponse = {
        timestamp: currentTime,
        errorMessage: errorMessage,
        errorOrigin: errorOrigin,
        errorSeverity: severity
    }

    logger.error(errorResponse)
    return errorResponse
} // end captureError

/** to log the api success
 * parameters are three message ,origin , severity level
 */
let captureInfo = (message, origin, priority) => {
    let currentTime = moment().format('LLLL')

    let infoMessage = {
        timestamp: currentTime,
        message: message,
        origin: origin,
        priority: priority
    }

    logger.info(infoMessage)
    return infoMessage
}

/**
 * exporting functions
 */
module.exports = {
    error: captureError,
    info: captureInfo
}