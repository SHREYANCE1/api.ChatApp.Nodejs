const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const http = require('http')
const mongoose = require('mongoose')
const appConfig = require('./../config/appConfig')
const logger = require('./libs/loggerLib')
const routeLoggerMiddleware = require('./middlewares/routeLogger')
const globalErroMiddleware = require('./middlewares/appErrorHandler')
const requirejs = require('request')





app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(routeLoggerMiddleware.logIp)

app.use(express.static(path.join(__dirname,'client')))

const modelsPath = './../app/models'
const controllersPath = './app/controllers'
const libsPath = './app/libs'
const middlewaresPath = './app/middlewares'
const routesPath = './../app/routes'


app.all('*',function (req, res, next) {
    res.header('Access-Control-Allow-Origin',appConfig.allowedCorsOrigin)
    res.header('Access-Control-Allow-Methods','POST, GET, PUT, DELETE')
    res.header('Access-Control-Allow-Headers',"X-Requested-With, Content-Type, Accept, Origin")
    
    next();
})

/*Bootstrap Models*/
fs.readdirSync(modelsPath).forEach(function (file) {
    if(~file.indexOf('.js')) require(modelsPath+'/'+file)
})/*End*/

/*Bootstrap Routes*/
fs.readdirSync(routesPath).forEach(function (file) {
    if(~file.indexOf('.js')){
        let route = require(routesPath+'/'+file)
        route.setRouter(app)
    } 

})/*End*/

/*Global 404 handler */
app.use(globalErroMiddleware.globalNotFoundHandler)
/*End*/



function onError(error) {
    if(error.syscall != 'listen'){
        logger.error(error.code+'not equal listen','serverOnError',10)
        throw error
    }

    //handle specific error
    switch(error.code){
        case 'EACCES':
            logger.error(error.code+'elevated priviliges required','serverOnError',10)
            process.exit(1)
            break
        case 'EADDRINUSE':
             logger.error(error.code+'address port already in use','serverOnError',10)
             process.exit(1)
             break
        default:
            logger.error(error.code+'some other error occured','serverOnError',10)
            throw error
    }
}//end onerror

function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    ('Listening on '+ bind)
    logger.info('server listening on port'+addr.port,'server onListening handler',10)
    let db = mongoose.connect(appConfig.db.uri,{
        useNewUrlParser: true,
        useCreateIndex: true  
      });
}

const server = http.createServer(app)
//start listening to http server
server.listen(appConfig.port)
server.on('error',onError)
server.on('listening',onListening)

//socket io connection 
const socketLib = require('./libs/socketLib')
socketLib.setServer(server)

process.on('unhandledRejection',(reason,p) => {
    console.log('Unhandled rejection at promise',p,'reason:',reason)
    //application specific logging, throwing an error 
})

//handling mongoose connection error
mongoose.connection.on('error',function(err){
    console.log('database connection error')
    console.log(err)
}); // end mnongoose connection error

//handling mongoose connection error
mongoose.connection.on('open',function(err){
    if(err){
        console.log("database error")
        console.log(err)
    } else {
        console.log("database connection open success")
    }
}); // end mongoose connection handler



module.exports = app
