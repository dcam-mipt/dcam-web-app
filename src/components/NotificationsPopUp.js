/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import { Flex, Image, Text, Bar, BarWrapper, PopUp } from './UIKit/styled-templates'
import moment from 'moment'
import axios from 'axios'
import mvConsts from '../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'
import io from 'socket.io-client';
import userActions from '../redux/actions/UserActions'
import NotificationsList from './AdminTools/NotificationsList'
// const socket = io('https://dcam.pro:3000');

let main = (props) => {
    useEffect(() => {

    })
    return <BarWrapper>
        <NotificationsList only_my />
    </BarWrapper >
}

let mapStateToProps = (state) => {
    return {
        balance: state.user.balance,
        user: state.user.user,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        setUserInfo: (data) => {
            return dispatch(userActions.setUserInfo(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

/*eslint-enable no-unused-vars*/