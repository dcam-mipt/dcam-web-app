/*eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import userActions from '../../redux/actions/UserActions'
import axios from 'axios'
import styled from 'styled-components'
import moment from 'moment-timezone'
import Button from '../Button'
import useComponentVisible from '../useComponentVisible'
import mvConsts from '../../constants/mvConsts';
import BookPopUp from './BookPopUp'
import BucketPopUp from './BucketPopUp'
import ReservationsPopUp from './ReservationsPopUp'
import { Flex, Image, Text, PopUp } from '../styled-templates'
import Circles from '../Circles'

let compareObjects = (a, b) => JSON.stringify(a) === JSON.stringify(b)

let useSlots = (initialIsVisible) => {
    const [selectedSlots, setSelectedSlots] = useState(initialIsVisible);
    let setSlots = (slot) => {
        if (selectedSlots.filter(i => compareObjects(i, slot)).length) {
            setSelectedSlots(selectedSlots.filter(i => !compareObjects(i, slot)))
        } else {
            setSelectedSlots(selectedSlots.concat([slot]))
        }
    }
    return [selectedSlots, setSlots, setSelectedSlots];
}

let Laundry = (props) => {
    let [selectedDay, setSelectedDay] = useState(+moment().startOf(`day`))
    let [mobileCalendar, setMobileCalendar] = useState(false)
    let [selectedSlots, selectSlot, setSelectedSlots] = useSlots([])
    let [bucketRef, bucketVisible, setBucketVisible] = useComponentVisible(false);
    let [reservationsRef, reservationsVisible, setReservationsVisible] = useComponentVisible(false);
    let [selectedBook, setSelectedBook] = useState(undefined)
    let [bookRef, bookVisible, setBookVisible] = useComponentVisible(false);
    let my_reservations = props.user ? props.laundry.filter(i => i.user_id === props.user.objectId && i.timestamp > +moment().add(-2, `hour`)) : []
    useEffect(() => { !selectedSlots.length && setBucketVisible(false) })
    useEffect(() => { !my_reservations.length && setReservationsVisible(false) })
    useEffect(() => { if (!bookVisible) setSelectedBook(undefined) })
    let header = (
        <CalendarHeader>
            <Button backgroundColor={mvConsts.colors.accept} only_desktop onClick={() => { setSelectedDay(+moment().startOf(`day`)) }} >
                Сегодня
            </Button>
            <Button disabled={!my_reservations.length} onClick={() => { setReservationsVisible(!reservationsVisible) }} >
                Мои стирки
            </Button>
            <Button backgroundColor={mvConsts.colors.lightblue} disabled={!selectedSlots.length} onClick={() => { setBucketVisible(!bucketVisible) }} >
                Корзина {selectedSlots.length && `(${selectedSlots.length})`}
            </Button>
            <Button backgroundColor={mvConsts.colors.accept} only_mobile onClick={() => { setMobileCalendar(!mobileCalendar) }} >
                {mobileCalendar ? `Расписание` : moment(+selectedDay).format(`DD.MM`)}
            </Button>
        </CalendarHeader>
    )
    return (
        <GlobalWrapper>
            {
                props.laundry.length
                    ? <Flex>
                        <PopUp ref={bucketRef} visible={bucketVisible} >
                            <BucketPopUp {...props} selectedSlots={selectedSlots} selectSlot={selectSlot} days_of_week_full setSelectedSlots={setSelectedSlots} />
                        </PopUp>
                        <PopUp ref={reservationsRef} visible={reservationsVisible} >
                            <ReservationsPopUp {...props} my_reservations={my_reservations} setReservationsVisible={setReservationsVisible} setSelectedDay={setSelectedDay} setSelectedBook={setSelectedBook} setBookVisible={setBookVisible} />
                        </PopUp>
                        <PopUp ref={bookRef} visible={bookVisible && selectedBook} setBookVisible={setBookVisible} >
                            <BookPopUp {...props} selectedBook={selectedBook} setBookVisible={setBookVisible} />
                        </PopUp>
                        <Wrapper>
                            <Calendar mobileCalendar={mobileCalendar} >
                                <Flex only_desktop > {header} </Flex>
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
                                                            onClick={() => { !is_before && setSelectedDay(start_of_day); setMobileCalendar(false) }}
                                                            is_selected_day={selectedDay === +moment(start_of_day).startOf(`day`)}
                                                            is_today={+moment().startOf(`day`) === +moment(start_of_day).startOf(`day`)}
                                                            is_before={is_before}
                                                            is_weekend={+moment(start_of_day).isoWeekday() > 5}
                                                        >
                                                            {dayCell(start_of_day, props.laundry.filter(i => +moment(i.timestamp).startOf(`day`) === start_of_day).length, props.machines.length)}
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
                                                        let slot_data = { machine_id: machine.objectId, timestamp: timestamp }
                                                        let is_book = props.laundry.filter(i => i.timestamp === timestamp).filter(i => i.machine_id === machine.objectId).length
                                                        let book = is_book && props.laundry.filter(i => i.timestamp === timestamp).filter(i => i.machine_id === machine.objectId)[0]
                                                        let is_my_book = my_reservations.filter(i => i.timestamp === timestamp).filter(i => i.machine_id === machine.objectId).length
                                                        let is_before = slot_data.timestamp < +moment().add(-2, `hour`)
                                                        return (
                                                            <Machine
                                                                index={machine_index}
                                                                width={props.machines.length}
                                                                key={machine_index}
                                                                onClick={() => { if (!is_before) { !is_book ? selectSlot(slot_data) : setSelectedBook(book); setBookVisible(true) } }}
                                                                is_selected={selectedSlots.filter((i, index) => compareObjects(i, slot_data)).length}
                                                                is_book={is_book}
                                                                is_my_book={is_my_book}
                                                                is_before={is_before}
                                                            >
                                                                {is_book ? book.email.split(`@`)[0] : `-`}
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
                    : <Circles rotate={props.laundry.length < 1} />
            }
        </GlobalWrapper >
    )
}

let mapStateToProps = (state) => {
    return {
        machines: state.machines.machines,
        laundry: state.laundry.laundry,
        user: state.user.user,
        is_admin: state.user.is_admin,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        setToken: (data) => {
            return dispatch(userActions.setToken(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Laundry)

let days_of_week_full = [`Понедельник`, `Вторник`, `Среда`, `Четверг`, `Пятница`, `Суббота`, `Воскресенье`]
let days_of_week_short = [`пн`, `вт`, `ср`, `чт`, `пт`, `сб`, `вс`]

let dayCell = (start_of_day = +moment(), booked = 0, machines_number = 0) => {
    let percentage = booked / (machines_number * 12)
    let color = percentage > (2 / 3) ? mvConsts.colors.WARM_ORANGE : percentage < (1 / 3) ? mvConsts.colors.accept : mvConsts.colors.yellow
    let is_week_end = moment(start_of_day).isoWeekday() > 5
    let mobile_cell = () => {
        return (
            <Flex extra={``} row>
                <Flex extra={`width: 30vw;`} row >
                    <Text size={1} color={is_week_end ? mvConsts.colors.WARM_ORANGE : null} >
                        {days_of_week_short[moment(start_of_day).isoWeekday() - 1].toUpperCase()}, {moment(start_of_day).format(`DD.MM`)}
                    </Text>
                </Flex>
                <Flex extra={`width: 40vw;`} row >
                    <Text extra={`margin-right: 2vw;`} >Свободно:</Text>
                    <Text color={color} >{machines_number * 12 - booked}</Text>
                </Flex>
                <Flex extra={`width: 5vw;`} ><Image src={require(`../../assets/images/arrow.svg`)} width={1.5} /></Flex>
            </Flex>
        )
    }
    let desktop_cell = () => {
        return (
            <Flex>
                <Flex row >
                    <Flex only_desktop extra={`width: 2vw; height: 2vw;`} >{moment(start_of_day).format(`DD`)}</Flex>
                    .<Flex extra={`width: 2vw; height: 2vw;`} >{moment(start_of_day).format(`MM`)}</Flex>
                </Flex>
                <Flex row >
                    <Flex extra={`width: 2vw; height: 2vw; color: ${color}`} >{machines_number * 12 - booked}</Flex>
                    /<Flex extra={`width: 2vw; height: 2vw;`} >{machines_number * 12}</Flex>
                </Flex>
            </Flex>
        )
    }
    return (
        <Flex>
            <Flex only_mobile>{mobile_cell()}</Flex>
            <Flex only_desktop>{desktop_cell()}</Flex>
        </Flex>
    )
}

const TimeNode = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 5vw;
font-size: 0.8vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 15vw;
    font-size: 4vw;
}`

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row;
transition: 0.2s;
width: 94vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 100vh;
    flex-direction: column;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}`

const Calendar = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column;
transition: 0.2s;
width: 64vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.mobileCalendar ? `block` : `none`}
    width: 100vw;
    max-height: 92vh;
    overflow: scroll;
    padding: 1vh 0 16vh 0;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}`

const Schedule = styled.div`
display: flex
justify-content: center
align-items: center
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
    height: 85vh;
}`

const TwoHourRow = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
transition: 0.2s
width: 30vw;
height: 3.2vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 13vw;
}`

const Machine = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: ${props => 20 / props.width}vw;
height: 3vw;
cursor: pointer;
background-color: ${props => props.is_before ? `none` : props.is_my_book ? mvConsts.colors.accept : props.is_book ? mvConsts.colors.WARM_ORANGE : props.is_selected ? mvConsts.colors.lightblue : mvConsts.colors.background.support};
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

const WeekRow = styled.div`
display: flex
justify-content: center
align-items: center
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
background-color: ${props => props.is_before ? `transparent` : props.is_selected_day ? `white` : props.is_weekend ? `#e0e0e0` : `#d6d6d6`};
border-top-left-radius: ${props => +(props.week_index === 0 && props.day_index === 0) * 1}vw;
border-top-right-radius: ${props => +(props.week_index === 0 && props.day_index === 6) * 1}vw;
border-bottom-left-radius: ${props => +(props.week_index === 3 && props.day_index === 0) * 1}vw;
border-bottom-right-radius: ${props => +(props.week_index === 3 && props.day_index === 6) * 1}vw;
${props => props.is_selected_day ? `border-radius: 0.5vw` : null};
border: 0.${props => 1 + +(props.is_selected_day || props.is_today)}vw solid ${props => props.is_selected_day ? mvConsts.colors.purple : props.is_today ? mvConsts.colors.accept : mvConsts.colors.background.secondary}
cursor: ${props => !props.is_before ? `default` : `pointer`};
@media (min-width: 320px) and (max-width: 480px) {
    width: 92vw;
    height: 20vw;
    padding: 2vw;
    margin: 1vw;
    border-radius: 4vw;
    background-color: white;
    border: 1vw solid ${props => props.is_selected_day ? mvConsts.colors.purple : props.is_today ? mvConsts.colors.accept : `transparent`}
}`

const GlobalWrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 94vw;
height: 94vh;
@media (min-width: 320px) and (max-width: 480px) {
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}
`

const CalendarHeader = styled.div`
display: flex
justify-content: flex-end
align-items: center
flex-direction: row
transition: 0.2s
width: 60vw;
@media (min-width: 320px) and (max-width: 480px) {
    background-color: white;
    height: 8vh;
    width: 100vw;
}`
/*eslint-enable no-unused-vars*/