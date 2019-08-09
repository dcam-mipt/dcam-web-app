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
    return (
        <Flex extra={`background-color: white; border-radius: 1vw; `} >
            <Flex row >
                <Image onClick={() => { set_selected_date(+moment(selected_date).add(-1, `month`)) }} extra={`cursor: pointer; transform: rotate(180deg);`} src={require(`../../assets/images/arrow.svg`)} width={1.5} />
                <Flex extra={`width: 10vw;`} >
                    <Text extra={`cursor: pointer;`} onClick={() => { set_selected_date(+moment().startOf(`day`)) }} size={1} >{mvConsts.month[+moment(selected_date).month()]} {moment(selected_date).year()}</Text>
                </Flex>
                <Image onClick={() => { set_selected_date(+moment(selected_date).add(1, `month`)) }} extra={`cursor: pointer;`} src={require(`../../assets/images/arrow.svg`)} width={1.5} />
            </Flex>
            {
                [0, 1, 2, 3, 4, 5].map((week, week_index) => {
                    return (
                        <Flex row key={week_index} >
                            {
                                mvConsts.weekDays.short.map((day, day_index) => {
                                    let date = +moment(selected_date).startOf(`month`).startOf(`isoWeek`).add(week_index, `week`).add(day_index, `day`)
                                    let the_same_month = +moment(selected_date).startOf(`month`) === +moment(date).startOf(`month`)
                                    let is_today = +moment().startOf(`day`) === date
                                    let is_selected = selected_date === date
                                    return (
                                        <Flex key={day_index} extra={`
                                                    width: 2.5vw;
                                                    height: 2.5vw;
                                                    border: 0.15vw solid ${is_selected ? mvConsts.colors.purple : is_today ? mvConsts.colors.accept : `transparent`};
                                                    border-radius: 0.5vw;
                                                    cursor: pointer;
                                                `} onClick={() => { set_selected_date_connected(date) }} >
                                            <Text color={the_same_month ? `black` : mvConsts.colors.text.support} >
                                                {moment(date).format(`D`)}
                                            </Text>
                                        </Flex>
                                    )
                                })
                            }
                        </Flex>
                    )
                })
            }
        </Flex>
    )
}

export default main;

/*eslint-enable no-unused-vars*/