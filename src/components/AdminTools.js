/*eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { connect } from 'react-redux'
import moment from 'moment'
import { Flex, Image, Bar, Text, Rotor } from './styled-templates'
import Input from './Input'
import Button from './Button'
import mvConsts from '../constants/mvConsts'
import TransactionsList from './TransactionsList'

let get_ser_status = (timestamp) => {
    if (+moment() - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment().tz(`Europe/Moscow`).startOf(`day`) === +moment(timestamp).tz(`Europe/Moscow`).startOf(`day`)) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
}

let AdminTools = (props) => {
    let [users, setUsers] = useState([])
    let [users_transactions, set_users_transactions] = useState([])
    let [search, setSearch] = useState(``)
    let [selected_user, set_selected_user] = useState(null)
    let [new_balance, set_new_balance] = useState(``)
    let money_delta = selected_user ? +new_balance - selected_user.money : 0
    useEffect(() => {
        axios.defaults.headers.common.Authorization = props.token
        !users.length && axios.get(`http://dcam.pro/api/users/get_users_list`)
            .then((d) => { setUsers(d.data) })
            .catch((d) => { console.log(d) })
        !users_transactions.length && axios.get(`http://dcam.pro/api/transactions/get_all_transactions`)
            .then((d) => { set_users_transactions(d.data) })
            .catch((d) => { console.log(d) })
    })
    return (
        <GlobalWrapper>
            <Flex extra={`height: 89vh; background-color: white; padding: 1vw 1vw 0 1vw; margin-left: 1vw; border-radius: 0.5vw;`} >
                <Input placeholder={`Поиск`} onChange={(e) => { setSearch(e.target.value) }} />
                <Flex extra={`height: calc(91vh - 3.5vw); display: block; overflow: auto;`} >
                    <Flex>
                        {
                            users.length ? users.filter(i => i === `` || i.username.split(`@`)[0].toLowerCase().indexOf(search.toLowerCase()) > -1).sort((a, b) => b.last_seen - a.last_seen).map((user, user_index) => {
                                return (
                                    <Flex extra={`background-color: ${selected_user && selected_user.objectId === user.objectId ? mvConsts.colors.background.secondary : `transparent`}; padding: 0.5vw; border-radius: 0.5vw; transition: 0s; &:hover { background-color: ${mvConsts.colors.background.secondary} };`} pointer key={user_index} row onClick={() => { set_selected_user(selected_user && selected_user.objectId === user.objectId ? null : user) }} >
                                        <Image src={user.avatar} width={3} round />
                                        <NameWrapper>
                                            <Text size={1} >{user.username.split(`@`)[0]}</Text>
                                            <Text color={mvConsts.colors.text.support} >{get_ser_status(user.last_seen)}</Text>
                                        </NameWrapper>
                                    </Flex>
                                )
                            }) : <Flex extra={`height: 80vh;`} ><Rotor><Image src={require(`../assets/images/menu.svg`)} width={2} /></Rotor></Flex>
                        }
                    </Flex>
                </Flex>
            </Flex>
            <Flex extra={`height: 91vh; width: 26vw; margin-left: 1vw; justify-content: flex-start;`} >
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
                                    onChange={(d) => { (!isNaN(d.target.value) && d.target.value.length < 10) && set_new_balance(Math.round(d.target.value * 100) / 100) }}
                                    value={new_balance}
                                />
                                <Button
                                    disabled={+new_balance === selected_user.money || new_balance === ``}
                                    backgroundColor={mvConsts.colors.accept}
                                    onClick={async () => {
                                        try {
                                            await axios.get(`http://dcam.pro/api/balance/edit/${selected_user.objectId}/${money_delta}`)
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}
                                >
                                    Присвоить
                        </Button>
                            </Flex>
                        </Card>
                    </Flex> : <Text color={mvConsts.colors.text.support} >выберите пользователя</Text>
                }
                <Flex extra={`height: calc(91vh - ${(card_width / 86 * 54) * (selected_user ? 1 : 0)}vw); display: block; overflow: auto;`} >
                    <TransactionsList transactions={selected_user ? users_transactions.filter(i => i.from === selected_user.objectId || i.to === selected_user.objectId) : users_transactions} />
                </Flex>
            </Flex>
            <Flex extra={`width: 25vw;`} >
                <Text>events</Text>
            </Flex>
            <Flex extra={`width: 30vw;`} >
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

const NameWrapper = styled(Flex)`
                padding-left: 1vw;
                align-items: flex-start;
                width: 12vw;
@media (min-width: 320px) and (max-width: 480px) {
                    padding - left: 5vw;
            }`
const GlobalWrapper = styled(Flex)`
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: row;
            transition: 0.2s;
            width: 94vw;
            height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
                    flex - direction: column;
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