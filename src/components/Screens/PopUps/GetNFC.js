/*eslint-disable no-unused-vars*/
import Button from '../UI/Button'
import Container from '../../Container'
import Input from '../UI/Input'
import Parse from 'parse'
import React from 'react';
import moment from 'moment'
import mvConsts from '../../../constants/mvConsts'
import styled, { keyframes } from 'styled-components';
import uiActions from '../../../redux/actions/UIActions'
import { connect } from 'react-redux';

class GetNFC extends React.Component {
    state = {
        value: ``
    }
    render = () => {
        let visible = this.props.popUpWindow === mvConsts.popUps.GET_NFC
        return (
            <Wrapper className={mvConsts.popUps.GET_NFC} visible={visible} >
                <PopUp visible={visible} >
                    <Notification >
                        Извините, бронь станет доступна, после того как Вы привяжете пропуск к профилю.
                    </Notification>
                    <Container extraProps={`padding: 1vw; background-color: ${mvConsts.colors.background.primary}; border-radius: 0.5vw;`} >
                        <Input short={false} placeholder={`NFC UID (8 символов)`} value={this.state.value} onChange={(d) => { this.setState({ value: d }) }} />
                        <Button visible={visible} short={false} backgroundColor={mvConsts.colors.accept} onClick={() => { Parse.Cloud.run(`createNfcRecord`, { value: this.state.value.toUpperCase() }) }} disabled={(`` + this.state.value).length !== 8} >
                            Сохранить
                        </Button>
                        <Button visible={visible} short={false} backgroundColor={mvConsts.colors.reject} onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.EMPTY) }} >
                            Закрыть
                        </Button>
                    </Container>
                </PopUp>
            </Wrapper>
        )
    }
}

const Notification = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
width: 17.5vw;
margin-bottom: 0.5vw;
color: ${mvConsts.colors.text.primary};
padding: 1vw;
background-color: ${mvConsts.colors.background.primary};
border-radius: 0.5vw;
text-align: left;
transition: 0.2s
`

const Wrapper = styled.div`
display: flex
position: absolute;
z-index: ${props => props.visible ? 1 : -1};
top: 0vw;
right: 0vw;
justify-content: center
align-items: center
flex-direction: column
width: 94vw
height: 100vh
background: rgba(0,0,0,.${props => props.visible ? 2 : 0});
backdrop-filter: blur(${props => props.visible ? 2 : 0}px);
visibility: ${props => props.visible ? `visible` : `hidden`};
transition: 0.2s
`

const PopUp = styled.div`
padding: 1vw;
border-radius: 1vw;
position: absolute;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
top: ${props => props.visible ? 10 : 12}vh;
right: 2vw;
z-index: ${props => props.visible ? 1 : -1};
opacity: ${props => props.visible ? 1 : 0};
visibility: ${props => props.visible ? `visible` : `hidden`};
// box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
transition: 0.2s;
`

let mapStateToProps = (state) => {
    return {
        popUpWindow: state.ui.popUpWindow,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(GetNFC)

/*eslint-enable no-unused-vars*/