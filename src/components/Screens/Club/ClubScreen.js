/*eslint-disable no-unused-vars*/

import React from 'react'
import { connect } from 'react-redux'
import styled, { keyframes } from 'styled-components'
import mvConsts from '../../../constants/mvConsts'
import Container from '../../Container'
import Button from '../UI/Button'
import moment from 'moment'
import uiActions from '../../../redux/actions/UIActions'
import clubActions from '../../../redux/actions/ClubActions'
import pencil from '../../../assets/images/pencil.svg'
import cros from '../../../assets/images/cros_white.svg'
import Parse from 'parse'

let
    daysToSelect = Array.from({ length: 21 }, (v, i) => i),
    time_sets = Array.from({ length: 48 }, (v, i) => i)

let convertToNode = (i) => {
    return ({
        ...i,
        day: +moment(i.start_timestamp).format(`D`) - +moment().format(`D`),
        from: (+moment(i.start_timestamp) - +moment(i.start_timestamp).startOf(`day`)) / 3600000 * 2,
        to: (+moment(i.end_timestamp) - +moment(i.end_timestamp).startOf(`day`)) / 3600000 * 2 - 1,
    })
}

class ClubScreen extends React.Component {
    state = {
        select_mode: undefined,
        is_admin: false,
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
    }

    render = () => {
        let { select_mode } = this.state
        let { selected_slot, books } = this.props
        let books_map = books.map((i, index) => convertToNode(i))
        return (
            <Wrapper>
                <TimeSchedule>
                    {
                        time_sets.filter(i => i % 2 === 0).map((i, index) => {
                            return (
                                <TimeNode key={index}>
                                    {moment().startOf(`day`).add(index, `hour`).format(`HH:mm`)}
                                </TimeNode>
                            )
                        })
                    }
                </TimeSchedule>
                <ScrolledElement>
                    {
                        daysToSelect.map((i, day_index) => {
                            let startOfDay = moment().startOf(`day`).add(day_index, `day`)
                            let isWeekEnd = moment(startOfDay).day() > 5 || moment(startOfDay).day() === 0
                            return (
                                <Container extraProps={`flex-direction: row; position: relative;`} key={day_index}>
                                    <DayNode isWeekEnd={isWeekEnd}>
                                        {moment(startOfDay).format(`DD.MM`)}, {mvConsts.weekDays.short[moment(startOfDay).day()]}
                                    </DayNode>
                                    {
                                        selected_slot ? selected_slot.day === day_index ?
                                            <BookNode selected_slot={selected_slot} onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.CLUB_BOOK) }} >

                                            </BookNode>
                                            : null : null
                                    }
                                    {
                                        books_map.filter(i => i.day === day_index).map((i, index) => {
                                            return (
                                                <BookNode
                                                    {...i}
                                                    booked={true}
                                                    key={index}
                                                    selected_slot={i}
                                                >
                                                    <Container> {moment(i.start_timestamp).format(`HH:mm`)} </Container>
                                                    <Container> {i.owner.split(` `)[2]} </Container>
                                                    <Container> {moment(i.end_timestamp).format(`HH:mm`)} </Container>
                                                </BookNode>
                                            )
                                        })
                                    }
                                    <MainScheduleRow>
                                        {
                                            time_sets.map((i, index) => {
                                                return (
                                                    <Node key={index} index={index} s={select_mode} day_index={day_index}
                                                        onMouseOver={() => {
                                                            if (select_mode) {
                                                                if (select_mode.from <= index) {
                                                                    this.setState({ select_mode: { ...select_mode, to: index } })
                                                                }
                                                            }
                                                        }}
                                                        onClick={() => {
                                                            if (selected_slot) {
                                                                // this.props.openBookPopUp(undefined)
                                                            } else {
                                                                if (select_mode && !books_map.filter(i => i.day === day_index).filter(i => (i.from >= select_mode.from && i.to <= index) && i.is_allowed).length) {
                                                                    this.props.openBookPopUp(select_mode)
                                                                }
                                                                if (select_mode) {
                                                                    this.setState({ select_mode: undefined, })
                                                                } else {
                                                                    this.setState({ select_mode: { day: day_index, from: index, to: index }, })
                                                                }
                                                            }
                                                        }}
                                                    >

                                                    </Node>
                                                )
                                            })
                                        }
                                    </MainScheduleRow>
                                </Container>
                            )
                        })
                    }
                </ScrolledElement>
                <Container extraProps={`flex-direction: row; position: absolute; bottom: 1vw; right: 1vw;`} >
                    {
                        select_mode
                            ? <LocalButtton
                                backgroundColor={mvConsts.colors.WARM_ORANGE}
                                onClick={() => { this.setState({ select_mode: undefined }) }}
                            > <img src={cros} style={{ width: `1vw` }} alt={``} /> </LocalButtton>
                            : null
                    }
                    {
                        this.state.is_admin
                            ? <LocalButtton
                                backgroundColor={mvConsts.colors.accept}
                                onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.CLUB_EDIT) }}
                            > <img src={pencil} style={{ width: `1vw` }} alt={``} /> </LocalButtton>
                            : null
                    }
                </Container>
            </Wrapper>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        server_time: state.constants.server_time,
        selected_slot: state.club.selected_slot,
        books: state.club.books,
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
        openBookPopUp: (data) => {
            return dispatch(clubActions.openBookPopUp(data))
        },
    }
}

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 94vw
height: 90vh
transition: 0.2s
@media (min-width: 320px) and (max-width: 480px) {
    flex-direciton: column;
}
`

const TimeSchedule = styled.div`
display: flex
justify-content: center
align-items: center
width: 88vw;
height: 10vh;
padding-left: 6vw;
border-bottom: 0.1vw solid ${mvConsts.colors.background.support};
transition: 0.2s
`

const MainScheduleRow = styled.div`
display: flex
justify-content: center
align-items: center
width: 88vw;
height: 10vh;
border-bottom: 0.02vw solid ${mvConsts.colors.background.support};
transition: 0.2s
`

const ScrolledElement = styled.div`
width: 94vw;
height: 80vh;
display: block;
overflow: auto;
max-height: 80vh;
transition: 0.2s
`

const Node = styled.div`
display: flex
justify-content: center
align-items: flex-start
flex-direction: column
width: ${props => 88 / time_sets.length}vw;
height: 9.4vh;
margin: 0.3vh 0 0.3vh 0
z-index: 2;
background-color: ${props => props.s ? props.s.day === props.day_index && props.index >= props.s.from && props.index <= props.s.to ? mvConsts.colors.background.primary : null : null};
border-top-left-radius: ${props => props.s ? props.s.from === props.index ? 0.5 : 0 : 0}vw;
border-bottom-left-radius: ${props => props.s ? props.s.from === props.index ? 0.5 : 0 : 0}vw;
border-top-right-radius: ${props => props.s ? props.s.to === props.index ? 0.5 : 0 : 0}vw;
border-bottom-right-radius: ${props => props.s ? props.s.to === props.index ? 0.5 : 0 : 0}vw;
&:hover {
    background-color: ${props => props.s ? `white` : `rgba(255, 255, 255, 0.3)`};
    border-top-left-radius: ${props => props.s ? props.s.from === props.index ? 0.5 : 0 : 0.5}vw;
    border-bottom-left-radius: ${props => props.s ? props.s.from === props.index ? 0.5 : 0 : 0.5}vw;
    border-top-right-radius: ${props => props.s ? props.s.to === props.index ? 0.5 : 0 : 0.5}vw;
    border-bottom-right-radius: ${props => props.s ? props.s.to === props.index ? 0.5 : 0 : 0.5}vw;
};
`

const BookNode = styled.div`
display: flex
justify-content: center
align-items: flex-start
flex-direction: column
padding: 0 0.2vw 0 0.2vw
width: ${props => 88 / time_sets.length * (props.selected_slot.to - props.selected_slot.from + 1) - 0.4}vw;
height: 9.4vh;
background-color: ${props => props.booked ? props.is_allowed ? mvConsts.colors_.HAN_BLUE : `rgba(0, 0, 0, 0.05)` : mvConsts.colors.yellow};
border-radius: 0.5vw;
position: absolute;
z-index: ${props => props.booked ? props.is_allowed ? 3 : 1 : 3};
left: ${props => 6 + props.selected_slot.from * 88 / time_sets.length}vw;
top: 0.3vh;
color: white;
cursor: pointer;
transition: 0.2s
`

const DayNode = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 6vw;
height: 10vh;
font-size: 0.8vw;
color: ${props => props.isWeekEnd ? `white` : mvConsts.colors.text.primary};
background-color: ${props => props.isWeekEnd ? mvConsts.colors.yellow : null};
border-right: 0.1vw solid ${mvConsts.colors.background.support}; 
transition: 0.2s
`

const TimeNode = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: ${88 / time_sets.length * 2}vw; 
color: ${mvConsts.colors.text.primary}; 
font-size: 0.8vw; 
`

const LocalButtton = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 3vw
height: 3vw
margin: 0.2vw
border-radius: 0.5vw
background-color: ${props => props.backgroundColor ? props.backgroundColor : mvConsts.colors.accept}
z-index: 3;
cursor: pointer;
&:hover {
    transform: rotate(5deg)
}
transition: 0.2s
`

export default connect(mapStateToProps, mapDispatchToProps)(ClubScreen)

/*eslint-enable no-unused-vars*/