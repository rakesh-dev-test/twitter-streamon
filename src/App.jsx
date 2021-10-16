import { BrowserRouter, Link, Redirect, Route } from 'react-router-dom';
import './index.css';
import Trends from './Trends';
import TweetStream from './TweetStream';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                    <div className="container-fluid justify-content-center">
                        <Link
                            className="btn btn-outline-success me-2"
                            to="/tweets"
                        >
                            Tweets
                        </Link>
                        <Link
                            className="btn btn-outline-success me-2"
                            to="/trends"
                        >
                            Trends
                        </Link>
                    </div>
                </nav>
                <Route exact path="/">
                    <Redirect to="/tweets" />
                </Route>
                <Route exact path="/tweets">
                    <TweetStream />
                </Route>
                <Route exact path="/trends">
                    <Trends />
                </Route>
            </BrowserRouter>
        </>
    );
};

export default App;
