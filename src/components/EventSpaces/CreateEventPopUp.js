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
import axios from 'axios'

let CreateEventPopUp = (props) => {
    let [temp, set_temp] = useState(false)
    return (
        <Flex>
            <Flex extra={`align-items: flex-start; justify-content; flex-start;`} >
                <Text bold size={1.5} extra={`margin: 0.5vw 0 0.5vw 0.25vw;`} >Новое мероприятие</Text>
                <Flex row extra={`width: 100%; justify-content: space-between;`} >
                    <Text>начало</Text>
                    <Input type={`time`} float />
                </Flex>
                <Flex row extra={`width: 100%; justify-content: space-between;`} >
                    <Text>конец</Text>
                    <Input type={`time`} float />
                </Flex>
                <Button backgroundColor={mvConsts.colors.accept} >Создать</Button>
            </Flex>
        </Flex>
    )
}

export default CreateEventPopUp;
/*eslint-enable no-unused-vars*/