/*eslint-disable no-unused-vars*/
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image } from '../UIKit/styled-templates'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'
import Calendar from './Calendar'

let top_buttons = [
    {
        image: require(`../../assets/images/club.svg`),
        title: `клуб`,
    },
    {
        image: require(`../../assets/images/meetings_room.svg`),
        title: `кдс`,
    },
]

let main = () => {
    let [target, set_target] = useState(0)
    let [selected_date, set_selected_date] = useState(+moment().startOf(`day`))
    return (
        <Flex row extra={`@supports (-webkit-overflow-scrolling: touch) { height: 75vh; }`} >
            <Flex>
                <Top row >
                    {
                        top_buttons.map((item, index) => {
                            return (
                                <TopButton key={index} onClick={() => { set_target(index) }} >
                                    <TopButtonImageWrapper>
                                        <Image src={item.image} width={2} />
                                    </TopButtonImageWrapper>
                                    <SpaceTitle selected={target === index} >
                                        {item.title}
                                    </SpaceTitle>
                                </TopButton>
                            )
                        })
                    }
                </Top>
                <Center>
                    <WeekDaysWrapper>
                        {
                            mvConsts.weekDays.short.map((day, day_index) => {
                                let date = +moment(selected_date).startOf(`isoWeek`).add(day_index, `day`)
                                let is_selected = date === selected_date
                                let color = is_selected ? mvConsts.colors.text.support : mvConsts.colors.text.primary
                                return (
                                    <Flex key={day_index} >
                                        <WeekDayTitle is_selected={is_selected} >
                                            <Text color={color} >{day}</Text>
                                            <Text color={color} size={2} >{moment(date).format(`DD`)}</Text>
                                        </WeekDayTitle>
                                    </Flex>
                                )
                            })
                        }
                    </WeekDaysWrapper>
                </Center>
            </Flex>
            <Right visible={false} >
                <Flex extra={`background-color: white; padding: 1vw; border-radius: 1vw; `} >
                    <Calendar onSelectDate={(date) => { set_selected_date(date) }} />
                </Flex>
            </Right>
        </Flex>
    )
}

const WeekDayTitle = styled(Flex)`
width: 9.5vw;
padding: 0.5vw 0 0.5vw 0;
background-color: ${props => props.is_selected ? mvConsts.colors.background.support : mvConsts.colors.background.primary}; 
@media (min-width: 320px) and (max-width: 480px) {
    flex-direction: row;
    width: 98vw;
    padding: 2.5vw 0 2.5vw 0;
}`

const WeekDaysWrapper = styled(Flex)`
flex-direction: row;
> * {
    &:first-child {
        > * {
            border-top-left-radius: 1vw;
            border-bottom-left-radius: 1vw;
            @media (min-width: 320px) and (max-width: 480px) {
                border-radius: 4vw;
            }
        }
    };
    &:last-child {
        > * {
            border-top-right-radius: 1vw;
            border-bottom-right-radius: 1vw;
        }
    }
}
@media (min-width: 320px) and (max-width: 480px) {
> * { 
    &:not(:first-child) {
        > * {
            display: none;
        }
    };
}
}`

const Cell = styled(Flex)`
width: 10.2vw;
height: 6vh;
background-color: ${mvConsts.colors.background.support};
border: 0.1vw solid ${mvConsts.colors.background.primary};
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const TopButtonImageWrapper = styled(Flex)`
padding: 0.2vw;
border-radius: 2vw;
background-color: ${mvConsts.colors.background.secondary};
@media (min-width: 320px) and (max-width: 480px) {
    padding: 0.8vw;
    border-radius: 8vw;  
}`

const TopButton = styled(Flex)`
padding: 0.75vw;
margin: 0.2vw;
border-radius: 1vw;
background-color: white;
flex-direction: row;
@media (min-width: 320px) and (max-width: 480px) {
    padding: 2.5vw;
    margin-top: 1vw;
    border-radius: 5vw;
}
`

const SpaceTitle = styled(Flex)`
font-size: ${props => props.selected ? 1 : 0}vw;
padding: ${props => props.selected ? 0.5 : 0}vw;
margin-left: ${props => props.selected ? 0.5 : 0}vw;
border-radius: 2vw;
background-color: ${props => props.selected ? mvConsts.colors.lightblue : mvConsts.colors.background.secondary};
color: white;
transition: 0.2s;
@media (min-width: 320px) and (max-width: 480px) {
    font-size: ${props => props.selected ? 4 : 0}vw;
    padding: ${props => props.selected ? 2 : 0}vw;
    margin-left: ${props => props.selected ? 2 : 0}vw;
    border-radius: 4vw;
}`

const Top = styled(Flex)`
width: 69vw;
height: 8vh;
justify-content: flex-start;
padding-left: 2vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    padding-top: 4vw;
}`

const Center = styled(Flex)`
width: 69vw;
height: 84vh;
justify-content: flex-start;
padding-top: 0.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    padding-top: 2.5vw;
    width: 100vw;
    height: 92vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 75vh;
}`

const Right = styled(Flex)`
width: 25vw;
height: 92vh;
justify-content: flex-start;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.visible ? `flex` : `none`};
    background-color: white;
    position: fixed;
    top: 0;
    width: 100vw;
    height: 94vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 75vh;
}`

export default main;
/*eslint-enable no-unused-vars*/