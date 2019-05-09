/*eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import userActions from '../redux/actions/UserActions'
import axios from 'axios'
import styled from 'styled-components'
import moment, { defineLocale } from 'moment'
import Button from './Button'
import useComponentVisible from './useComponentVisible'
import mvConsts from '../constants/mvConsts';

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
    let my_reservations = props.user ? props.laundry.filter(i => i.user_id === props.user.objectId) : []
    useEffect(() => { !selectedSlots.length && setBucketVisible(false) })
    useEffect(() => { !my_reservations.length && setReservationsVisible(false) })
    let header = (
        <CalendarHeader>
            <Title>
                Стирка | {moment(selectedDay).format(`DD.MM`)}
            </Title>
            <Button only_desktop onClick={() => { setSelectedDay(+moment().startOf(`day`)) }} >
                Сегодня
            </Button>
            <Button disabled={!my_reservations.length} onClick={() => { setReservationsVisible(!reservationsVisible) }} >
                Стирки
            </Button>
            <Button disabled={!selectedSlots.length} onClick={() => { setBucketVisible(!bucketVisible) }} >
                Корзина
            </Button>
            <Button only_mobile onClick={() => { setMobileCalendar(!mobileCalendar) }} >
                {mobileCalendar ? `Расписание` : `Календарь`}
            </Button>
        </CalendarHeader>
    )
    return (
        <GlobalWrapper>
            <PopUp ref={bucketRef} visible={bucketVisible} >
                <Flex>
                    {
                        selectedSlots.map((i, index) => {
                            return (
                                <BasketRecord key={index} >
                                    <div>
                                        {moment(i.timestamp).format(`DD.MM`)}, {moment(i.timestamp).format(`HH:mm`)}
                                    </div>
                                    <MachineCircle>
                                        {props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}
                                    </MachineCircle>
                                    <div
                                        onClick={() => { selectSlot(i) }}
                                    >
                                        Удалить
                                </div>
                                </BasketRecord>
                            )
                        })
                    }
                    <Flex row>
                        <Button onClick={() => { setSelectedSlots([]) }} >
                            Очистить
                        </Button>
                            <Button onClick={() => {
                                let a = selectedSlots
                                let deal = () => new Promise((resolve, reject) => {
                                    axios.get(`http://dcam.pro/api/laundry/book/${a[0].timestamp}/${a[0].machine_id}`)
                                        .then((d) => {
                                            a = a.filter((i, index) => index > 0)
                                            setSelectedSlots(a)
                                            a.length ? deal() : document.location.reload();
                                        })
                                        .catch((d) => { console.log(d); reject(d) })
                                })
                                a.length && deal()
                            }} >
                                Купить
                        </Button>
                    </Flex>
                </Flex>
            </PopUp>
            <PopUp ref={reservationsRef} visible={reservationsVisible} >
                <Flex>
                    {
                        my_reservations.map((i, index) => {
                            return (
                                <BasketRecord key={index} >
                                    <div>
                                        {moment(i.timestamp).format(`DD.MM`)}, {moment(i.timestamp).format(`HH:mm`)}
                                    </div>
                                    <MachineCircle>
                                        {props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}
                                    </MachineCircle>
                                    <div
                                        onClick={() => { axios.get(`http://dcam.pro/api/laundry/unbook/${i.objectId}`).then(() => { document.location.reload(); }) }}
                                    >
                                        Удалить
                                </div>
                                </BasketRecord>
                            )
                        })
                    }
                </Flex>
            </PopUp>
            <PopUp ref={bookRef} visible={bookVisible && selectedBook} >
                <Flex>
                    {
                        selectedBook && <BasketRecord>
                            <div>
                                {selectedBook.email.split(`@`)[0]}
                            </div>
                            <div>
                                {moment(selectedBook.timestamp).format(`DD.MM`)}, {moment(selectedBook.timestamp).format(`HH:mm`)}
                            </div>
                            <MachineCircle>
                                {props.machines.map(i => i.objectId).indexOf(selectedBook.machine_id) + 1}
                            </MachineCircle>
                            {
                                props.is_admin
                                && <div
                                    onClick={() => { axios.get(`http://dcam.pro/api/laundry/unbook/${selectedBook.objectId}`).then(() => { document.location.reload(); }) }}
                                >
                                    Удалить
                            </div>
                            }
                        </BasketRecord>
                    }
                </Flex>
            </PopUp>
            <MobileHeader only_mobile >
                {header}
            </MobileHeader>
            <Wrapper>
                <Calendar mobileCalendar={mobileCalendar} >
                    <MobileHeader only_desktop>
                        {header}
                    </MobileHeader>
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
                                                onClick={() => { !is_before && setSelectedDay(start_of_day); setMobileCalendar(false) }}
                                                is_selected_day={selectedDay === +moment(start_of_day).startOf(`day`)}
                                                is_today={+moment().startOf(`day`) === +moment(start_of_day).startOf(`day`)}
                                            >
                                                {moment(start_of_day).format(`DD.MM`)}
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
                            {new Array(4).fill(0).map((i, index) => <Machine index={index} key={index} width={props.machines.length} >{index + 1}</Machine>)}
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
                                                    onClick={() => { !is_book ? !is_before && selectSlot(slot_data) : setSelectedBook(book); setBookVisible(true) }}
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
            </Wrapper>
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

const MobileHeader = styled.div`
display: ${props => props.only_desktop ? `flex` : `none`};
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.only_mobile ? `flex` : `none`};
    height: 8vh;
}`

const TimeNode = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 5vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 15vw;
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
    height: 100%;
    flex-direction: column;
    justify-content: flex-start
}`

const Calendar = styled.div`
display: flex
justify-content: flex-start
align-items: center
flex-direction: column
transition: 0.2s
width: 63vw;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.mobileCalendar ? `block` : `none`};
    width: 100vw;
    max-height: 88vh;
    overflow: scroll;
}`

const Schedule = styled.div`
display: flex
justify-content: flex-start
align-items: center
flex-direction: column
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.mobileCalendar ? `none` : `block`};
    width: 100vw;
    max-height: 88vh;
    overflow: scroll;
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
background-color: ${props => props.is_before ? `none` : props.is_my_book ? mvConsts.colors.accept : props.is_book ? mvConsts.colors.WARM_ORANGE : props.is_selected ? mvConsts.colors.lightblue : `lightgrey`};
color: white;
font-size: 0.8vw;
border: 0.08vw solid ${props => props.is_before ? `transparent` : `white`};
border-radius: ${props => +(props.index === 0) * 0.5}vw ${props => +(props.index === props.width - 1) * 0.5}vw ${props => +(props.index === props.width - 1) * 0.5}vw ${props => +(props.index === 0) * 0.5}vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => 20 / props.width * 5}vw;
    border-radius: ${props => +(props.index === 0) * 2}vw ${props => +(props.index === props.width - 1) * 2}vw ${props => +(props.index === props.width - 1) * 2}vw ${props => +(props.index === 0) * 2}vw;
    height: 12vw;
    font-size: 3vw;
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

const Day = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 8.5vw;
height: 8.5vw;
background-color: white;
border: 0.2vw solid ${props => props.is_selected_day ? mvConsts.colors.purple : props.is_today ? mvConsts.colors.accept : `transparent`}
cursor: pointer;
@media (min-width: 320px) and (max-width: 480px) {
    width: 92vw;
    height: 3vw;
    padding: 2vw;
    margin: 1vw;
    border-radius: 4vw;
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
position: fixed;
@media (min-width: 320px) and (max-width: 480px) {
    height: 100vh;
}
@supports (-webkit-overflow-scrolling: touch) {
    height: 85vh;
}
`

const CalendarHeader = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
transition: 0.2s
margin-bottom: 1vw;
width: 100vw;
@media (min-width: 320px) and (max-width: 480px) {
    background-color : white;
    position: fixed;
    top: 0;
}`

const Title = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 9vw;
padding: 0.9vw;
border-radius: 0.5vw;
background-color: white;
font-size: 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    display: none;
}`

const Flex = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: ${props => props.row ? `row` : `column`}
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
}`

const PopUp = styled.div`
display: block;
max-height: 92vh;
overflow: scroll;
transition: 0.2s
border-radius: 1vw;
background-color: white;
z-index: 2;
position: absolute;
top: ${props => (props.visible ? 0 : 2) + 1}vw;
right: 1vw;
visibility: ${props => props.visible ? `visible` : `hidden`}
opacity: ${props => +props.visible};
padding: 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    display: ${props => props.visible ? `flex` : `none`}
    position: fixed;
    width: 100vw;
    top: 0;
    right: 0;
}`

const BasketRecord = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
transition: 0.2s
padding: 0.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const MachineCircle = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 2vw;
height: 2vw;
border-radius: 2vw;
font-size: 0.8vw;
background-color: ${mvConsts.colors.accept};
color: white;
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
    height: 10vw;
    border-radius: 10vw;
    font-size: 4vw;
}`
/*eslint-enable no-unused-vars*/