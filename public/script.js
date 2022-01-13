const socket = io();

const chat = document.querySelector('#chat-window');
const output = document.querySelector('#output');
const userName = document.querySelector('#name');
const message = document.querySelector('#message');
const form = document.querySelector('#form');
const feedback = document.querySelector('#feedback');

// vill ha med vårt event objekt för att vi inte vill ladda om sidan
// när vi submitar häncer
form.addEventListener('submit' , e => {
    e.preventDefault();

    // skapar variabel.

    let name;
    userName.value.trim() !== '' ? name = userName.value : name = 'Unknown user';
    if(message.value.trim() !== '') {
        // precis som det emittas från vår server så emittas det från vår front end enligt nedan
        socket.emit('message', {
            // skickar iväg ett object i detta fall vår socket id för att se var det kommer ifrån
            id: socket.id,
            message: message.value,
            name
        })
    }
 message.value = '';
 message.focus(); 
} )

// i scripten vill vi lyssna efter event nedan, lyssnas med ett on när vi får ett message
// här konsolloggase meddelandet som vi skickar ifrån vår server
// sript.js är i vår  front end och server är index.js
// 14 min in i lektion 2 2 emittar ett event i vår server och konsolloggar det i vår front end och konsolloggar en payload

socket.on('message', data => {
    console.log(data);

    let pos;
    // om dom matchar kommer variablen innehålla en text som innehåller, positionen i chatten
    // om true är position right annars tomt
    // data.id === socket.id ? pos = 'right' : ''
     
// samma sak som ovan
    data.id === socket.id ? pos = 'right' : pos = ''


    output.innerHTML += `
            <div class="chat-box ${pos}">
                <p class="chat-name">${data.name}</p>
            <p class="chat-message">${data.message}</p>
            </div>
    `
    feedback.innerHTML = '';
    // denna ska göra så att det blir tomt men funkar inte
 

})

message.addEventListener('keypress', () => {
    socket.emit('typing', userName.value)
} )

// vill vi lyssna på broadcast från index. js

socket.on('typing', data => {
    feedback.innerHTML = `<p>${data} is typing a message...</p>`
})