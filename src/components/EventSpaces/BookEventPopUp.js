/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp, ClosePopUp, Bar } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import Form from '../UIKit/Form'
import DatePicker from '../UIKit/DatePicker'
import Selector from '../UIKit/Selector'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'
import Calendar from './Calendar'
import useComponentVisible from '../UIKit/useComponentVisible'
import axios from 'axios'
import { connect } from 'react-redux'

let get_user_status = (timestamp) => {
    if (+moment() - +timestamp < 5 * 6000) {
        return `онлайн`
    }
    if (+moment() - +timestamp < 24 * 3600000) {
        return `сегодня в ${moment(+timestamp).format(`HH:mm`)}`
    }
    return `оффлайн с ${moment(+timestamp).format(`DD.MM.YY`)}`
}

let BookEventPopUp = (props) => {
    let { event, is_admin } = props
    let [day, set_day] = useState(moment().startOf(`day`))
    let [start_timestamp, set_start_timestamp] = useState(moment().startOf(`hour`).add(1, `hour`).format(`HH:mm`))
    let [end_timestamp, set_end_timestamp] = useState(moment().startOf(`hour`).add(2, `hour`).format(`HH:mm`))
    let [number_of_people, set_number_of_people] = useState(`0`)
    let [aim, set_aim] = useState(``)
    let [loading, set_loading] = useState(false)
    let [owner_data, set_owner_data] = useState(undefined)
    useEffect(() => {
        set_start_timestamp(event ? event.start_timestamp : moment().startOf(`hour`).add(1, `hour`).format(`HH:mm`))
        set_end_timestamp(event ? event.end_timestamp : moment().startOf(`hour`).add(2, `hour`).format(`HH:mm`))
        set_number_of_people(event ? event.number_of_people : ``)
        set_aim(event ? event.aim : ``)
    }, [event])
    useEffect(() => {
        if (event) {
            set_loading(true)
            axios.get(`https://dcam.pro/api/users/get_user/${event.user_id}`)
                .then((d) => { set_owner_data(d.data); set_loading(false) })
                .catch((d) => { console.log(d) })
        } else {
            set_owner_data(undefined)
        }
    }, [event])
    if (event) {
        return (
            <Flex>
                <Flex extra={`justify-content; flex-start;`} >
                    <Form array={[{ type: `title`, text: `Запись` }]} />
                    <Bar row >
                        <Image src={owner_data && owner_data.avatar} round width={3} />
                        <NameWrapper>
                            <Text size={1} >{owner_data && owner_data.username.split(`@`)[0]}</Text>
                            <Text color={mvConsts.colors.text.support} >{owner_data && get_user_status(owner_data.last_seen)}</Text>
                        </NameWrapper>
                        <ImageWrapper><Image width={3} /></ImageWrapper>
                    </Bar>
                    <Bar clear >
                        <Flex extra={`width: 100%; `} row >
                            <Half><Text color={mvConsts.colors.text.support} >Время</Text></Half>
                            <Half>
                                <Flex row>
                                    <Text size={1.4} >{moment(start_timestamp).format(`HH:mm`)}</Text>
                                    <Text size={1.4} extra={`margin: 0 0.5vw 0 0.5vw;`} >-</Text>
                                    <Text size={1.4} >{moment(end_timestamp).format(`HH:mm`)}</Text>
                                </Flex>
                            </Half>
                        </Flex>
                        <Flex extra={`width: 100%; `} row >
                            <Half><Text color={mvConsts.colors.text.support} >Количество людей</Text></Half>
                            <Half><Text size={1.4} >{number_of_people}</Text></Half>
                        </Flex>
                        <Flex extra={`width: 100%; `} row >
                            <Half><Text color={mvConsts.colors.text.support} >Цель</Text></Half>
                            <Half><Text>{aim}</Text></Half>
                        </Flex>
                    </Bar>
                    <Button backgroundColor={mvConsts.colors.accept} short={false} onClick={async () => {
                        let start = +moment(day).startOf(`day`).add(start_timestamp.split(`:`)[0], `hour`).add(start_timestamp.split(`:`)[1], `minute`)
                        let end = +moment(day).startOf(`day`).add(end_timestamp.split(`:`)[0], `hour`).add(end_timestamp.split(`:`)[1], `minute`)
                        await axios.post(`${mvConsts.api}/events/create/`, {
                            start: start,
                            end: end,
                            target_id: props.target_id,
                            number_of_people: number_of_people,
                            aim: aim,
                        })
                        props.onCreate !== undefined && props.onCreate()
                        set_start_timestamp(moment().startOf(`hour`).add(1, `hour`).format(`HH:mm`))
                        set_end_timestamp(moment().startOf(`hour`).add(2, `hour`).format(`HH:mm`))
                    }} >Записаться</Button>
                </Flex>
                <ClosePopUp props={props} />
            </Flex>
        )
    } else {
        return (
            <Text>загрузка</Text>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        is_admin: !state.user.is_admin,
    }
}
export default connect(mapStateToProps)(BookEventPopUp)

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
/*eslint-enable no-unused-vars*/