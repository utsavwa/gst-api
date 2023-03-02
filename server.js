const http = require('http');
const App = require('./App.js');

const server = http.createServer(App);

server.listen(process.env.PORT, console.log(`Server started on port: ${process.env.PORT}`));    