const express = require('express');
// för att använda sockets behöver vi också http modulen
const http = require('http');
const path = require('path');
const socket = require('socket.io');

const app = express();
// kastar in vår express i http server
const server = http.createServer(app);

// när sidan är stylad använd en middleware för att få in den med en absoulut sökväg
// nedan kopplar ihop

app.use(express.static(path.join(__dirname, 'public')));

// lägger in en local host port nedan så läng, förhoppningen är att kanske undersökar hur det funkar och ändra
// använda docker?
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('server running on http://localhost:' + PORT);
})

// skapar en variabel io socket io som kommer vara lika med socket för att sen stoppa in vår server för att kunna lyssna efter events
// lyssna till events och emitta

const io = socket(server);

// skapar en eventlistener med ett connection events
// när någon connectar till vår socket kommer det att finnas info i vår socket.

io.on('connection', socket => {
    console.log('New user connected', socket.id);
    // När vi har fått ett connection vill vi göra allting som är här innanför.
    // specifiera vad vi vill göra

    // när vi connectar vill vi emitta och vi vill använda oss av socket emit event

    // socket.emit('message', 'welcome to the John man');
    // när någon connectar emittas ett meddelande välkommen till chatten som vi sen konsollogga

    // nedan lyssnar vi efter message

    socket.on('message', data => {
        console.log(data);
        // nu vill vi skicka till alla sockets och skicka vidare till vår front end
        io.sockets.emit('message', data);
    })

    // broadcast skickar till alla andra sockets förutom sin egen
    // alltså skickar upp till servern och vidare till alla andra förutom sin självt
    socket.on('typing', data => {
        socket.broadcast.emit('typing', data)

    })

})