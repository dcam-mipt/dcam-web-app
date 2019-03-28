/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { connect } from "react-redux";

class MyInput extends React.Component {

    static defaultProps = {
        mobile: false,
        placeholder: `placeholder`,
        visible: true,
        short: false,
        number: false,
        password: false,
        suffix: ``,
        onEnterPress: () => { },
        onChange: () => { },
        validator: () => true,
    }

    render = () => {
        return (
            <Input
                {...this.props}
                placeholder={this.props.placeholder}
                // type={this.props.number ? `number` : this.props.password ? `password` : `input`}
                pattern={this.props.number ? `[0-9]*` : null}
                defaultValue={this.props.defaultValue}
                value={this.props.value}
                textAlign={this.props.textAlign}
                onChange={(e) => {
                    if (this.props.validator(e.target.value) || !e.target.value.length) {
                        this.props.onChange(e.target.value)
                    }
                }}
                onKeyPress={(e) => {
                    if (e.which === 13 || e.keyCode === 13) {
                        this.props.onEnterPress()
                    }
                }}
            />
        )
    }
}

let mapStateToProps = (state) => {
    return {
        mobile: state.ui.mobile,
    }
};

export default connect(mapStateToProps)(MyInput)
// export default (Button)

const Input = styled.input`
    outline: none;
    border: none;
    text-align: center;
    font-size: 0.8vw;
    text-align: ${props => props.textAlign ? props.textAlign : `left`};
    width: ${props => props.short ? 6.25 : 15}vw;
    height: ${props => +props.visible}vw;
    padding: ${props => +props.visible}vw;
    border-radius: 0.5vw;
    background-color: ${props => props.backgroundColor ? props.backgroundColor : mvConsts.colors.background.secondary};
    margin: ${props => +props.visible * 0.25}vw;
    color: ${props => props.color ? props.color : mvConsts.colors.text.primary};
    font-size: 1vw;
    visibility: ${props => props.visible ? `visible` : `hidden`};
    opacity: ${props => +props.visible};
    transition: visibility 0.2s, opaicty 0.2s, height 0.2s; 
    ::placeholder {
        color: ${mvConsts.colors.text.support};
    }
    @media (min-width: 320px) and (max-width: 480px) {
        width: ${props => props.short ? 27 : 68}vw;
        height: ${props => +props.visible * 5}vw;
        padding: ${props => +props.visible * 4}vw;
        border-radius: 2vw;
        margin: ${props => +props.visible}vw;
        font-size: 4vw;
    }
    &::-webkit-input-placeholder {
        ${props => props.placeholderColor === undefined ? null : `color: ${props => props.placeholderColor}`}
    }
    
    ${props => props.extraProps === undefined ? null : props.extraProps}
`

/*eslint-enable no-unused-vars*/