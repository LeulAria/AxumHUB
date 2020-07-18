const server = require('../../../server')
const socket = require('socket.io')
const io = socket(server)

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected...`)
})