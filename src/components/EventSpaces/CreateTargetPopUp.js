/*eslint-disable no-unused-vars*/
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import DatePicker from '../UIKit/DatePicker'
import Selector from '../UIKit/Selector'
import Form from '../UIKit/Form'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'
import Calendar from './Calendar'
import useComponentVisible from '../UIKit/useComponentVisible'
import axios from 'axios';

let CreateSpacePopUp = (props) => {
    let q = [
        {
            type: `title`,
            text: `Новый пункт`
        },
        {
            name: `event_name`,
            type: `input`,
            required: true,
            placeholder: `название`,
        },
        {
            type: `sub_title`,
            text: `Аватар (только .svg)`,
        },
        {
            name: `avatar`,
            type: `picture`,
            required: true,
        },
        {
            type: `button`,
            text: `Создать`,
            color: mvConsts.colors.accept,
            disabled: q !== undefined ? !q[1].value || !q[3].value : false,
            action: async () => {
                await axios.post(`${mvConsts.api}/targets/create/${q[1].value}/${props.dormitory_id}`, q[3].value, { headers: { 'Content-Type': q[3].value.type } })
                props.onCreate()
            }
        }
    ]
    return (
        <Flex>
            <Form array={q} />
        </Flex>
    )
}

export default CreateSpacePopUp;
/*eslint-enable no-unused-vars*/