const textMessage = ( username , text) => {
    return{
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const locationMessage = (username,url) => {
    return{
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    textMessage,
    locationMessage
}