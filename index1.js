var express = require('express')
let app = express()

var events = require('events')

let eventEmitter = new events.EventEmitter()

eventEmitter.on('welcomeEmail',function(data){
    console.log('event is emitted now performing its funvtion')
    console.log(`send email to ${data.name} on address ${data.email}`)
})

app.get('/signup',function(req,res) {
    var user = {name: 'firstname', email: 'email@email.com'}
    setTimeout ( () => {
        eventEmitter.emit('welcomeEmail',user)
    },2000)
    
    console.log('just declared the emitter above , deliberaely delaying the emit for 2 secs it will execute after 2 sec function using set timeout')
    res.send('hello world')
})

app.listen(3000, function(){
    console.log('example app listening on port 3000')
})