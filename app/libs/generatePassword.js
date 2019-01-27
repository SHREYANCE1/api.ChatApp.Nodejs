'use srict'

const bcrypt = require('bcryptjs')
const saltRounds = 10

/*Custom library*/
let logger = require('./loggerLib')

let hashpassword = (myPlaintextPassoword) => {
    let salt = bcrypt.genSaltSync(saltRounds)
    let hash = bcrypt.hashSync(myPlaintextPassoword)
    return hash
}

let comparePassword = (oldPassword, hashpassword, cb) => {
    bcrypt.compare(oldPassword, hashpassword,(err,res) => {
        if (err) {
            logger.error(err.message,'Comparison Error',5)
            cb(err, null)
        } else {
            cb(null, res)
        }
    })
}

module.exports = {
    hashpassword: hashpassword,
    comparePassword: comparePassword
}