/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image } from '../UIKit/styled-templates'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'

let main = (props) => {
    let [selected_date, set_selected_date] = useState(+moment().startOf(`day`))
    let set_selected_date_connected = (date) => {
        set_selected_date(date)
        if (props.onSelectDate !== undefined) { props.onSelectDate(date) }
    }
    let [month_start, set_month_start] = useState(+moment().startOf(`day`))
    useEffect(() => {
        set_month_start(+props.month_start)
    }, [props.month_start])
    return (
        <Wrapper>
            {
                (props.header === undefined || props.header === true) && <Flex row >
                    <Image onClick={() => { set_selected_date(+moment(selected_date).add(-1, `month`)) }} extra={`cursor: pointer; transform: rotate(180deg);`} src={require(`../../assets/images/arrow.svg`)} width={1.5} />
                    <Flex extra={`width: 10vw;`} >
                        <Text extra={`cursor: pointer;`} onClick={() => { set_selected_date(+moment().startOf(`day`)) }} size={1} >{mvConsts.month[+moment(selected_date).month()]} {moment(selected_date).year()}</Text>
                    </Flex>
                    <Image onClick={() => { set_selected_date(+moment(selected_date).add(1, `month`)) }} extra={`cursor: pointer;`} src={require(`../../assets/images/arrow.svg`)} width={1.5} />
                </Flex>
            }
            {
                new Array(6).fill(0).map((week, week_index) => {
                    return (
                        <Flex row key={week_index} >
                            {
                                mvConsts.weekDays.short.map((day, day_index) => {
                                    let date = +moment(month_start).startOf(`isoWeek`).add(week_index, `week`).add(day_index, `day`)
                                    let the_same_month = +moment(month_start) === +moment(date).startOf(`month`)
                                    let is_today = +moment().startOf(`day`) === date
                                    let is_selected = selected_date === date
                                    return (
                                        <Day key={day_index} is_selected={is_selected} is_today={is_today} onClick={() => { set_selected_date_connected(date) }} >
                                            <Text text_color={props => (is_selected || is_today) ? `white` : the_same_month ? props.theme.text.primary : props.theme.text.support} >
                                                {moment(date).format(`D`)}
                                            </Text>
                                        </Day>
                                    )
                                })
                            }
                        </Flex>
                    )
                })
            }
        </Wrapper>
    )
}

export default main;

const Wrapper = styled(Flex)`
background: ${props => props.theme.background.primary};
border-radius: 1vw; 
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const Day = styled(Flex)`
width: 2.3vw;
height: 2.3vw;
border: 0.15vw solid ${props => props.is_selected ? props.theme.purple : props.is_today ? props.theme.accept : `transparent`};
border-radius: 0.5vw;
cursor: pointer;
background: ${props => props.is_selected ? props.theme.purple : props.is_today ? props.theme.accept : `transparent`};
@media (min-width: 320px) and (max-width: 480px) {
    
}`

/*eslint-enable no-unused-vars*/