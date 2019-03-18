/*eslint-disable no-unused-vars*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App'
import * as serviceWorker from './serviceWorker';
import * as Sentry from '@sentry/browser';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { reducer } from './redux/reducers'

const store = createStore(
    reducer,
    applyMiddleware(thunk),
);

Sentry.init({
    dsn: "https://11f6f8cd95ef4b56882cfaafedcc3b59@sentry.io/1417450"
});

let main = () => {
    return (
        <Provider store={store}>
            <App />
        </Provider>
    )
}

ReactDOM.render(main(), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
/*eslint-enable no-unused-vars*/