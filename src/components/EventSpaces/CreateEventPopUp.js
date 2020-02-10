/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp, ClosePopUp, Bar } from '../UIKit/styled-templates'
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
                <Bar row onClick={() => { props.close && props.close() }} >
                    <Flex only_mobile >
                        <Arrow only_mobile width={1.5} extra={`transform: rotate(180deg); margin-right: 1vw;`} />
                    </Flex>
                    <Text size={1.5} bold >{details ? `Редактированиe` : `Новая запись`}</Text>
                </Bar>
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
                <Flex row extra={`width: 92%; justify-content: space-between;`} >
                    <Text extra={`padding-left: 0.5vw; @media (min-width: 320px) and (max-width: 480px) { padding-left: 2vw; };`} >начало</Text>
                    <Input type={`time`} value={moment(start_timestamp).format(`HH:mm`)} onChange={(e) => { set_start_timestamp(+moment(day).add(e.target.value.split(`:`)[0], `hours`).add(e.target.value.split(`:`)[1], `minutes`)) }} float />
                </Flex>
                <Flex row extra={`width: 92%; justify-content: space-between;`} >
                    <Text extra={`padding-left: 0.5vw; @media (min-width: 320px) and (max-width: 480px) { padding-left: 2vw; };`} >конец</Text>
                    <Input type={`time`} value={moment(end_timestamp).format(`HH:mm`)} onChange={(e) => { set_end_timestamp(+moment(day).add(e.target.value.split(`:`)[0], `hours`).add(e.target.value.split(`:`)[1], `minutes`)) }} float />
                </Flex>
                <Flex row extra={`width: 92%; justify-content: space-between;`} >
                    <Text extra={`padding-left: 0.5vw; @media (min-width: 320px) and (max-width: 480px) { padding-left: 2vw; };`} >количество людей</Text>
                    <Input type={`number`} short extra={`width: 5.2vw;`} value={number_of_people} onChange={(e) => { set_number_of_people(`` + +e.target.value) }} integer />
                </Flex>
                <Text extra={`padding-left: 0.5vw; @media (min-width: 320px) and (max-width: 480px) { padding-left: 2vw; };`} >цель визита</Text>
                <Input type={`textarea`} value={aim} onChange={(e) => { set_aim(e.target.value) }} />
                <Button background={props => props.theme.accept} short={false} onClick={async () => {
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
        </Flex>
    )
}

const Arrow = (props) => <Image {...props} src={require(localStorage.getItem(`theme`) === `light` ? `../../assets/images/arrow.svg` : `../../assets/images/arrow_white.svg`)} />


export default CreateEventPopUp;
/*eslint-enable no-unused-vars*/