/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import { Flex, Image, Text, Bar, BarWrapper, PopUp } from './UIKit/styled-templates'
import Switcher from './UIKit/Switcher'
import moment from 'moment-timezone'
import Button from './UIKit/Button'
import axios from 'axios'
import mvConsts from '../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Input from './UIKit/Input'
import CardPopUp from './CardPopUp';
import io from 'socket.io-client';
import Switch from './UIKit/Switch';
import Selector from './UIKit/Selector';
import userActions from '../redux/actions/UserActions'
import uiActions from '../redux/actions/UiActions'
import dormitoryActions from '../redux/actions/DormitoryActions'
// const socket = io('https://dcam.pro:3000');

let get_user_status = (timestamp) => {
    if (+moment().tz(`Europe/Moscow`) - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment().tz(`Europe/Moscow`) - +timestamp < 24 * 3600000) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
}


let main = (props) => {
    let { dormitories, selected_dormitory, set_selected_dormitory } = props
    return <BarWrapper>
        <Bar row >
            <Text size={1.5} bold >Общежитие</Text>
        </Bar>
        <ErrorText error={selected_dormitory === null} >Выберите общежитие</ErrorText>
        <Switcher
            width={80}
            reversed={true}
            array={dormitories.map(i => i.number)}
            onChange={(index) => { set_selected_dormitory(dormitories[index].objectId) }}
            selected={dormitories.map(i => i.objectId).indexOf(selected_dormitory)}
        />
    </BarWrapper >
}

let mapStateToProps = (state) => {
    return {
        balance: state.user.balance,
        user: state.user.user,
        theme: state.ui.theme,
        theme_shift: state.ui.theme_shift,
        dormitories: state.dormitories.dormitories || [],
        selected_dormitory: state.dormitories.selected_dormitory,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        setUserInfo: (data) => {
            return dispatch(userActions.setUserInfo(data))
        },
        set_theme: (data) => {
            return dispatch(uiActions.setTheme(data))
        },
        set_theme_shift: (data) => {
            return dispatch(uiActions.setThemeShift(data))
        },
        set_selected_dormitory: (data) => {
            return dispatch(dormitoryActions.setSelectedDormitory(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

const ErrorText = styled(Text).attrs({
    bold: true,
    color: props => props.theme.WARM_ORANGE
})`
font-size: ${props => props.error ? 0.8 : 0.0001}vw;
`

/*eslint-enable no-unused-vars*/