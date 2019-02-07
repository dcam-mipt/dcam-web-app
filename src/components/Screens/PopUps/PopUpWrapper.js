/*eslint-disable no-unused-vars*/
import actions from '../../../redux/actions/UIActions'
import Container from '../../Container'
import React from 'react';
import mvConsts from '../../../constants/mvConsts'
import styled, { keyframes } from 'styled-components';
import { connect } from 'react-redux';

class PopUpWrapper extends React.Component {

    hideElement = (className, popUpWindow) => {
        let hideOnClickOutside = (element) => {
            const outsideClickListener = event => {
                if (event.target.closest(`.` + className) === null) {
                    if (isVisible(element)) {
                        if (this.props.popUpWindow === className) {
                            this.props.setPopUpWindow(mvConsts.popUps.EMPTY)
                        }
                        removeClickListener()
                    }
                }
            }

            const removeClickListener = () => {
                document.removeEventListener('click', outsideClickListener)
            }
            document.addEventListener('click', outsideClickListener)
        }
        const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length) // source (2018-03-11): https://github.com/jquery/jquery/blob/master/src/css/hiddenVisibleSelectors.js
        if (popUpWindow === className) {
            hideOnClickOutside(document.getElementsByClassName(className)[0])
        }
    }

    componentWillReceiveProps(nextProps) {
        this.hideElement(this.props.children.props.name, nextProps.popUpWindow)
        if (nextProps.popUpWindow !== mvConsts.popUps.EMPTY && nextProps.mobile) {
            document.getElementsByTagName(`body`)[0].style.position = `fixed`
        } else {
            document.getElementsByTagName(`body`)[0].style.position = `inherit`
        }
    }

    render = () => {

        let anyMobilePopUp = this.props.popUpWindow !== mvConsts.popUps.EMPTY && this.props.mobile

        return (
            <Container>
                <Container
                    extraProps={`
                        width: 100vw;
                        height: 100vh;
                        position: absolute;
                        background-color: rgba(0, 0, 0, ${anyMobilePopUp ? 0.2 : 0});
                        backdrop-filter: blur(${anyMobilePopUp ? 5 : 0}px);
                        visibility: ${anyMobilePopUp ? `visible` : `hidden`};
                        z-index: 2;
                        top: 0;
                        transition: 0.2s;
                    `}
                    onClick={() => {
                        if (this.props.popUpWindow !== mvConsts.popUps.EMPTY) {
                            this.props.setPopUpWindow(mvConsts.popUps.EMPTY)
                        }
                    }}
                >

                </Container>
                {this.props.children}
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        popUpWindow: state.ui.popUpWindow,
        mobile: state.ui.mobile,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (screenName) => {
            return dispatch(actions.setPopUpWindow(screenName))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopUpWrapper)
// export default (PopUpWrapper)

/*eslint-enable no-unused-vars*/