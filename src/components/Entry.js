/*eslint-disable no-unused-vars*/
import React from 'react'
import { connect } from 'react-redux'
import GoogleAPI from '../api/GoogleAPI'
import userActions from '../redux/actions/UserActions'
import axios from 'axios'

let Entry = (props) => {
    return (
        <div onClick={() => {
            GoogleAPI.signIn()
                .then((d) => {
                    axios.get(`http://dcam.pro/api/auth/${d.w3.U3}/${d.w3.Eea}`)
                        .then((d) => { props.setToken(d.data) })
                        .catch((d) => { console.log(d) })
                })
                .catch((d) => { console.log(d) })
        }} >log in</div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Entry)
/*eslint-enable no-unused-vars*/