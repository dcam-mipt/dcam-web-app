/*eslint-disable no-unused-vars*/
import { combineReducers } from 'redux';

import UIReducer from './UIReducer.js';
import UserReducer from './UserReducer.js';
import MachinesReducer from './MachinesReducer';
import LaundryReducer from './LaundryReducer';

export const reducer = combineReducers({
    ui: UIReducer,
    user: UserReducer,
    machines: MachinesReducer,
    laundry: LaundryReducer,
});
/*eslint-enable no-unused-vars*/
