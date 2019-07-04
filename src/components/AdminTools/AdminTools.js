/*eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment'
import { Flex, Image, Bar, Text, Rotor } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import mvConsts from '../../constants/mvConsts'
import TransactionsList from './TransactionsList'
import NotificationsList from './NotificationsList'
import io from 'socket.io-client';
const socket = io('http://dcam.pro:3000');

let get_user_status = (timestamp) => {
    if (+moment() - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment().tz(`Europe/Moscow`).startOf(`day`) === +moment(timestamp).tz(`Europe/Moscow`).startOf(`day`)) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
}

let get_users = () => new Promise((resolve, reject) => { axios.get(`http://dcam.pro/api/users/get_users_list`).then((d) => { resolve(d) }).catch(e => console.log(e)) })
let get_transactions = () => new Promise((resolve, reject) => { axios.get(`http://dcam.pro/api/transactions/get_all_transactions`).then((d) => { resolve(d) }).catch(e => console.log(e)) })

let loading_rotor = <Rotor><Image src={require(`../../assets/images/menu.svg`)} width={2} /></Rotor>

let AdminTools = (props) => {
    let [users_list, set_users_list] = useState([])
    let [users_transactions, set_users_transactions] = useState([])
    let [search, set_search] = useState(``)
    let [selected_user, set_selected_user] = useState(null)
    let [new_balance, set_new_balance] = useState(``)
    let [loading, set_loading] = useState(false)
    let money_delta = selected_user ? +new_balance - selected_user.money : 0
    let update_transactions = async () => {
        set_loading(true)
        let new_users_list = (await get_users()).data
        set_users_list(new_users_list)
        if (selected_user) {
            set_new_balance(``)
            set_selected_user(new_users_list.filter(i => i.objectId === selected_user.objectId)[0])
        }
        set_users_transactions((await get_transactions()).data)
        set_loading(false)
    }
    useEffect(() => {
        axios.defaults.headers.common.Authorization = props.token
        !users_list.length && get_users().then((d) => { set_users_list(d.data) })
        !users_transactions.length && get_transactions().then((d) => { set_users_transactions(d.data) })
    })
    socket.on('Transactions', async (msg) => { await update_transactions() })
    return (
        <GlobalWrapper>
            <UsersWrapper user_is_selected={selected_user !== null} >
                <Flex only_mobile extra={`height: 3vh;`} />
                <Input placeholder={`Поиск`} onChange={(e) => { set_search(e.target.value) }} />
                <Block subtrahend={3.5} >
                    {
                        users_list.length ? users_list.filter(i => i === `` || i.username.split(`@`)[0].split(`.`)[0].toLowerCase().indexOf(search.toLowerCase()) > -1).sort((a, b) => b.last_seen - a.last_seen).map((user, user_index) => {
                            return (
                                <User is_selected_user={selected_user && selected_user.objectId === user.objectId} pointer key={user_index} row onClick={() => { set_new_balance(``); set_selected_user(selected_user && selected_user.objectId === user.objectId ? null : user) }} >
                                    <Image src={user.avatar} width={3} round />
                                    <NameWrapper>
                                        <Text size={1} >{user.username.split(`@`)[0].split(`.`)[0]}</Text>
                                        <Text color={mvConsts.colors.text.support} >{get_user_status(user.last_seen)}</Text>
                                    </NameWrapper>
                                </User>
                            )
                        }) : <Flex extra={`height: 80vh;`} ><Rotor><Image src={require(`../../assets/images/menu.svg`)} width={2} /></Rotor></Flex>
                    }
                </Block>
            </UsersWrapper>
            <TransactionsWrapper user_is_selected={selected_user !== null} >
                <Flex only_mobile extra={`height: 3vh;`} />
                {
                    selected_user ? <Flex>
                        <Card>
                            <Text color={`white`} >Стиралка 7ки</Text>
                            <Flex row >
                                <Text bold color={`white`} size={1.2} >{selected_user.money}</Text>
                                <Text color={`white`} >р</Text>
                                {+new_balance !== 0 && <Text bold extra={`margin-left: 1vw;`} color={money_delta > 0 ? mvConsts.colors.accept : mvConsts.colors.WARM_ORANGE} size={1} >{money_delta > 0 && `+`}{money_delta}р</Text>}
                            </Flex>
                            <Flex row >
                                <Input
                                    backgroundColor={`rgba(255, 255, 255, 0.5)`}
                                    color={`white`}
                                    placeholder={`Сумма`}
                                    short
                                    number
                                    pattern={`[0-9]*`}
                                    onChange={(d) => { (!isNaN(d.target.value) && d.target.value.length < 10) && set_new_balance(Math.round(d.target.value * 100) / 100) }}
                                    value={new_balance}
                                />
                                <Button
                                    disabled={+new_balance === selected_user.money || new_balance === ``}
                                    backgroundColor={loading ? mvConsts.colors.background.support : mvConsts.colors.accept}
                                    onClick={async () => {
                                        try {
                                            set_loading(true)
                                            await axios.get(`http://dcam.pro/api/balance/edit/${selected_user.objectId}/${money_delta}`)
                                            await update_transactions()
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}
                                >
                                    {loading ? loading_rotor : `Присвоить`}
                                </Button>
                            </Flex>
                        </Card>
                    </Flex> : null
                }
                <Button only_mobile backgroundColor={mvConsts.colors.WARM_ORANGE} short={false} onClick={() => { set_selected_user(null) }} >Закрыть</Button>
                <Block only_desktop subtrahend={(card_width / 86 * 54) * (selected_user ? 1 : 0)} >
                    <TransactionsList transactions={selected_user ? users_transactions.filter(i => i.from === selected_user.objectId || i.to === selected_user.objectId) : users_transactions} />
                </Block>
            </TransactionsWrapper>
            <Flex only_desktop extra={`width: 25vw; `} >
                <NotificationsList user_id={selected_user ? selected_user.objectId : undefined} />
            </Flex>
            <Flex only_desktop extra={`width: 30vw;`} >
                <Text>machines</Text>
            </Flex>
        </GlobalWrapper>
    )
}

let mapStateToProps = (state) => {
    return {
        token: state.user.token,
        machines: state.machines.machines,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(AdminTools)

const User = styled(Flex)`
background-color: ${props => props.is_selected_user ? props.background.secondary : `transparent`};
padding: 0.5vw;
border-radius: 0.5vw;
transition: 0s;
&:hover { background-color: ${props => props.background.secondary} };
@media (min-width: 320px) and (max-width: 480px) {
    padding: 2.5vw;
    border-radius: 2.5vw;
}`

const Block = styled(Flex)`
height: calc(91vh - ${props => props.subtrahend}vw);
display: block;
overflow: auto;
@media (min-width: 320px) and (max-width: 480px) {
    height: calc(91vh - ${props => props.subtrahend * 5}vw);
}`

const TransactionsWrapper = styled(Flex)`
height: 91vh;
width: 26vw;
margin-left: 1vw;
justify-content: flex-start;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.user_is_selected ? `flex` : `none`}
    width: 100vw;
    height: 100vh;
    margin-left: 0;
}`

const UsersWrapper = styled(Flex)`
height: 89vh;
background-color: ${props => props.background.primary};
padding: 1vw 1vw 0 1vw;
margin-left: 1vw;
border-radius: 0.5vw;
justify-content: flex-start;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.user_is_selected ? `none` : `flex`}
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin-left: 0;
    border-radius: 0vw;
}`

const NameWrapper = styled(Flex)`
padding-left: 1vw;
align-items: flex-start;
width: 12vw;
@media (min-width: 320px) and (max-width: 480px) {
    padding-left: 5vw;
    width: 60vw;
}`

const GlobalWrapper = styled(Flex)`
flex-direction: row;
width: 94vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 100vh;
    flex-direction: column;
}`

let card_width = 86 * 0.27
const Card = styled(Flex)`
width: ${card_width}vw;
height: ${card_width / 86 * 54}vw;
border-radius: ${card_width / 20}vw;
background-color: ${mvConsts.colors.purple};
justify-content: space-around;
align-items: flex-start;
> * {
    margin-left: 1vw;
}
@media (min-width: 320px) and (max-width: 480px) {
width: ${4.2 * card_width}vw;
height: ${4.2 * card_width / 86 * 54}vw;
border-radius: ${4.2 * card_width / 20}vw;
> * {
    margin-left: 5vw;
}
}`
/*eslint-enable no-unused-vars*/