/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import Selector from '../UIKit/Selector'
import mvConsts from '../../constants/mvConsts';
import axios from 'axios'
import moment from 'moment'
import useComponentVisible from '../UIKit/useComponentVisible'

let DatePicker = (props) => {
    let [date, set_date] = useState(+moment().add(1, `hour`).startOf(`hour`))
    let set_date_up_to_date = (date) => {
        if (+date >= +moment().startOf(`day`)) {
            set_date(date)
        }
    }
    useEffect(() => {
        if (props.onChange !== undefined && props.value !== date) {
            props.onChange(date)
        }
    })
    let DD = +moment(date).format(`DD`)
    let MM = +moment(date).format(`MM`)
    let YYYY = +moment(date).format(`YYYY`)
    let HH = +moment(date).format(`HH`)
    let mm = +moment(date).format(`mm`)
    return (
        <Flex extra={`align-items: flex-start; width: 100%;`} >
            {/* <Text size={1} extra={`margin: 0.25vw;`} >Дата</Text> */}
            <Flex row >
                <Selector
                    array={new Array(moment(date).daysInMonth()).fill(0).map((a, b) => b + 1)}
                    selected={DD - 1}
                    onChange={(n) => { set_date_up_to_date(+moment(`${n + 1}.${MM}.${YYYY} ${HH}:${mm}`, `D.M.Y H:m`)) }}
                    width={1}
                />
                <Selector
                    array={mvConsts.month}
                    selected={MM - 1}
                    onChange={(n) => { set_date_up_to_date(+moment(`${DD}.${n + 1}.${YYYY} ${HH}:${mm}`, `D.M.Y H:m`)) }}
                    width={6}
                />
                <Selector
                    array={new Array(2).fill(0).map((a, b) => +moment().format(`YYYY`) + b)}
                    selected={YYYY - +moment().format(`YYYY`)}
                    onChange={(n) => { set_date_up_to_date(+moment(`${DD}.${MM}.${+moment().format(`YYYY`) + n} ${HH}:${mm}`, `D.M.Y H:m`)) }}
                    width={3}
                />
            </Flex>
            {
                props.time && <>
                    {/* <Text size={1} extra={`margin: 0.25vw;`} >Время</Text> */}
                    <Flex row >
                        <Selector
                            array={new Array(24).fill(0).map((a, b) => (b < 10 ? `0` : null) + b)}
                            selected={HH}
                            onChange={(n) => { set_date_up_to_date(+moment(`${DD}.${MM}.${YYYY} ${n + 1}:${mm}`, `D.M.Y H:m`)) }}
                            width={1}
                        />
                        <Text>:</Text>
                        <Selector
                            array={new Array(12).fill(0).map((a, b) => (b * 5 < 10 ? `0` : null) + b * 5)}
                            selected={mm / 5}
                            onChange={(n) => { set_date_up_to_date(+moment(`${DD}.${MM}.${YYYY} ${HH}:${n * 5}`, `D.M.Y H:m`)) }}
                            width={1}
                        />
                    </Flex>
                </>
            }
        </Flex>
    )
}

export default DatePicker;

const Box = styled(Flex)`
padding: 1vw;
width: ${props => props.width}vw;
border-radius: 0.5vw;
background: ${props => props.theme.backgroundColor ? props.theme.backgroundColor : props.theme.background.secondary};
margin: 0.25vw;
color: ${props => props.color ? props.color : props.theme.text.primary};
cursor: pointer;
@media (min-width: 320px) and (max-width: 480px) {

}`
/*eslint-enable no-unused-vars*/