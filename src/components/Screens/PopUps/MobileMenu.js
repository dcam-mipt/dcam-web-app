/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import uiActions from '../../../redux/actions/UIActions'
import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Container from '../../Container'
import Parse from 'parse'
import Button from '../UI/Button'

let m = mvConsts.mobile_media_query

class MobileMenu extends React.Component {
    render = () => {
        let visible = this.props.visible
        return (
            <Wrapper className={mvConsts.popUps.MOBILE_MENU} visible={visible} >
                <ProfileTab>
                    <Container extraProps={`flex-direction: row; width: 80vw; justify-content: flex-start;`} >
                        <Container extraProps={`width: 15vw; height: 15vw; border-radius: 15vw; background-color: ${mvConsts.colors.background.support};`} >
                            <Image
                                width={15}
                                extraProps={`border-radius: 15vw;`}
                                src={Parse.User.current().get(`avatar`)}
                            />
                        </Container>
                        <Container extraProps={`margin-left: 5vw; align-items: flex-start;`} >
                            <Container extraProps={`font-size: 5vw`} >
                                {Parse.User.current().get(`username`).split(`@`)[0]}
                            </Container>
                            <Container extraProps={`font-size: 3.5vw; color: ${mvConsts.colors.text.support}`} >
                                онлайн
                            </Container>
                        </Container>
                    </Container>
                    <Container extraProps={`flex-direction: row; width: 80vw; justify-content: space-between; border-top: 0.05vw solid ${mvConsts.colors.background.support}; padding-top: 2vw; margin-top: 2vw; `} >
                        <Container extraProps={` width: 15vw; height: 15vw; border-radius: 15vw; background-color: ${this.props.money > 0 ? mvConsts.colors.accept : mvConsts.colors.background.support}; color: white; font-size: 3vw; transition: background-color 0.2s; `} >
                            {this.props.money} ₽
                        </Container>
                        <Button onClick={() => { this.props.setPopUpWindow(mvConsts.popUps.TOP_BALANCE_WINDOW) }} >
                            Пополнить
                        </Button>
                    </Container>
                </ProfileTab>
            </Wrapper>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        visible: state.ui.popUpWindow === mvConsts.popUps.MOBILE_MENU,
        money: state.constants.money,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MobileMenu)

const ProfileTab = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 96vw;
padding: 2vw 0 2vw 0;
border-radius: 4vw;
background-color: ${mvConsts.colors.background.primary}
@media (min-width: 320px) and (max-width: 480px) {
    
}`

const Wrapper = styled.div`
display: none;
@media (min-width: 320px) and (max-width: 480px) {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transition: 0.2s;
    position: absolute;
    box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
    z-index: 2;
    opacity: ${props => props.visible ? 1 : 0};
    visibility: ${props => props.visible ? `visible` : `hidden`};

    border-radius: 4vw;
    top: ${props => props.visible ? 10 : 14}vh;
    width: 96vw;
    padding: 2vw 2vw 2vw 2vw;
}`

const Image = styled.img`
width: ${props => props.width}vw;
${props => props.extraProps}
`

/*eslint-enable no-unused-vars*/