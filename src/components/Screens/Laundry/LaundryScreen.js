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
        <Container extraProps={`width: 6vw; height: 6vw; @media (min-width: 320px) and (max-width: 480px) { height: 10vw; }`} >
            <Container extraProps={`flex-direction: row; ${border(`bottom`)};`} >
                <Container extraProps={`width: 3vw; height: 3vw; ${border(`right`)}; font-size: ${props.isSelected ? 1.5 : 1}vw; transition: 0.2s; @media (min-width: 320px) and (max-width: 480px) { font-size: ${props.isSelected ? 6 : 4}vw; width: 8vw; height: 100%; } `} >
                    {moment(props.day).tz(`Europe/Moscow`).format('DD')}
                </Container>
                <Container extraProps={`width: 3vw; height: 3vw; color: ${mvConsts.colors.background.support}; @media (min-width: 320px) and (max-width: 480px) { font-size: 4vw; width: 8vw; height: 100%; } `} >
                    {moment(props.day).tz(`Europe/Moscow`).format('MM')}
                </Container>
            </Container>
            <Container extraProps={`flex-direction: row`} >
                <Container extraProps={`width: 3vw; height: 3vw; ${border(`right`)}; color: ${props.isBefore ? mvConsts.colors.text.support : free_lots / lots_number > 2 / 3 ? mvConsts.colors.accept : free_lots / lots_number > 1 / 3 ? mvConsts.colors.yellow : mvConsts.colors.WARM_ORANGE}; transition: 0.2s; @media (min-width: 320px) and (max-width: 480px) { font-size: 4vw; width: 8vw; height: 100%; } `} >
                    {free_lots}
                </Container>
                <Container extraProps={`width: 3vw; height: 3vw; @media (min-width: 320px) and (max-width: 480px) { font-size: 4vw; width: 8vw; height: 100%; } `} >
                    {lots_number}
                </Container>
            </Container>
        </Container>
    )
}

class LaundryScreen extends React.Component {
    state = {
        selectedDay: +moment(this.props.server_time).tz(`Europe/Moscow`).startOf(`day`),
        is_admin: false,
    }
    subscriptionOptions = [`update`, `create`, `delete`, `open`]
    machinesQuery = new Parse.Query('Machines');
    laundryQuery = new Parse.Query('Laundry');
    machinesSubscription = this.machinesQuery.subscribe();
    laundrySubscription = this.laundryQuery.subscribe();
    loadMachines = () => {
        this.machinesQuery.find()
            .then((d) => { this.props.loadMachines(d) })
            .catch((d) => { console.log(d) })
    }
    loadLaundry = () => {
        Parse.Cloud.run(`getLaundry`)
            .then((d) => { this.props.loadLaundry(d) })
            .catch((d) => { console.log(d) })
    }
    componentDidMount() {
        let q = new Parse.Query(Parse.Role)
        q.equalTo(`name`, `Admin`)
        q.find()
            .then((d) => {
                new Parse.Query(`Roles`)
                    .equalTo('userId', Parse.User.current().id)
                    .equalTo('role', `ADMIN`)
                    .first()
                    .then((d) => { this.setState({ is_admin: d ? true : false }) })
            })
        for (let i in this.subscriptionOptions) {
            this.machinesSubscription.on(this.subscriptionOptions[i], () => {
                this.loadMachines()
            });
            this.laundrySubscription.on(this.subscriptionOptions[i], () => {
                this.loadLaundry()
            });
        }
    }
    componentWillUnmount() {
        this.machinesSubscription.unsubscribe();
        this.laundrySubscription.unsubscribe();
    }
    render = () => {
        return (
            <Container flexDirection={`row`} extraProps={`position: relative; @media (min-width: 320px) and (max-width: 480px) { flex-direction: column; height: 100%; }`} >
                <TimePointer visible={this.state.selectedDay === +moment(this.props.server_time).tz(`Europe/Moscow`).startOf(`day`)} >
                    {this.props.server_time}
                </TimePointer>
                <Container>
                    <Header >
                        <Container extraProps={`flex-direction: row; @media (min-width: 320px) and (max-width: 480px) { flex-direction: column; } `} >
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
                        <Container extraProps={`flex-direction: row; @media (min-width: 320px) and (max-width: 480px) { flex-direction: column; }`} >
                            <Button
                                visible={this.state.is_admin}
                                backgroundColor={mvConsts.colors.accept}
                                onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.LAUNDRY_SETTINGS) }}
                            >
                                Редактирование
                            </Button>
                            <Button backgroundColor={mvConsts.colors.lightblue} onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.LAUNDRY_OPTIONS) }}  >
                                Настройки
                            </Button>
                            <Button
                                disabled={!this.props.laundry.filter(i => i.userId === Parse.User.current().id && +moment(i.timestamp) > +moment(this.props.server_time).startOf(`hour`)).length}
                                onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.RESEVATIONS) }}
                            >
                                Стирки | {this.props.laundry.filter(i => i.userId === Parse.User.current().id && +moment(i.timestamp) > +moment(this.props.server_time).startOf(`hour`)).length}
                            </Button>
                            <Button
                                disabled={!this.props.selected_slots.length}
                                backgroundColor={mvConsts.colors.accept}
                                onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.SHOPPING_BASKET) }}
                            >
                                Корзина | {this.props.selected_slots.length}
                            </Button>
                        </Container>
                    </Header>
                    <Container extraProps={`width: 64vw; height: 80vh; justify-content: flex-start; @media (min-width: 320px) and (max-width: 480px) { width: 100vw; flex-direction: row; max-width: 100vw; overflow: scroll; height: 100%; } `} >
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
                                <Container extraProps={`height: 3.4vw; flex-direction: row; @media (min-width: 320px) and (max-width: 480px) { height: 11vh } `} key={time_index} >
                                    <Container width={4} extraProps={`color: ${mvConsts.colors.text.support}; height: 4.5vw; justify-content: flex-start; `} >
                                        {moment(timestamp).tz(`Europe/Moscow`).format(`HH:mm`)}
                                    </Container>
                                    {
                                        this.props.machines.map((machine, machine_index) => {
                                            let slotObject = { timestamp: timestamp, machineId: machine.machineId }
                                            let book = this.props.laundry.filter(i => i.machineId === slotObject.machineId && i.timestamp === slotObject.timestamp)[0]
                                            return (
                                                <Container key={machine_index} >
                                                    <Machine
                                                        first={machine_index === 0}
                                                        last={machine_index === this.props.machines.length - 1}
                                                        width={21 / this.props.machines.length}
                                                        isBefore={+moment(this.props.server_time).tz(`Europe/Moscow`).add(-2, `hour`) > +moment(timestamp).tz(`Europe/Moscow`)}
                                                        isSelected={this.props.selected_slots.filter(i => JSON.stringify(i) === JSON.stringify(slotObject)).length}
                                                        isDisabled={machine.isDisabled}
                                                        isBook={book ? true : false}
                                                        isMyBook={book ? book.userId === Parse.User.current().id : false}
                                                        is_vk_owner={book ? book.vk ? true : false : false}
                                                        onClick={() => {
                                                            if (book) {
                                                                if (book.vk) {
                                                                    window.open(book.vk)
                                                                }
                                                            } else {
                                                                this.props.selectSlot(slotObject)
                                                            }
                                                        }}
                                                    >
                                                        {book ? book.name.length > 36 / this.props.machines.length ? (book.name).substring(0, 36 / this.props.machines.length - 2) + `...` : book.name : `-`}
                                                    </Machine>
                                                </Container>
                                            )
                                        })
                                    }
                                </Container>
                            )
                        })
                    }
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
    }
}

let mapDispatchToProps = (dispatch) => {
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaundryScreen)

const TimePointer = (props) => {
    let percent = (props.children - +moment(props.children).tz(`Europe/Moscow`).startOf(`day`)) / (1000 * 3600 * 24)
    let top = -1 + 40 * percent
    return (
        <Container extraProps={`visibility: ${props.visible ? `visible` : `hidden`}; transition: 0.2s; opacity: ${+props.visible}; position: absolute; right: 23.5vw; top: ${top + +!props.visible}vw; z-index: 1; color: ${mvConsts.colors.purple};`} >
            <Container extraProps={`padding: 0 3vw 0 0; `} >
                {moment(props.children).tz(`Europe/Moscow`).format(`HH:mm`)}
            </Container>
            <Container extraProps={`flex-direction: row`} >
                <Container extraProps={`width: 0.5vw; height: 0.5vw; border-radius: 1vw; background-color: ${mvConsts.colors.purple};`} >

                </Container>
                <Container extraProps={`width: 6vw; height: 0.1vw; background-color: ${shadeColor2(mvConsts.colors.purple, 0.6)};`} >

                </Container>
            </Container>
        </Container>
    )
}

const DayWrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 30vw
height: 90vh
justify-content: flex-start;
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    width: 100%
    height: 100%
}
`

const Machine = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: ${props => props.width}vw
height: 3vw
background: ${props => props.isBefore || props.isDisabled ? mvConsts.colors.background.support : props.isSelected ? mvConsts.colors.lightblue : `rgba(0, 0, 0, 0.03)`};
background: ${props => props.isBefore ? null : props.isMyBook ? mvConsts.colors.accept : props.isBook ? mvConsts.colors.WARM_ORANGE : null};
border-top-left-radius: ${props => props.first ? 0.5 : 0}vw;
border-bottom-left-radius: ${props => props.first ? 0.5 : 0}vw;
border-top-right-radius: ${props => props.last ? 0.5 : 0}vw;
border-bottom-right-radius: ${props => props.last ? 0.5 : 0}vw;
color: white
${props => !props.isBefore && !props.isDisabled ? props.isBook ? props.is_vk_owner ? `cursor: pointer;` : null : `cursor: pointer;` : null}
display: -webkit-box;
   -webkit-line-clamp: 3;
   -webkit-box-orient: vertical;
   overflow: hidden;
   text-overflow: ellipsis;
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.width * 4}vw
    height: 10vh
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
    ${props => props.inner ? `background-color: ${mvConsts.colors.background.secondary}
    ${props => props.isWeekEnd ? `background-color: ${mvConsts.colors.background.support}` : null}
    ${props => props.isBefore ? `background-color: transparent` : null}` : null}
}
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.inner ? 30 : 30.5}vw
    height: ${props => props.inner ? 30 : 30.5}vw
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
@media (min-width: 320px) and (max-width: 480px) {
    height: 10vw
}
`

const Header = styled.div`
display: flex
justify-content: space-between
align-items: center
flex-direction: row
width: 63vw
height: 10vh
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    height: 100%
    flex-direction: column
}
`

/*eslint-enable no-unused-vars*/