/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import moment from 'moment-timezone'
import Parse from 'parse'
import mvConsts from '../../constants/mvConsts.js';

export default {
    openBookPopUp: (data) => {
        return {
            type: types.OPEN_BOOK_POP_UP,
            data: data
        }
    },
    setClubBooks: (data) => {
        return {
            type: types.SET_CLUB_BOOKS,
            data: data
        }
    },
}
/*eslint-enable no-unused-vars*/