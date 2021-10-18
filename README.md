# Frontend Developer Assignement

Firstly, thanks for the opportunity given to work on this assignemnt. I got to learn about Sockets, which I haven't worked with earlier. Also, I got to understand where I'm weak at - playing and arranging items using CSS Flex box and min/max heights.

-   Technologies used:
    -   React
    -   Bootstrap CSS
    -   React Router
    -   ExpressJS, NodeJS as a middleware
    -   Socket.io Client and Server
    -   React-wordcloud (for Task II)

## Assumptions made

-   The requiremnts asked to show the user Profile picture, but unfortunately, Twitter Stream API doesn't,

## Running the project

### Pre-requisites

-   Add your Twitter Bearer Token to a `.env` file, you can refer the `.env.example` file.
-   Install required NPM modules using `yarn`.
-   To bypass CORS error locally, you can download the CORS Chrome Extension from [Chrome Webstore](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf).

### Method 1

-   To start the Node server, run the command `node server/server.js`.
-   To start the client app, run the command `yarn run start`.
-   You can view the Demo video under the `demo` directory in this project.
-   Navigate to [http://localhost:3000](http://localhost:3000) to see the app working.

### Method 2

-   If there is no `build` directory, run `yarn run build` to generate a production build of the React based Client App.
-   Run `NODE_ENV=production node server/server.js` to serve both the Node middleware and Client server
-   Navigate to [http://localhost:3001](http://localhost:3000) to see the app working.

## TODO

-   Improve responsiveness and styling.
-   Optimize rendering.
-   Graceful error handling.

## Conclusion

I agree that my code isn't production ready yet, but would love to learn from your team and improve myself if given an opportunity.
