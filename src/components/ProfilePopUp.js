/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import { Flex, Image, Text, Bar, BarWrapper, PopUp } from './UIKit/styled-templates'
import moment from 'moment'
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
// const socket = io('https://dcam.pro:3000');

let get_user_status = (timestamp) => {
    if (+moment() - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment() - +timestamp < 24 * 3600000) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
}

let main = (props) => {
    let { user, signOut } = props
    let [entries, setEntries] = useState(false)
    let [loading, setLoading] = useState(false)
    let [theme, set_theme] = useState(localStorage.getItem(`theme`))
    useEffect(() => {
        let check_entries = () => axios.get(`https://dcam.pro/api/auth/get_my_entries`).then((d) => { setEntries(d.data) })
        setTimeout(() => { check_entries() }, 0)
    })
    let load_my_info = () => {
        setLoading(false)
        axios.get(`https://dcam.pro/api/user/get_my_info`)
            .then((d) => {
                props.setUserInfo({ ...user, ...d.data })
            })
    }
    return <BarWrapper>
        <Bar row >
            <Text size={1.5} bold >Профиль</Text>
        </Bar>
        <Bar row >
            <Image src={user && user.avatar} width={3} round />
            <NameWrapper>
                <Flex row>
                    <Text>{user && user.username.split(`@`)[0]}</Text>
                    <Text color={props => props.theme.text.support} >@{user && user.username.split(`@`)[1]}</Text>
                </Flex>
                <Text color={props => props.theme.text.support} >{user && get_user_status(user.last_seen)}</Text>
            </NameWrapper>
        </Bar>
        {/* <Bar row >
            <CardPopUp />
        </Bar> */}
        <Bar row >
            <Text size={1.5} bold >Оформление</Text>
        </Bar>
        <Flex extra={`align-items: flex-start; width: 100%;`} >
            <Text extra={`margin: 0.5vw`} >Тема оформления</Text>
            <Flex row>
                <ThemeChooser disabled={props.theme_shift === `system`} light selected={props.theme === `light`} onClick={() => { if(props.theme_shift === `disabled`) props.set_theme(`light`) }}/>
                <ThemeChooser disabled={props.theme_shift === `system`} dark selected={props.theme === `dark`} onClick={() => { if(props.theme_shift === `disabled`) props.set_theme(`dark`) }}/>
            </Flex>
            <Text extra={`margin: 0.5vw`} >Автоматическая смена</Text>
            <Selector
                bottom
                left
                array={Object.values(mvConsts.theme_shift)}
                selected={Object.keys(mvConsts.theme_shift).indexOf(props.theme_shift)}
                onChange={(i) => {
                    props.set_theme_shift(Object.keys(mvConsts.theme_shift)[i])
                }}
                width={10}
            />
        </Flex>
        <Bar row >
            <Button backgroundColor={props => props.theme.WARM_ORANGE} onClick={() => { signOut() }} >Выйти</Button>
        </Bar>
    </BarWrapper >
}

let mapStateToProps = (state) => {
    return {
        balance: state.user.balance,
        user: state.user.user,
        theme: state.ui.theme,
        theme_shift: state.ui.theme_shift,
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
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

const NameWrapper = styled(Flex)`
padding-left: 1vw;
align-items: flex-start;
@media (min-width: 320px) and (max-width: 480px) {
    padding-left: 5vw;
}`

const ThemeChooser = styled(Flex)`
width: 4vw;
height: 4vw;
border-radius: 1vw;
background: ${props => props.light ? mvConsts.light.background.secondary : mvConsts.dark.background.secondary};
border: 0.2vw solid ${props => props.disabled ? `transparent` : props.selected ? props.theme.lightblue : props.light ? mvConsts.light.background.support : mvConsts.dark.background.support};
margin: 0.5vw;
${props => props.disabled ? null : `&:hover { transform: scale(1.02) rotate(2deg) }; cursor: pointer;`}
@media (min-width: 320px) and (max-width: 480px) {
    
}`

/*eslint-enable no-unused-vars*/