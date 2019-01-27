const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Auth = mongoose.model('Auth')
const request = require('request')

const logger = require('./../libs/loggerLib')
const response = require('./../libs/responseLib')
const token = require('./../libs/tokenLib')
const check = require('./../libs/checkLib')

let isAuthorized = (req, res, next) => {

    if(req.params.authToken || req.query.authToken || req.header('authToken')){
        Auth.findOne({'authToken': req.query.authToken},(err, authDetails) => {
            if(err){
                logger.error(err.message,'Authorization middleware',10)
                let apiResponse = response.generate(true,'Failed To Authorise',500,null)
                res.send(apiResponse)
            } else if (check.isEmpty(authDetails)){
                logger.error('No Auth key','Authorization middleware',10)
                let apiResponse = response.generate(true,'Invalid or Expired Auth key',404,null)
                res.send(apiResponse)
            } else {
                token.verifyToken(authDetails.authToken, authDetails.tokenSecret, (err,decoded) => {
                    if (err){
                        logger.error(err.message,'Authorization middleware',10)
                        let apiResponse = response.generate(true,'Failed To Authorise',500,null)
                        res.send(apiResponse)
                    } else {
                        req.user = {userId: decoded.data.userId}
                        next()
                    }
                }) // end verify token
            }
        })
    } else {
        logger.error('Auth token is missing','Authorization middleware',5)
        let apiResponse = response.generate(true,'Auth token is missing in request',400,null)
        res.send(apiResponse)
    }
}

module.exports = {
    isAuthorized: isAuthorized
}