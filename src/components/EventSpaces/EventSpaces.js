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
                <Center>
                    <Flex extra={`align-items: flex-start;`} >
                        <WeekDaysWrapper>
                            {
                                mvConsts.weekDays.short.map((day, day_index) => {
                                    let date = +moment(week_start).add(day_index, `day`)
                                    let is_today = date === +moment().startOf(`day`)
                                    let color = is_today ? mvConsts.colors.text.secondary : mvConsts.colors.text.primary
                                    return (
                                        <Flex key={day_index} >
                                            <WeekDayTitle is_today={is_today} >
                                                <Text color={color} >{day}</Text>
                                                <Text color={color} size={2} >{moment(date).format(`DD`)}</Text>
                                            </WeekDayTitle>
                                        </Flex>
                                    )
                                })
                            }
                        </WeekDaysWrapper>
                        <Flex extra={`max-height: 36vw; height: 36vw; display: block; overflow-y: scroll;`} >
                            <Flex row >
                                {
                                    mvConsts.weekDays.short.map((day, day_index) => {
                                        return (
                                            <Flex key={day_index} extra={`width: 9.5vw; position: relative;`} >
                                                {
                                                    new Array(24).fill(0).map((item, index) => {
                                                        let h = 3.5
                                                        return (
                                                            <Flex extra={`width: 9.2vw; height: ${h - 0.2}vw; border-radius: 0.2vw; background: ${mvConsts.colors.yellow}; position: absolute; top: ${h * index + 0.2}vw; `} >
                                                                <Text color={`white`} >{index}</Text>
                                                            </Flex>
                                                        )
                                                    })
                                                }
                                            </Flex>
                                        )
                                    })
                                }
                                <Flex extra={`width: 3vw; position: relative;`} >
                                    {
                                        new Array(24).fill(0).map((item, index) => {
                                            let h = 3.5
                                            return (
                                                <Flex extra={`position: absolute; top: ${h * index + 0.2}vw; `} >
                                                    <Text color={mvConsts.colors.text.support} >{moment().startOf(`day`).add(index, `hour`).format(`HH:mm`)}</Text>
                                                </Flex>
                                            )
                                        })
                                    }
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Center>

                {/* <Flex extra={`width: 94vw; height: 84vh;`} >
                    <Flex row extra={`padding-left: 5vw;`} >
                        {
                            new Array(24).fill(0).map((item, index) => {
                                return (
                                    <Flex key={index} extra={`width: 2.5vw; margin: 0.3vw;`}  >
                                        <Text color={mvConsts.colors.text.support} >
                                            {moment().startOf(`day`).add(index, `hour`).format(`HH`)}
                                        </Text>
                                    </Flex>
                                )
                            })
                        }
                    </Flex>
                    <Flex>
                        {
                            mvConsts.weekDays.short.map((day, day_index) => {
                                return (
                                    <Flex row key={day_index} >
                                        <Text extra={`width: 5vw;`} color={mvConsts.colors.text.support} >{`${moment().startOf(`isoWeek`).add(day_index, `day`).format(`DD.MM`)} - ${day.toLocaleLowerCase()}`}</Text>
                                        {
                                            new Array(24).fill(0).map((item, index) => {
                                                return (
                                                    <Flex key={index} extra={`width: 2.5vw; height: 2.5vw; border-radius: 0.5vw; background: ${mvConsts.colors.background.support}; margin: 0.3vw;`}  >

                                                    </Flex>
                                                )
                                            })
                                        }
                                    </Flex>
                                )
                            })
                        }
                    </Flex>
                </Flex> */}

            </Flex>

            <Right visible={false} >
                {
                    create_mode
                        ? <>
                            <Flex extra={`padding: 0.1vw; border-radius: 0.75vw; margin-bottom: 0.5vw; background: white;`} >
                                <Input placeholder={`Название`} />
                            </Flex>

                            <Flex row extra={`padding: 1vw; width: 15.7vw; justify-content: space-between; border-radius: 0.75vw; margin-bottom: 0.5vw; background: white;`} >
                                <Flex extra={`align-items: flex-start; &:hover { transform: scale(1.05) }; cursor: pointer; `} >
                                    <Text size={0.75} color={mvConsts.colors.text.support} >{moment().format(`DD.MM.YY`)}</Text>
                                    <Text size={1.5} >{moment().startOf(`hour`).format(`HH:mm`)}</Text>
                                </Flex>
                                <Flex>-</Flex>
                                <Flex extra={`align-items: flex-start; &:hover { transform: scale(1.05) }; cursor: pointer; `} >
                                    <Text size={0.75} color={mvConsts.colors.text.support} >{moment().format(`DD.MM.YY`)}</Text>
                                    <Text size={1.5} >{moment().add(1, `hour`).startOf(`hour`).format(`HH:mm`)}</Text>
                                </Flex>
                            </Flex>

                            <Button onClick={() => { set_create_mode(false) }} backgroundColor={mvConsts.colors.WARM_ORANGE} >
                                Отмена
                            </Button>
                        </>
                        : <>
                            <AddButton onClick={() => { set_create_mode(true) }} >
                                <Text bold color={`white`} >Добавить</Text>
                            </AddButton>
                            <Flex extra={`width: 100%; height: 100%;`} >
                                <Image src={require(`../../assets/images/file.svg`)} width={10} />
                            </Flex>
                        </>
                }
            </Right>
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