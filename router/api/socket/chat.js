const server = require('../../../server')
const Chat = require('../../../models/ChatGroup')
const Uesr = require("../../../models/User")
const socket = require('socket.io')
const io = socket(server)

const formatChatMessage = require('./formatChatMessage')

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected...`)
  console.log('socket id: ', socket.id)

  socket.on('testX', (msg) => {
    console.log(msg)
    io.emit('server1', 'send this back')
  })


  socket.on('joinRoom', ({ username, userid, roomid }) => {
    console.log('the payload: -----------------', { username, userid, roomid })

    socket.join(roomid)

    // send if thier is saved chats
    Chat.findOne({ name: roomid })
      .then((chat) => {
        socket.emit('saved_chats', chat.chats)
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


  // // join a user to specific group
  // socket.on('joinGroupChat', ({ username, userid, roomid }) => {
  //   console.log('here the user to join------------------------------------------------------: ', username, userid, roomid)

  //   console.log(roomid)
  //   socket.join(roomid)
  //   // show user online

  //   io.to('staticRoom').emit('connected', 'wtf wtf wtf')

  //   socket.broadcast.to('staticRoom').emit('userJoinedOnline', userid)
  // })

  // socket.emit('connected', 'socket connection is enabled and i am sending this message')

  // socket.broadcast.emit('connected', 'user has joined chat room')



  // socket.on('userEvent', (msg) => {
  //   console.log(msg)
  // })

  // socket.on('disconnect', () => {
  //   io.emit('disconnected', 'user has leaved the chat')
  // })

})
