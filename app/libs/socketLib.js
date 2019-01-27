const socketio = require('socket.io')
const mongoose = require('mongoose')
const shortid = require('shortid')
const logger = require('./loggerLib')

const events = require('events')
const eventEmitter = new events.EventEmitter


const tokenLib = require('./tokenLib')
const check = require('./checkLib')
const response = require('./responseLib')

const ChatModel = mongoose.model('Chat')

let setServer = (server) => {
    
    let allOnlineUsers = []

    let io = socketio.listen(server)
    

    let myIo = io.of('')
    

    myIo.on('connection', (socket) => {
        console.log('on connection -- verify user')
        socket.emit('Verify-user','null')
        
        socket.on('set-user',(authToken) => {
            console.log('set user is called')
            tokenLib.verifyClaimWithoutSecretKey(authToken, (err,user) => {
                if(err){
                    socket.emit('auth-error',{status: 500, error: 'Please provide correct auth token'})
                } else {
                    console.log('user is verified ..setting details')
                    let currentUser = user.data
                    //setting socket user id
                    socket.userId = currentUser.userId
                    let fullName = `${currentUser.firstName} ${currentUser.lastName}`
                    console.log(`${fullName} is online`)
                    //myIo.emit(currentUser.userId,'you are online')

                    let userObj = {userId: currentUser.userId, fullName: fullName}
                    allOnlineUsers.push(userObj)
                    console.log(allOnlineUsers)

                    //setting room name
                    socket.room = 'GroupChat'
                    //joining chat-group room
                    socket.join(socket.room)
                    socket.to(socket.room).broadcast.emit('online-user-list',allOnlineUsers)
                }
            })
        })

        socket.on('disconnect', () => {
        //disconnect the user from the socket
        //remove the user from the online list
        //unssubscibe the user from his own channel
        console.log('user is disconnected')
        console.log(socket.userId)
        let removeIndex = allOnlineUsers.map(function (user) {return user.userId}).indexOf(socket.userId)
        allOnlineUsers.splice(removeIndex,1)
        console.log(allOnlineUsers)

        //leave the room on disconnect
        socket.to(socket.room).broadcast.emit('online-user-list',allOnlineUsers)
        socket.leave(socket.room)
        }) //end of disconnect

        socket.on('chat-msg', (data) => {
            console.log('socket chat-msg called')
            data['chatId'] = shortid.generate()
            console.log(data)
            console.log(data.receiverId)

            //event to save chat
            setTimeout( function (){
                eventEmitter.emit('save-chat',data)
            },2000)
            myIo.emit(data.receiverId,data)
        })

        socket.on('typing', (fullName) => {
            socket.to(socket.room).broadcast.emit('typing',fullName)
        });
    })
}

module.exports = {
    setServer: setServer
}

//database operations are kept outside socket io code
//saving the message

eventEmitter.on('save-chat',(data) => {
    let newChat = new ChatModel({
        chatId: data.chatId,
        senderName: data.senderName,
        senderId: data.senderId,
        receiverName: data.receiverName || '',
        receiverId: data.receiverId || '',
        message: data.message,
        chatRoom: data.chatRoom || '',
        createdOn: data.createdOn
    });

    newChat.save((err, result) => {
        if(err){
            console.log(`error occured: ${err.message}`)
        } if(result == undefined || result == null || result == ''){
            console.log('chat is not saved')
        } else {
            console.log('chat saved')
            console.log(result)
        }
    });
})