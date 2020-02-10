/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Flex, Image, Extra, Bar, Text, Rotor, BarWrapper, ClosePopUp } from '../UIKit/styled-templates'
import axios from 'axios'
import styled from 'styled-components'
import Form from '../UIKit/Form'
import mvConsts from '../../constants/mvConsts'
import { connect } from 'react-redux'
import laundryActions from '../../redux/actions/LaundryActions'

let get_user_status = (timestamp) => {
    if (+moment() - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment() - +timestamp < 24 * 3600000) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
}


let days_of_week_short = [`пн`, `вт`, `ср`, `чт`, `пт`, `сб`, `вс`]
let calc_hours = (timestamp) => +(((+moment(timestamp).tz(`Europe/Moscow`) - +moment().tz(`Europe/Moscow`)) / 3600000 + ``).split(`.`)[0])
let get_laundry = () => new Promise((resolve, reject) => { axios.get(`${mvConsts.api}/laundry/get`).then((d) => { resolve(d) }).catch(e => console.log(e)) })

let main = (props) => {
    let { set_book_visible } = props
    let [owner_data, setOwnerData] = useState(undefined)
    let [loading, setLoading] = useState(false)
    useEffect(() => {
        if (props.selectedBook) {
            setLoading(true)
            axios.get(`${mvConsts.api}/users/get_user/${props.selectedBook.user_id}`)
                .then((d) => { setOwnerData(d.data); setLoading(false) })
                .catch((d) => { console.log(d) })
        }
        if (!props.selectedBook) {
            setOwnerData(undefined)
        }
    }, [props.selectedBook])
    return (
        <Flex>
            {
                loading
                    ? <Rotor><Image extra={``} src={require(`../../assets/images/menu.svg`)} width={2} /></Rotor>
                    : (owner_data && props.selectedBook) && <BarWrapper>
                        {/* <Bar row >
                            <Image src={require(`../../assets/images/bookmark.svg`)} width={2} />
                            <Text size={1.5} >Запись в стиралку</Text>
                        </Bar> */}
                        <Bar row onClick={() => { props.close && props.close() }} >
                            <Flex only_mobile >
                                <Arrow only_mobile width={1.5} extra={`transform: rotate(180deg); margin-right: 1vw;`} />
                            </Flex>
                            <Text size={1.5} bold >Запись в стиралку</Text>
                        </Bar>
                        <Bar row >
                            <Image src={owner_data.avatar} width={3} round />
                            <NameWrapper>
                                <Text size={1} >{props.selectedBook.email.split(`@`)[0]}</Text>
                                <Text text_color={props => props.theme.text.support} >{get_user_status(owner_data.last_seen)}</Text>
                            </NameWrapper>
                            <ImageWrapper><Image width={3} /></ImageWrapper>
                        </Bar>
                        <Bar clear >
                            <Flex extra={`width: 100%; `} row >
                                <Half><Text text_color={props => props.theme.text.support} >Время</Text></Half>
                                <Half>
                                    <Text text_color={props => props.theme.text.support} >{days_of_week_short[moment(props.selectedBook.timestamp).isoWeekday() - 1].toUpperCase()} {moment(props.selectedBook.timestamp).format(`DD.MM.YY`)}</Text>
                                    <Text size={1.4} >{moment(props.selectedBook.timestamp).format(`HH:mm`)}</Text>
                                </Half>
                            </Flex>
                            <Flex extra={`width: 100%; `} row >
                                <Half><Text text_color={props => props.theme.text.support} >Машина</Text></Half>
                                <Half><MachineCircle>{props.machines.map(i => i.objectId).indexOf(props.selectedBook.machine_id) + 1}</MachineCircle></Half>
                            </Flex>
                            {
                                (props.is_admin || props.user.objectId === props.selectedBook.user_id) &&
                                <Flex extra={`width: 100%; `} row >
                                    <Half><Text text_color={props => props.theme.text.support} >{calc_hours(props.selectedBook.timestamp) > 2 ? `Продать` : `Удалить`}</Text></Half>
                                    <Half><Image
                                        pointer
                                        src={require(`../../assets/images/money.svg`)}
                                        width={2}
                                        onClick={async () => {
                                            await axios.get(`${mvConsts.api}/laundry/unbook/${props.selectedBook.objectId}`)
                                            set_book_visible(false)
                                            get_laundry().then((d) => { props.set_laundry(d.data) })
                                        }}
                                    /></Half>
                                </Flex>
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
        set_laundry: (data) => {
            return dispatch(laundryActions.set_laundry(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

const Arrow = (props) => <Image {...props} src={require(localStorage.getItem(`theme`) === `light` ? `../../assets/images/arrow.svg` : `../../assets/images/arrow_white.svg`)} />


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

const MachineCircle = styled(Flex)`
width: 2vw;
height: 2vw;
border-radius: 2vw;
font-size: 0.8vw;
background: ${props => props.theme.accept};
color: white;
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
    height: 10vw;
    border-radius: 10vw;
    font-size: 4vw;
}`

/*eslint-enable no-unused-vars*/