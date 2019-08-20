/*eslint-disable no-unused-vars*/
import React, { useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'
import Calendar from './Calendar'
import useComponentVisible from '../UIKit/useComponentVisible'

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
    let [week_start, set_week_start] = useState(+moment().startOf(`isoWeek`))
    let [weekSelectorRef, weekSelectorVisible, setWeekSelectorVisible] = useComponentVisible(false);
    let [create_mode, set_create_mode] = useState(false)
    return (
        <Flex row extra={`@supports (-webkit-overflow-scrolling: touch) { height: 75vh; }`} >
            <Flex>
                <Top row >
                    <Flex row >
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
                    </Flex>
                    <WeekSelectorWrapper>
                        <Image onClick={() => { set_week_start(+moment(week_start).add(-1, `week`)) }} extra={`transform: rotate(180deg);`} src={require(`../../assets/images/arrow.svg`)} width={1.5} />
                        <Text size={1} onClick={() => { setWeekSelectorVisible(true) }} extra={`width: 8vw; &:hover { box-shadow: 0 0 1vw rgba(0, 0, 0, 0.1); } `} >{moment(week_start).format(`DD.MM`)} - {moment(week_start).add(6 / 7, `week`).format(`DD.MM`)}</Text>
                        <Image onClick={() => { set_week_start(+moment(week_start).add(1, `week`)) }} src={require(`../../assets/images/arrow.svg`)} width={1.5} />
                    </WeekSelectorWrapper>
                    <PopUp top={7} right={26} ref={weekSelectorRef} visible={weekSelectorVisible} >
                        <Calendar onSelectDate={(date) => { set_week_start(+moment(date).startOf(`isoWeek`)); setWeekSelectorVisible(false) }} />
                    </PopUp>
                </Top>
                <Flex row extra={`height: 84vh;`} >
                    <Flex>
                        {
                            mvConsts.weekDays.short.map((day, day_index) => {
                                return (
                                    <Flex key={day_index} extra={`width: 5vw; height: ${30 / 7}vw;`} >
                                        <Text color={mvConsts.colors.text.support} >{day}</Text>
                                    </Flex>
                                )
                            })
                        }
                    </Flex>
                    <Flex extra={`width: 85vw; height: 30vw; border-radius: 1vw;`} >
                        {
                            mvConsts.weekDays.short.map((day, day_index) => {
                                return (
                                    <Flex key={day_index} extra={`width: 85vw; height: ${30 / 7}vw; background: ${mvConsts.colors.background.support}; border-bottom: 0.03vw solid ${mvConsts.colors.background.primary};`} >
                                        
                                    </Flex>
                                )
                            })
                        }
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

const AddButton = styled(Flex)`
width: 10vw;
height: 3vw;
border-radius: 0.5vw;
cursor: pointer;
background: ${mvConsts.colors.lightblue};
&:hover { transform: scale(1.05) rotate(2deg); };
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const WeekSelectorWrapper = styled(Flex)`
flex-direction: row;
background: white;
border-radius: 0.5vw;
margin-right: 3.25vw;
> * {
    padding: 0 1vw 0 1vw;
    height: 3vw;
    cursor: pointer;
    border-radius: 0.5vw;
    border-radius: 0.5vw;
    &:first-child {
        opacity: 0.2;
        transform: rotate(180deg);
        &:hover { opacity: 1; transform: rotate(180deg) scale(1.2); }
        &:active { transform: rotate(180deg) scale(1.5); }
    };
    &:last-child {
        opacity: 0.2;
        &:hover { opacity: 1; transform: scale(1.2); }
        &:active { transform: scale(1.5); }
    }
}
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const WeekDayTitle = styled(Flex)`
width: 9.5vw;
padding: 0.5vw 0 0.5vw 0;
background: ${props => props.is_today ? mvConsts.colors.accept : mvConsts.colors.background.primary}; 
@media (min-width: 320px) and (max-width: 480px) {
    flex-direction: row;
    width: 98vw;
    padding: 2.5vw 0 2.5vw 0;
}`

const WeekDaysWrapper = styled(Flex)`
flex-direction: row;
background: rgba(0, 0, 0, 0.02);
border-radius: 1vw;
> * {
    &:first-child {
        > * {
            &:first-child {
                border-top-left-radius: 1vw;
                border-bottom-left-radius: 1vw;
                @media (min-width: 320px) and (max-width: 480px) {
                    border-radius: 4vw;
                }
            }
        }
    };
    &:last-child {
        > * {
            &:first-child {
                border-top-right-radius: 1vw;
                border-bottom-right-radius: 1vw;
            }
            &:last-child {
                border-bottom-right-radius: 1vw;
            }
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

const TopButtonImageWrapper = styled(Flex)`
padding: 0.2vw;
border-radius: 2vw;
background: ${mvConsts.colors.background.secondary};
@media (min-width: 320px) and (max-width: 480px) {
    padding: 0.8vw;
    border-radius: 8vw;  
}`

const TopButton = styled(Flex)`
padding: 0.75vw;
margin: 0.2vw;
border-radius: 1vw;
background: white;
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
background: ${props => props.selected ? mvConsts.colors.lightblue : mvConsts.colors.background.secondary};
color: white;
transition: 0.2s;
@media (min-width: 320px) and (max-width: 480px) {
    font-size: ${props => props.selected ? 4 : 0}vw;
    padding: ${props => props.selected ? 2 : 0}vw;
    margin-left: ${props => props.selected ? 2 : 0}vw;
    border-radius: 4vw;
}`

const Top = styled(Flex)`
width: 70vw;
height: 8vh;
justify-content: space-between;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    padding-top: 4vw;
}`

const Center = styled(Flex)`
width: 70vw;
height: 84vh;
// justify-content: flex-start;
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
width: 22vw;
height: 92vh;
justify-content: flex-start;
align-items: flex-start;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.visible ? `flex` : `none`};
    background: white;
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