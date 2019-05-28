/*eslint-disable no-unused-vars*/
import React, { useState } from 'react'
import { Flex, Image, Text, Bar, BarWrapper } from './styled-templates'
import moment from 'moment'
import Button from './Button'
import axios from 'axios'
import mvConsts from '../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Input from './Input'

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
    let { signOut, user } = props
    return (
        <BarWrapper>
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
            {/* <Bar>
                <Text color={mvConsts.colors.text.support} >telegram бот ещё не взаимнодейтсовал с этим аккаунтом</Text>
            </Bar> */}
            <Bar row >
                <Button backgroundColor={mvConsts.colors.WARM_ORANGE} onClick={() => { signOut() }} >Выйти</Button>
            </Bar>
        </BarWrapper>
    )
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