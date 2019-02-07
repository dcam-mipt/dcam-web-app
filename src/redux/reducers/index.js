/**
 * Created by sabir on 19.07.17.
 */
import { combineReducers } from 'redux';

import UIReducer from './UIReducer.js';
import ConstantsReducer from './ConstantsReducer';
import MachinesReducer from './MachinesReducer';
import LaundryReducer from './LaundryReducer';
import ClubReducer from './ClubReducer';

export const reducer = combineReducers({
    ui: UIReducer,
    constants: ConstantsReducer,
    machines: MachinesReducer,
    laundry: LaundryReducer,
    club: ClubReducer,
});
