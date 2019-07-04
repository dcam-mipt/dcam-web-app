/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Image, Bar, Text } from '../UIKit/styled-templates'
import axios from 'axios'
import io from 'socket.io-client';
import mvConsts from '../../constants/mvConsts';
import moment from 'moment-timezone'
const socket = io('http://dcam.pro:3000');

let get_notifications = (all = `my`) => new Promise((resolve, reject) => { axios.get(`http://dcam.pro/api/notifications/get_${all ? `all` : `my`}_notifications`).then((d) => { resolve(d) }).catch(e => console.log(e)) })

let main = (props) => {
    let [users_notifications, set_users_notifications] = useState([])
    useEffect(() => {
        !users_notifications.length && get_notifications(`all`).then((d) => { set_users_notifications(d.data) })
    })
    // socket.on('Transactions', async (msg) => { await update_transactions() })
    return (
        <Block>
            {
                // users_notifications.filter(i => props.user_id ? props.user_id === i.user_id : true).sort((a, b) => b.delivery_timestamp - a.delivery_timestamp).map((item, index) => {
                users_notifications.filter(i => props.user_id ? props.user_id === i.user_id : true).sort((a, b) => +moment(b.createdAt) - +moment(a.createdAt)).map((item, index) => {
                    return (
                        <Flex extra={`padding: 1vw; border-radius: 0.5vw; background-color: ${mvConsts.colors.background.primary}; align-items: flex-start; margin-bottom: 0.5vw; width: 20vw;`} key={index} >
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
                                        <Text key={index} size={1}  >
                                            {m}
                                        </Text>)
                                }
                            </Flex>
                        </Flex>
                    )
                })
            }
        </Block>
    )
}

export default main;

const Block = styled(Flex)`
height: 91vh;
display: block;
overflow: auto;
@media (min-width: 320px) and (max-width: 480px) {

}`
/*eslint-enable no-unused-vars*/