/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import { Flex, Image, Text, Bar, BarWrapper, PopUp } from './styled-templates'
import moment from 'moment'
import Button from './Button'
import axios from 'axios'
import mvConsts from '../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Input from './Input'
import CardPopUp from './CardPopUp';
import io from 'socket.io-client';
import Switch from './Switch';
import userActions from '../redux/actions/UserActions'
const socket = io('http://dcam.pro:3000');

let get_ser_status = (timestamp) => {
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
        let check_entries = () => axios.get(`http://dcam.pro/api/auth/get_my_entries`).then((d) => { setEntries(d.data) })
        check_entries()
        socket.on('Verifications', (msg) => { msg === (user && user.username) && check_entries() })
    })
    let load_my_info = () => {
        setLoading(false)
        axios.get(`http://dcam.pro/api/user/get_my_info`)
            .then((d) => {
                props.setUserInfo({ ...user, ...d.data })
            })
    }
    return <BarWrapper>
        <Bar row >
            <Image src={require(`../assets/images/home.svg`)} width={2} />
            <Text size={1.5} >Профиль</Text>
        </Bar>
        <Bar row >
            <Image src={user && user.avatar} width={3} round />
            <NameWrapper>
                <Flex row>
                    <Text size={1} >{user && user.username.split(`@`)[0]}</Text>
                    <Text size={1} color={mvConsts.colors.text.support} >@{user && user.username.split(`@`)[1]}</Text>
                </Flex>
                <Text color={mvConsts.colors.text.support} >{user && get_ser_status(user.last_seen)}</Text>
            </NameWrapper>
        </Bar>
        {
            loading
                ? `loading...`
                : user && user.telegram
                    ? < Bar row >
                        <Image src={require(`../assets/images/telegram.svg`)} width={3} round />
                        <NameWrapper>
                            <Text size={1} >@{user.telegram.username}</Text>
                            <Text color={mvConsts.colors.text.support} pointer onClick={() => {
                                axios.get(`http://dcam.pro/api/auth/forget_my_telegram`).then(() => { load_my_info() })
                            }} >забыть этот аккаунт</Text>
                        </NameWrapper>
                    </Bar>
                    : entries
                        ? <Bar>
                            <Text>Введите код от бота</Text>
                            <Flex row>
                                {
                                    new Array(5).fill(0).map((item, index) => <LilInput
                                        key={index}
                                        id={`pass_${index}`}
                                        maxLength={1}
                                        pattern={`[0-9]*`}
                                        onChange={(e) => {
                                            if (isNaN(e.target.value)) {
                                                document.getElementById(`pass_${index}`).value = ``
                                            } else {
                                                if (index < 4) {
                                                    document.getElementById(`pass_${index + 1}`).focus()
                                                } else {
                                                    setLoading(true)
                                                    let string = new Array(5).fill(0).map((i, index) => document.getElementById(`pass_${index}`).value).join(``)
                                                    axios.get(`http://dcam.pro/api/auth/check_verificatoin_pass/${string}`).then((d) => { load_my_info() })
                                                }
                                            }
                                        }}
                                    />)
                                }
                            </Flex>
                        </Bar>
                        : <Bar row >
                            <Image src={require(`../assets/images/telegram.svg`)} width={3} round />
                            <NameWrapper>
                                <Text size={1} >@dcam_mipt_bot</Text>
                                <Text color={mvConsts.colors.text.support} >найдите бота в telegram</Text>
                            </NameWrapper>
                        </Bar>
        }
        <Bar only_mobile >
            <CardPopUp />
            <CardPopUp />
            <CardPopUp />
        </Bar>
        <Bar row >
            <Button backgroundColor={mvConsts.colors.WARM_ORANGE} onClick={() => { signOut() }} >Выйти</Button>
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

const LilInput = styled.input`
text-align: center;
width: 2vw;
height: 2vw;
background-color: ${mvConsts.colors.background.secondary};
border: none;
outline: none;
border-radius: 0.2vw;
font-size: 1vw;
margin: 0.2vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
    height: 10vw;
    background-color: ${mvConsts.colors.background.secondary};
    border: none;
    outline: none;
    border-radius: 1vw;
    font-size: 5vw;
    margin: 1vw;
}`

/*eslint-enable no-unused-vars*/