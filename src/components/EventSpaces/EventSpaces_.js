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
import CreateSpacePopUp from './CreateTargetPopUp'
import { connect } from 'react-redux'
import axios from 'axios'
import BookEventPopUp from './BookEventPopUp'

let get_targets = () => axios.get(`${mvConsts.api}/targets/get`).then(d => d.data).catch(e => e)
let get_events = () => axios.get(`${mvConsts.api}/events/get`).then(d => d.data).catch(e => e)
let get_dormitories = () => axios.get(`${mvConsts.api}/dormitory/get`).then(d => d.data).catch(e => e)

let useDetails = (default_value) => {
    let [id, set_id] = useState(``)
    let [details_ref, details_visible, set_details_visible] = useComponentVisible(default_value);
    return [details_ref, details_visible, (visible, id) => {
        set_details_visible(visible)
        set_id(id)
    }, id]
}

let Arrow = (props) => <Image {...props} src={require(`../../assets/images/arrow_white.svg`)} />

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
    let height_ = 6
    return (
        <Flex extra={`position: relative; @supports (-webkit-overflow-scrolling: touch) { height: 75vh; }`} >
            {/* <Flex extra={`width: 94vw; height: 10vh; background: blue;`} >

            </Flex> */}
            <Flex row extra={`width: 94vw; justify-content: space-around;`} >
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
                    {/* <Flex row extra={`width: 16vw; padding: 1vw 2vw 1vw 2vw; justify-content: space-between;`}>
                        <Button short={false} backgroundColor={props => props.theme.accept} >Создать</Button>
                    </Flex> */}
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
                </LeftWrapper>
                <RightWrapper>
                    <Flex row extra={`width: 100%; height: 10%; background: rgba(255, 255, 255, 0.15);`} >
                        <Flex extra={`width: 10%; height: 100%;`} >

                        </Flex>
                        {
                            new Array(7).fill(0).map((item, index) => {
                                let is_today = +moment().startOf(`day`) === +moment(week_start).add(index, `day`)
                                return (
                                    <Day key={index} >
                                        <Text color={props => `${is_today ? props.theme.text.primary : props.theme.text.support}`} >{moment(week_start).add(index, `day`).format(`DD.MM`)}</Text>
                                    </Day>
                                )
                            })
                        }
                    </Flex>
                    <Flex extra={`width: 100%; height: 90%; display: block; max-height: 90%; overflow-y: scroll;`} >
                        <Flex row extra={`width: 100%;`}>
                            <Flex extra={`width: 10%;`}>
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
                            <Flex row extra={`width: 90%; height: ${24 * height_}vh`}>
                                {
                                    new Array(7).fill(0).map((item, index) => {
                                        return (
                                            <Flex extra={`width: calc(100% / 7); height: 100%; border-left: 0.1vw solid rgba(255, 255, 255, 0.1); position: relative;`} key={index} >
                                                {
                                                    events.map((e, e_i) => {
                                                        let day_length = 24 * 60 * 60 * 1000
                                                        let height = (+e.end_timestamp - +e.start_timestamp) / day_length * (24 * height_)
                                                        let visible = (e.target_id === selected_target) && (+moment(e.start_timestamp).startOf(`day`) === +moment(week_start).add(index, `day`))
                                                        height = visible ? height : 0
                                                        let top = (+e.start_timestamp - +moment(e.start_timestamp).startOf(`day`)) / day_length * (24 * height_)
                                                        return (
                                                            <Event key={e_i} is_selected={details_id === e.objectId && details_visible} accepted={e.accepted} height={height} top={top} id={`e_` + e.id} onClick={() => { set_details_visible(false, e.objectId); setTimeout(() => { set_details_visible(true, e.objectId) }, 200) }} >
                                                                <Flex extra={`height: ${visible ? 0.3 : 0}vw; justify-content: space-around; align-items: flex-start; margin-left: 0.5vw;`} >
                                                                    <Text color={`white`} size={visible ? 0.8 : 0.0001} >{moment(e.start_timestamp).format(`HH:mm`)}</Text>
                                                                    {/* <Text color={`white`} >{moment(e.end_timestamp).format(`HH:mm`)}</Text> */}
                                                                </Flex>
                                                            </Event>
                                                        )
                                                    })
                                                }
                                            </Flex>
                                        )
                                    })
                                }
                            </Flex>
                        </Flex>
                    </Flex>
                </RightWrapper>
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

const Event = styled(Flex)`
width: 95%;
justify-content: flex-start;
height: ${props => props.height}vh;
border-radius: 0.5vw;
background: ${props => props.accepted ? props.theme.accept : props.theme.yellow};
position: absolute;
top: ${props => props.top}vh;
// top: 0vh;
z-index: 2;
cursor: pointer;
${props => props.is_selected ? `box-shadow: 0 0 1vw ${props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.2)` : props.accepted ? props.theme.accept : props.theme.yellow}; transform: scale(1.05);` : ``}
&:hover {
    transform: scale(1.05);
    box-shadow: 0 0 1vw ${props => props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.2)` : props.accepted ? props.theme.accept : props.theme.yellow};
};
flex-direction: row;
@media (min-width: 320px) and (max-width: 480px) {
    
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
    
}`

const Day = styled(Flex)`
width: calc(90% / 7);
height: 100%;
border-left: 0.1vw solid rgba(255, 255, 255, 0.1);
@media (min-width: 320px) and (max-width: 480px) {
    
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
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const RightWrapper = styled(Flex)`
width: 70vw;
height: 90vh;
background: ${props => props.theme.background.primary};
border-radius: 1vw;
overflow: hidden;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

/*eslint-enable no-unused-vars*/