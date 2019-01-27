/* response sturcture for api */
let generate = (error, message, status, data) => {
    let apiResponse = {
        error: error,
        message: message,
        status: status,
        data: data
    }
    return apiResponse
}

/**
 * exporting functions
 */
module.exports = {
    generate: generate
}