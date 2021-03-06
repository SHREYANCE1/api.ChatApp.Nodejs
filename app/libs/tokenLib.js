const jwt = require('jsonwebtoken')
const shortid = require('shortid')
const secretKey = 'nodejsbackendchatapplication'

let generateToken = (data,cb) => {
    try{
        let claims = {
            jwtid: shortid.generate(),
            iat: Date.now(),
            exp: Math.floor(Date.now()/1000) + (60*60*24),
            sub: 'authToken',
            iss: 'edChat',
            data: data
        }
        let tokenDetails = {
            token: jwt.sign(claims, secretKey),
            tokenSecret: secretKey
        }
        cb(null, tokenDetails)
    } catch (err) {
        console.log(err)
        cb(err, null)
    }
}/* end generate token */

let verifyClaim = (token,secretKey,cb) => {
    //verify a token symmetric
    jwt.verify(token, secretKey, function (err, decoded) {
        if(err) {
            cb(err,null)
        }
        else {
            cb(null,decoded)
        }
    })
}/* end verifyClaim*/

let verifyClaimWithoutSecretKey = (token,cb) => {
    verifyClaim(token,secretKey,function (err,decoded) {
        if(err){
            cb(err,null)
        } else {
            cb(null,decoded)
        }
    })
}

module.exports = {
    generateToken: generateToken,
    verifyToken: verifyClaim,
    verifyClaimWithoutSecretKey: verifyClaimWithoutSecretKey
}