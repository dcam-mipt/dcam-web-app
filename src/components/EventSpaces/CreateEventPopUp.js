/*eslint-disable no-unused-vars*/
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp, ClosePopUp } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import DatePicker from '../UIKit/DatePicker'
import Selector from '../UIKit/Selector'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'
import Calendar from './Calendar'
import useComponentVisible from '../UIKit/useComponentVisible'
import axios from 'axios'

let CreateEventPopUp = (props) => {
    let [day, set_day] = useState(moment().startOf(`day`))
    let [start_timestamp, set_start_timestamp] = useState(moment().startOf(`hour`).add(1, `hour`).format(`HH:mm`))
    let [end_timestamp, set_end_timestamp] = useState(moment().startOf(`hour`).add(2, `hour`).format(`HH:mm`))
    let [number_of_people, set_number_of_people] = useState(`0`)
    let [aim, set_aim] = useState(``)
    return (
        <Flex>
            <Flex extra={`align-items: flex-start; justify-content; flex-start;`} >
                <Text bold size={1.5} extra={`margin: 0.5vw 0 0.5vw 0.25vw;`} >Новая запись</Text>
                <DatePicker date={day} onChange={(d) => { set_day(d) }} />
                <Flex row extra={`width: 100%; justify-content: space-between;`} >
                    <Text>начало</Text>
                    <Input type={`time`} value={start_timestamp} onChange={(e) => { set_start_timestamp(e.target.value) }} float />
                </Flex>
                <Flex row extra={`width: 100%; justify-content: space-between;`} >
                    <Text>конец</Text>
                    <Input type={`time`} value={end_timestamp} onChange={(e) => { set_end_timestamp(e.target.value) }} float />
                </Flex>
                <Flex row extra={`width: 100%; justify-content: space-between;`} >
                    <Text>количество людей</Text>
                    <Input type={`number`} short extra={`width: 5.2vw;`} value={number_of_people} onChange={(e) => { set_number_of_people(`` + +e.target.value) }} integer />
                </Flex>
                <Text>цель визита</Text>
                <Input type={`textarea`} value={aim} onChange={(e) => { set_aim(e.target.value) }} />
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
}

export default CreateEventPopUp;
/*eslint-enable no-unused-vars*/