// require your server and launch it
const server = require('./api/server')
const PORT = 5000

server.listen(PORT, () => {
    console.log('Listening on port ', PORT)
})