const server = require('../../../server')
const Chat = require('../../../models/ChatGroup')
const Uesr = require("../../../models/User")
const socket = require('socket.io')
const io = socket(server)

const formatChatMessage = require('./formatChatMessage')

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected...`)

  // myFirstEmit Event

  socket.emit('connected', 'socket connection is enabled and i am sending this message')

  socket.broadcast.emit('connected', 'user has joined chat room')

  socket.on("sendChat", (chatPayload) => {
    // save to chat   user Id, projectName or ChatId, push to chats: [{  }]
    // Chat.findById()

    io.emit('getChatMsg', formatChatMessage(chatPayload))
  })

  socket.on('userEvent', (msg) => {
    console.log(msg)
  })

  socket.on('disconnect', () => {
    io.emit('disconnected', 'user has leaved the chat')
  })

})
