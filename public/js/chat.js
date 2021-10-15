// This Are The Npm Modules That Are Needed To Make This App 
const socket = io();


// This Are the Element That Are Extracted From The Html File 
const Form = document.querySelector('#mess-type');
const formButton = document.querySelector('.btn');
const formInput = document.querySelector('.input-btn');
const locationButton = document.querySelector('.sendLocation');
const messageHidden = document.querySelector('#message-hidden');

// This Are The Templates That Are Used To Render Message, Time etc 
const messageTemplate = document.querySelector('#message-temp').innerHTML
const locationTemplate = document.querySelector('#location-temp').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-temp').innerHTML



// autoscroll 
const autoscroll = ()=>{
const newMessage = messageHidden.lastElementChild
console.log(newMessage);
const newMessStyle = getComputedStyle(newMessage)
const newMessMargin = parseInt(newMessStyle.marginBottom)
const newmessHeight = newMessage.offsetHeight + newMessMargin
console.log(newMessMargin);

const visibleHeight = messageHidden.offsetHeight

const containerHeight = messageHidden.scrollHeight

const scrollOfSet = messageHidden.scrollTop + visibleHeight

if(containerHeight - newmessHeight <= scrollOfSet){
    messageHidden.scrollTop = messageHidden.scrollHeight
}
}
// This Is Used To Parse The value 
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })


socket.on('message', (message) => {

    const html = Mustache.render(messageTemplate, {
        username: message.username, 
        message: message.text,
        createdAt: moment(message.createdAt).format(`h:mm a`)
    });
    messageHidden.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message);
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    messageHidden.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


socket.on('roomData' , ({room , users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
   document.querySelector('#sideBarss').innerHTML = html

})



Form.addEventListener('submit', (e) => {
    e.preventDefault();
    formButton.setAttribute('disabled', 'disabled')

    const message = formInput.value
    socket.emit('sendMessage', message, (error , ) => {
        formButton.removeAttribute('disabled', 'disabled');

        formInput.value = ''
        formInput.focus();

        if (error) {
            console.log('sry cant done');
        }
    })
})

locationButton.addEventListener('click', () => {
    navigator.geolocation.getCurrentPosition((position) => {
        if (!navigator.geolocation) {
            alert('sry your browser Doesnt support this')
        }

        let lan = position.coords.latitude;
        let lon = position.coords.longitude

        socket.emit('sendLocation', {
            lan,
            lon
        }, () => {
            console.log('location send');
        })
    });

})


socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})