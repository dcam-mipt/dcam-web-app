/*eslint-disable no-unused-vars*/
import { combineReducers } from 'redux';

import UIReducer from './UIReducer.js';
import UserReducer from './UserReducer.js';

export const reducer = combineReducers({
    ui: UIReducer,
    user: UserReducer,
});
/*eslint-enable no-unused-vars*/
