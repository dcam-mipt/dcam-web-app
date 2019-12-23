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
        <Bar>
            <CardPopUp />
        </Bar>
        <Bar row >
            <Text size={1.5} bold >Оформление</Text>
        </Bar>
        <Bar row >
            <Selector
                array={new Array(3).fill(0).map((item, index) => `вариант ${index + 1}`)}
                selected={0}
                onChange={() => {}}
                width={5}
            />
        </Bar>
        <Bar row >
            <Button backgroundColor={props => props.theme.WARM_ORANGE} onClick={() => { signOut() }} >Выйти</Button>
        </Bar>
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

const NameWrapper = styled(Flex)`
padding-left: 1vw;
align-items: flex-start;
@media (min-width: 320px) and (max-width: 480px) {
    padding-left: 5vw;
}`

/*eslint-enable no-unused-vars*/