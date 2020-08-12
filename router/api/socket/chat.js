const server = require('../../../server')
const Chat = require('../../../models/ChatGroup')
const Uesr = require("../../../models/User")
const socket = require('socket.io')
const io = socket(server)

const formatChatMessage = require('./formatChatMessage')

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected...`)
  console.log('socket id: ', socket.id)

  socket.on('joinRoom', ({ username, userid, roomid }) => {
    console.log('the payload: -----------------', { username, userid, roomid })

    socket.join(roomid)

    // send if thier is saved chats
    Chat.findOne({ name: roomid })
      .then((chat) => {
        console.log('the chat looks like', chat)
        if (chat.chats)
          socket.emit('saved_chats', chat.chats)
        else
          socket.emit('saved_chats', [])
      })
      .catch((err) => {
        console.log(err)
      })
  })

  // Send chat to chat board and save to database
  socket.on("sendChat", (chatPayload) => {
    const chatMsg = formatChatMessage(chatPayload);

    console.log('socket rooms: ', socket.rooms)
    // save chat msg to db
    Chat.findOne({ name: chatPayload.roomid })
      .then((chat) => {
        chat.chats.push(chatMsg)
        chat.save()
      })
      .catch(err => {
        console.log(err)
      })

    io.to(chatPayload.roomid).emit('showChat', chatMsg)
  })


  // socket.on('disconnect', () => {
  //   io.emit('disconnected', 'user has leaved the chat')
  // })

})
