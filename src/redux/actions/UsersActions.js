/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import moment from 'moment-timezone'
import Parse from 'parse'
import mvConsts from '../../constants/mvConsts.js';

export default {
    setUsersList: (data) => {
        return {
            type: types.SET_USERS_LIST,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/