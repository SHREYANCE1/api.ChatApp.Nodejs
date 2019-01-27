const mongoose = require('mongoose')
const shortid = require('shortid')
const time = require('./../libs/timeLib')
const response = require('./../libs/responseLib')
const logger = require('./../libs/loggerLib')
const validateInput = require('./../libs/paramsValidation')
const check = require('./../libs/checkLib')
const passwordLib = require('./../libs/generatePassword')
const token = require('./../libs/tokenLib')

/*Models*/
const UserModel = mongoose.model('User')
const AuthModel = mongoose.model('Auth')

/*sign-up function */
let signUpFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {
            if (!(check.isEmpty(req.body.email)) && !(check.isEmpty(req.body.password))){
                if(false){
                    let apiResponse = response.generate(true, 'Email Format Invalid',400,null)
                    reject(apiResponse)
                } else if(false){
                    let apiResponse = response.generate(true, 'Password Format Invalid',400,null)
                    reject(apiResponse)
                } else {
                    resolve(req)
                }
            } else {
                logger.error('Field missing during user creation','userController: validateUserInput',5)
                let apiResponse = response.generate(true,'One or more Parameter(s) are missing',400,null)
                reject(apiResponse)
            }
        })
    }/*end validate user input*/

    let createUser = () => {
        return new Promise((resolve, request) => {
            UserModel.findOne({email: req.body.email})
                .exec((err, retrieverdUserDetails) => {
                    if (err) {
                        logger.error(err.message,'userController: createUser',10)
                        let apiResponse = response.generate(true,'failed to create user',400,null)
                        reject(apiResponse)
                    } else if (check.isEmpty(retrieverdUserDetails)) {
                        console.log(req.body)
                        let newUser = new UserModel({
                            userId: shortid.generate(),
                            firstName: req.body.firstName,
                            lastName: req.body.lastName || '',
                            email: req.body.email.toLowerCase(),
                            mobileNumber: req.body.mobileNumber,
                            password: passwordLib.hashpassword(req.body.password),
                            createdOn: time.now()
                        })
                        newUser.save((err, newUser) => {
                            if (err) {
                                logger.error(err.message,'userController: createUser',10)
                                let apiResponse = response.generate(true,'Failed to create user',400,null)
                                reject(apiResponse)
                            } else {
                                let newUserObj = newUser.toObject();
                                resolve(newUserObj)
                            }
                        })
                    } else {
                        logger.error('User already exists','userController: createUser',10)
                        let apiResponse = response.generate(true,'User Already Exists',400,null)
                        reject(apiResponse)
                    }
                })
        })
    } /*end create user functon*/

    validateUserInput(req, res)
        .then(createUser)
            .then((resolve) => {
                delete resolve.password
                let apiResponse = response.generate(false,'New User Created',200,resolve)
                res.send(apiResponse)
            })
            .catch((err) => {
                console.log(err)
                res.send(err)
            })
}/*end user signup fucntion*/

/*login function*/
let loginFunction = (req, res) => {

    let findUser = () => {
        return new Promise((resolve, reject) => {
            if(req.body.email) {
                UserModel.findOne({email: req.body.email}, (err, userDetails) => {
                    if(err){
                        logger.error('Failed to retreive user','userController: loginFucntion',5)
                        let apiResponse = response.generate(true,'Failed to retreive user',500,null)
                        reject(apiResponse)
                    } else if (check.isEmpty(userDetails)) {
                        logger.error('No user found','userController: loginFucntion',5)
                        let apiResponse = response.generate(true,'No user found',500,null)
                        reject(apiResponse)
                    } else {
                        logger.info('User Found','User Controller: findUser',10)
                        resolve(userDetails)
                    }
                })
            } else {
                let apiResponse = response.generate(true,"Email parameter is missing",400,null)
                reject(apiResponse)
            }
        })
    } /*end find user*/

    let validatePassword = (retrieverdUserDetails) => {
        return new Promise((resolve, reject) => {
            passwordLib.comparePassword(req.body.password, retrieverdUserDetails.password, (err, isMatch) => {
            
                if(err){
                    logger.error(err.message,'userController: validatePassword()',10)
                    let apiResponse = response.generate(true,'Login Failed',500,null)
                    reject(apiResponse)
                } else if (isMatch) {
                    console.log('console.log')
                    let retrieverdUserDetailsObj = retrieverdUserDetails.toObject()
                    delete retrieverdUserDetailsObj.password
                    delete retrieverdUserDetailsObj._id
                    delete retrieverdUserDetailsObj._v
                    delete retrieverdUserDetailsObj.createdOn
                    delete retrieverdUserDetailsObj.modifiedOn
                    console.log('retreived user')
                    console.log(retrieverdUserDetailsObj)
                    resolve(retrieverdUserDetailsObj)
                } else {
                    logger.error('Login failed Invalid Password','userController: validatePassword()',10)
                    let apiResponse = response.generate(true,'Login Failed Invalid Password',404,null)
                    reject(apiResponse)
                }
            })
        })
    } /*end validate passoword*/

    let generateToken = (userDetails) => {
        console.log('userDetails')
        console.log(userDetails)
        return new Promise((resolve, reject) => {
            token.generateToken(userDetails, (err, tokenDetails) => {
                if (err) {
                    logger.error('Login failed generate token','userController: generateToken()',10)
                    let apiResponse = response.generate(true,'Failed To Generate Token',404,null)
                    reject(apiResponse)
                } else {
                    console.log('token generated')
                    tokenDetails.userId = userDetails.userId
                    tokenDetails.userDetails = userDetails
                    resolve(tokenDetails)
                }
            })
        })
    } /*end genrate token function*/

    let saveToken = (tokenDetails) => {
        console.log('save token')
        return new Promise( (resolve, reject) => {
            AuthModel.findOne({ userId: tokenDetails.userId}, (err, retrieverdTokenDetails) => {
                if(err) {
                    logger.error(err.message, 'UserController: saveToken',10)
                    let apiResponse = response.generate(true,'Failed to generate token',500,null)
                    reject(apiResponse)
                } else if (check.isEmpty(retrieverdTokenDetails)) {
                    let newAuthToken = new AuthModel({
                        userId: tokenDetails.userId,
                        authToken: tokenDetails.token,
                        tokenSecret: tokenDetails.tokenSecret,
                        tokenGenerationTime: time.now()
                    })
                    newAuthToken.save((err, newTokenDetails) => {
                        if(err){
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken',10)
                            let apiResponse = response.generate(true,'Failed to generate token',500,null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                } else {
                    retrieverdTokenDetails.authToken = tokenDetails.token,
                    retrieverdTokenDetails.tokenSecret = tokenDetails.tokenSecret,
                    retrieverdTokenDetails.tokenGenerationTime = time.now()
                    retrieverdTokenDetails.save((err, newTokenDetails) => {
                        if (err) {
                            console.log(err)
                            logger.error(err.message, 'userController: saveToken',10)
                            let apiResponse = response.generate(true,'Failed to generate token',500,null)
                            reject(apiResponse)
                        } else {
                            let responseBody = {
                                authToken: newTokenDetails.authToken,
                                userDetails: tokenDetails.userDetails
                            }
                            resolve(responseBody)
                        }
                    })
                }
            })
        })
    }

    findUser(req,res)
        .then(validatePassword)
        .then(generateToken)
        .then(saveToken)
        .then((resolve) => {
            let apiResponse = response.generate(false,'Login Successful',200,resolve)
            res.status(200)
            res.send(apiResponse)
        })
        .catch((err) => {
            res.status(err.status)
            res.send(err)
        })

}/*end of login function*/


/**
 Edit User function
 *  */
let editUser = (req,res) => {
    let options = req.body;
    console.log(options)
    UserModel.updateMany({'userId': req.params.userId},options). exec((err, result) => {
        if(err){
            logger.error(err.message, 'userController: editUser',10)
            let apiResponse = response.generate(true,'Error Occured cannot edit user',500,null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)){
            logger.error('No user found', 'userController: editUser',10)
            let apiResponse = response.generate(true,'No User found',404,null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false,'User Details Edited',200,result)
            res.send(apiResponse)
            }
       }) // end user model update

} // end edit user


let getAllUser = (req,res) => {
    UserModel.find()
        .lean()
        .exec((err, result) => {
            if(err){
                console.log(err)
                logger.error(err.message,'User Controller: getAllUser',10)
                let apiResponse = response.generate(true,'Error Occured Failed to find user details',500,null)
                res.send(apiResponse)
            } else if (check.isEmpty(result)){
                logger.error(err.message,'User Controller: getAllUser',10)
                let apiResponse = response.generate(true,'No User Found',404,null)
                res.send(apiResponse)
            } else {
                logger.info('All User Details Found','User Controller: getAllUser',5)
                let apiResponse = response.generate(false,'All User Details Found',200,result)
                res.send(apiResponse)
            }
        })
} // end get all Users

//function to read a single user
let getSingleUser = (req, res) => {
    UserModel.findOne({'userId':req.params.userId})
    .select('-password -apikey -id')
    .lean()
    .exec((err, result) => {

        if(err){
            logger.error(err.message,'User Controller: getSingleUser',10)
            let apiResponse = response.generate(true,'Error Occured',500,null)
            res.send(apiResponse)
        } else if (check.isEmpty(result)){
            let apiResponse = response.generate(true,'No User Found',404,null)
                res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false,'All User Details Found',200,result)
                res.send(apiResponse)
        }
    })
}

///function to delete user
let deleteUser = (req,res) => {
    UserModel.findOneAndRemove({'userId':req.params.userId}).exec((err, result) => {

        if(err){
            logger.error(err.message,'User Controller: deleteUser',10)
            let apiResponse = response.generate(true,'Failed to delete user',500,null)
                res.send(apiResponse)
        } else if (check.isEmpty(result)){
            logger.error('No User Found','User Controller: deleteUser',10)
            let apiResponse = response.generate(true,'No User Found',404,null)
                res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false,'User Deleted Successfully',200,result)
                res.send(apiResponse)
            }
    }) // end user model find and remove

} // end delete user

/*logout function*/
let logoutFunction = (req, res) => {
            AuthModel.findOneAndRemove({userid: req.user.userId}, (err, result) => {
                if(err){
                    logger.error(err.message,'userController: logout',10)
                    let apiResponse = response.generate(true,`error occured: ${err.message}`,500,null)
                    res.send(apiResponse)
                } else if (check.isEmpty(result)) {
                    let apiResponse = response.generate(true,'Invalid user id',404,null)
                    res.send(apiResponse)
                } else {
                    let apiResponse = response.generate(false,'Logged out successfully',200,null)
                    res.send(apiResponse)
                }
            })
}/*end*/

/** 
 * functions export
 */
module.exports = {
    signUpFunction: signUpFunction,
    loginFunction: loginFunction,
    logoutFunction: logoutFunction,
    deleteUser: deleteUser,
    editUser: editUser,
    getSingleUser: getSingleUser,
    getAllUser: getAllUser
}