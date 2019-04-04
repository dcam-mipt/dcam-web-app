/*eslint-disable no-unused-vars*/
import { combineReducers } from 'redux';

import UIReducer from './UIReducer.js';

export const reducer = combineReducers({
    ui: UIReducer,
});
/*eslint-enable no-unused-vars*/