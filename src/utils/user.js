const users = []

// adding a new user 
const addUser = ({ id, username, room }) => {
    // cleaning the data 
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validating the data 
    if (!room || !username) {
        return {
            error: 'Username And Room Are required '
        }
    }

    // checking for existing user 
    const existingUser = users.find((user) => {
        return user.room === room & user.username === username
    })

    if (existingUser) {
        return {
            error: 'The Username Already exists'
        }
    }

    // storing the user 
    const user = { id, username, room }
    users.push(user)
    return { user }


}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1 )[0]
    }
}


const getUser = (id)=>{
    return users.find((user) => user.id === id)
}



const getUserInRoom = (room)=>{
    room = room.trim().toLowerCase()
return users.filter((user) => user.room === room)
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}
// removing the user


// getting user that is already their 


// getting user that is into a particular room 