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
import useComponentVisible from '../UIKit/useComponentVisible'
import axios from 'axios'

let CreateVotingPopUp = (props) => {
    let q = [
        { type: `title`, text: `Новое голосование` },
        { type: `input`, placeholder: `Название`, required: true, },
        { type: `input`, placeholder: `наименование`, required: true },
        {
            type: `button`,
            text: `Добавить`,
            disable: false,
            action: (update) => { q !== undefined && q.push({ type: `input`, placeholder: `наименование` }); update() }
        }
    ]
    return (
        <Flex>
            <Text>
                <Form array={q} />
            </Text>
        </Flex>
    )
}

export default CreateVotingPopUp;
/*eslint-enable no-unused-vars*/