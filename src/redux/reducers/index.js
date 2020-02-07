/*eslint-disable no-unused-vars*/
import { combineReducers } from 'redux';

import UIReducer from './UIReducer.js';
import UserReducer from './UserReducer.js';
import MachinesReducer from './MachinesReducer';
import DormitoriesReducer from './DormitoriesReducer';
import LaundryReducer from './LaundryReducer';

export const reducer = combineReducers({
    ui: UIReducer,
    user: UserReducer,
    machines: MachinesReducer,
    laundry: LaundryReducer,
    dormitories: DormitoriesReducer,
});
/*eslint-enable no-unused-vars*/
