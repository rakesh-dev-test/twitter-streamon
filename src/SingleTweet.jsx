import React from 'react';

const SingleTweet = React.memo(({ tweet = {} }) => {
    const {
        data: { text, created_at },
        includes: { users },
    } = tweet;
    const timestamp= new Date(created_at).toLocaleString('en-US');
    return (
        <div className=" card" style={{ margin: '12px 0' }}>
            <div className="card-body">
                <div className="row">
                    <div className="col-2 col-sm-3 col-lg-2">
                        <div
                            style={{
                                backgroundColor: 'rgb(134, 142, 150)',
                                width: 72,
                                height: 72,
                            }}
                            className="rounded-circle"
                            alt="user"
                        />
                    </div>
                    <div className="col-10 col-sm-9 col-lg-10 d-flex align-items-start flex-column">
                        <p className="card-title mb-auto">{text}</p>
                        <div className="hstack gap-3 mt-4">
                            <div className="text-muted">
                                @{users[0]?.username}
                            </div>
                            <div className="ms-auto text-muted">{timestamp}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SingleTweet;
