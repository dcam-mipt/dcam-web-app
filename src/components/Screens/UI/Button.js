/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import * as actions from '../../../redux/actions/UIActions'

import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

// Components
import Container from '../../Container'

class MyButton extends React.Component {

    static defaultProps = {
        mobile: false,
        title: `title`,
        visible: true,
        short: true,
        disabled: false,
        backgroundColor: mvConsts.colors.yellow,
        shaped: false,
        onClick: () => { },
    }

    render = () => {
        let style = `
            
        `
        return (
            <Wrapper
                {...this.props}
                onClick={() => {
                    if (!this.props.disabled) {
                        this.props.onClick()
                    }
                }}
            >
                {this.props.children || this.props.title}
            </Wrapper>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        mobile: state.ui.mobile,
    }
};

export default connect(mapStateToProps)(MyButton)

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: ${props => props.short ? 6.25 : 15}vw;
height: ${props => +props.visible}vw;
padding: ${props => +props.visible}vw;
border-radius: 0.5vw;
background-color: ${props => props.shaped ? `transparent` : props.disabled ? mvConsts.colors.background.support : props.backgroundColor};
margin: ${props => +props.visible / 4}vw;
color: ${props => props.shaped ? props.backgroundColor : `white`};
font-size: 0.8vw;
cursor: ${props => props.disabled ? null : `pointer`};
visibility: ${props => props.visible ? `visible` : `hidden`};
opacity: ${props => props.visible ? 1 : 0};
transition: 0.2s;
transition-delay: ${props => props.visible ? -1 : 0.2}s;
border: ${props=> +props.shaped * 0.1}vw solid ${props => props.backgroundColor}
outline-offset: 0.25vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.short ? 33 : 68}vw;
    height: ${props => props.visible ? 12 : 0}vw;
    padding: ${props => props.visible ? 0.04 : 0}vw;
    border-radius: 2vw;
    margin: ${props => props.visible ? 1 : 0}vw;
font-size: 4vw;
}
@media (min-width: 320px) and (max-width: 480px) {
    
}`

/*eslint-enable no-unused-vars*/