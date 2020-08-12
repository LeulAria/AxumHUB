const moment = require('moment')

const formatChatMessage = (payload) => {
  return {
    user: payload.user.name,
    id: payload.user.id,
    avatar: payload.user.avatar,
    message: payload.message,
    date: moment().format('h:mm a')
  }
}

module.exports = formatChatMessage