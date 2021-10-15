const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const request = require('request');
const path = require('path');
const proxy = require('./proxy');
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(proxy);

const server = http.createServer(app);
const io = socketio(server, { cors: { origin: 'localhost:3000' } });

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

const streamURL = new URL(
    'https://api.twitter.com/2/tweets/sample/stream?tweet.fields=created_at&expansions=author_id&user.fields=created_at'
);

const defaultMsg = {
    title: 'Loading ...',
};
const authMsg = {
    title: 'Could not authenticate',
};

let sleepTimeout = 0;

const sleep = async (delay) => {
    return new Promise((resolve) => setTimeout(() => resolve(true), delay));
};

const reconnect = async (stream, socket) => {
    sleepTimeout++;
    stream.abort();
    await sleep(2 ** sleepTimeout * 1000);
    streamTweets(socket);
};

const streamConnectionTimeout = 30000;
const streamTweets = (socket) => {
    const config = {
        url: streamURL,
        auth: { bearer: TWITTER_BEARER_TOKEN },
        streamConnectionTimeout,
    };

    try {
        const stream = request.get(config);

        stream
            .on('data', (data) => {
                try {
                    const json = JSON.parse(data);
                    if (json.connection_issue) {
                        socket.emit('error', json);
                    } else {
                        if (json.data) {
                            socket.emit('tweet', json);
                        } else {
                            socket.emit('authError', json);
                        }
                    }
                } catch (e) {
                    socket.emit('streamError');
                }
            })
            .on('error', (err) => {
                socket.emit('error', err);
                reconnect(stream, socket);
            });
    } catch (err) {
        socket.emit('authError', err);
    }
};

io.on('connection', async (socket) => {
    try {
        io.emit('connected', 'Client Connected');
        streamTweets(io);
    } catch (e) {
        console.log(e);
        io.emit('authError', authMsg);
    }
});

console.log('NODE_ENV', process.env.NODE_ENV);
console.log('NODE_ENV', process.env.TWITTER_BEARER_TOKEN);

let port = 3001;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));
    app.get('*', (req, res) =>
        res.sendFile(path.join(__dirname, '../build', 'index.html'))
    );
}

server.listen(port, () => console.log(`Listening on PORT: ${port}`));