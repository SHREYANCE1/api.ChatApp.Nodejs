console.log('in user1.js')
var socket = io.connect('http://localhost:3000');
console.log('socket')
//var authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ikt2T05XVWNvQiIsImlhdCI6MTU0ODMyODIzNjk3MCwiZXhwIjoxNTQ4NDE0NjM2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IjhnZE40MEtWdCIsImZpcnN0TmFtZSI6ImZpcnN0IiwibGFzdE5hbWUiOiJsYXN0IiwiZW1haWwiOiJzaHJleUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjg4NzM3ODQ1NCwiX192IjowfX0.LjfwhtsBgFwpIDEmMufv-htDb7duVN6Mz3BVYBAvVDo"
//var authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6ImZia2lTT1RSdiIsImlhdCI6MTU0ODMzNDgzMDc2MiwiZXhwIjoxNTQ4NDIxMjMwLCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IjhnZE40MEtWdCIsImZpcnN0TmFtZSI6ImZpcnN0IiwibGFzdE5hbWUiOiJsYXN0IiwiZW1haWwiOiJzaHJleUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjg4NzM3ODQ1NCwiX192IjowfX0.TZ0MVladr25-YSZr83yDYY3dUXXi_UDn6XotVihIYF8'
//var authToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InI3T1A5NXJJYSIsImlhdCI6MTU0ODMzNjc3NjI0MywiZXhwIjoxNTQ4NDIzMTc2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IjhnZE40MEtWdCIsImZpcnN0TmFtZSI6ImZpcnN0IiwibGFzdE5hbWUiOiJsYXN0IiwiZW1haWwiOiJzaHJleUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjg4NzM3ODQ1NCwiX192IjowfX0.wlD88rs5YJYMn1K9RgvP4O5hiesc7wPVghVdK-iHxIY'
//var authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ill3OUdLY3lnTyIsImlhdCI6MTU0ODM0NTg3NTEwNSwiZXhwIjoxNTQ4NDMyMjc1LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IjhnZE40MEtWdCIsImZpcnN0TmFtZSI6ImZpcnN0IiwibGFzdE5hbWUiOiJsYXN0IiwiZW1haWwiOiJzaHJleUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjg4NzM3ODQ1NCwiX192IjowfX0.CcxAep0HbJ6NmKPGFbhoKlWsJ1_MSPlP1L5G2mLloo0'
var authToken ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IjhoM3kyTkV4ZiIsImlhdCI6MTU0ODU4NTExNDMyNywiZXhwIjoxNTQ4NjcxNTE0LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IjhnZE40MEtWdCIsImZpcnN0TmFtZSI6ImZpcnN0IiwibGFzdE5hbWUiOiJsYXN0IiwiZW1haWwiOiJzaHJleUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjg4NzM3ODQ1NCwiX192IjowfX0.RaTY7l-nJbhwmA81ho0_QlwUgasIUQuE1wLUZSwhD_U'


var userId ="8gdN40KVt"

let chatMessage = {
    createdOn: Date.now(),
    receiverId: 'mGgSOeDFy', // user 2 id
    receiverName: 'ch j',
    senderId: userId,
    senderName: "first last"   
}

let chatSocket = () => {
    socket.on('Verify-user', (data) => {
        console.log('socket trying to verify user')
        socket.emit('set-user',authToken)
    })

    socket.on(userId, (data) => {
        console.log('you received a message from'+data.senderName)
        console.log(data.message)
    })

    socket.on('online-user-list', (data) => {
        console.log('online user list is updated, some user came online or went offline')
        console.log(data)
    })

    $('#send').on('click',function () {
        let messageText = $('#message').val()
        chatMessage.message = messageText
        socket.emit('chat-msg',chatMessage)
    })

    $('#message').on('keypress', function () {
        socket.emit('typing','ch j')
    })

    socket.on('typing', (data) => {
        console.log(data+ ' is typing')
    }) 
}

chatSocket()