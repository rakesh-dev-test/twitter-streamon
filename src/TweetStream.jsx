import React, { useEffect, useRef, useState } from 'react';
import { io as socketIOClient } from 'socket.io-client';
import SingleTweet from './SingleTweet';

const TweetStream = () => {
    const [tweets, setTweets] = useState([]);
    const [streamState, setStreamState] = useState({
        active: false,
        error: false,
    });
    let socket = useRef(null);

    const InitiateSocket = () => {
        if (process.env.NODE_ENV === 'development') {
            socket.current = socketIOClient('http://localhost:3001/');
        } else {
            socket.current = socketIOClient('/');
        }
    };
    useEffect(() => {
        InitiateSocket();
    }, []);

    const streamTweets = (socket) => {
        socket.on('connect', () => {
            console.log('connected');
            setStreamState({ active: true, error: false });
        });
        socket.on('tweet', (json) => {
            if (json.data) {
                setTweets((prevTweets) => {
                    prevTweets.unshift(json);
                    return [...prevTweets];
                });
            }
        });
        socket.on('error', (errData) => {
            console.error(errData);
        });
        socket.on('authError', (err) => {
            console.error(err);
        });

        return socket;
    };
    useEffect(() => {
        if (streamState.active) {
            InitiateSocket();
            streamTweets(socket.current);
        } else {
            socket.current.disconnect();
        }
        return () => {
            if (streamState.active) socket.current.disconnect();
        };
    }, [streamState.active]);

    const handleToggleStreamState = () => {
        setStreamState((prevState) => ({
            ...prevState,
            active: !prevState.active,
        }));
    };

    return (
        <div>
            <div className="container container-md px-3 mt-2">
                <div className="row ">
                    <div className="col-md-4 col-sm-12" style={{ top: 54 }}>
                        <div className="card py-4 px-2 my-3">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    id="flexSwitchCheckDefault"
                                    checked={streamState.active}
                                    onChange={handleToggleStreamState}
                                    style={{ cursor: 'pointer' }}
                                />
                                <label
                                    style={{ cursor: 'pointer' }}
                                    className="form-check-label"
                                    htmlFor="flexSwitchCheckDefault"
                                >
                                    Toggle Tweet stream
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="right-container col-md-8 col-sm-12">
                        <div
                            className="container container-sm"
                            style={{ padding: 0 }}
                        >
                            {tweets.map((tweet) => {
                                return (
                                    <SingleTweet
                                        key={tweet.data.id}
                                        tweet={tweet}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetStream;
