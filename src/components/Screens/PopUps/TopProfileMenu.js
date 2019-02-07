/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import actions from '../../../redux/actions/UIActions'
import GoogleAPI from '../../../API/GoogleAPI'

import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';

import user_selected from '../../../assets/images/user_selected.png'
import settings_selected from '../../../assets/images/settings_selected.svg'
import logout from '../../../assets/images/logout.png'

// Components
import Container from '../../Container'

class TopProfileMenu extends React.Component {

    static defaultProps = {
        visible: false,
    }

    // state = {
    //
    // }

    // componentDidMount() {

    // }

    render = () => {

        let visible = this.props.popUpWindow === mvConsts.popUps.TOP_PROFILE_MENU;

        let style = `
            // width: 10vw;
            padding: 0 1vw 0 1vw;
            height: 4vw;
            border-radius: 1vw;
            position: absolute;
            top: ${visible ? 10 : 12}vh;
            right: 0.5vw;
            z-index: 1;
            opacity: ${visible ? 1 : 0};
            visibility: ${visible ? `visible` : `hidden`};
            // box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
            transition: opacity 0.2s, top 0.2s, visibility 0.2s;
        `

        let items = [
            // {
            //     image: user_selected,
            //     onClick: () => {},
            // },
            // {
            //     image: settings_selected,
            //     onClick: () => {},
            // },
            {
                image: logout,
                onClick: () => {
                    GoogleAPI.signOut()
                    this.props.setPopUpWindow(mvConsts.popUps.EMPTY)
                },
            },
        ]
        
        return (
            <Container className={mvConsts.popUps.TOP_PROFILE_MENU} flexDirection={`row`} backgroundColor={mvConsts.colors.background.primary} extraProps={style} >
                {
                    items.map((item, index) => {
                        return (
                            <Container key={index} extraProps={`
                                padding: 0.5vw;
                                border-left: ${+(index === items.length - 1 && items.length > 1)}px solid ${mvConsts.colors.background.secondary};
                                cursor: pointer;
                            `} onClick={() => {item.onClick()}} >
                                <img src={item.image} alt={``} style={{ width: `2vw`, }} />
                            </Container>
                        )
                    })
                }
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        popUpWindow: state.ui.popUpWindow,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setEntryScreen: (screenName) => {
            return dispatch(actions.setEntryScreen(screenName))
        },
        setPopUpWindow: (screenName) => {
            return dispatch(actions.setPopUpWindow(screenName))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopProfileMenu)
// export default (TopProfileMenu)

/*eslint-enable no-unused-vars*/