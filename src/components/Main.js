/*eslint-disable no-unused-vars*/
import React from 'react'
import { connect } from 'react-redux'
import userActions from '../redux/actions/UserActions'

let Main = (props) => {
    return (
        <div onClick={() => { props.setToken(undefined) }} >log out</div>
    )
}

let mapStateToProps = (state) => {
    return {
        user: state.user,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        setToken: (data) => {
            return dispatch(userActions.setToken(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main)
/*eslint-enable no-unused-vars*/