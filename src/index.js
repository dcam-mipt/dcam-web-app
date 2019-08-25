/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App.js'
import * as serviceWorker from './serviceWorker';

let main = () => {
    return (
        <App />
    )
}

ReactDOM.render(main(), document.getElementById('root'));
serviceWorker.unregister();
/*eslint-enable no-unused-vars*/