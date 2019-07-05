/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Image, Bar, Text } from '../UIKit/styled-templates'
import axios from 'axios'
import io from 'socket.io-client';
import mvConsts from '../../constants/mvConsts';
import moment from 'moment-timezone'
const socket = io('http://dcam.pro:3000');

let get_notifications = (all = `my`) => new Promise((resolve, reject) => { axios.get(`http://dcam.pro/api/notifications/get_${all}_notifications`).then((d) => { resolve(d) }).catch(e => console.log(e)) })

let main = (props) => {
    let [users_notifications, set_users_notifications] = useState([])
    useEffect(() => {
        !users_notifications.length && get_notifications(props.only_my ? `my` : `all`)
            .then((d) => { set_users_notifications(d.data ? d.data : []) })
    }, [])
    // socket.on('Transactions', async (msg) => { await update_transactions() })
    return (
        <Block height={props.only_my ? 80 : 91} >
            {
                users_notifications.length ? users_notifications.filter(i => props.user_id ? props.user_id === i.user_id : true).sort((a, b) => +moment(b.createdAt) - +moment(a.createdAt)).map((item, index) => {
                    return (
                        <Notification key={index} >
                            <Flex row >
                                <Image extra={`margin-right: 1vw;`} round width={2} src={require(`../../assets/images/${item.status === `checked` ? `done` : `clock`}.svg`)} />
                                <Flex extra={`align-items: flex-start;`} >
                                    <Text>
                                        {item.username.split(`@`)[0].split(`.`)[0]}
                                    </Text>
                                    <Text>
                                        {moment(item.delivery_timestamp).tz(`Europe/Moscow`).format(`DD.MM.YY HH:mm`)}
                                    </Text>
                                </Flex>
                            </Flex>
                            <Flex extra={`align-items: flex-start; margin-top: 1vw;`} >
                                {
                                    item.message.split(`\n`).map((m, index) =>
                                        <Text key={index} size={0.8}  >
                                            {m}
                                        </Text>)
                                }
                            </Flex>
                        </Notification>
                    )
                }) : <Text>Ещё нет уведомлений</Text>
            }
        </Block>
    )
}

export default main;

const Block = styled(Flex)`
max-height: ${props => props.height}vh;
display: block;
overflow: auto;
@media (min-width: 320px) and (max-width: 480px) {

}`

const Notification = styled(Flex)`
&:hover {
    background-color: rgba(0, 0, 0, 0.05);
}
border: 0.1vw solid ${mvConsts.colors.background.secondary};
padding: 1vw;
border-radius: 0.5vw;
background-color: ${mvConsts.colors.background.primary};
align-items: flex-start;
margin-bottom: 0.5vw;
width: 20vw;
@media (min-width: 320px) and (max-width: 480px) {
    border: 0.5vw solid ${mvConsts.colors.background.secondary};
    padding: 5vw;
    border-radius: 2.5vw;
    margin-bottom: 2.5vw;
    width: 80vw;
}`
/*eslint-enable no-unused-vars*/