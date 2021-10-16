const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const request = require('request');
const path = require('path');
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/trending', async (_, res) => {
    const config = {
        auth: { bearer: TWITTER_BEARER_TOKEN },
    };
    request.get(placeTrendsURL, config, (err, response, body) => {
        if (!err && response.statusCode === 200) {
            res.status(200).send(JSON.parse(body));
        } else {
            res.status(response.statusCode).send(err);
        }
    });
});

const server = http.createServer(app);
const io = socketio(server, { cors: { origin: 'localhost:3000' } });

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;

const streamURL = new URL(
    'https://api.twitter.com/2/tweets/sample/stream?tweet.fields=created_at&expansions=author_id&user.fields=created_at',
);
const placeTrendsURL = new URL(
    'https://api.twitter.com/1.1/trends/place.json?id=20070458',
);

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

let port = 3001;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../build')));
    app.get('*', (_, res) =>
        res.sendFile(path.join(__dirname, '../build', 'index.html')),
    );
}

server.listen(port, () => console.log(`Listening on PORT: ${port}`));
