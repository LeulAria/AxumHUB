const server = require('../../../server')
const Chat = require('../../../models/ChatGroup')
const socket = require('socket.io')
const io = socket(server)

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected...`)

  // myFirstEmit Event
  socket.emit('myFirstEmit', 'this is my frist emit when connected to the server')

  socket.emit('test', 'socket connection is enabled and i am sending this message')

  socket.broadcast.emit('test', 'user has joined chat room')

  socket.on("sendChat", (msg) => {
    io.emit('test', msg)
    console.log('usermsg: ', msg)
  })

  socket.on('userEvent', (msg) => {
    console.log(msg)
  })

  socket.on('disconnect', () => {
    io.emit('disconnected', 'user has leaved the chat')
  })

})
