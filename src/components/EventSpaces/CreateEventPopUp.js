/*eslint-disable no-unused-vars*/
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import DatePicker from '../UIKit/DatePicker'
import Selector from '../UIKit/Selector'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'
import Calendar from './Calendar'
import useComponentVisible from '../UIKit/useComponentVisible'

let q = [
    {
        type: `title`,
        text: `Новое мероприятие`
    },
    {
        name: `event_name`,
        type: `input`,
        required: true,
        placeholder: `Фамилия`,
    },
    {
        name: `date`,
        type: `date_time_picker`,
        required: true,
    },
]

let CreateEventPopUp = (props) => {
    let [temp, set_temp] = useState(false)
    return (
        <Flex>
            <Flex extra={`align-items: flex-start; justify-content; flex-start;`} >
                {
                    q.map((question, question_index) => {
                        switch (question.type) {
                            case `input`: return <Input key={question_index} value={question.value} onChange={(e) => { question.value = e.target.value; set_temp(!temp) }} placeholder={question.placeholder} />
                            case `date_picker`: return <DatePicker key={question_index} value={question.value} onChange={(e) => { question.value = e; set_temp(!temp) }} placeholder={question.placeholder} />
                            case `date_time_picker`: return <DatePicker key={question_index} time={true} value={question.value} onChange={(e) => { question.value = e; set_temp(!temp) }} placeholder={question.placeholder} />
                            case `title`: return <Text key={question_index} bold size={1.5} extra={`margin: 0.5vw 0 0.5vw 0.25vw;`} >{question.text}</Text>
                            case `sub_title`: return <Text key={question_index} size={1} extra={`margin: 0.5vw 0 0.5vw 0.25vw;`} >{question.text}</Text>
                            case `select`: return <Selector width={2} key={question_index} array={question.array} selected={question.array.indexOf(question.value) >= 0 ? question.array.indexOf(question.value) : 0} onChange={(new_value) => { question.value = question.array[new_value]; set_temp(!temp) }} />
                            default: return <Flex key={question_index} ></Flex>
                        }
                    })
                }
            </Flex>
        </Flex>
    )
}

export default CreateEventPopUp;
/*eslint-enable no-unused-vars*/