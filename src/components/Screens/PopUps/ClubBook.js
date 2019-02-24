/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import uiActions from '../../../redux/actions/UIActions'
import clubActions from '../../../redux/actions/ClubActions'
import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Container from '../../Container'
import moment from 'moment'
import Button from '../UI/Button'
import Input from '../UI/Input'
import Switch from '../UI/Switch'
import Parse from 'parse'
import Select from 'react-select'
import validator from 'validator'
import arrow from '../../../assets/images/arrow.svg'
import axios from 'axios';

class ClubBook extends React.Component {
    state = {
        is_regular: false,
        residents_number: 1,
        using_music_equipment: false,
        using_projector: false,
        selected_days: [],
        end_of_repeat: +moment().startOf(`day`),
        calendar_month: +moment().startOf(`month`),
    }
    componentWillReceiveProps(nextProps) {
        let { selected_slot } = nextProps
        if (selected_slot) {
            this.setState({
                selected_days: this.state.selected_days.concat(moment().add(selected_slot.day - 1, `day`).day()),
                end_of_repeat: +moment().startOf(`day`).add(selected_slot.day, `day`)
            })
        } else {
            this.setState({ selected_days: [] })
        }
    }
    render = () => {
        let visible = this.props.popUpWindow === mvConsts.popUps.CLUB_BOOK
        let style = `
            border-radius: 1vw;
            padding: 1vw 1vw 1vw 1vw
            background-color: ${mvConsts.colors.background.primary};
            flex-direction: column
            position: absolute;
            top: ${visible ? 12 : 14}vh;
            right: 2vw;
            box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
            z-index: ${visible ? 4 : -1};
            opacity: ${visible ? 1 : 0};
            visibility: ${visible ? `visible` : `hidden`};
            transition: opacity 0.2s, top 0.2s, visibility 0.2s;
        `
        let number_of_weeks = Math.ceil((moment(this.state.calendar_month).endOf(`month`).endOf(`isoWeek`) - moment(this.state.calendar_month).startOf(`month`).startOf(`isoWeek`)) / 86400000 / 7)
        let { selected_slot } = this.props
        let from = selected_slot ? moment().startOf(`day`).add(selected_slot.day, `day`).add(selected_slot.from * 0.5, `hour`) : 0
        let to = selected_slot ? moment().startOf(`day`).add(selected_slot.day, `day`).add((selected_slot.to + 1) * 0.5, `hour`) : 0
        return (
            <Container className={mvConsts.popUps.CLUB_BOOK} extraProps={style} >
                <Container extraProps={`color: ${mvConsts.colors.text.primary}`} >
                    <Input short={false} placeholder={`Название мероприятия`} />
                    <Container extraProps={`width: 15vw; height: 4vw; flex-direction: row; justify-content: space-between; `} >
                        <Container>
                            <Container extraProps={`font-size: 0.7vw; color: ${mvConsts.colors.text.support}`} >
                                {mvConsts.weekDays.short[moment(from).day()]} {moment(from).format(`DD.MM.YY`)}
                            </Container>
                            <Container extraProps={`font-size: 1.5vw;`} >
                                {moment(from).format(`HH:mm`)}
                            </Container>
                        </Container>
                        <Container extraProps={`width: 2vw; height: 0.1vw; background-color: ${mvConsts.colors.background.support}`} />
                        <Container extraProps={`color: ${mvConsts.colors.text.support}`} >
                            {(to - from) / 3600000}ч
                        </Container>
                        <Container extraProps={`width: 2vw; height: 0.1vw; background-color: ${mvConsts.colors.background.support}`} />
                        <Container>
                            <Container extraProps={`font-size: 0.7vw; color: ${mvConsts.colors.text.support}`} >
                                {mvConsts.weekDays.short[moment(to).day()]} {moment(to).format(`DD.MM.YY`)}
                            </Container>
                            <Container extraProps={`font-size: 1.5vw;`} >
                                {moment(to).format(`HH:mm`)}
                            </Container>
                        </Container>
                    </Container>
                    <QuestionWrapper>
                        Количество людей
                        <Input short={true} placeholder={`Число`} value={this.state.residents_number} onChange={(e) => { if (validator.isNumeric(e) || e.length === 0) { this.setState({ residents_number: e.length > 1 ? +e : 0 }) } }} />
                    </QuestionWrapper>
                    <QuestionWrapper>
                        Музыкальное оборудование
                        <Switch
                            checked={this.state.using_music_equipment}
                            onChange={() => { this.setState({ using_music_equipment: !this.state.using_music_equipment }) }}
                        />
                    </QuestionWrapper>
                    <QuestionWrapper>
                        Проектор
                        <Switch
                            checked={this.state.using_projector}
                            onChange={() => { this.setState({ using_projector: !this.state.using_projector }) }}
                        />
                    </QuestionWrapper>
                    <QuestionWrapper>
                        Сделать регулярным
                        <Switch
                            checked={this.state.is_regular}
                            onChange={() => { this.setState({ is_regular: !this.state.is_regular }) }}
                        />
                    </QuestionWrapper>
                </Container>
                <Button short={false} onClick={() => {
                    // Parse.Cloud.run(`createClubBook`, {
                    //     location: `club`,
                    //     start_timestamp: +moment().startOf(`day`).add(selected_slot.day, `day`).add(selected_slot.from * 0.5, `hour`),
                    //     end_timestamp: +moment().startOf(`day`).add(selected_slot.day, `day`).add((selected_slot.to + 1) * 0.5, `hour`),
                    //     is_regular: this.state.is_regular,
                    //     data: {
                    //         residents_number: this.state.residents_number,
                    //         using_music_equipment: this.state.using_music_equipment,
                    //         using_projector: this.state.using_projector,
                    //         selected_days: this.state.selected_days,
                    //         end_of_repeat: this.state.end_of_repeat,
                    //     },
                    // })

                    axios.post(`http://dcam.pro/api/club/`, {
                        location: `club`,
                        start_timestamp: +moment().startOf(`day`).add(selected_slot.day, `day`).add(selected_slot.from * 0.5, `hour`),
                        end_timestamp: +moment().startOf(`day`).add(selected_slot.day, `day`).add((selected_slot.to + 1) * 0.5, `hour`),
                        is_regular: this.state.is_regular,
                        data: {
                            residents_number: this.state.residents_number,
                            using_music_equipment: this.state.using_music_equipment,
                            using_projector: this.state.using_projector,
                            selected_days: this.state.selected_days,
                            end_of_repeat: this.state.end_of_repeat,
                        },
                    })
                    	.then((d) => { console.log(d) })
                        .catch((d) => { console.log(d) })


                    this.props.openBookPopUp(undefined)
                }} >
                    Подтвердить
                </Button>
                <Button short={false} backgroundColor={mvConsts.colors.WARM_ORANGE} onClick={() => { this.props.openBookPopUp(undefined) }} >
                    Отмена
                </Button>
                <RepeatedDaysChooser visible={this.state.is_regular} >
                    {
                        mvConsts.weekDays.short.filter((i, index) => index > 0).concat(mvConsts.weekDays.short[0]).map((i, index) => {
                            return (
                                <WeekDay
                                    index={index}
                                    key={index}
                                    onClick={() => { this.setState({ selected_days: this.state.selected_days.indexOf(index) > -1 ? this.state.selected_days.filter(i => i !== index) : this.state.selected_days.concat(index) }) }}
                                    is_selected={this.state.selected_days.indexOf(index) > -1}
                                >
                                    {i}
                                </WeekDay>
                            )
                        })
                    }
                </RepeatedDaysChooser>
                <RepeatedSettings visible={this.state.is_regular} >
                    <Container>
                        <Container extraProps={`width: 20vw; flex-direction: row; justify-content: space-around;`}>
                            <img
                                src={arrow}
                                style={{ width: `1vw`, transform: `rotate(180deg)`, cursor: `pointer`, visibility: this.state.calendar_month === +moment().startOf(`month`) ? `hidden` : `visible`, opacity: +(this.state.calendar_month !== +moment().startOf(`month`)), transition: `0.2s`, }}
                                alt={``}
                                onClick={() => { this.setState({ calendar_month: Math.max(+moment(this.state.calendar_month).add(-1, `month`), +moment().startOf(`month`)) }) }}
                            />
                            <MonthLable onClick={() => { this.setState({ calendar_month: +moment().startOf(`month`) }) }} >
                                {mvConsts.month[+moment(this.state.calendar_month).format(`M`) - 1]}
                                <Container extraProps={`color: ${mvConsts.colors.text.support}; font-size: 0.7vw;`} >
                                    {moment(this.state.calendar_month).format(`YYYY`)}
                                </Container>
                            </MonthLable>
                            <img
                                src={arrow}
                                style={{ width: `1vw`, cursor: `pointer`, }}
                                alt={``}
                                onClick={() => { this.setState({ calendar_month: moment(this.state.calendar_month).add(1, `month`) }) }}
                            />
                        </Container>
                        {
                            Array.from({ length: number_of_weeks }, (v, i) => i).map((i, week_index) => {
                                return (
                                    <Container extraProps={`flex-direction: row`} key={week_index} >
                                        {
                                            Array.from({ length: 7 }, (v, i) => i).map((i, day_index) => {
                                                let day = moment(this.state.calendar_month).startOf(`month`).startOf(`isoWeek`).add(week_index, `week`).add(day_index, `day`)
                                                return (
                                                    <CalendarDay
                                                        is_today={+moment(day) === +moment().startOf(`day`)}
                                                        is_selected={+moment(day) === +moment(this.state.end_of_repeat).startOf(`day`)}
                                                        is_this_month={moment(day).format(`MM`) === moment(this.state.calendar_month).format(`MM`)}
                                                        contains_event={this.state.selected_days.indexOf((moment(day).day() + 6) % 7) > -1 && day > +moment() && day < moment(this.state.end_of_repeat)}
                                                        day={day}
                                                        key={day_index}
                                                        onClick={() => { this.setState({ end_of_repeat: day }) }}
                                                    >
                                                        {moment(day).format(`DD`)}
                                                    </CalendarDay>
                                                )
                                            })
                                        }
                                    </Container>
                                )
                            })
                        }
                    </Container>
                </RepeatedSettings>
                <Summering visible={this.state.is_regular} >
                    Предстоит {3} занятий до {moment(this.state.end_of_repeat).format(`D`)} {mvConsts.month[+moment(this.state.end_of_repeat).format(`M`)]} по {this.state.selected_days.map((i, index) => mvConsts.weekDays.short[i + 1] + (index < this.state.selected_days.length - 1 ? `, ` : ``))}.
                </Summering>
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        popUpWindow: state.ui.popUpWindow,
        selected_slot: state.club.selected_slot,
    }
};

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

export default connect(mapStateToProps, mapDispatchToProps)(ClubBook)

const RepeatedSettings = styled.div`
display: flex
justify-content: center
align-items: center
border-radius: 1vw;
padding: 1vw 1vw 1vw 1vw
background-color: ${mvConsts.colors.background.primary};
flex-direction: column
position: absolute;
top: 4.5vw;
right: ${props => props.visible ? 20 : 100}vw;
box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
z-index: 2;
visibility: ${props => props.visible ? `visible` : `hidden`}
opacity: ${props => +props.visible}
transition: 0.2s
`

const RepeatedDaysChooser = styled.div`
display: flex
justify-content: center
align-items: center
border-radius: 1vw;
padding: 1vw 1vw 1vw 1vw
background-color: ${mvConsts.colors.background.primary};
flex-direction: row
position: absolute;
top: ${props => props.visible ? 0 : -50}vh;
right: 20vw;
box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
z-index: 2;
visibility: ${props => props.visible ? `visible` : `hidden`}
opacity: ${props => +props.visible}
transition: 0.2s
`

const Summering = styled.div`
display: flex
justify-content: center
align-items: flex-start
width: 21vw;
border-radius: 1vw;
padding: 1vw 1vw 1vw 1vw
background-color: ${mvConsts.colors.background.primary};
flex-direction: column;
position: absolute;
top: ${props => props.visible ? 24 : 100}vw;
right: 20vw;
box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
z-index: 2;
visibility: ${props => props.visible ? `visible` : `hidden`}
opacity: ${props => +props.visible}
transition: 0.2s
`

const WeekDay = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 2vw
height: 2vw
margin: 0 0.5vw 0 0.5vw
border-radius: 0.2vw
color: ${props => props => props.is_selected ? `white` : props.index > 4 ? mvConsts.colors.text.support : mvConsts.colors.text.primary}
background-color: ${props => props.is_selected ? mvConsts.colors.purple : mvConsts.colors.background.primary}
&:hover {
    background-color: ${props => props.is_selected ? null : mvConsts.colors.background.secondary}
}
cursor: pointer;
transition: 0.2s;
`

const MonthLable = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 10vw;
font-size: 1vw;
cursor: pointer;
padding: 0.1vw;
border-radius: 0.5vw
&:hover {
    background-color: ${mvConsts.colors.background.secondary}
}
transition: 0.2s
`

const CalendarDay = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 2.5vw
height: 2.5vw
margin: 0.25vw
border-radius: 3vw
font-size: 0.8vw
background-color: ${props => props.is_selected ? mvConsts.colors.purple : props.is_today ? mvConsts.colors.accept : props.contains_event ? mvConsts.colors.yellow : null};
color: ${props => props.is_this_month ? props.is_today || props.is_selected || props.contains_event ? `white` : mvConsts.colors.text.primary : mvConsts.colors.text.support};
cursor: ${props => props.is_this_month ? `pointer` : null};
transition: 0.2s
`

const QuestionWrapper = styled.div`
display: flex
flex-direction: row;
align-items: center
justify-content: space-between; 
width: 17vw;
height: 3vw;
`

/*eslint-enable no-unused-vars*/