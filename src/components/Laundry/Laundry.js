/*eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import userActions from '../../redux/actions/UserActions'
import laundryActions from '../../redux/actions/LaundryActions'
import axios from 'axios'
import styled from 'styled-components'
import moment from 'moment-timezone'
import Button from '../UIKit/Button'
import useComponentVisible from '../UIKit/useComponentVisible'
import mvConsts from '../../constants/mvConsts';
import BookPopUp from './BookPopUp'
import { Flex, Image, Text, PopUp, convertHex } from '../UIKit/styled-templates'
import Switcher from '../UIKit/Switcher'
import Circles from '../UIKit/Circles'
import PurchasesPopUp from './PurchasesPopUp'

let compareObjects = (a, b) => JSON.stringify(a) === JSON.stringify(b)

let useSlots = (initialIsVisible) => {
    const [selected_slots, set_selected_slots] = useState(initialIsVisible);
    let set_slots = (slot) => {
        if (selected_slots.filter(i => compareObjects(i, slot)).length) {
            set_selected_slots(selected_slots.filter(i => !compareObjects(i, slot)))
        } else {
            set_selected_slots(selected_slots.concat([slot]))
        }
    }
    return [selected_slots, set_slots, set_selected_slots];
}

let cutter = (s) => s.length > 11 ? s.substring(0, 8) + `...` : s
let get_laundry = () => new Promise((resolve, reject) => { axios.get(`${mvConsts.api}/laundry/get`).then((d) => { resolve(d) }).catch(e => console.log(e)) })

let Laundry = (props) => {
    let [selectedDay, set_selected_day] = useState(+moment().startOf(`day`))
    let [mobileCalendar, setMobileCalendar] = useState(false)
    let [selected_slots, select_slot, set_selected_slots] = useSlots([])
    let [purchases_ref, purchases_visible, set_purchases_visible, close_purchases, PurchasesWrapper] = useComponentVisible(false);
    let [selectedBook, set_selected_book] = useState(undefined)
    let [bookRef, book_visible, set_book_visible, close_book] = useComponentVisible(false);
    let my_reservations = props.user && props.laundry ? props.laundry.filter(i => i.user_id === props.user.objectId && i.timestamp > +moment().add(-2, `hour`)) : []
    useEffect(() => { if (!book_visible) set_selected_book(undefined) }, [book_visible])
    // useEffect(() => {
    //     let i = setInterval(() => { get_laundry().then((d) => { props.set_laundry(d.data) }) }, 10000)
    //     return () => { clearInterval(i) }
    // }, [])
    let header = (
        <CalendarHeader>
            <Button only_desktop background={props => props.theme.accept} onClick={() => { set_selected_day(+moment().startOf(`day`)) }} >
                Сегодня
            </Button>
            <Button only_desktop background={props => props.theme.lightblue} disabled={selected_slots.length + my_reservations.length < 1} onClick={() => { set_purchases_visible(!purchases_visible) }} >
                Покупки
            </Button>
        </CalendarHeader>
    )
    return (
        <GlobalWrapper>
            {
                props.laundry
                    ? <Flex>
                        <Wrapper>
                            <Flex only_mobile extra={`height: 30vw;`} /> 
                            <PopUp extra={`top: ${book_visible && selectedBook ? 2 : 1}vw; right: 2vw;`} ref={bookRef} visible={book_visible && selectedBook} set_book_visible={set_book_visible} >
                                <BookPopUp close={close_book} {...props} selectedBook={selectedBook} set_book_visible={set_book_visible} />
                            </PopUp>
                            <PopUp ref={purchases_ref} visible={purchases_visible} extra={`top: ${purchases_visible ? 10.25 : 11.5}vw; right: 32vw;`} >
                                <PurchasesPopUp
                                    {...props}
                                    close={close_purchases}
                                    days_of_week_full
                                    my_reservations={my_reservations}
                                    select_slot={select_slot}
                                    selected_slots={selected_slots}
                                    set_book_visible={set_book_visible}
                                    set_selected_book={set_selected_book}
                                    set_selected_day={set_selected_day}
                                    set_selected_slots={set_selected_slots}
                                    set_purchases_visible={set_purchases_visible}
                                />
                            </PopUp>
                            <Flex extra={`position: absolute; top: -1vh; z-index: 1; background: transparnt;`} >
                                <Switcher
                                    only_mobile
                                    width={90}
                                    array={[`Покупки`, `Расписание`, `Календарь`]}
                                    onChange={(index) => {
                                        if (index === 0) { set_purchases_visible(!purchases_visible) }
                                        if (index > 0) {
                                            setMobileCalendar(index === 2)
                                        }
                                    }}
                                    selected={purchases_visible ? 0 : +mobileCalendar + 1}
                                    extra={`box-shadow 0 0 8vw rgba(0, 0, 0, 0.2);`}
                                />
                            </Flex>
                            <Calendar mobileCalendar={mobileCalendar} >
                                <Flex> {header} </Flex>
                                {
                                    new Array(4).fill(0).map((week, week_index) => {
                                        return (
                                            <WeekRow key={week_index} >
                                                {
                                                    new Array(7).fill(0).map((day, day_index) => {
                                                        let start_of_day = +moment().startOf(`isoWeek`).add(week_index, `week`).add(day_index, `day`)
                                                        let is_before = start_of_day < +moment().startOf(`day`)
                                                        return (mobileCalendar ? !is_before : true) && <Day
                                                            key={day_index}
                                                            day_index={day_index}
                                                            week_index={week_index}
                                                            onClick={() => { !is_before && set_selected_day(start_of_day); setMobileCalendar(false) }}
                                                            is_selected_day={selectedDay === +moment(start_of_day).startOf(`day`)}
                                                            is_today={+moment().startOf(`day`) === +moment(start_of_day).startOf(`day`)}
                                                            is_before={is_before}
                                                            is_weekend={+moment(start_of_day).isoWeekday() > 5}
                                                        >
                                                            {dayCell(start_of_day, props.laundry.filter(i => +moment(i.timestamp).startOf(`day`) === start_of_day).length, props.machines.filter(i => !i.is_broken).length)}
                                                        </Day>
                                                    })
                                                }
                                            </WeekRow>
                                        )
                                    })
                                }
                            </Calendar>
                            <Schedule mobileCalendar={mobileCalendar} >
                                {
                                    <TwoHourRow>
                                        <TimeNode />
                                        {props.machines.map((i, index) => <Machine index={index} key={index} width={props.machines.length} >{index + 1}</Machine>)}
                                    </TwoHourRow>
                                }
                                {
                                    new Array(12).fill(0).map((i, index) => {
                                        let timestamp = +moment(selectedDay).add(index * 2, `hour`)
                                        return (
                                            <TwoHourRow key={index} >
                                                <TimeNode>
                                                    {moment(selectedDay).startOf(`day`).add(index * 2, `hour`).format(`HH:mm`)}
                                                </TimeNode>
                                                {
                                                    props.machines.map((machine, machine_index) => {
                                                        let compar_dates = (a, b) => moment(a).format(`DD.MM.YY HH:mm`) === moment(b).format(`DD.MM.YY HH:mm`)
                                                        let slot_data = { machine_id: machine.objectId, timestamp: timestamp }
                                                        let is_book = props.laundry.filter(i => compar_dates(i.timestamp, timestamp)).filter(i => i.machine_id === machine.objectId).length
                                                        let book = is_book && props.laundry.filter(i => compar_dates(i.timestamp, timestamp)).filter(i => i.machine_id === machine.objectId)[0]
                                                        let is_my_book = my_reservations.filter(i => compar_dates(i.timestamp, timestamp)).filter(i => i.machine_id === machine.objectId).length
                                                        let is_before = slot_data.timestamp < +moment().add(-2, `hour`)
                                                        let no_selection_prop = is_before || machine.is_broken
                                                        return (
                                                            <Machine
                                                                index={machine_index}
                                                                width={props.machines.length}
                                                                key={machine_index}
                                                                onClick={() => { if (!no_selection_prop) { !is_book ? select_slot(slot_data) : set_selected_book(book); set_book_visible(true) } }}
                                                                is_selected={selected_slots.filter((i, index) => compareObjects(i, slot_data)).length}
                                                                is_book={is_book}
                                                                is_my_book={is_my_book}
                                                                no_selection_prop={no_selection_prop}
                                                            >
                                                                {cutter(is_book ? book.email.split(`@`)[0].split(`.`)[0] : `-`)}
                                                            </Machine>
                                                        )
                                                    })
                                                }
                                            </TwoHourRow>
                                        )
                                    })
                                }
                            </Schedule>
                            <Flex extra={`position: fixed; bottom: 6vh;`} only_mobile > {header} </Flex>
                        </Wrapper>
                    </Flex>
                    : <Circles rotate />
            }
        </GlobalWrapper >
    )
}

let mapStateToProps = (state) => {
    return {
        machines: state.machines.machines.filter(i => i.dormitory_id === state.dormitories.selected_dormitory),
        laundry: state.laundry.laundry === null ? null : state.laundry.laundry === null ? null : state.laundry.laundry.filter(i => state.machines.machines.filter(j => j.objectId === i.machine_id).map(i => i.dormitory_id)[0] === state.dormitories.selected_dormitory),
        user: state.user.user,
        is_admin: state.user.is_admin,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        setToken: (data) => {
            return dispatch(userActions.setToken(data))
        },
        set_laundry: (data) => {
            return dispatch(laundryActions.set_laundry(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Laundry)

let days_of_week_full = [`Понедельник`, `Вторник`, `Среда`, `Четверг`, `Пятница`, `Суббота`, `Воскресенье`]
let days_of_week_short = [`пн`, `вт`, `ср`, `чт`, `пт`, `сб`, `вс`]

let dayCell = (start_of_day = +moment(), booked = 0, machines_number = 0) => {
    let percentage = booked / (machines_number * 12)
    let color = props => percentage > (2 / 3) ? props.theme.WARM_ORANGE : percentage < (1 / 3) ? props.theme.accept : props.theme.yellow
    let is_week_end = moment(start_of_day).isoWeekday() > 5
    let mobile_cell = () => {
        return (
            <Flex extra={``} row>
                <Flex extra={`width: 30vw;`} row >
                    <Text size={1} text_color={props => is_week_end ? props.theme.WARM_ORANGE : props.theme.text.primary} >
                        {days_of_week_short[moment(start_of_day).isoWeekday() - 1].toUpperCase()}, {moment(start_of_day).format(`DD.MM`)}
                    </Text>
                </Flex>
                <Flex extra={`width: 40vw;`} row >
                    <Text extra={`margin-right: 2vw;`} >Свободно:</Text>
                    <Text text_color={color} >{machines_number * 12 - booked}</Text>
                </Flex>
                <Flex extra={`width: 5vw;`} ><Arrow width={1.5} /></Flex>
            </Flex>
        )
    }
    let desktop_cell = () => {
        return (
            <Text>
                <Flex row >
                    <Flex extra={`width: 2vw; height: 2vw;`} >{moment(start_of_day).format(`DD`)}</Flex>
                    .<Flex extra={`width: 2vw; height: 2vw;`} >{moment(start_of_day).format(`MM`)}</Flex>
                </Flex>
                <Flex row >
                    <Flex extra={props => `width: 2vw; height: 2vw; color: ${color(props)}`} >{machines_number * 12 - booked}</Flex>
                    /<Flex extra={`width: 2vw; height: 2vw;`} >{machines_number * 12}</Flex>
                </Flex>
            </Text>
        )
    }
    return (
        <Flex>
            <Flex only_mobile>{mobile_cell()}</Flex>
            <Flex only_desktop>{desktop_cell()}</Flex>
        </Flex>
    )
}

const Arrow = (props) => <Image {...props} src={require(localStorage.getItem(`theme`) === `light` ? `../../assets/images/arrow.svg` : `../../assets/images/arrow_white.svg`)} />


const TimeNode = styled(Text)`
width: 5vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 15vw;
}`

const Wrapper = styled(Flex)`
flex-direction: row;
width: 94vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 100vh;
    flex-direction: column;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 88vh;
}`

const Calendar = styled(Flex)`
display: flex
flex-direction: column;
transition: 0.2s;
width: 64vw;
height: 92vh;
position: relative;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.mobileCalendar ? `block` : `none`}
    width: 100vw;
    max-height: 92vh;
    overflow: scroll;
    padding: 1vh 0 16vh 0;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 88vh;
}`

const Schedule = styled(Flex)`
display: flex
flex-direction: column;
transition: 0.2s;
width: 30vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.mobileCalendar ? `none` : `block`}
    width: 100vw;
    max-height: ${13 * 14}vw;
    overflow: scroll;
    padding: 1vh 0 16vh 0;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 88vh;
}`

const TwoHourRow = styled(Flex)`
display: flex
flex-direction: row
transition: 0.2s
width: 30vw;
height: 3.2vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 13vw;
}`

const Machine = styled(Flex)`
display: flex
flex-direction: column
transition: 0.2s
width: ${props => 20 / props.width}vw;
height: 3vw;
cursor: pointer;
background: ${props => props.no_selection_prop ? `transparent` : props.is_my_book ? props.theme.accept : props.is_book ? props.theme.WARM_ORANGE : props.is_selected ? props.theme.lightblue : props.theme.background.support};
color: white;
font-size: 0.8vw;
margin: 0 0.08vw 0 0;
border-radius: ${props => +(props.index === 0) * 0.5}vw ${props => +(props.index === props.width - 1) * 0.5}vw ${props => +(props.index === props.width - 1) * 0.5}vw ${props => +(props.index === 0) * 0.5}vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => 20 / props.width * 5}vw;
    border-radius: ${props => +(props.index === 0) * 2}vw ${props => +(props.index === props.width - 1) * 2}vw ${props => +(props.index === props.width - 1) * 2}vw ${props => +(props.index === 0) * 2}vw;
    height: 12vw;
    font-size: 3vw;
    border-width: 0.2vw;
}`

const WeekRow = styled(Flex)`
display: flex
flex-direction: row;
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    flex-direction: column;
}`

const Day = styled(Flex)`
box-sizing: border-box;
-moz-box-sizing: border-box;
-webkit-box-sizing: border-box;
width: 8.5vw;
height: 8.5vw;
background: ${props => props.is_before ? `transparent` : props.is_selected_day ? props.theme.background.primary : props.is_weekend ? convertHex(props.theme.background.support, 0.7) : convertHex(props.theme.background.support, 0.5)};
border-top-left-radius: ${props => +(props.week_index === 0 && props.day_index === 0) * 1}vw;
border-top-right-radius: ${props => +(props.week_index === 0 && props.day_index === 6) * 1}vw;
border-bottom-left-radius: ${props => +(props.week_index === 3 && props.day_index === 0) * 1}vw;
border-bottom-right-radius: ${props => +(props.week_index === 3 && props.day_index === 6) * 1}vw;
${props => props.is_selected_day ? `border-radius: 0.5vw` : null};
border: 0.${props => 1 + +(props.is_selected_day || props.is_today)}vw solid ${props => props.is_selected_day ? props.theme.purple : props.is_today ? props.theme.accept : props.theme.background.secondary}
cursor: ${props => !props.is_before ? `default` : `pointer`};
@media (min-width: 320px) and (max-width: 480px) {
    width: 92vw;
    height: 20vw;
    padding: 2vw;
    margin: 1vw;
    border-radius: 4vw;
    background: ${props => props.theme.background.primary};
    border: 1vw solid ${props => props.is_selected_day ? props.theme.purple : props.is_today ? props.theme.accept : `transparent`}
}`

const GlobalWrapper = styled(Flex)`
display: flex
flex-direction: column
transition: 0.2s
width: 94vw;
height: 94vh;
@media (min-width: 320px) and (max-width: 480px) {
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 88vh;
}
`

const CalendarHeader = styled(Flex)`
display: flex
justify-content: flex-end
flex-direction: row
transition: 0.2s
width: 60vw;
@media (min-width: 320px) and (max-width: 480px) {
    // background: white;
    // height: 8vh;
    width: 100vw;
}`
/*eslint-enable no-unused-vars*/