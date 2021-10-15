// The Npm Modules That Are Needed To Create This App 
const express = require('express');
const socket = require('socket.io')
const path = require('path');
const http = require('http');
const Filter = require('bad-words')
const { textMessage } = require('./utils/mess')
const { locationMessage } = require('./utils/mess')
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/user');
const { text } = require('express');
const { emit } = require('process');
// This Are The Things That Are Needed To Place The Server On The Web 
const app = express();
const server = http.createServer(app);
const io = socket(server)

const port = process.env.PORT || 3000
const publicDirectory = path.join(__dirname, '../public')

app.use(express.static(publicDirectory))


io.on('connection', (socket) => {
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })
        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message', textMessage('Admin', 'welcome everyone'));
        socket.broadcast.to(user.room).emit('message', textMessage('Admin', ` ${user.username} Just Joint The Group`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        })
        callback()
    })


    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('bad words are not allowed')
        }

        io.to(user.room).emit('message', textMessage(user.username, message));
        callback()
    })


    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', locationMessage(user.username, `http://google.com/maps?q=${location.lan},${location.lon}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', textMessage('Admin', ` ${user.username} has just left the room`))
            io.to('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)

            })
        }
    })
})



server.listen(port, () => {
    console.log('server is on port :-', port);
})