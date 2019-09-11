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
                <Top row >
                    <Flex row >
                        {
                            targets.map((item, index) => {
                                return (
                                    <TopButton key={index} onClick={() => { set_selected_target(index) }} >
                                        <TopButtonImageWrapper>
                                            {/* <Image src={`http://dcam.pro:1337` + item.avatar.url.split(`:1337`)[1]} width={2} /> */}
                                        </TopButtonImageWrapper>
                                        <SpaceTitle selected={selected_target === index} >
                                            {item.name}
                                        </SpaceTitle>
                                    </TopButton>
                                )
                            })
                        }
                        {
                            is_admin && <TopButton onClick={() => { set_create_target_visible(true) }} >
                                <TopButtonImageWrapper>
                                    <Image src={require(`../../assets/images/plus.svg`)} width={2} />
                                </TopButtonImageWrapper>
                                <PopUp extra={`top: ${create_target_visible ? 4 : 3}vw; left: 0vw;`} ref={create_target_ref} visible={create_target_visible} >
                                    <CreateSpacePopUp onCreate={() => { get_targets().then(d => { set_targets(d) }) }} />
                                </PopUp>
                            </TopButton>
                        }
                    </Flex>
                    <Flex row >
                        <WeekSelectorWrapper>
                            <Image onClick={() => { set_week_start(+moment(week_start).add(-1, `week`)) }} extra={`transform: rotate(180deg);`} src={require(`../../assets/images/arrow.svg`)} width={1.5} />
                            <Text size={1} onClick={() => { set_week_selector_visible(true) }} extra={`width: 8vw; &:hover { box-shadow: 0 0 1vw rgba(0, 0, 0, 0.1); } `} >
                                {moment(week_start).format(`DD.MM`)} - {moment(week_start).add(6 / 7, `week`).format(`DD.MM`)}
                                <PopUp extra={`top: ${week_selector_visible ? 8 : 7}vw;`} ref={week_selector_ref} visible={week_selector_visible} >
                                    <Calendar onSelectDate={(date) => { set_week_start(+moment(date).startOf(`isoWeek`)); set_week_selector_visible(false) }} />
                                </PopUp>
                            </Text>
                            <Image onClick={() => { set_week_start(+moment(week_start).add(1, `week`)) }} src={require(`../../assets/images/arrow.svg`)} width={1.5} />
                        </WeekSelectorWrapper>
                        <Button backgroundColor={mvConsts.colors.accept} onClick={() => { set_create_event_visible(true) }} >
                            Создать
                            <PopUp extra={`top: ${create_event_visible ? 4 : 3}vw; right: 0vw;`} ref={create_event_ref} visible={create_event_visible} >
                                <CreateEventPopUp target_id={target_id} onCreate={() => { get_events().then(d => { set_events(d); set_create_event_visible(false) }) }} />
                            </PopUp>
                        </Button>
                    </Flex>
                </Top>
                <Flex extra={`height: 84vh;`} >
                    <Flex row extra={`padding-left: 5vw;h`} >
                        {
                            new Array(24).fill(0).map((item, index) => {
                                return ( <Text key={index} color={mvConsts.colors.text.support} extra={`width: 3.5vw;`} >{moment().startOf(`day`).add(index, `hour`).format(`HH:mm`)}</Text> )
                            })
                        }
                    </Flex>
                    {
                        new Array(7).fill(0).map((item, index) => {
                            return (
                                <Flex row key={index} >
                                    <Text color={mvConsts.colors.text.support} size={1} extra={`width: 5vw;`} >{moment(week_start).add(index, `day`).format(`DD.MM`)}, {mvConsts.weekDays.short[index].toLocaleUpperCase()}</Text>
                                    <Flex extra={`width: 84vw; height: 3vw; margin: 0.25vw; background: ${mvConsts.colors.background.support}; border-radius: 0.5vw;`} >

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
height: 8vh;
justify-content: space-between;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    padding-top: 4vw;
}`

/*eslint-enable no-unused-vars*/