/*eslint-disable no-unused-vars*/
import types from '../ActionTypes.js'
import moment from 'moment-timezone'
import Parse from 'parse'
import mvConsts from '../../constants/mvConsts.js';

export default {
    selectSlot: (data) => {
        return (dispatch, getState) => {
            if (
                +moment(getState().constants.server_time).tz(`Europe/Moscow`) < +moment(data.timestamp).tz(`Europe/Moscow`).add(2, `hour`) &&
                !(getState().machines.machines.filter(i => i.machineId === data.machineId)[0].isDisabled && +moment(getState().machines.machines.filter(i => i.machineId === data.machineId)[0].chill_untill) >= +moment(data.timestamp)) &&
                !getState().laundry.laundry.filter(i => i.timestamp === data.timestamp && i.machineId === data.machineId).length
            ) {
                dispatch({
                    type: types.SELECT_SLOT,
                    data: {
                        timestamp: data.timestamp,
                        machineId: data.machineId,
                    }
                })
            }
        }
    },
    loadLaundry: (data) => {
        return (dispatch, getState) => {
            let m = data.filter(i => i.userId === Parse.User.current().id && +moment(i.timestamp) > +moment(getState().constants.server_time).startOf(`hour`)).sort((a, b) => a.timestamp - b.timestamp)
            dispatch({
                type: types.LOAD_LAUNDRY_SUCCESS,
                data: [].concat(data)
            })
            if (!m.length) {
                dispatch({
                    type: types.SET_POP_UP_WINDOW,
                    data: mvConsts.popUps.EMPTY
                })
            }
        }
    },
    openLaundryBookDetails: (data) => {
        return (dispatch) => {
            dispatch({
                type: types.OPEN_LAUNDRY_BOOK_DETAIL,
                data: data
            })
        }
    }
}
/*eslint-enable no-unused-vars*/