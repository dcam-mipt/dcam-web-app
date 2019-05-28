/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Flex, Image, Extra, Bar, Text, Rotor, BarWrapper } from '../styled-templates'
import axios from 'axios'
import styled from 'styled-components'
import mvConsts from '../../constants/mvConsts'
import { connect } from 'react-redux'

let get_ser_status = (timestamp) => {
    if (+moment() - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment() - +timestamp < 24 * 3600000) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
}


let days_of_week_short = [`пн`, `вт`, `ср`, `чт`, `пт`, `сб`, `вс`]

let main = (props) => {
    let [owner_data, setOwnerData] = useState(undefined)
    let [loading, setLoading] = useState(false)
    useEffect(() => {
        if (props.selectedBook && !owner_data) {
            setLoading(true)
            axios.get(`http://dcam.pro/api/users/get_user/${props.selectedBook.user_id}`)
                .then((d) => { setOwnerData(d.data); setLoading(false) })
                .catch((d) => { console.log(d) })
        }
        if (!props.selectedBook) {
            setOwnerData(undefined)
        }
    })
    return (
        <Flex>
            {
                loading
                    ? <Rotor><Image extra={``} src={require(`../../assets/images/menu.svg`)} width={2} /></Rotor>
                    : (owner_data && props.selectedBook) && <BarWrapper>
                        <Bar row >
                            <Image src={require(`../../assets/images/bookmark.svg`)} width={2} />
                            <Text size={1.5} >Запись в стиралку</Text>
                        </Bar>
                        <Bar row >
                            <Image src={owner_data.avatar} width={3} round />
                            <NameWrapper>
                                <Text size={1} >{owner_data.username.split(`@`)[0]}</Text>
                                <Text color={mvConsts.colors.text.support} >{get_ser_status(owner_data.last_seen)}</Text>
                            </NameWrapper>
                            <ImageWrapper><Image width={3} /></ImageWrapper>
                        </Bar>
                        <Bar clear >
                            <Extra extra={`width: 100%; `} row >
                                <Half><Text color={mvConsts.colors.text.support} >Время</Text></Half>
                                <Half>
                                    <Text color={mvConsts.colors.text.support} >{days_of_week_short[moment(props.selectedBook.timestamp).isoWeekday() - 1].toUpperCase()} {moment(props.selectedBook.timestamp).format(`DD.MM.YY`)}</Text>
                                    <Text size={1.4} >{moment(props.selectedBook.timestamp).format(`HH:mm`)}</Text>
                                </Half>
                            </Extra>
                            <Extra extra={`width: 100%; `} row >
                                <Half><Text color={mvConsts.colors.text.support} >Машина</Text></Half>
                                <Half><MachineCircle>{props.machines.map(i => i.objectId).indexOf(props.selectedBook.machine_id) + 1}</MachineCircle></Half>
                            </Extra>
                            {
                                (props.is_admin || props.user.objectId === props.selectedBook.user_id) &&
                                <Extra extra={`width: 100%; `} row >
                                    <Half><Text color={mvConsts.colors.text.support} >Продать</Text></Half>
                                    <Half><Image
                                        pointer
                                        src={require(`../../assets/images/money.svg`)}
                                        width={2}
                                        onClick={() => {
                                            axios.get(`http://dcam.pro/api/laundry/unbook/${props.selectedBook.objectId}`).then(() => {
                                                // document.location.reload();
                                            })
                                        }}
                                    /></Half>
                                </Extra>
                            }
                        </Bar>
                    </BarWrapper>
            }
        </Flex>
    )
}

let mapStateToProps = (state) => {
    return {
        user: state.user.user,
        is_admin: state.user.is_admin,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

const Half = styled(Flex)`
width: 50%;
align-items: flex-start;
height: 3vw;
@media (min-width: 320px) and (max-width: 480px) {
    height: 15vw;
}`

const NameWrapper = styled(Flex)`
padding-left: 1vw;
align-items: flex-start;
@media (min-width: 320px) and (max-width: 480px) {
    padding-left: 5vw;
}`

const ImageWrapper = styled(Flex)`
width: 7vw;
align-items: flex-end;
@media (min-width: 320px) and (max-width: 480px) {
    width: 35vw;
}`

const MachineCircle = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 2vw;
height: 2vw;
border-radius: 2vw;
font-size: 0.8vw;
background-color: ${mvConsts.colors.accept};
color: white;
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
    height: 10vw;
    border-radius: 10vw;
    font-size: 4vw;
}`

/*eslint-enable no-unused-vars*/