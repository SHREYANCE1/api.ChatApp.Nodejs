const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib')
/**
 * application level 404 handler
 */
let notFoundHandler = (req, res, next) => {
    logger.error('Resource Not Found','404',1)
    let apiResponse = response.generate(true,'Resource Not Found',404,null)
    res.status(404).send(apiResponse)
}
/**
 * exporting functions
 */
module.exports = {
    globalNotFoundHandler: notFoundHandler
}