/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'
import Calendar from './Calendar'
import useComponentVisible from '../UIKit/useComponentVisible'
import CreateEventPopUp from './CreateEventPopUp'
import CreateSpacePopUp from './CreateTargetPopUp'
import { connect } from 'react-redux'
import axios from 'axios'

let get_targets = () => axios.get(`${mvConsts.api}/targets/get`).then(d => d.data).catch(e => e)
let get_events = () => axios.get(`${mvConsts.api}/events/get`).then(d => d.data).catch(e => e)

let EventTargets = (props) => {
    let { is_admin } = props
    let [selected_target, set_selected_target] = useState(0)
    let [targets, set_targets] = useState([])
    let [events, set_events] = useState([])
    let [week_start, set_week_start] = useState(+moment().startOf(`isoWeek`))
    let [week_selector_ref, week_selector_visible, set_week_selector_visible] = useComponentVisible(false);
    let [create_event_ref, create_event_visible, set_create_event_visible] = useComponentVisible(false);
    let [create_target_ref, create_target_visible, set_create_target_visible] = useComponentVisible(false);
    useEffect(() => {
        get_targets().then(d => { set_targets(d) })
        get_events().then(d => { set_events(d) })
    }, [])
    let target_id = targets[selected_target] && targets[selected_target].objectId
    return (
        <Flex row extra={`@supports (-webkit-overflow-scrolling: touch) { height: 75vh; }`} >
            <Flex>
                <Flex row extra={`height: 30vh; width: 90vw; justify-content: space-between;`} >
                    <PopUp extra={`top: ${create_target_visible ? 4 : 3}vw; left: 10vw;`} ref={create_target_ref} visible={create_target_visible} >
                        <CreateSpacePopUp onCreate={() => { get_targets().then(d => { set_targets(d) }) }} />
                    </PopUp>
                    <PopUp extra={`top: ${week_selector_visible ? 8 : 7}vw;`} ref={week_selector_ref} visible={week_selector_visible} >
                        <Calendar onSelectDate={(date) => { set_week_start(+moment(date).startOf(`isoWeek`)); set_week_selector_visible(false) }} />
                    </PopUp>
                    <PopUp extra={`top: ${create_event_visible ? 4 : 3}vw; right: 0vw;`} ref={create_event_ref} visible={create_event_visible} >
                        <CreateEventPopUp target_id={target_id} onCreate={() => { get_events().then(d => { set_events(d); set_create_event_visible(false) }) }} />
                    </PopUp>
                    <Flex row >
                        {
                            targets.map((item, index) => {
                                return (
                                    <Flex key={index} >
                                        <Text extra={`margin: 0.2vw;`} size={1} >{item.name}</Text>
                                        <Flex extra={`margin: 0.5vw; padding: 1vw; border-radius: 2vw; background: ${index === selected_target ? mvConsts.colors.lightblue : mvConsts.colors.background.primary}; cursor: pointer; &:hover { transform: scale(1.05) rotate(5deg); };`} onClick={() => { set_selected_target(index) }} >
                                            <Flex extra={`padding: 1vw; border-radius: 6vw; background: ${mvConsts.colors.background.secondary};`} >
                                                <Image src={item.avatar.url} width={4} />
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                )
                            })
                        }
                        {
                            is_admin && <Flex>
                                <Text extra={`margin: 0.2vw;`} size={1} >добавить</Text>
                                <Flex extra={`margin: 0.5vw; padding: 1vw; border-radius: 2vw; background: ${mvConsts.colors.background.primary}; cursor: pointer; &:hover { transform: scale(1.05) rotate(5deg); };`} onClick={() => { set_create_target_visible(true) }} >
                                    <Flex extra={`padding: 1vw; border-radius: 6vw; background: ${mvConsts.colors.background.secondary};`} >
                                        <Image src={require(`../../assets/images/plus.svg`)} width={4} />
                                    </Flex>
                                </Flex>
                            </Flex>
                        }
                    </Flex>
                    <Flex row >
                        <Flex>
                            <Text extra={`margin: 0.2vw;`} size={1} >записаться</Text>
                            <Flex extra={`margin: 0.5vw; padding: 1vw; border-radius: 2vw; background: ${mvConsts.colors.accept}; cursor: pointer; &:hover { transform: scale(1.05) rotate(5deg); > * { transform: rotate(-90deg); } };`} onClick={() => { set_create_event_visible(true) }} >
                                <Flex extra={`padding: 1vw; border-radius: 6vw; background: rgba(255, 255, 255, 0.5);`} >
                                    <Image src={require(`../../assets/images/plus_white.svg`)} extra={`opacity: 0.75;`} width={4} />
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex>
                            <Text extra={`margin: 0.2vw;`} size={1} >начало недели</Text>
                            <Flex extra={`margin: 0.5vw; padding: 1vw; border-radius: 2vw; background: ${mvConsts.colors.background.primary}; cursor: pointer; &:hover { transform: scale(1.05) rotate(5deg); };`} onClick={() => { set_week_selector_visible(true) }} >
                                <Flex extra={`padding: 1vw; border-radius: 6vw; background: ${mvConsts.colors.background.secondary};`} >
                                    <Flex extra={`width: 4vw; height: 4vw;`} >
                                        <Text size={1.5} color={mvConsts.colors.text.support} extra={`border-bottom: 0.1vw solid ${mvConsts.colors.text.support}`} >{moment(week_start).format(`DD`)}</Text>
                                        <Text size={1.5} color={mvConsts.colors.text.support} >{moment(week_start).format(`MM`)}</Text>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex>
                            <Text extra={`margin: 0.2vw;`} size={1} >общежитие</Text>
                            <Flex extra={`margin: 0.5vw; padding: 1vw; border-radius: 2vw; background: ${mvConsts.colors.background.primary}; cursor: pointer; &:hover { transform: scale(1.05) rotate(5deg); };`} >
                                <Flex extra={`padding: 1vw; border-radius: 6vw; background: ${mvConsts.colors.background.secondary};`} >
                                    <Text extra={`width: 4vw; height: 4vw;`} size={3} color={mvConsts.colors.text.support} >{7}</Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex extra={`height: 64vh; justify-content: flex-start;`} >
                    <Flex row extra={`padding-left: 5vw;`} >
                        {
                            new Array(24).fill(0).map((item, index) => {
                                return (<Text key={index} color={mvConsts.colors.text.support} extra={`width: 3.5vw;`} >{moment().startOf(`day`).add(index, `hour`).format(`HH:mm`)}</Text>)
                            })
                        }
                    </Flex>
                    {
                        new Array(7).fill(0).map((item, index) => {
                            let events_for_day = events.filter(i => +moment(i.timestamp).startOf(`day`) === +moment(week_start).add(index, `day`))
                            return (
                                <Flex row key={index} extra={`height: ${(100 / 7) * 0.85}%; margin: 0.2%;`} >
                                    <Text color={mvConsts.colors.text.support} size={1} extra={`width: 5vw;`} >{moment(week_start).add(index, `day`).format(`DD.MM`)}, {mvConsts.weekDays.short[index].toLocaleUpperCase()}</Text>
                                    <Flex extra={`position: relative; width: 84vw; height: 100%; margin: 0.25vw; background: ${mvConsts.colors.background.support}; border-radius: 0.5vw;`} >
                                        {
                                            events_for_day.map((e, e_i) => {
                                                return (
                                                    <Flex key={index} extra={`width: ${+e.duration * 3 - 0.1}vw; height: 80%; border-radius: 0.5vw; background: ${mvConsts.colors.accept}; position: absolute; left: ${+moment(+e.timestamp).tz(`Europe/Moscow`).format(`HH`) / 24 * 84}vw; z-index: 2;`} >
                                                        <Text color={`white`} extra={`text-align: center;`} >{e.name}</Text>
                                                    </Flex>
                                                )
                                            })
                                        }
                                    </Flex>
                                </Flex>
                            )
                        })
                    }
                </Flex>
            </Flex>
        </Flex>
    )
}

let mapStateToProps = (state) => {
    return {
        is_admin: state.user.is_admin,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        // setToken: (data) => {
        //     return dispatch(userActions.setToken(data))
        // }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(EventTargets)

const WeekSelectorWrapper = styled(Flex)`
flex-direction: row;
background: white;
border-radius: 0.5vw;
margin: 0.25vw;
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

const TopButtonImageWrapper = styled(Flex)`
padding: 0.2vw;
border-radius: 2vw;
background: ${mvConsts.colors.background.secondary};
@media (min-width: 320px) and (max-width: 480px) {
    padding: 0.8vw;
    border-radius: 8vw;  
}`

const TopButton = styled(Flex)`
position: relative;
padding: 0.75vw;
margin: 0.2vw;
border-radius: 1vw;
background: white;
flex-direction: row;
cursor: pointer;
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
width: 90vw;
// height: 8vh;
justify-content: space-between;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    padding-top: 4vw;
}`

/*eslint-enable no-unused-vars*/