/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp, convertHex } from '../UIKit/styled-templates'
import Input from '../UIKit/Input'
import Button from '../UIKit/Button'
import Form from '../UIKit/Form'
import mvConsts from '../../constants/mvConsts';
import moment from 'moment'
import Calendar from './Calendar'
import useComponentVisible from '../UIKit/useComponentVisible'
import CreateEventPopUp from './CreateEventPopUp'
// import CreateSpacePopUp from './CreateTargetPopUp'
import { connect } from 'react-redux'
import axios from 'axios'
import BookEventPopUp from './BookEventPopUp'

let get_targets = () => axios.get(`${mvConsts.api}/targets/get`).then(d => d.data).catch(e => e)
let get_events = () => axios.get(`${mvConsts.api}/events/get`).then(d => d.data.sort((a, b) => a.start_timestamp - b.start_timestamp)).catch(e => e)
let get_dormitories = () => axios.get(`${mvConsts.api}/dormitory/get`).then(d => d.data).catch(e => e)

let useDetails = (default_value) => {
    let [id, set_id] = useState(``)
    let [details_ref, details_visible, set_details_visible] = useComponentVisible(default_value);
    return [details_ref, details_visible, (visible, id) => {
        set_details_visible(visible)
        set_id(id)
    }, id]
}

let cutter = (s) => s.length > 10 ? s.substring(0, 8) + `...` : s

let EventSpaces = (props) => {
    let { is_admin, user } = props
    let [selected_target, set_selected_target] = useState(``)
    let [targets, set_targets] = useState([])
    let [events, set_events] = useState([])
    let [dormitories, set_dormitories] = useState([])
    let [selected_dormitory, set_selected_dormitory] = useState(`RPv7Xk9mfv`)
    let [week_start, set_week_start] = useState(+moment().startOf(`isoWeek`))
    let [week_selector_ref, week_selector_visible, set_week_selector_visible] = useComponentVisible(false);
    let [create_event_ref, create_event_visible, set_create_event_visible] = useComponentVisible(false);
    let [create_target_ref, create_target_visible, set_create_target_visible] = useComponentVisible(false);
    let [dormitory_ref, dormitory_visible, set_dormitory_visible] = useComponentVisible(false);
    let [targets_ref, targets_visible, set_targets_visible] = useComponentVisible(true);
    let [requests_ref, requests_visible, set_requests_visible] = useComponentVisible(false);
    let [my_books_ref, my_books_visible, set_my_books_visible] = useComponentVisible(false);
    let [mobile_workspace_ref, mobile_workspace_visible, set_mobile_workspace_visible] = useComponentVisible(false);
    let [week_day, set_week_day] = useState(+moment().isoWeekday() - 1)
    let [details_ref, details_visible, set_details_visible, details_id] = useDetails(false);
    let selected_dormitory_number = dormitories.filter(i => i.objectId === selected_dormitory)[0] && dormitories.filter(i => i.objectId === selected_dormitory)[0].number
    let [month_start, set_month_start] = useState(+moment().startOf(`month`))
    let d = events.filter(i => i.objectId === details_id)[0]
    useEffect(() => {
        get_targets().then(d => {
            set_targets(d)
            get_dormitories().then(d_ => {
                set_dormitories(d_)
                set_selected_target(d.filter(i => i.dormitory_id === selected_dormitory)[0].objectId)
            })
        })
        get_events().then(d => { set_events(d) })
    }, [])
    useEffect(() => { set_details_visible(false, details_id) }, [events])
    let height_ = 6
    return (
        <Flex extra={`position: relative; @supports (-webkit-overflow-scrolling: touch) { height: 75vh; };`} >
            <PopUp extra={`top: ${create_event_visible ? 0 : 1}vw; left: 22vw;`} ref={create_event_ref} visible={create_event_visible} >
                <CreateEventPopUp details={d} target_id={selected_target} onCreate={() => { get_events().then(d => { set_events(d); set_create_event_visible(false) }) }} onSelectDate={(e) => { set_week_start(+moment(e).startOf(`isoWeek`)) }} />
            </PopUp>
            <PopUp extra={`top: ${details_visible ? 0 : 1}vw; left: 22vw; @media (min-width: 320px) and (max-width: 480px) { top: 0; left: 0; };`} ref={details_ref} visible={details_visible} >
                <BookEventPopUp close={() => { set_details_visible(false) }} visible={details_visible} event={d} onDelete={() => { get_events().then(d => { set_events(d) }) }} onEdit={() => {
                    set_details_visible(false, details_id)
                    setTimeout(() => { set_create_event_visible(true) }, 200)
                }} />
            </PopUp>
            <Flex only_desktop row extra={`width: 94vw; justify-content: space-around;`} >
                <LeftWrapper>
                    <Flex row extra={props => `width: 18vw; padding: 1vw; justify-content: space-between;`} >
                        <Flex row>
                            <Text extra={`padding-left: 1vw; width: 6vw; align-items: flex-start; cursor: pointer; &:hover { transform: scale(1.1); };`} bold size={1} onClick={() => { set_month_start(+moment().startOf(`month`)) }}>{mvConsts.month[+moment(month_start).format(`M`) - 1]}</Text>
                            <Text bold size={1} color={props => props.theme.text.support}>{moment(month_start).format(`YYYY`)}</Text>
                        </Flex>
                        <Flex row extra={`border-radius: 0.5vw; overflow: hidden;`} >
                            <CalendarArrowWrapper onClick={() => { set_month_start(+moment(month_start).add(-1, `month`)) }} >
                                <Arrow width={1} extra={`transform: rotate(180deg);`} />
                            </CalendarArrowWrapper>
                            <CalendarArrowWrapper onClick={() => { set_month_start(+moment(month_start).add(1, `month`)) }} >
                                <Arrow width={1} />
                            </CalendarArrowWrapper>
                        </Flex>
                    </Flex>
                    <Calendar header={false} month_start={month_start} onSelectDate={(e) => { set_week_start(+moment(e).startOf(`isoWeek`)) }} />
                    <Flex>
                        <Flex row extra={`width: 16vw; padding: 1vw 2vw 1vw 2vw; justify-content: space-between;`} onClick={() => { set_dormitory_visible(!dormitory_visible) }} >
                            <Text bold size={1}>Общежитие</Text>
                            <Arrow width={1} extra={`transform: rotate(${dormitory_visible ? 90 : 0}deg);`} />
                        </Flex>
                        <Flex extra={`align-items: flex-start; width: 16vw;`} >
                            {
                                dormitories && dormitories.map((item, index) => {
                                    return (
                                        <Flex row key={index} extra={`&:hover{ opacity: 0.75;`} onClick={() => { set_selected_dormitory(item.objectId); set_selected_target(targets.filter(i => i.dormitory_id === item.objectId).length > 0 ? targets.filter(i => i.dormitory_id === item.objectId)[0].objectId : 0) }} >
                                            <Flex extra={props => `width: 0.5vw; height: ${+dormitory_visible * 0.5}vw; border-radius: 2vw; background: ${selected_dormitory === item.objectId ? props.theme.accept : props.theme.background.support};`} />
                                            <Text extra={`width: 9vw; align-items: flex-start; margin: ${+dormitory_visible}vw; cursor: pointer; };`} size={dormitory_visible ? 0.8 : 0.0001} >Общежитие №{item.number}</Text>
                                        </Flex>
                                    )
                                })
                            }
                        </Flex>
                    </Flex>
                    <Flex>
                        <Flex row extra={`width: 16vw; padding: 1vw 2vw 1vw 2vw; justify-content: space-between;`} onClick={() => { set_targets_visible(!targets_visible) }} >
                            <Text bold size={1}>Юнит</Text>
                            <Arrow width={1} extra={`transform: rotate(${targets_visible ? 90 : 0}deg);`} />
                        </Flex>
                        <Flex extra={`align-items: flex-start; width: 16vw;`} >
                            {
                                targets && targets.map((item, index) => {
                                    let item_visible = targets_visible && item.dormitory_id === selected_dormitory
                                    return (
                                        <Flex row key={index} extra={`&:hover{ opacity: 0.75;`} onClick={() => { set_selected_target(item.objectId) }} >
                                            <Flex extra={props => `width: 0.5vw; height: ${+item_visible * 0.5}vw; border-radius: 2vw; background: ${selected_target === item.objectId ? props.theme.accept : props.theme.background.support};`} />
                                            <Text extra={`width: 9vw; align-items: flex-start; margin: ${+item_visible}vw; cursor: pointer; };`} size={item_visible ? 0.8 : 0.0001} >{item.name}</Text>
                                        </Flex>
                                    )
                                })
                            }
                        </Flex>
                    </Flex>
                    {
                        is_admin && <Flex>
                            <Flex row extra={`width: 16vw; padding: 1vw 2vw 1vw 2vw; justify-content: space-between;`} onClick={() => { set_requests_visible(!requests_visible) }} >
                                <Text bold size={1}>Заявки</Text>
                                <Arrow width={1} extra={`transform: rotate(${requests_visible ? 90 : 0}deg);`} />
                            </Flex>
                            <Flex extra={`align-items: flex-start; width: 16vw;`} >
                                {
                                    events && events.map((item, index) => {
                                        let item_visible = requests_visible && item.target_id === selected_target && !item.accepted && item.end_timestamp > moment()
                                        return (
                                            <Flex row key={index} extra={`&:hover{ opacity: 0.75;`} onClick={() => { set_details_visible(false, details_id); setTimeout(() => { set_details_visible(true, item.objectId) }, 200) }} >
                                                <Flex extra={props => `width: 0.5vw; height: ${+item_visible * 0.5}vw; border-radius: 2vw; background: ${details_id === item.objectId ? props.theme.accept : props.theme.background.support};`} />
                                                <Text extra={`margin: ${+item_visible}vw; width: 1vw; align-items: flex-start; cursor: pointer; };`} size={item_visible ? 0.8 : 0.0001} >{moment(item.start_timestamp).format(`DD.MM`)}</Text>
                                                <Text extra={`margin: ${+item_visible}vw; width: 1vw; align-items: flex-start; justify-content: flex-start; cursor: pointer; };`} size={item_visible ? 0.8 : 0.0001} >{moment(item.start_timestamp).format(`HH:mm`)}</Text>
                                                <Text extra={`margin: ${+item_visible}vw; width: 1vw; align-items: flex-start; justify-content: flex-start; cursor: pointer; };`} size={item_visible ? 0.8 : 0.0001} >{moment(item.end_timestamp).format(`HH:mm`)}</Text>
                                                <Text extra={`margin: ${+item_visible}vw; width: 4vw; align-items: flex-start; cursor: pointer; };`} size={item_visible ? 0.8 : 0.0001} >{cutter(item.username.split(`@`)[0])}</Text>
                                            </Flex>
                                        )
                                    })
                                }
                            </Flex>
                        </Flex>
                    }
                </LeftWrapper>
                <RightWrapper>
                    <TitleRow>
                        <Flex extra={`width: 10.15vw; height: 100%;`} >
                            <Button backgroundColor={props => props.theme.accept} onClick={() => { set_create_event_visible(true); set_details_visible(false, undefined) }} >Создать</Button>
                        </Flex>
                        {
                            new Array(7).fill(0).map((item, index) => {
                                let is_today = +moment().startOf(`day`) === +moment(week_start).add(index, `day`)
                                return (
                                    <Day key={index} >
                                        <Text bold={is_today} color={props => `${is_today ? props.theme.text.primary : props.theme.text.support}`} >{moment(week_start).add(index, `day`).format(`DD.MM`)} {mvConsts.weekDays.short[index]}</Text>
                                    </Day>
                                )
                            })
                        }
                    </TitleRow>
                    <Flex extra={`width: 100%; height: 90%; display: block; max-height: 90%; overflow-y: scroll;`} >
                        <Flex row extra={`width: 100%; position: relative;`}>
                            <TimePointer visible={week_start === +moment().startOf(`isoWeek`)} />
                            <Flex extra={`width: 10vw;`}>
                                {
                                    new Array(24).fill(0).map((item, index) => {
                                        return (
                                            <Flex extra={`width: 100%; height: ${height_}vh;`} key={index} >
                                                <Text color={props => `${props.theme.text.support}`} >{moment().startOf(`day`).add(index, `hour`).format(`HH:mm`)}</Text>
                                            </Flex>
                                        )
                                    })
                                }
                            </Flex>
                            <Flex row extra={`width: 60vw; height: ${24 * height_}vh`}>
                                {
                                    new Array(7).fill(0).map((item, index) => {
                                        let events_for_day = events.filter(i => i.target_id === selected_target).filter(i => +moment(i.start_timestamp).startOf(`day`) === +moment(week_start).add(index, `day`))
                                        return (
                                            <Day key={index} >
                                                {
                                                    events_for_day.map((e, e_i) => {
                                                        let day_length = 24 * 60 * 60 * 1000
                                                        let length_in_ms = (+e.end_timestamp - +e.start_timestamp)
                                                        let height = length_in_ms / day_length * (24 * height_) * 0.96
                                                        let top = (+e.start_timestamp - +moment(e.start_timestamp).startOf(`day`)) / day_length * (24 * height_)
                                                        let is_before = +e.end_timestamp < +moment()
                                                        return (
                                                            <Event key={e_i} is_before={is_before} is_selected={details_id === e.objectId && details_visible} accepted={e.accepted} height={height} top={top} id={`e_` + e.id} day_length={day_length} length_in_ms={length_in_ms} onClick={() => { set_details_visible(false, details_id); setTimeout(() => { set_details_visible(true, e.objectId) }, 200) }} >
                                                                <Flex extra={`height: 0.3vw; justify-content: space-around; align-items: flex-start; margin: ${length_in_ms / day_length > 1 / 24 ? 1.5 : 0}vw 0 0 0.5vw;`} >
                                                                    <Text color={`white`} bold >{moment(e.start_timestamp).format(`HH:mm`)}</Text>
                                                                    <Text color={`white`} >{cutter(e.username.split(`@`)[0])}</Text>
                                                                </Flex>
                                                            </Event>
                                                        )
                                                    })
                                                }
                                            </Day>
                                        )
                                    })
                                }
                            </Flex>
                        </Flex>
                    </Flex>
                </RightWrapper>
            </Flex>
            <Flex only_mobile extra={`position: relative; height: 100vh;`} >
                <Flex extra={props => `width: 100vw; border-radius: 6vw; background: ${props.theme.background.primary}; position: absolute; bottom: 0; padding-bottom: 8vh;`} >
                    <Flex row extra={`padding: 8vw; width: 92.5vw; justify-content: space-between;`} >
                        <Flex row extra={`margin-left: 4vw;`} onClick={() => { set_week_start(+moment().startOf(`isoWeel`)) }} >
                            <Text extra={`width: 10vw; padding-left: 1vw; align-items: flex-start; cursor: pointer; &:hover { transform: scale(1.1); };`} bold size={1}>{mvConsts.month[+moment(week_start).month()].substr(0, 3)}</Text>
                            <Text extra={`width: 20vw;`} bold size={1} color={props => props.theme.text.support}>{moment(week_start).format(`DD`)} - {moment(week_start).add(6, `day`).format(`DD`)}</Text>
                        </Flex>
                        <Flex row >
                            <Flex row extra={`width: 25vw; border-radius: 3vw; overflow: hidden;`} >
                                <CalendarArrowWrapper onClick={() => { set_week_start(+moment(week_start).add(-1, `week`)) }} >
                                    <Arrow width={1} extra={`transform: rotate(180deg);`} />
                                </CalendarArrowWrapper>
                                <CalendarArrowWrapper onClick={() => { set_week_start(+moment(week_start).add(1, `week`)) }} >
                                    <Arrow width={1} />
                                </CalendarArrowWrapper>
                            </Flex>
                            <Flex row extra={props => `margin-left: 6vw; width: 10vw; height: 10vw; border-radius: 3vw; background: ${props.theme.background.support};`} onClick={() => { set_mobile_workspace_visible(!mobile_workspace_visible) }} >
                                <Arrow width={0.8} extra={`transform: rotate(${mobile_workspace_visible ? `` : `-`}90deg);`} />
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex row>
                        {
                            new Array(7).fill(0).map((item, index) => {
                                let is_selected_day = +moment(week_start).add(index, `day`).isoWeekday() === week_day + 1
                                let is_today = +moment().isoWeekday() === index + 1
                                return (
                                    <Flex key={index} extra={props => `width: calc(80vw / 7); margin: 1vw; padding: 4vw 0 4vw 0; border-radius: 3vw; background: ${is_selected_day ? props.theme.background.support : `transparent`}; position: relative;`} onClick={() => { set_week_day(index) }} >
                                        <Flex extra={props => `position: absolute; width: 3vw; height: 3vw; border-radius: 3vw; background: ${props.theme.accept}; top: 0; right: 0;`} />
                                        <Text color={props => props.theme.text.primary} size={1} bold={is_selected_day} extra={`opacity: 50%;`} >
                                            {mvConsts.weekDays.short[index][0]}
                                        </Text>
                                        <Text color={props => props.theme.text.primary} size={1} bold={is_selected_day} extra={`margin-top: 3vw;`} >
                                            {moment(week_start).add(index, `day`).format(`DD`)}
                                        </Text>
                                    </Flex>
                                )
                            })
                        }
                    </Flex>
                    <Flex extra={`display: block; max-height: 65vh; opacity: ${+mobile_workspace_visible}; overflow-y: scroll;`} >
                        <Flex row extra={`width: 100vw; position: relative;`}>
                            <TimePointer visible={week_start === +moment().startOf(`isoWeek`)} />
                            <Flex extra={`width: 20vw;`}>
                                {
                                    new Array(24).fill(0).map((item, index) => {
                                        return (
                                            <Flex extra={`width: 100%; height: ${height_}vh;`} key={index} >
                                                <Text color={props => `${props.theme.text.support}`} >{moment().startOf(`day`).add(index, `hour`).format(`HH:mm`)}</Text>
                                            </Flex>
                                        )
                                    })
                                }
                            </Flex>
                            <Flex row extra={`width: 70vw; height: ${24 * height_}vh`}>
                                {
                                    new Array(1).fill(0).map((item, index) => {
                                        let events_for_day = events.filter(i => i.target_id === selected_target).filter(i => +moment(i.start_timestamp).startOf(`day`) === +moment(week_start).add(week_day, `day`))
                                        return (
                                            <Day key={index} >
                                                {
                                                    events_for_day.map((e, e_i) => {
                                                        let day_length = 24 * 60 * 60 * 1000
                                                        let length_in_ms = (+e.end_timestamp - +e.start_timestamp)
                                                        let height = length_in_ms / day_length * (24 * height_) * 0.96
                                                        let top = (+e.start_timestamp - +moment(e.start_timestamp).startOf(`day`)) / day_length * (24 * height_)
                                                        let is_before = +e.end_timestamp < +moment()
                                                        return (
                                                            <Event key={e_i} is_before={is_before} is_selected={details_id === e.objectId && details_visible} accepted={e.accepted} height={height} top={top} id={`e_` + e.id} day_length={day_length} length_in_ms={length_in_ms} onClick={() => { set_details_visible(false, details_id); setTimeout(() => { set_details_visible(true, e.objectId) }, 200) }} >
                                                                <Flex extra={`height: 1.2vw; justify-content: space-around; align-items: flex-start; margin: ${length_in_ms / day_length > 1 / 24 ? 6 : 0}vw 0 0 2vw;`} >
                                                                    <Text color={`white`} bold >{moment(e.start_timestamp).format(`HH:mm`)}</Text>
                                                                    <Text color={`white`} >{cutter(e.username.split(`@`)[0])}</Text>
                                                                </Flex>
                                                            </Event>
                                                        )
                                                    })
                                                }
                                            </Day>
                                        )
                                    })
                                }
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

let mapStateToProps = (state) => {
    return {
        is_admin: state.user.is_admin,
        user: state.user.user,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(EventSpaces)

const Arrow = styled(Image).attrs({
    src: props => props.theme.background.primary === `#fff` ? require(`../../assets/images/arrow.svg`) : require(`../../assets/images/arrow_white.svg`),
})``;

let TimePointer = (props) => {
    let { visible } = props
    const TimeLine = styled(Flex)`
    width: 60vw;
    height: 1px;
    background: ${props => props.theme.WARM_ORANGE};
    box-shadow: 0 0.5vw 1vw ${props => props.theme.background.primary === `#fff` ? `transparent` : props.theme.WARM_ORANGE};
    z-index: 1;
    @media (min-width: 320px) and (max-width: 480px) {
        
    }`
    const TimeCircle = styled(Flex)`
    width: 0.5vw;
    height: 0.5vw;
    border-radius: 0.5vw;
    background: ${props => props.theme.WARM_ORANGE};
    box-shadow: 0 0vw 1vw ${props => props.theme.background.primary === `#fff` ? `transparent` : props.theme.WARM_ORANGE};
    z-index: 1;
    position: absolute;
    left: ${(+moment().isoWeekday() - 1) * 60 / 7 + 3.75}vw;
    @media (min-width: 320px) and (max-width: 480px) {
        
    }`
    let [current_time, set_current_time] = useState(+moment())
    useEffect(() => {
        let timer = setInterval(() => { set_current_time(+moment()) }, 1000)
        return () => { clearInterval(timer) }
    }, [])
    return (
        <Flex row extra={`opacity: ${+visible}; transition: 0.5s; position: absolute; top: ${(+moment() - +moment().startOf(`day`)) / (24 * 60 * 60 * 1000) * 100}%; right: 0;`} >
            <Text bold extra={`width: 4vw;`} color={props => props.theme.WARM_ORANGE} >{moment().format(`HH:mm`)}</Text>
            <TimeLine />
            <TimeCircle />
        </Flex>
    )
}

const LikeButton = styled(Flex)`
cursor: pointer;
width: ${props => +props.visible * 2}vw;
height: ${props => +props.visible * 2}vw;
margin-left: ${props => +props.visible * 0.5}vw;
border-radius: 0.5vw;
background: ${props => props.color}
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const TitleRow = styled(Flex)`
width: 100%;
height: 10%;
background: ${props => props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.04)` : `rgba(255, 255, 255, 0.15)`};
flex-direction: row;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const EventSupport = styled(Flex)`
width: 75vw;
justify-content: flex-start;
align-items: ${props => props.length_in_ms / props.day_length > 1 / 24 ? `flex-start` : `center`};
height: ${props => props.height}vh;
border-radius: 0.5vw;
background: ${props => convertHex(props.accepted ? props.theme.accept : props.theme.yellow, props.is_before ? 0.5 : 1)};
cursor: pointer;
${props => props.is_selected ? `box-shadow: 0 0 1vw ${props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.2)` : props.is_before ? `transparent` : props.accepted ? props.theme.accept : props.theme.yellow}; transform: scale(1.05);` : ``}
&:hover {
    transform: scale(1.05);
    box-shadow: 0 0 1vw ${props => props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.2)` : props.is_before ? `transparent` : props.accepted ? props.theme.accept : props.theme.yellow};
};
flex-direction: row;
@media (min-width: 320px) and (max-width: 480px) {
    border-radius: 2vw;
    margin: ${props => +props.visible * 2}vw;
}
`

const Event = styled(Flex)`
width: 95%;
justify-content: flex-start;
align-items: ${props => props.length_in_ms / props.day_length > 1 / 24 ? `flex-start` : `center`};
height: ${props => props.height}vh;
border-radius: 0.5vw;
background: ${props => convertHex(props.accepted ? props.theme.accept : props.theme.yellow, props.is_before ? 0.5 : 1)};
position: absolute;
top: ${props => props.top}vh;
cursor: pointer;
${props => props.is_selected ? `box-shadow: 0 0 1vw ${props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.2)` : props.is_before ? `transparent` : props.accepted ? props.theme.accept : props.theme.yellow}; transform: scale(1.05);` : ``}
&:hover {
    transform: scale(1.05);
    box-shadow: 0 0 1vw ${props => props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.2)` : props.is_before ? `transparent` : props.accepted ? props.theme.accept : props.theme.yellow};
};
flex-direction: row;
@media (min-width: 320px) and (max-width: 480px) {
    border-radius: 2vw;
}
`

const CalendarArrowWrapper = styled(Flex)`
width: 3vw;
height: 2vw;
background: ${props => props.theme.background.secondary};
&:hover {
    background: ${props => convertHex(props.theme.background.secondary, 0.5)};
};
cursor: pointer;
@media (min-width: 320px) and (max-width: 480px) {
    width: 15vw;
    height: 10vw;
    &:hover {
        background: ${props => props.theme.background.secondary};
    };
}`

const Day = styled(Flex)`
width: calc(60vw / 7);
height: 100%;
border-left: 0.1vw solid ${props => props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.03)` : `rgba(255, 255, 255, 0.1)`};
position: relative;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
    border-left: 0.4vw solid ${props => props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.03)` : `rgba(255, 255, 255, 0.1)`};
}`

const Block = styled(Flex)`
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const LeftWrapper = styled(Flex)`
display: block;
width: 20vw;
height: 90vh;
max-height: 90vh;
overflow-y: scroll;
background: ${props => props.theme.background.primary};
border-radius: 1vw;
position: relative;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const RightWrapper = styled(Flex)`
width: 70vw;
height: 90vh;
background: ${props => props.theme.background.primary};
border-radius: 1vw;
overflow: hidden;
position: relative;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

/*eslint-enable no-unused-vars*/