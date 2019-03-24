/*eslint-disable no-unused-vars*/

import Button from '../UI/Button'
import Input from '../UI/Input'
import Container from '../../Container'
import Parse from 'parse'
import React from 'react'
import laundryActions from '../../../redux/actions/LaundryActions'
import machinesActions from '../../../redux/actions/MachinesActions'
import moment from 'moment-timezone'
import mvConsts from '../../../constants/mvConsts'
import styled, { keyframes } from 'styled-components'
import uiActions from '../../../redux/actions/UIActions'
import { connect } from 'react-redux'
import cros from '../../../assets/images/cros.svg'
import money from '../../../assets/images/money.svg'
import bag from '../../../assets/images/bag.svg'
import pencil from '../../../assets/images/pencil.svg'
import settings from '../../../assets/images/settings_selected.svg'
import invoice_back from '../../../assets/images/invoice_back.svg'
import axios from 'axios';

// mobile media query
let m = mvConsts.mobile_media_query

let shadeColor2 = (color, percent) => {
    // eslint-disable-next-line
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
    // eslint-disable-next-line
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

let NodeContent = (props = { day: +moment(), laundry: [], machines: [], isSelected: false, isBefore: false }) => {
    let border = position => `border-${position}: 0.05vw solid ${props.isSelected ? `transparent` : `rgba(0,0,0,0.1)`};`
    let free_lots = props.machines.filter(i => !i.isDisabled).length * 12 - props.laundry.filter(i => +moment(i.timestamp).tz(`Europe/Moscow`).startOf(`day`) === +props.day).length
    let lots_number = props.machines.filter(i => !i.isDisabled).length * 12
    return (
        <Container extraProps={`width: 6vw; height: 6vw `} >
            <Container extraProps={`flex-direction: row; ${border(`bottom`)}; font-size: 1vw; `} >
                <Container extraProps={`width: 2.5vw; height: 2.5vw; font-size: 1vw;  ${props.isSelected ? `font-size: 1.5vw` : null}; transition: 0.2s; `} >
                    {moment(props.day).tz(`Europe/Moscow`).format('DD')}
                </Container>.
                <Container extraProps={`width: 2.5vw; height: 2.5vw; font-size: 1vw;  ${props.isSelected ? `font-size: 1.5vw` : null}; transition: 0.2s; `} >
                    {moment(props.day).tz(`Europe/Moscow`).format('MM')}
                </Container>
            </Container>
            <Container extraProps={`flex-direction: row;`} >
                <Container extraProps={`width: 2.5vw; height: 2.5vw; font-size: 1vw;  color: ${props.isBefore ? mvConsts.colors.text.support : free_lots / lots_number > 2 / 3 ? mvConsts.colors.accept : free_lots / lots_number > 1 / 3 ? mvConsts.colors.yellow : mvConsts.colors.WARM_ORANGE}; transition: 0.2s; `} >
                    {free_lots}
                </Container>/
                <Container extraProps={`width: 2.5vw; height: 2.5vw; font-size: 1vw; `} >
                    {lots_number}
                </Container>
            </Container>
        </Container>
    )
}

let sub = (class_name, column_name, value, onRecive) => {
    let q = new Parse.Query(class_name)
    if (column_name) {
        q.equalTo(column_name, value)
        q.first().then((d) => { onRecive(d) })
    } else {
        q.find().then((d) => { onRecive(d) })
    }
    let s = q.subscribe()
    s.on(`update`, (d) => { onRecive(d) })
    s.on(`create`, (d) => { onRecive(d) })
    s.on(`delete`, (d) => { q.first().then((d) => { onRecive(d) }) })
    return s
}

class LaundryScreen extends React.Component {
    state = {
        selectedDay: +moment(this.props.server_time).tz(`Europe/Moscow`).startOf(`day`),
        context: undefined,
    }
    laundry_sub;
    machines_sub;
    loadMachines = () => {
        axios.get(`http://dcam.pro/api/machines/get`)
            .then((d) => { this.props.loadMachines(d.data) })
            .catch((d) => { mvConsts.error(d) })
    }
    loadLaundry = () => {
        // Parse.Cloud.run(`getLaundry`)
        //     .then((d) => { this.props.loadLaundry(d) })
        //     .catch((d) => { mvConsts.error(d) })
        axios.get(`http://dcam.pro/api/laundry/get`)
            .then((d) => { this.props.loadLaundry(d.data) })
            .catch((d) => { mvConsts.error(d) })
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.book_details !== undefined) {
            this.setState({ selectedDay: +moment(nextProps.book_details.timestamp).startOf(`day`) })
        }
        if (nextProps.machines !== this.props.machines) {
            this.setState({ context: undefined })
        }
    }
    componentDidMount() {
        this.laundry_sub = sub(`Laundry`, null, null, (d) => { this.loadLaundry() })
        this.machines_sub = sub(`Machines`, null, null, (d) => { this.loadMachines() })
    }
    componentWillUnmount() {
        this.laundry_sub.unsubscribe();
        this.machines_sub.unsubscribe();
    }
    render = () => {
        let buttons = [
            {
                visible: this.props.is_admin,
                backgroundColor: mvConsts.colors.accept,
                onClick: () => { this.props.setPopUpWindow(mvConsts.popUps.LAUNDRY_SETTINGS) },
                image: pencil,
                title: `Редактирование`
            },
            {
                backgroundColor: mvConsts.colors.lightblue,
                onClick: () => { this.props.setPopUpWindow(mvConsts.popUps.LAUNDRY_OPTIONS) },
                image: settings,
                title: `Настройки`
            },
            {
                disabled: !this.props.laundry.filter(i => i.userId === Parse.User.current().id && +moment(i.timestamp) > +moment(this.props.server_time).add(-2, `hour`).startOf(`hour`)).length,
                onClick: () => { this.props.setPopUpWindow(mvConsts.popUps.RESEVATIONS) },
                image: invoice_back,
                title: `Стирки | ${this.props.laundry.filter(i => i.userId === Parse.User.current().id && +moment(i.timestamp) > +moment(this.props.server_time).add(-2, `hour`).startOf(`hour`)).length}`
            },
            {
                disabled: !this.props.selected_slots.length,
                backgroundColor: mvConsts.colors.accept,
                onClick: () => { this.props.setPopUpWindow(mvConsts.popUps.SHOPPING_BASKET) },
                image: bag,
                title: `Корзина | ${this.props.selected_slots.length}`
            },
        ]
        return (
            <Container flexDirection={`row`} extraProps={`position: relative; ${m(`flex-direction: column; height: 100%;`)}`} >
                <TimePointer visible={this.state.selectedDay === +moment(this.props.server_time).tz(`Europe/Moscow`).startOf(`day`)} >
                    {this.props.server_time}
                </TimePointer>
                <Container>
                    <Header>
                        <Container extraProps={`flex-direction: row; `} >
                            <Tab>
                                <Container extraProps={`flex-direction: row;  `} >
                                    <Container extraProps={`color: ${mvConsts.colors.text.support}; font-size: 1.2vw;`} >
                                        Стиралка
                                </Container>
                                    <Container extraProps={`width: 1vw; color: ${mvConsts.colors.yellow}; font-size: 1.5vw;`} >
                                        |
                                </Container>
                                    <Container extraProps={`font-size: 1.2vw; color: ${mvConsts.colors.text.primary}`} >
                                        {mvConsts.weekDays.short[moment(this.state.selectedDay).tz(`Europe/Moscow`).day()]} {moment(this.state.selectedDay).tz(`Europe/Moscow`).format(`DD.MM.YY`)}
                                    </Container>
                                </Container>
                            </Tab>
                            <Button
                                backgroundColor={mvConsts.colors.purple}
                                disabled={this.state.selectedDay === +moment(this.props.server_time).tz(`Europe/Moscow`).startOf(`day`)}
                                onClick={() => { this.setState({ selectedDay: +moment(this.props.server_time).tz(`Europe/Moscow`).startOf(`day`) }) }}
                            >
                                Сегодня
                            </Button>
                        </Container>
                        <Container extraProps={`flex-direction: row;`} >
                            {
                                buttons.map((i, index) => {
                                    return (
                                        <Button
                                            {...i}
                                            key={index}
                                        >
                                            {i.title}
                                        </Button>
                                    )
                                })
                            }
                        </Container>
                    </Header>
                    <Container extraProps={`width: 64vw; height: 80vh; justify-content: flex-start; ${m(`display: none;`)} `} >
                        {
                            [0, 1, 2, 3].map((week, weekIndex) => {
                                return (
                                    <Container extraProps={`flex-direction: row;`} key={weekIndex} >
                                        {
                                            mvConsts.weekDays.short.map((day, dayIndex) => {
                                                let startOfDay = +moment(this.props.server_time).tz(`Europe/Moscow`).startOf(`isoWeek`).add(weekIndex, `week`).add(dayIndex, `day`)
                                                let isBefore = +moment(this.props.server_time).tz(`Europe/Moscow`).startOf(`day`) > +moment(startOfDay).tz(`Europe/Moscow`)
                                                return (
                                                    <Node key={dayIndex} inner={false} week={weekIndex} day={dayIndex} isBefore={isBefore} >
                                                        <Node
                                                            key={dayIndex} inner={true} week={weekIndex} day={dayIndex}
                                                            isBefore={isBefore}
                                                            isToday={+moment(this.props.server_time).tz(`Europe/Moscow`).startOf(`day`) === +moment(startOfDay).tz(`Europe/Moscow`)}
                                                            isSelected={+moment(this.state.selectedDay).tz(`Europe/Moscow`).startOf(`day`) === +moment(startOfDay).tz(`Europe/Moscow`)}
                                                            isWeekEnd={moment(startOfDay).tz(`Europe/Moscow`).add(-1, `day`).day() > 4}
                                                            onClick={() => { if (!isBefore) { this.setState({ selectedDay: startOfDay }) } }}
                                                        >
                                                            <NodeContent
                                                                day={startOfDay}
                                                                isSelected={+moment(this.state.selectedDay).tz(`Europe/Moscow`).startOf(`day`) === +moment(startOfDay).tz(`Europe/Moscow`)}
                                                                isWeekEnd={moment(startOfDay).tz(`Europe/Moscow`).add(-1, `day`).day() > 4}
                                                                isBefore={isBefore}
                                                                laundry={this.props.laundry}
                                                                machines={this.props.machines}
                                                            />
                                                        </Node>
                                                    </Node>
                                                )
                                            })
                                        }
                                    </Container>
                                )
                            })
                        }
                    </Container>
                </Container>
                <DayWrapper>
                    {
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((time, time_index) => {
                            let timestamp = +moment(this.state.selectedDay).tz(`Europe/Moscow`).add(time_index * 2, `hour`)
                            return (
                                <Container extraProps={`height: 3.4vw; flex-direction: row; ${m(`height: 10vw;`)}`} key={time_index} >
                                    <Container extraProps={`color: ${mvConsts.colors.text.support}; width: 4vw; height: 4.5vw; justify-content: flex-start; ${m(`height: 12vw; width: 16vw; font-size: 4vw;`)}`} >
                                        {moment(timestamp).tz(`Europe/Moscow`).format(`HH:mm`)}
                                    </Container>
                                    {
                                        this.props.machines.map((machine, machine_index) => {
                                            let slotObject = { timestamp: timestamp, machineId: machine.objectId }
                                            let book = this.props.laundry.filter(i => i.machineId === slotObject.machineId && i.timestamp === slotObject.timestamp)[0]
                                            let isBefore = +moment(this.props.server_time).tz(`Europe/Moscow`).add(-2, `hour`) > +moment(timestamp).tz(`Europe/Moscow`)
                                            let isMyBook = book ? book.userId === Parse.User.current().id : false
                                            let context = this.props.is_admin && this.state.context ? this.state.context.machine_id === machine.objectId && this.state.context.timestamp === timestamp : false
                                            let isDisabled = machine.isDisabled && +moment(machine.chill_untill) >= +moment(timestamp)
                                            // console.log(book)
                                            return (
                                                <Machine
                                                    onContextMenu={(e) => {
                                                        if (this.props.is_admin) {
                                                            let context_object = { machine_id: machine.objectId, timestamp: timestamp }
                                                            this.setState({ context: JSON.stringify(this.state.context) === JSON.stringify(context_object) ? undefined : context_object })
                                                        }
                                                        e.preventDefault();
                                                    }}
                                                    key={machine_index}
                                                    first={machine_index === 0}
                                                    last={machine_index === this.props.machines.length - 1}
                                                    width={this.props.machines.length}
                                                    isBefore={isBefore}
                                                    isSelected={this.props.selected_slots.filter(i => JSON.stringify(i) === JSON.stringify(slotObject)).length}
                                                    isDisabled={isDisabled}
                                                    isBook={book ? true : false}
                                                    isMyBook={isMyBook}
                                                    is_vk_owner={book ? book.vk ? true : false : false}
                                                    context={context}
                                                    className={`ignore`}
                                                    onClick={() => {
                                                        if (book) {
                                                            if (!isBefore && book) {
                                                                this.props.openLaundryBookDetails(book)
                                                            }
                                                        } else {
                                                            if (!context) {
                                                                this.props.selectSlot(slotObject)
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {
                                                        context
                                                            ? <img
                                                                style={{ width: `1.5vw` }}
                                                                src={require('../../../assets/images/no-stopping.svg')}
                                                                alt={``}
                                                                onClick={() => {
                                                                    axios.get(`http://dcam.pro/api/laundry/broke_machine/${this.state.context.machine_id}/${this.state.context.timestamp}`)
                                                                        .then((d) => { console.log(d); this.setState({ context: undefined }) })
                                                                        .catch((d) => { mvConsts.error(d) })
                                                                }}
                                                            />
                                                            : book ? book.email.split(`@`)[0] : `-`
                                                    }
                                                </Machine>
                                            )
                                        })
                                    }
                                </Container>
                            )
                        })
                    }
                    <BottomButtons>
                        {
                            buttons.filter((i, index) => i.visible !== false).map((i, index) => {
                                return (
                                    <Button
                                        key={index}
                                        {...i}
                                    >
                                        <img
                                            src={i.image}
                                            style={{ width: `6vw`, }}
                                            alt={``}
                                        />
                                    </Button>
                                )
                            })
                        }
                    </BottomButtons>
                </DayWrapper>
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        server_time: state.constants.server_time,
        selected_slots: state.laundry.selected_slots,
        machines: state.machines.machines,
        laundry: state.laundry.laundry,
        popUpWindow: state.ui.popUpWindow,
        book_details: state.laundry.book_details,
        is_admin: state.ui.is_admin,
    }
}

let mapDispatchToProps = (dispatch, a, b) => {
    return {
        selectSlot: (data) => {
            return dispatch(laundryActions.selectSlot(data))
        },
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
        loadMachines: (data) => {
            return dispatch(machinesActions.loadMachines(data))
        },
        loadLaundry: (data) => {
            return dispatch(laundryActions.loadLaundry(data))
        },
        openLaundryBookDetails: (data) => {
            return dispatch(laundryActions.openLaundryBookDetails(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaundryScreen)

const TimePointer = (props) => {
    let percent = (props.children - +moment(props.children).tz(`Europe/Moscow`).startOf(`day`)) / (1000 * 3600 * 24)
    let top = -1 + 40 * percent
    const Wrapper = styled.div`
    display: flex
    justify-content: center
    align-items: center
    flex-direction: column
    background-color: 
    transition: 0.2s
    visibility: ${props.visible ? `visible` : `hidden`};
    transition: 0.2s; opacity: ${+props.visible};
    position: absolute;
    right: 23.5vw;
    top: ${top + +!props.visible}vw;
    z-index: 1;
    color: ${mvConsts.colors.purple};
    @media (min-width: 320px) and (max-width: 480px) {
        display: none;
    }
    `
    return (
        <Wrapper extraProps={``} >
            <Container extraProps={`padding: 0 3vw 0 0; `} >
                {moment(props.children).tz(`Europe/Moscow`).format(`HH:mm`)}
            </Container>
            <Container extraProps={`flex-direction: row`} >
                <Container extraProps={`width: 0.5vw; height: 0.5vw; border-radius: 1vw; background-color: ${mvConsts.colors.purple};`} >

                </Container>
                <Container extraProps={`width: 6vw; height: 0.1vw; background-color: ${shadeColor2(mvConsts.colors.purple, 0.6)};`} >

                </Container>
            </Container>
        </Wrapper>
    )
}

const BottomButtons = styled.div`
display: none;
@media (min-width: 320px) and (max-width: 480px) {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: row;
    width: 100vw;
    transition: 0.2s;
}`

const DayWrapper = styled.div`
display: flex;
positoin: relative;
justify-content: center;
align-items: center;
flex-direction: column;
width: 30vw;
height: 90vh;
justify-content: flex-start;
transition: 0.2s
${m(`width: 100vw;`)}
`

const Machine = styled.div`
display: flex
justify-content: center;
align-items: center;
width: ${props => 21 / props.width}vw
height: 3vw
background: ${props => props.isBefore || props.isDisabled ? mvConsts.colors.background.support : props.isSelected ? mvConsts.colors.lightblue : `rgba(0, 0, 0, 0.03)`};
background: ${props => props.isBefore ? null : props.isMyBook ? mvConsts.colors.accept : props.isBook ? mvConsts.colors.WARM_ORANGE : null};
background: ${props => props.context ? mvConsts.colors.purple : null};
border-top-left-radius: ${props => props.first ? 0.5 : 0}vw;
border-bottom-left-radius: ${props => props.first ? 0.5 : 0}vw;
border-top-right-radius: ${props => props.last ? 0.5 : 0}vw;
border-bottom-right-radius: ${props => props.last ? 0.5 : 0}vw;
color: white;
overflow: visible;
${props => !props.isBefore && !props.isDisabled ? props.isBook ? props.is_vk_owner ? `cursor: pointer;` : null : `cursor: pointer;` : null}
display: -webkit-box;
   -webkit-line-clamp: 3;
   -webkit-box-orient: vertical;
   overflow: hidden;
   text-overflow: ellipsis;
transition: 0.2s
flex-direction: row;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => 80 / props.width}vw;
    height: 9vw;
    border-top-left-radius: ${props => props.first ? 2 : 0}vw;
    border-bottom-left-radius: ${props => props.first ? 2 : 0}vw;
    border-top-right-radius: ${props => props.last ? 2 : 0}vw;
    border-bottom-right-radius: ${props => props.last ? 2 : 0}vw;
    font-size: 3vw;
}
`

const Node = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: ${props => props.inner ? 8.6 : 8.7}vw
height: ${props => props.inner ? 8.6 : 8.7}vw
border: ${props => props.inner ? 0 : 0.1}vw solid ${mvConsts.colors.background.support};
border-top-left-radius: ${props => props.week === 0 && props.day === 0 ? 1 : 0}vw;
border-bottom-left-radius: ${props => props.week === 3 && props.day === 0 ? 1 : 0}vw;
border-top-right-radius: ${props => props.week === 0 && props.day === 6 ? 1 : 0}vw;
border-bottom-right-radius: ${props => props.week === 3 && props.day === 6 ? 1 : 0}vw;
${props => props.inner ? `background-color: transparent` : null}
${props => props.isToday ? `border: 0.2vw solid ${mvConsts.colors.accept}` : null}
${props => props.isSelected ? `border-radius: 0.5vw; border: 0.2vw solid ${mvConsts.colors.purple}` : null}
${props => !props.isBefore ? `background-color: transparent` : null}
${props => props.isSelected ? `background-color: ${mvConsts.colors.background.primary}` : null}
${props => props.isWeekEnd ? `background-color: ${mvConsts.colors.background.support}` : null}
${props => props.isWeekEnd ? `background-color: ${shadeColor2(mvConsts.colors.background.support, 0.2)}` : null}
${props => props.isBefore ? `background-color: transparent` : null}
${props => props.isWeekEnd ? `color: ${mvConsts.colors.text.secondary};` : `color: ${mvConsts.colors.text.primary}`}
${props => props.isBefore ? `color: ${mvConsts.colors.text.support};` : null}
cursor: ${props => props.isBefore ? `default` : `pointer;`}
transition: 0.2s;
&:hover{
    ${props => props.isSelected ? null : `background-color: ${shadeColor2(`#000000`, 0.9)}`}
}
`

const Tab = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
height: 3vw;
border-radius: 0.5vw;
margin: 0.5vw;
&:hover { background-color: ${mvConsts.colors.background.primary}; };
background-color: ${mvConsts.colors.background.primary};
padding: 0 1vw 0 1vw;
transition: 0.2s
`

const Header = styled.div`
display: flex
justify-content: space-between
align-items: center
flex-direction: row
width: 63vw
height: 10vh
transition: 0.2s
${m(`display: none;`)}
`

/*eslint-enable no-unused-vars*/