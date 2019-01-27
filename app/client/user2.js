console.log('in user2.js')
var socket = io.connect('http://localhost:3000');
console.log('socket')
//var authToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Ikt2T05XVWNvQiIsImlhdCI6MTU0ODMyODIzNjk3MCwiZXhwIjoxNTQ4NDE0NjM2LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6IjhnZE40MEtWdCIsImZpcnN0TmFtZSI6ImZpcnN0IiwibGFzdE5hbWUiOiJsYXN0IiwiZW1haWwiOiJzaHJleUBnbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjg4NzM3ODQ1NCwiX192IjowfX0.LjfwhtsBgFwpIDEmMufv-htDb7duVN6Mz3BVYBAvVDo"
//var authToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6InpXUHF3TlhSZSIsImlhdCI6MTU0ODMzNjY0NzI2MSwiZXhwIjoxNTQ4NDIzMDQ3LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6Im1HZ1NPZURGeSIsImZpcnN0TmFtZSI6ImNoIiwibGFzdE5hbWUiOiJqIiwiZW1haWwiOiJjakBlbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjAsIl9fdiI6MH19.u7pWgJKerVB9MqQOcX48aj8FVucvRZx1cQR7IiPIg0w' // nre user auth token
//var authToken='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6Inp3Z1pFQ0NTcCIsImlhdCI6MTU0ODM0NTg4NTc4MSwiZXhwIjoxNTQ4NDMyMjg1LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6Im1HZ1NPZURGeSIsImZpcnN0TmFtZSI6ImNoIiwibGFzdE5hbWUiOiJqIiwiZW1haWwiOiJjakBlbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjAsIl9fdiI6MH19.TdXW-InYLd4KtFNSXZbgswjEPguc90PBXvHLsR3k3_A'
var authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6ImZJVXA2MVR1UCIsImlhdCI6MTU0ODU4NTQxODU5MCwiZXhwIjoxNTQ4NjcxODE4LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJlZENoYXQiLCJkYXRhIjp7InVzZXJJZCI6Im1HZ1NPZURGeSIsImZpcnN0TmFtZSI6ImNoIiwibGFzdE5hbWUiOiJqIiwiZW1haWwiOiJjakBlbWFpbC5jb20iLCJtb2JpbGVOdW1iZXIiOjAsIl9fdiI6MH19.jJhe7TadzoktiGkvpSykOlw0ONSo2uOoVAy443LIfug'
var userId ="mGgSOeDFy" //his id

let chatMessage = {
    createdOn: Date.now(),
    receiverId: '8gdN40KVt', // user 2 id
    receiverName: 'first last',
    senderId: userId,
    senderName: "ch j"   
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