/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
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
    let { details } = props
    let [day, set_day] = useState(moment().startOf(`day`))
    let [start_timestamp, set_start_timestamp] = useState(+moment().startOf(`hour`))
    let [end_timestamp, set_end_timestamp] = useState(+moment().startOf(`hour`).add(1, `hour`))
    let [number_of_people, set_number_of_people] = useState(`0`)
    let [aim, set_aim] = useState(``)
    useEffect(() => {
        if (details) {
            set_day(+moment(details.start_timestamp).startOf(`day`))
            set_start_timestamp(details.start_timestamp)
            set_end_timestamp(details.end_timestamp)
            set_number_of_people(details.number_of_people)
            set_aim(details.aim)
        }
    }, [details])
    return (
        <Flex>
            <Flex extra={`align-items: flex-start; justify-content; flex-start;`} >
                <Text bold size={1.5} extra={`margin: 0.5vw 0 0.5vw 0.25vw;`} >{details ? `Редактированиe` : `Новая запись`}</Text>
                <Input
                    type={`date`}
                    autocomplete={true}
                    value={moment(day).format(`YYYY-MM-DD`)}
                    onChange={(e) => {
                        let timestamp_ = +moment(e.target.value, `YYYY-MM-DD`);
                        if (timestamp_ > 0) {
                            set_day(timestamp_)
                            props.onSelectDate && props.onSelectDate(timestamp_)
                        }
                    }}
                />
                <Flex row extra={`width: 100%; justify-content: space-between;`} >
                    <Text>начало</Text>
                    <Input type={`time`} value={moment(start_timestamp).format(`HH:mm`)} onChange={(e) => { set_start_timestamp(+moment(day).add(e.target.value.split(`:`)[0], `hours`).add(e.target.value.split(`:`)[1], `minutes`)) }} float />
                </Flex>
                <Flex row extra={`width: 100%; justify-content: space-between;`} >
                    <Text>конец</Text>
                    <Input type={`time`} value={moment(end_timestamp).format(`HH:mm`)} onChange={(e) => { set_end_timestamp(+moment(day).add(e.target.value.split(`:`)[0], `hours`).add(e.target.value.split(`:`)[1], `minutes`)) }} float />
                </Flex>
                <Flex row extra={`width: 100%; justify-content: space-between;`} >
                    <Text>количество людей</Text>
                    <Input type={`number`} short extra={`width: 5.2vw;`} value={number_of_people} onChange={(e) => { set_number_of_people(`` + +e.target.value) }} integer />
                </Flex>
                <Text>цель визита</Text>
                <Input type={`textarea`} value={aim} onChange={(e) => { set_aim(e.target.value) }} />
                <Button backgroundColor={props => props.theme.accept} short={false} onClick={async () => {
                    let start = start_timestamp
                    let end = end_timestamp
                    await axios.post(`${mvConsts.api}/events/${details ? `edit` : `create`}/`, {
                        ...details,
                        start: start,
                        end: end,
                        target_id: props.target_id,
                        number_of_people: number_of_people,
                        aim: aim,
                    })
                    props.onCreate !== undefined && props.onCreate()
                    set_start_timestamp(+moment().startOf(`hour`).add(1, `hour`))
                    set_end_timestamp(+moment().startOf(`hour`).add(2, `hour`))
                }} >{details ? `Изменить` : `Записаться`}</Button>
            </Flex>
            <ClosePopUp props={props} />
        </Flex>
    )
}

export default CreateEventPopUp;
/*eslint-enable no-unused-vars*/