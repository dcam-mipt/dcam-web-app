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

let get_user_status = (timestamp) => {
    if (+moment() - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment().tz(`Europe/Moscow`).startOf(`day`) === +moment(timestamp).tz(`Europe/Moscow`).startOf(`day`)) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
}

let get_users = () => new Promise((resolve, reject) => { axios.get(`${mvConsts.api}/users/get_users_list`).then((d) => { resolve(d.data ? d.data : []) }) })

let loading_rotor = <Rotor><Image src={require(`../../assets/images/menu.svg`)} width={2} /></Rotor>

let AdminTools = (props) => {
    let [users_list, set_users_list] = useState([])
    let [search, set_search] = useState(``)
    let [selected_user, set_selected_user] = useState(null)
    let [new_balance, set_new_balance] = useState(``)
    let [loading, set_loading] = useState(false)
    let money_delta = selected_user ? +new_balance - selected_user.money : 0
    useEffect(() => {
        axios.defaults.headers.common.Authorization = props.token
        !users_list.length && get_users().then((d) => { set_users_list(d) })
    }, [])
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
                                        <Text size={0.8} >{user.username.split(`@`)[0]}</Text>
                                        <Text text_color={props => props.theme.text.support} >{get_user_status(user.last_seen)}</Text>
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
                            <Text text_color={`white`} >Стиралка</Text>
                            <Flex row >
                                <Text bold text_color={`white`} size={1.2} >{selected_user.money}</Text>
                                <Text text_color={`white`} >р</Text>
                                {+new_balance !== 0 && <Text bold extra={`margin-left: 1vw;`} text_color={props => money_delta > 0 ? props.theme.accept : props.theme.WARM_ORANGE} size={1} >{money_delta > 0 && `+`}{money_delta}р</Text>}
                            </Flex>
                            <Flex row >
                                <Input
                                    background={`rgba(255, 255, 255, 0.5)`}
                                    text_color={`white`}
                                    placeholder={`Сумма`}
                                    short
                                    onChange={(d) => { set_new_balance(d.target.value) }}
                                    value={new_balance}
                                    type={`number`}
                                />
                                <Button
                                    disabled={+new_balance === selected_user.money || new_balance === ``}
                                    background={props => loading ? props.theme.background.support : props.theme.accept}
                                    onClick={async () => {
                                        try {
                                            set_loading(true)
                                            await axios.get(`${mvConsts.api}/balance/edit/${selected_user.objectId}/${money_delta}`)
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
                <Button only_mobile background={props => props.theme.WARM_ORANGE} short={false} onClick={() => { set_selected_user(null) }} >Закрыть</Button>
            </TransactionsWrapper>
            <Flex only_desktop extra={`width: 25vw; `} >

            </Flex>
            <Flex only_desktop extra={`width: 30vw;`} >

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
background: ${props => props.is_selected_user ? props.theme.background.secondary : `transparent`};
padding: 0.5vw;
border-radius: 0.5vw;
transition: 0s;
&:hover { background: ${props => props.theme.background.secondary} };
@media (min-width: 320px) and (max-width: 480px) {
    padding: 2.5vw;
    border-radius: 2.5vw;
}`

const Block = styled(Flex)`
max-height: calc(91vh - ${props => props.subtrahend}vw);
display: block;
overflow-y: scroll;
@media (min-width: 320px) and (max-width: 480px) {
    max-height: calc(100vh - ${props => props.subtrahend * 5}vw);
    padding-bottom: 10vh;
    display: block;
}
@supports (-webkit-overflow-scrolling: touch) {
    display: block;
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
background: ${props => props.theme.background.primary};
padding: 1vw 1vw 0 1vw;
margin-left: 1vw;
border-radius: 1vw;
justify-content: flex-start;
@media (min-width: 320px) and (max-width: 480px) {
    background: ${props => props.theme.background.secondary};
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
    width: 56vw;
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
background: ${props => props.theme.purple};
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