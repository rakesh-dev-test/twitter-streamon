import React, { useEffect, useState } from 'react';
import { io as socketIOClient } from 'socket.io-client';

const SingleTweet = React.memo(({ tweet }) => {
    const {
        data: { text, created_at },
        includes: { users },
    } = tweet;
    return (
        <div className="column is-12 card" style={{ margin: '12px 0' }}>
            <div className="card-content">
                <p className="content">{text}</p>
                <div className="columns">
                    <span className="column subtitle">
                        @{users[0]?.username}
                    </span>
                    <span className="column subtitle">{created_at}</span>
                </div>
            </div>
        </div>
    );
});

const TweetStream = () => {
    const [tweets, setTweets] = useState([]);

    const [appState, setAppState] = useState({
        loading: true,
        error: false,
    });

    const streamTweets = () => {
        let socket;

        if (process.env.NODE_ENV === 'development') {
            socket = socketIOClient('http://localhost:3001/');
        } else {
            socket = socketIOClient('/');
        }

        socket.on('connected', () => {
            console.log('connected');
        });
        socket.on('tweet', (json) => {
            if (json.data) {
                setTweets((prevTweets) => {
                    prevTweets.unshift(json);
                    return prevTweets;
                });
            }
        });
        socket.on('error', (errData) => {
            console.error(errData);
        });
        socket.on('authError', (err) => {
            console.error(err);
        });

        // setTimeout(() => {
        //     socket.disconnect(0);
        // }, 3000);
    };

    useEffect(() => {
        setTimeout(() => {
            setAppState({ loading: false, error: false });
            streamTweets();
        }, 5000);
    }, []);

    if (appState?.loading) return <div>Loading ...</div>;

    return (
        <div>
            <div className="columns is-multiline">
                {tweets.map((tweet) => (
                    <>
                        <SingleTweet key={tweet.data.id} tweet={tweet} />
                        <br />
                    </>
                ))}
            </div>
        </div>
    );
};

export default TweetStream;
