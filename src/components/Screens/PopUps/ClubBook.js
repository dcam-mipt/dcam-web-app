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

class ClubBook extends React.Component {
    state = {
        repeatedSettings: false
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
            z-index: 2;
            opacity: ${visible ? 1 : 0};
            visibility: ${visible ? `visible` : `hidden`};
            transition: opacity 0.2s, top 0.2s, visibility 0.2s;
        `
        let number_of_weeks = Math.ceil((moment().endOf(`month`).endOf(`isoWeek`) - moment().startOf(`month`).startOf(`isoWeek`)) / 86400000 / 7)
        let { selected_slot } = this.props
        return (
            <Container className={mvConsts.popUps.CLUB_BOOK} extraProps={style} >
                {
                    selected_slot
                        ? <Container extraProps={`color: ${mvConsts.colors.text.primary}`} >
                            <Input short={false} placeholder={`Название мероприятия`} />
                            <Container extraProps={`width: 15vw; height: 4vw; flex-direction: row; justify-content: space-between; `} >
                                <Container>
                                    <Container extraProps={`font-size: 0.8vw; color: ${mvConsts.colors.text.support}`} >
                                        {moment().startOf(`day`).add(selected_slot.day, `day`).add(selected_slot.from * 0.5, `hour`).format(`DD.MM.YY`)}
                                    </Container>
                                    <Container extraProps={`font-size: 1.5vw;`} >
                                        {moment().startOf(`day`).add(selected_slot.day, `day`).add(selected_slot.from * 0.5, `hour`).format(`HH:mm`)}
                                    </Container>
                                </Container>
                                <Container extraProps={`width: 2vw; height: 0.1vw; background-color: ${mvConsts.colors.background.support}`} >

                                </Container>
                                <Container extraProps={`color: ${mvConsts.colors.text.support}`} >
                                    {(selected_slot.to - selected_slot.from + 1) * 0.5}ч
                            </Container>
                                <Container extraProps={`width: 2vw; height: 0.1vw; background-color: ${mvConsts.colors.background.support}`} >

                                </Container>
                                <Container>
                                    <Container extraProps={`font-size: 0.8vw; color: ${mvConsts.colors.text.support}`} >
                                        {moment().startOf(`day`).add(selected_slot.day, `day`).add((selected_slot.to + 1) * 0.5, `hour`).format(`DD.MM.YY`)}
                                    </Container>
                                    <Container extraProps={`font-size: 1.5vw;`} >
                                        {moment().startOf(`day`).add(selected_slot.day, `day`).add((selected_slot.to + 1) * 0.5, `hour`).format(`HH:mm`)}
                                    </Container>
                                </Container>
                            </Container>
                            <Container extraProps={`width: 17vw; flex-direction: row; justify-content: space-between;`} >
                                <Container>
                                    Сделать регулярным
                                </Container>
                                <Switch checked={this.state.repeatedSettings} onChange={() => { this.setState({ repeatedSettings: !this.state.repeatedSettings }) }} />
                            </Container>
                        </Container>
                        : null
                }
                <Button short={false} >
                    Подтвердить
                </Button>
                <Button short={false} backgroundColor={mvConsts.colors.WARM_ORANGE} onClick={() => { this.props.openBookPopUp(undefined) }} >
                    Отмена
                </Button>
                <RepeatedSettings visible={this.state.repeatedSettings} >
                    <Container>
                        <Container>
                            Февраль
                        </Container>
                        {
                            Array.from({ length: number_of_weeks }, (v, i) => i).map((i, week_index) => {
                                return (
                                    <Container extraProps={`flex-direction: row`} key={week_index} >
                                        {
                                            Array.from({ length: 7 }, (v, i) => i).map((i, day_index) => {
                                                let today = moment().startOf(`month`).startOf(`isoWeek`).add(week_index, `week`).add(day_index, `day`)
                                                return (
                                                    <CalendarDay today={today} key={day_index} >
                                                        {moment(today).format(`DD`)}
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
top: 40vh;
right: ${props => props.visible ? 0 : -30}vw;
box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
z-index: 2;
transition: 0.2s
`

const CalendarDay = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 2.5vw
height: 2.5vw
padding: 0.25vw
border-radius: 3vw
font-size: 0.8vw
background-color: ${props => +moment(props.today) === +moment().startOf(`day`) ? mvConsts.colors.purple : null};
color: ${props => moment(props.today).format(`MM`) === moment().format(`MM`) ? +moment(props.today) === +moment().startOf(`day`) ? `white` : mvConsts.colors.text.primary : mvConsts.colors.text.support};
cursor: ${props => moment(props.today).format(`MM`) === moment().format(`MM`) ? `pointer` : null};
transition: 0.2s
`

/*eslint-enable no-unused-vars*/