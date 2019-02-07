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
    render = () => {
        let visible = this.props.popUpWindow === mvConsts.popUps.CLUB_BOOK
        let style = `
            border-radius: 1vw;
            padding: 1vw 1vw 1vw 1vw
            background-color: ${mvConsts.colors.background.primary};
            flex-direction: column
            position: absolute;
            top: ${visible ? 19 : 21}vh;
            right: 2vw;
            box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
            z-index: 2;
            opacity: ${visible ? 1 : 0};
            visibility: ${visible ? `visible` : `hidden`};
            transition: opacity 0.2s, top 0.2s, visibility 0.2s;
        `
        let number_of_weeks = Math.ceil((moment().endOf(`month`).endOf(`isoWeek`) - moment().startOf(`month`).startOf(`isoWeek`)) / 86400000 / 7)
        return (
            <Container className={mvConsts.popUps.CLUB_BOOK} extraProps={style} >
                <Button short={false} >
                    Подтвердить
                </Button>
                <Button short={false} backgroundColor={mvConsts.colors.WARM_ORANGE} onClick={() => { this.props.openBookPopUp(undefined) }} >
                    Отмена
                </Button>
                <RepeatedSettings>
                    <Container>
                        <Container>
                            Февраль
                        </Container>
                        {
                            Array.from({ length: number_of_weeks }, (v, i) => i).map((i, index) => {
                                return (
                                    <Container key={index} >
                                        {i}
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
        machines: state.machines.machines,
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
top: 30vh;
right: 0vw;
box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
z-index: 2;
transition: 0.2s
`

/*eslint-enable no-unused-vars*/