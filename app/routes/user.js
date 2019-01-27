const express = require('express')
const router = express.Router()
const userController = require('./../controllers/userController')
const appConfig = require('./../../config/appConfig')
const auth = require('./../middlewares/auth')

module.exports.setRouter = (app) => {

    let baseUrl = `${appConfig.apiVersion}/users`

    app.get(`${baseUrl}/view/all`,auth.isAuthorized,userController.getAllUser)

    app.get(`${baseUrl}/:userId/details`,auth.isAuthorized,userController.getSingleUser)

    


    /* routes */
    // params: firstName, lastName, email, mobileNumber, password
    app.post(`${baseUrl}/signup`,userController.signUpFunction)
    /**
     *  @apiGroup users
     *  @apiVersion 1.0.0
     *  @api {post} /api/v1/users/signup api for user login
     *  
     *  @apiParam {string} firstName firstName of the user. (body params) (required)
     *  @apiParam {string} lastName lastName of the user. (body params) (required)
     *  @apiParam {string} email email of the user. (body params) (required)
     *  @apiParam {string} password password of the user. (body params) (required)
     *  @apiParam {number} mobileNumber mobileNumber of the user. (body params) (required)
     * 
     *  @apiSuccess {object} myResponse error status, message, http status code, data
     * 
     *  @apiSuccessExample {object} Success-Response:
     *  {
       "error": false,
        "message": "Sign-up Successful",
        "status": 200,
        "data": {
            "authToken": "string",
            "userDetails": {
                "mobileNumber": 2233445566,
                "email": "someone@email.com",
                "lastName": "SS",
                "firstName": "Shrey",
                "userID": "AHKnsjkKj"
            }
        }

        @apiErrorExample {json} Error-Response:
        *
        * {
        *   "error":true,
        *   "message": "Error Occured",
        *    "status": 500,
        *    "data": null   
        * }
     */

     //params:email, password

     app.post(`${baseUrl}/login`,userController.loginFunction)
     /**
     *  @apiGroup users
     *  @apiVersion 1.0.0
     *  @api {post} /api/v1/users/login api for user login
     *  
     *  @apiParam {string} email email of the user. (body params) (required)
     *  @apiParam {string} password password of the user. (body params) (required)
     * 
     *  @apiSuccess {object} myResponse error status, message, http status code, data
     * 
     *  @apiSuccessExample {object} Success-Response:
     *  {
       "error": false,
        "message": "Login Successful",
        "status": 200,
        "data": {
            "authToken": "string",
            "userDetails": {
                "mobileNumber": 2233445566,
                "email": "someone@email.com",
                "lastName": "SS",
                "firstName": "Shrey",
                "userID": "AHKnsjkKj"
            }
        }

        @apiErrorExample {json} Error-Response:
        *
        * {
        *   "error":true,
        *   "message": "Error Occured",
        *    "status": 500,
        *    "data": null   
        * }
     */
    
     //params:email, password

     app.post(`${baseUrl}/logout`,userController.logoutFunction)
     /**
     *  @apiGroup users
     *  @apiVersion 1.0.0
     *  @api {post} /api/v1/users/logout api for user login
     *  
     *  @apiParam {string} userId userId of the user. (auth headers) (required)
     * 
     *  @apiSuccess {object} myResponse error status, message, http status code, data
     * 
     *  @apiSuccessExample {object} Success-Response:
     *  {
       "error": false,
        "message": "Logged Out Successfully",
        "status": 200,
        "data": null
        }

        @apiErrorExample {json} Error-Response:
        *
        * {
        *   "error":true,
        *   "message": "Error Occured",
        *    "status": 500,
        *    "data": null   
        * }
     */
    app.put(`${baseUrl}/:userId/edit`,auth.isAuthorized,userController.editUser)

    app.post(`${baseUrl}/:userId/delete`,auth.isAuthorized,userController.deleteUser)
}