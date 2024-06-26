const http = require('http');
const app = require('./app');

app.set('port', process.env.PORT || 3001);
const server = http.createServer(app);

server.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}`);
});