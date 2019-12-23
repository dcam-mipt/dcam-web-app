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
import BucketPopUp from './BucketPopUp'
import ReservationsPopUp from './ReservationsPopUp'
import { Flex, Image, Text, PopUp } from '../UIKit/styled-templates'
import Circles from '../UIKit/Circles'

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

let cutter = (s) => s.length > 11 ? s.substring(0, 8) + `...` : s
let get_laundry = () => new Promise((resolve, reject) => { axios.get(`https://dcam.pro/api/laundry/get`).then((d) => { resolve(d) }).catch(e => console.log(e)) })

let Laundry = (props) => {
    let [selectedDay, setSelectedDay] = useState(+moment().startOf(`day`))
    let [mobileCalendar, setMobileCalendar] = useState(false)
    let [selectedSlots, selectSlot, setSelectedSlots] = useSlots([])
    let [bucket_ref, bucket_visible, set_bucket_visible, close_bucket] = useComponentVisible(false);
    let [reservationsRef, reservationsVisible, setReservationsVisible, close_reservations] = useComponentVisible(false);
    let [selectedBook, setSelectedBook] = useState(undefined)
    let [bookRef, bookVisible, setBookVisible, close_book] = useComponentVisible(false);
    let my_reservations = props.user && props.laundry ? props.laundry.filter(i => i.user_id === props.user.objectId && i.timestamp > +moment().add(-2, `hour`)) : []
    useEffect(() => { !selectedSlots.length && set_bucket_visible(false) })
    useEffect(() => { !my_reservations.length && setReservationsVisible(false) })
    useEffect(() => { if (!bookVisible) setSelectedBook(undefined) })
    useEffect(() => {
        let i = setInterval(() => { get_laundry().then((d) => { props.setLaundry(d.data) }) }, 10000)
        return () => { clearInterval(i) }
    }, [])
    let header = (
        <CalendarHeader>
            <Button backgroundColor={props => props.theme.accept} only_desktop onClick={() => { setSelectedDay(+moment().startOf(`day`)) }} >
                Сегодня
            </Button>
            <Button disabled={!my_reservations.length} onClick={() => { setReservationsVisible(!reservationsVisible) }} >
                Мои стирки
                <PopUp extra={`top: ${reservationsVisible ? 3.5 : 2}vw; right: 0vw;`} ref={reservationsRef} visible={reservationsVisible} >
                    <ReservationsPopUp close={close_reservations} {...props} my_reservations={my_reservations} setReservationsVisible={setReservationsVisible} setSelectedDay={setSelectedDay} setSelectedBook={setSelectedBook} setBookVisible={setBookVisible} />
                </PopUp>
            </Button>
            <Button backgroundColor={props => props.theme.lightblue} disabled={!selectedSlots.length} onClick={() => { set_bucket_visible(!bucket_visible) }} >
                Корзина {selectedSlots.length && `(${selectedSlots.length})`}
                <PopUp extra={`top: ${bucket_visible ? 3.5 : 2}vw; right: 0vw;`} ref={bucket_ref} visible={bucket_visible} >
                    <BucketPopUp close={close_bucket} {...props} selectedSlots={selectedSlots} selectSlot={selectSlot} days_of_week_full setSelectedSlots={setSelectedSlots} />
                </PopUp>
            </Button>
            <Button backgroundColor={props => props.theme.accept} only_mobile onClick={() => { setMobileCalendar(!mobileCalendar) }} >
                {mobileCalendar ? `Расписание` : moment(+selectedDay).format(`DD.MM`)}
            </Button>
        </CalendarHeader>
    )
    return (
        <GlobalWrapper>
            {
                props.laundry
                    ? <Flex>
                        <Wrapper>
                            <Flex extra={`width: 42vw; background: red; height: 1vw;`} >

                            </Flex>
                            <Flex>
                                {
                                    new Array(11).fill(0).map((day, day_index) => {
                                        let start_of_day = +moment().startOf(`isoWeek`).add(day_index, `day`)
                                        let is_before = start_of_day < +moment().startOf(`day`)
                                        let is_week_end = +moment(start_of_day).isoWeekday() > 5
                                        let is_selected_day = selectedDay === +moment(start_of_day).startOf(`day`)
                                        let is_today = +moment().startOf(`day`) === +moment(start_of_day).startOf(`day`)
                                        let machines_number = props.machines.length
                                        let booked = props.laundry.filter(i => +moment(i.timestamp).startOf(`day`) === start_of_day).length
                                        let percentage = booked / (machines_number * 12)
                                        let color = percentage > (2 / 3) ? props => props.theme.WARM_ORANGE : percentage < (1 / 3) ? props => props.theme.accept : props => props.theme.yellow
                                        return !is_before && <Day
                                            is_selected_day={is_selected_day}
                                            onClick={() => { !is_before && setSelectedDay(start_of_day); setMobileCalendar(false) }}
                                        >
                                            <Flex extra={`width: 15vw;`} >
                                                <Text size={1} color={is_week_end ? props => props.theme.WARM_ORANGE : null} >
                                                    {days_of_week_short[moment(start_of_day).isoWeekday() - 1].toUpperCase()}, {moment(start_of_day).format(`DD.MM`)}
                                                </Text>
                                            </Flex>
                                            <Flex extra={`width: 40vw;`} row >
                                                <Text extra={`margin-right: 2vw;`} >Свободно:</Text>
                                                <Text color={color} size={1} >{machines_number * 12 - booked}</Text>
                                            </Flex>
                                            {/* <Flex extra={`width: 5vw;`} ><Image src={require(`../../assets/images/arrow.svg`)} width={1.5} /></Flex> */}
                                        </Day>
                                    })
                                }
                            </Flex>
                            <Schedule mobileCalendar={mobileCalendar} >
                                <PopUp extra={`top: ${bookVisible && selectedBook ? 2 : 1}vw; right: 2vw;`} ref={bookRef} visible={bookVisible && selectedBook} setBookVisible={setBookVisible} >
                                    <BookPopUp close={close_book} {...props} selectedBook={selectedBook} setBookVisible={setBookVisible} />
                                </PopUp>
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
                        </Wrapper>
                    </Flex>
                    : <Circles rotate />
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
        },
        setLaundry: (data) => {
            return dispatch(laundryActions.setLaundry(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Laundry)

let days_of_week_full = [`Понедельник`, `Вторник`, `Среда`, `Четверг`, `Пятница`, `Суббота`, `Воскресенье`]
let days_of_week_short = [`пн`, `вт`, `ср`, `чт`, `пт`, `сб`, `вс`]

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
height: 100vh;
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
height: 100vh;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.mobileCalendar ? `block` : `none`}
    width: 100vw;
    max-height: 100vh;
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
height: 100vh;
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
height: 3.6vw;
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
width: ${props => 21 / props.width}vw;
height: 3.5vw;
cursor: pointer;
background-color: ${props => props.is_before ? `none` : props.is_my_book ? props.theme.accept : props.is_book ? props.theme.WARM_ORANGE : props.is_selected ? props.theme.lightblue : props.theme.background.support};
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
flex-direction: column;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const Day = styled(Flex)`
box-sizing: border-box;
-moz-box-sizing: border-box;
-webkit-box-sizing: border-box;
background: ${props => props.is_weekend ? props.theme.background.primary : props.theme.background.primary};
${props => props.is_selected_day ? `border-radius: 0.5vw` : null};
border: 0.2vw solid ${props => props.is_selected_day ? props.theme.purple : props.is_today ? props.theme.accept : props.theme.background.secondary}
cursor: ${props => !props.is_before ? `default` : `pointer`};
width: 22vw;
height: 4vw;
padding: 2vw;
// margin: 0.125vw;
border-radius: 1vw;
flex-direction: row;
${props => props.is_selected_day ? `box-shadow: 0 0 2vw rgba(255, 255, 255, 0.5)` : null}
&:hover {
    transform: scale(1.05)
}
@media (min-width: 320px) and (max-width: 480px) {
    width: 92vw;
    height: 20vw;
    padding: 2vw;
    margin: 1vw;
    border-radius: 4vw;
    background-color: white;
    border: 1vw solid ${props => props.is_selected_day ? props.theme.purple : props.is_today ? props.theme.accept : `transparent`}
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