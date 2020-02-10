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
    let { user, signOut, dormitories, selected_dormitory, set_selected_dormitory } = props
    return <BarWrapper>
        <Bar row >
            <Text size={1.5} bold >Профиль</Text>
        </Bar>
        <Bar row >
            <Image src={user && user.avatar} width={3} round />
            <NameWrapper>
                <Flex row>
                    <Text>{user && user.username.split(`@`)[0]}</Text>
                    <Text text_color={props => `${props.theme.text.support}`} >@{user && user.username.split(`@`)[1]}</Text>
                </Flex>
                <Text text_color={props => `${props.theme.text.support}`} >{user && get_user_status(user.last_seen)}</Text>
            </NameWrapper>
        </Bar>
        <Flex only_mobile >
            <Bar row >
                <Text size={1.5} bold >Общежитие</Text>
            </Bar>
            <ErrorText bold error={selected_dormitory === null} >Выберите общежитие</ErrorText>
            <Switcher
                width={80}
                reversed={true}
                array={dormitories.map(i => i.number)}
                onChange={(index) => { set_selected_dormitory(dormitories[index].objectId) }}
                selected={dormitories.map(i => i.objectId).indexOf(selected_dormitory)}
            />
        </Flex>
        <Bar row >
            <CardPopUp />
        </Bar>
        <Bar row >
            <Text size={1.5} bold >Оформление</Text>
        </Bar>
        {/* <Bar row>
            <Flex extra={`align-items: flex-start; width: 100%;`} >
                <Text extra={`margin: 0.5vw; @media (min-width: 320px) and (max-width: 480px) { margin: 2vw; }; `} >Тема оформления</Text>
                <Flex row>
                    <ThemeChooser disabled={props.theme_shift === `system`} light selected={props.theme === `light`} onClick={() => { if (props.theme_shift === `disabled`) props.set_theme(`light`) }} />
                    <ThemeChooser disabled={props.theme_shift === `system`} dark selected={props.theme === `dark`} onClick={() => { if (props.theme_shift === `disabled`) props.set_theme(`dark`) }} />
                </Flex>
                <Text extra={`margin: 0.5vw; @media (min-width: 320px) and (max-width: 480px) { margin: 2vw; }; `} >Автоматическая смена</Text>
            </Flex>
        </Bar> */}
        <Switcher
            width={80}
            reversed={true}
            array={[`Светлая`, `Темная`]}
            onChange={(index) => {
                let array = [`light`, `dark`]
                if (props.theme_shift === `disabled`) props.set_theme(array[index])
            }}
            selected={[`light`, `dark`].indexOf(props.theme)}
        />
        <Switcher
            width={80}
            reversed={true}
            array={Object.values(mvConsts.theme_shift)}
            onChange={(index) => {
                props.set_theme_shift(Object.keys(mvConsts.theme_shift)[index])
            }}
            selected={Object.keys(mvConsts.theme_shift).indexOf(props.theme_shift)}
        />
        <Bar row extra={`@media (min-width: 320px) and (max-width: 480px) { margin-bottom: 10vh; }`} >
            <Button background={props => props.theme.WARM_ORANGE} onClick={() => { signOut() }} >Выйти</Button>
        </Bar>
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

const ErrorText = styled(Text).attrs(props => ({
    bold: true,
    text_color: props.theme.WARM_ORANGE
}))`
@media (min-width: 320px) and (max-width: 480px) {
    font-size: ${props => props.error ? 4 : 0.0001}vw;
}
`

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
    width: 16vw;
    height: 16vw;
    border-radius: 4vw;
    border: 1vw solid ${props => props.disabled ? `transparent` : props.selected ? props.theme.lightblue : props.light ? mvConsts.light.background.support : mvConsts.dark.background.support};
    margin: 2vw;
}`

/*eslint-enable no-unused-vars*/