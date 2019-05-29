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
import TelegramAuthPopUp from './TelegramAuthPopUp';
import useComponentVisible from './useComponentVisible'
import io from 'socket.io-client';
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
    let [verificationRef, verificationVisible, setVerificationVisible] = useComponentVisible(true);
    let [entries, setEntries] = useState(false)
    let [value, setValue] = useState(``)
    useEffect(() => {
        socket.on('verifications update', function (msg) {
            axios.get(`http://dcam.pro/api/auth/get_my_entries`)
                .then((d) => { setEntries(d.data) })
                .catch((d) => { console.log(d) })
        })
    })
    return <BarWrapper>
        <PopUp top={3} right={3} ref={verificationRef} visible={verificationVisible} >
            <TelegramAuthPopUp />
        </PopUp>
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
            user && user.telegram_id
                ? <Bar row extra={`justify-content: flex-start;`} >
                    <Text>telegram бот активирован</Text>
                    {/* <Switch/> */}
                </Bar>
                : <Flex>
                    {
                        !entries && <Bar extra={`align-items: flex-start;`} >
                            <Text color={mvConsts.colors.text.support} >telegram бот ещё не активирован. Он будет отправлять вам во</Text>
                            <Text>Найдите наш бот (@dcam_mipt_bot) в telegram</Text>
                            <Text>Отправьте ему команду /auth</Text>
                        </Bar>
                    }
                    {
                        entries && <Bar row >
                            <Input placeholder={`*****`} number type={`password`} short onChange={(d) => { !isNaN(d.target.value) && setValue(d.target.value) }} />
                            <Button backgroundColor={mvConsts.colors.accept} onClick={() => {
                                axios.get(`http://dcam.pro/api/auth/accept_verificatoin_pass/${value}`)
                                    .then((d) => { console.log(d) })
                                    .catch((d) => { console.log(d) })
                            }} >Подтвердить</Button>
                        </Bar>
                    }
                </Flex>
        }
        <Bar only_mobile >
            <CardPopUp />
        </Bar>
        <Bar row >
            <Button backgroundColor={mvConsts.colors.WARM_ORANGE} onClick={() => { signOut() }} >Выйти</Button>
        </Bar>
    </BarWrapper>
}

let mapStateToProps = (state) => {
    return {
        balance: state.user.balance,
        user: state.user.user,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {

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