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
        suffix: ``,
        onEnterPress: () => { },
        onChange: () => { },
        validator: () => true,
    }

    render = () => {

        let width = this.props.mobile ? 400 : 100

        let style = `
            width: ${width * (this.props.width ? 0.01 * this.props.width : (this.props.short ? 0.0625 : 0.15))}vw;
            height: ${width * (this.props.visible ? 0.01 : 0)}vw;
            padding: ${width * (this.props.visible ? 0.01 : 0)}vw;
            border-radius: ${width * 0.005}vw;
            background-color: ${this.props.backgroundColor ? this.props.backgroundColor : mvConsts.colors.background.secondary};
            margin: ${width * (this.props.visible ? 0.0025 : 0)}vw;
            color: ${this.props.color ? this.props.color : mvConsts.colors.text.primary};
            font-size: ${width * 0.01}vw;
            visibility: ${this.props.visible ? `visible` : `hidden`};
            opacity: ${this.props.visible ? 1 : 0};
            transition: visibility 0.2s, opaicty 0.2s, height 0.2s; 
            ::placeholder {
                color: ${mvConsts.colors.text.support};
            }
            @media (min-width: 320px) and (max-width: 480px) {
                width: ${4 * width * (this.props.width ? 0.01 * this.props.width : (this.props.short ? 0.0625 : 0.15))}vw;
                height: ${4 * width * (this.props.visible ? 0.01 : 0)}vw;
                padding: ${4 * width * (this.props.visible ? 0.01 : 0)}vw;
                border-radius: ${4 * width * 0.005}vw;
                margin: ${4 * width * (this.props.visible ? 0.0025 : 0)}vw;
                font-size: ${4 * width * 0.01}vw;
            }
        `

        return (
            <Input
                extraProps={style}
                placeholder={this.props.placeholder}
                type={this.props.password ? `password` : `input`}
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
    width: ${props => props.width === undefined ? 18 : props.width}${props => props.widthUnit === undefined ? 'vw' : props.widthUnit};
    height: ${props => props.square ? props.width === undefined ? 5 : props.width : props.height === undefined ? 5 : props.height}${props => props.heightUnit === undefined ? 'vh' : props.heightUnit};
    ${props => props.backgroundColor === undefined ? null : `background-color: ${props.backgroundColor}`}
    outline: none;
    border: none;
    text-align: center;
    font-size: ${props => props.fontSize ? props.fontSize : 1}vw;
    ${props => props.color === undefined ? null : `color: ${props.color}`}
    text-align: ${props => props.textAlign ? props.textAlign : `left`};
    &::-webkit-input-placeholder {
        ${props => props.placeholderColor === undefined ? null : `color: ${props.placeholderColor}`}
    }
    
    ${props => props.extraProps === undefined ? null : props.extraProps}
`

/*eslint-enable no-unused-vars*/