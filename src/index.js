/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App.js'
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/browser';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { reducer } from './redux/reducers'

import io from 'socket.io-client';
const socket = io('http://dcam.pro', { path: '/test' });
setInterval(() => { socket.emit('chat message', `hello world`) }, 1000)
socket.on('chat message', function (msg) {
    console.log(msg);
});

const store = createStore(reducer);

// Sentry.init({
//     dsn: "https://11f6f8cd95ef4b56882cfaafedcc3b59@sentry.io/1417450"
// });

let main = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

ReactDOM.render(main(), document.getElementById('root'));
serviceWorker.unregister();
/*eslint-enable no-unused-vars*/