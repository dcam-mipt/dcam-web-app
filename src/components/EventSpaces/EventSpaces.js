/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Text, Image, PopUp } from '../UIKit/styled-templates'
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

let EventTargets = (props) => {
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
    let [requests_ref, requests_visible, set_requests_visible] = useComponentVisible(false);
    let [my_books_ref, my_books_visible, set_my_books_visible] = useComponentVisible(false);
    let [details_ref, details_visible, set_details_visible, details_id] = useDetails(false);
    let selected_dormitory_number = dormitories.filter(i => i.objectId === selected_dormitory)[0] && dormitories.filter(i => i.objectId === selected_dormitory)[0].number
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
    return (
        <Flex row extra={`position: relative; @supports (-webkit-overflow-scrolling: touch) { height: 75vh; }`} >
            <PopUp extra={`top: ${details_visible ? 1 : 0}vw; left: 0vw;`} ref={details_ref} visible={details_visible} >
                <BookEventPopUp event={d} onDelete={() => { get_events().then(d => { set_events(d) }) }} />
            </PopUp>
            <Flex>
                <Flex row extra={`height: 30vh; width: 90vw; justify-content: space-between;`} >
                    <Flex row >
                        {
                            targets.filter(i => i.dormitory_id === selected_dormitory).map((item, index) => {
                                return (
                                    <SquareWrapper key={index} title={item.name} color={selected_target === item.objectId ? props => props.theme.lightblue : null} onClick={() => { set_selected_target(item.objectId) }} >
                                        <Image src={item.avatar.url} width={4} />
                                    </SquareWrapper>
                                )
                            })
                        }
                        {
                            is_admin && <Flex extra={`position: relative;`} >
                                <PopUp extra={`top: ${create_target_visible ? 2 : 1}vw; left: 0;`} ref={create_target_ref} visible={create_target_visible} >
                                    <CreateSpacePopUp dormitory_id={selected_dormitory} onCreate={() => { get_targets().then(d => { set_targets(d) }) }} />
                                </PopUp>
                                <SquareWrapper title={`добавить`} onClick={() => { set_create_target_visible(true) }} >
                                    <Image src={require(`../../assets/images/plus.svg`)} width={4} />
                                </SquareWrapper>
                            </Flex>
                        }
                    </Flex>
                    <Flex row >

                        <Flex extra={`position: relative;`} >
                            <PopUp extra={`top: ${create_event_visible ? 2 : 1}vw; right: 0vw;`} ref={create_event_ref} visible={create_event_visible} >
                                <CreateEventPopUp target_id={selected_target} onCreate={() => { get_events().then(d => { set_events(d); set_create_event_visible(false) }) }} />
                            </PopUp>
                            <SquareWrapper title={`записаться`} onClick={() => { set_create_event_visible(true) }} >
                                <Image src={require(`../../assets/images/plus_white.svg`)} extra={`opacity: 0.75;`} width={4} />
                            </SquareWrapper>
                        </Flex>

                        <Flex extra={`position: relative;`} >
                            <PopUp extra={`top: ${week_selector_visible ? 2 : 1}vw; right: 0;`} ref={week_selector_ref} visible={week_selector_visible} >
                                <Calendar onSelectDate={(date) => { set_week_start(+moment(date).startOf(`isoWeek`)); set_week_selector_visible(false) }} />
                            </PopUp>
                            <SquareWrapper title={`добавить`} onClick={() => { set_week_selector_visible(true) }} >
                                <Flex extra={`width: 4vw; height: 4vw;`} >
                                    <Text size={1.5} color={props => props.theme.text.support} extra={`border-bottom: 0.1vw solid ${props => props.theme.text.support}`} >{moment(week_start).format(`DD`)}</Text>
                                    <Text size={1.5} color={props => props.theme.text.support} >{moment(week_start).format(`MM`)}</Text>
                                </Flex>
                            </SquareWrapper>
                        </Flex>
                        <Flex extra={`position: relative;`} >
                            <PopUp extra={`top: ${dormitory_visible ? 2 : 1}vw; right: 0vw;`} ref={dormitory_ref} visible={dormitory_visible} >
                                {
                                    dormitories && dormitories.map((item, index) => {
                                        return (
                                            <Flex row key={index} extra={`&:hover{ opacity: 0.75;`} onClick={() => { set_selected_dormitory(item.objectId); set_selected_target(targets.filter(i => i.dormitory_id === item.objectId).length > 0 ? targets.filter(i => i.dormitory_id === item.objectId)[0].objectId : 0) }} >
                                                <Flex extra={`width: 0.75vw; height: 0.75vw; border-radius: 2vw; background: ${props => selected_dormitory === item.objectId ? props.theme.accept : props.theme.background.support};`} />
                                                <Text extra={`width: 9vw; align-items: flex-start; margin: 1vw; cursor: pointer; };`} size={1} >Общежитие №{item.number}</Text>
                                            </Flex>
                                        )
                                    })
                                }
                            </PopUp>
                            <SquareWrapper title={`общежитие`} onClick={() => { set_dormitory_visible(true) }} >
                                <Text extra={`width: 4vw; height: 4vw;`} size={3} color={props => props.theme.text.support} >{selected_dormitory_number}</Text>
                            </SquareWrapper>
                        </Flex>
                        <Flex extra={`position: relative;`} >
                            <PopUp extra={`top: ${my_books_visible ? 2 : 1}vw; right: 0vw;`} ref={my_books_ref} visible={my_books_visible} >
                                {
                                    events && events.filter(i => i.user_id === user.objectId).map((item, index) => {
                                        return (
                                            <Flex row key={index} extra={`margin: 0.5vw; align-items: flex-start; cursor: pointer; &:hover{ transform: scale(1.02); };`} onClick={() => { set_details_visible(false, item.objectId); setTimeout(() => { set_details_visible(true, item.objectId) }, 200) }} >
                                                <Flex extra={`width: 6vw; align-items: flex-start; margin-right: 1vw;`} >
                                                    <Flex row >
                                                        <Text bold size={1} >{moment(item.start_timestamp).format(`HH:mm`)}</Text> -
                                                            <Text bold size={1} >{moment(item.end_timestamp).format(`HH:mm`)}</Text>
                                                    </Flex>
                                                    <Text>{moment(item.start_timestamp).format(`DD.MM.YY`)}</Text>
                                                </Flex>
                                                <Text extra={`width: 7vw; align-items: flex-start;`} >{item.username.split(`@`)[0]}</Text>
                                            </Flex>
                                        )
                                    })
                                }
                            </PopUp>
                            <SquareWrapper title={`общежитие`} onClick={() => { events && events.filter(i => i.user_id === user.objectId).length && set_my_books_visible(true) }} >
                                <Text extra={`width: 4vw; height: 4vw;`} size={3} color={props => props.theme.text.support} >{events.filter(i => i.user_id === user.objectId).length}</Text>
                            </SquareWrapper>
                        </Flex>
                        {
                            is_admin && <Flex extra={`position: relative;`} >
                                <PopUp extra={`top: ${requests_visible ? 2 : 1}vw; right: 0vw;`} ref={requests_ref} visible={requests_visible} >
                                    {
                                        events && events.filter(i => i.target_id === selected_target).filter(i => !i.accepted).map((item, index) => {
                                            return (
                                                <Flex row key={index} extra={`margin: 0.5vw; align-items: flex-start; cursor: pointer; &:hover{ transform: scale(1.02); };`} onClick={() => { set_details_visible(false, item.objectId); setTimeout(() => { set_details_visible(true, item.objectId) }, 200) }} >
                                                    <Flex extra={`width: 6vw; align-items: flex-start; margin-right: 1vw;`} >
                                                        <Flex row >
                                                            <Text bold size={1} >{moment(item.start_timestamp).format(`HH:mm`)}</Text> -
                                                            <Text bold size={1} >{moment(item.end_timestamp).format(`HH:mm`)}</Text>
                                                        </Flex>
                                                        <Text>{moment(item.start_timestamp).format(`DD.MM.YY`)}</Text>
                                                    </Flex>
                                                    <Text extra={`width: 7vw; align-items: flex-start;`} >{item.username.split(`@`)[0]}</Text>
                                                    <LikeButton color={props => props.theme.accept} onClick={async () => {
                                                        await axios.get(`${mvConsts.api}/events/accept/${item.objectId}/true`)
                                                        get_events().then(d => { set_events(d) })
                                                    }} >
                                                        <Image src={require(`../../assets/images/like.svg`)} width={1} />
                                                    </LikeButton>
                                                    <LikeButton color={props => props.theme.WARM_ORANGE} onClick={async () => {
                                                        await axios.get(`${mvConsts.api}/events/accept/${item.objectId}/false`)
                                                        get_events().then(d => { set_events(d) })
                                                    }} >
                                                        <Image src={require(`../../assets/images/like.svg`)} width={1} extra={`transform: rotate(180deg);`} />
                                                    </LikeButton>
                                                </Flex>
                                            )
                                        })
                                    }
                                </PopUp>
                                <SquareWrapper title={`заявки`} onClick={() => { (events && events.filter(i => i.target_id === selected_target).filter(i => !i.accepted).length) && set_requests_visible(true) }} >
                                    <Text extra={`width: 4vw; height: 4vw;`} size={3} color={events && events.filter(i => i.target_id === selected_target).filter(i => !i.accepted).length ? `white` : props => props.theme.text.support} >{events && events.filter(i => i.target_id === selected_target).filter(i => !i.accepted).length}</Text>
                                </SquareWrapper>
                            </Flex>
                        }
                    </Flex>
                </Flex>
                <Flex extra={`height: 64vh; justify-content: flex-start; position: relative;`} >
                    <Flex row extra={`padding-left: 5vw;`} >
                        {
                            new Array(24).fill(0).map((item, index) => {
                                return (<Text key={index} color={props => props.theme.text.support} extra={`width: 3.5vw;`} >{moment().startOf(`day`).add(index, `hour`).format(`HH:mm`)}</Text>)
                            })
                        }
                    </Flex>
                    {
                        new Array(7).fill(0).map((item, index) => {
                            let events_for_day = events.filter(i => i.target_id === selected_target).filter(i => +moment(i.start_timestamp).startOf(`day`) === +moment(week_start).add(index, `day`))
                            return (
                                <Flex row key={index} extra={`height: ${(100 / 7) * 0.85}%; margin: 0.2%;`} >
                                    <Text color={props => props.theme.text.support} size={1} extra={`width: 5vw;`} >{moment(week_start).add(index, `day`).format(`DD.MM`)}, {mvConsts.weekDays.short[index].toLocaleUpperCase()}</Text>
                                    <Grid>
                                        {
                                            events_for_day.map((e, e_i) => {
                                                let day_length = 24 * 60 * 60 * 1000
                                                let width = (+e.end_timestamp - +e.start_timestamp) / day_length * 84
                                                let left = (+e.start_timestamp - +moment(e.start_timestamp).startOf(`day`)) / day_length * 84
                                                return (
                                                    <Block key={e_i} is_selected={details_id === e.objectId && details_visible} accepted={e.accepted} width={width} left={left} id={`e_` + e.id} onClick={() => { set_details_visible(false, e.objectId); setTimeout(() => { set_details_visible(true, e.objectId) }, 200) }} >
                                                        <Flex extra={`height: 3vw; justify-content: space-around; align-items: flex-start; margin-left: 0.5vw;`} >
                                                            <Text color={`white`} >{moment(e.start_timestamp).format(`HH:mm`)}</Text>
                                                            <Text color={`white`} >{moment(e.end_timestamp).format(`HH:mm`)}</Text>
                                                        </Flex>
                                                    </Block>
                                                )
                                            })
                                        }
                                        {
                                            new Array(24).fill(0).map((item, index) => {
                                                return (
                                                    <Flex key={index} extra={`width: 7vw; height: 100%; border-right: 0.1vw solid rgba(255, 255, 255, 0.2);`} />
                                                )
                                            })
                                        }
                                    </Grid>
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
        user: state.user.user,
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

let SquareWrapper = (props) => {
    return (
        <Flex>
            <Text extra={`margin: 0.2vw;`} size={1} >{props.title}</Text>
            <Square {...props} >
                <Flex>
                    {props.children}
                </Flex>
            </Square>
        </Flex>
    )
}

const LikeButton = styled(Flex)`
cursor: pointer;
width: 2vw;
height: 2vw;
margin-left: 0.5vw;
border-radius: 0.5vw;
background: ${props => props.color}
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const Block = styled(Flex)`
width: ${props => props.width}vw;
justify-content: flex-start;
height: 80%;
border-radius: 0.5vw;
background: ${props => props.accepted ? props.theme.accept : props.theme.yellow};
position: absolute;
left: ${props => props.left}vw;
z-index: 2;
cursor: pointer;
${props => props.is_selected ? `box-shadow: 0 0 1vw ${props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.2)` : props.accepted ? props.theme.accept : props.theme.yellow}; transform: scale(1.05);` : `` }
&:hover {
    transform: scale(1.05);
    box-shadow: 0 0 1vw ${props => props.theme.background.primary === `#fff` ? `rgba(0, 0, 0, 0.2)` : props.accepted ? props.theme.accept : props.theme.yellow};
};
flex-direction: row;
@media (min-width: 320px) and (max-width: 480px) {
    
}
`

const Square = styled(Flex)`
margin: 0.5vw;
padding: 1vw;
border-radius: 2vw;
background: ${props => props.color ? props.color : props.theme.background.primary};
cursor: pointer;
&:hover {
    transform: scale(1.05) rotate(5deg);
    > * {
        // transform: rotate(-90deg);
    }
};
> * {
    padding: 1vw;
    border-radius: 6vw;
    background: ${props => props.color ? `rgba(255, 255, 255, 0.3)` : `rgba(0, 0, 0, 0.1)`};
}
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const Grid = styled(Flex)`
position: relative;
width: 84vw;
height: 100%;
margin: 0.25vw;
background: ${props => props.theme.background.support};
border-radius: 0.5vw;
flex-direction: row;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

/*eslint-enable no-unused-vars*/