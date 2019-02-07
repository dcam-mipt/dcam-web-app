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
        onClick: () => { },
    }

    render = () => {

        let width = 100

        let style = `
            width: ${100 * (this.props.short ? 0.0825 : 0.17)}vw;
            height: ${100 * (this.props.visible ? 0.03 : 0)}vw;
            padding: ${100 * (this.props.visible ? 0.01 : 0)}vw;
            border-radius: ${100 * 0.005}vw;
            background-color: ${this.props.disabled ? mvConsts.colors.background.support : this.props.backgroundColor};
            margin: ${100 * (this.props.visible ? 0.0025 : 0)}vw;
            color: white;
            font-size: ${100 * 0.008}vw;
            cursor: ${this.props.disabled ? null : `pointer`};
            visibility: ${this.props.visible ? `visible` : `hidden`};
            opacity: ${this.props.visible ? 1 : 0};
            transition: 0.2s;
            transition-delay: ${this.props.visible ? -1 : 0.2}s;
            @media (min-width: 320px) and (max-width: 480px) {
                width: ${100 * (this.props.short ? 0.0825 * 4 : 0.17 * 4)}vw;
                height: ${100 * (this.props.visible ? 0.03 * 4 : 0)}vw;
                padding: ${100 * (this.props.visible ? 0.01 * 4 : 0)}vw;
                border-radius: ${100 * 0.005 * 4}vw;
                margin: ${100 * (this.props.visible ? 0.0025 * 4 : 0)}vw;
                font-size: ${100 * 0.008 * 4}vw;
            }
        `
        return (
            <Container
                extraProps={style}
                onClick={() => {
                    if (!this.props.disabled) {
                        this.props.onClick()
                    }
                }}
            >
                {this.props.children || this.props.title}
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        mobile: state.ui.mobile,
    }
};

export default connect(mapStateToProps)(MyButton)
// export default (Button)

/*eslint-enable no-unused-vars*/