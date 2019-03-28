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
                let exeption = event.path.map(i => i.classList).filter(i => i !== undefined).map(i => Object.values(i)).filter(i => i.indexOf(`ignore`) > -1).length > 0
                if (event.target.closest(`.` + className) === null && !exeption) {
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

        let anyPopUp = this.props.popUpWindow !== mvConsts.popUps.EMPTY

        return (
            <Container>
                <Wrapper
                    anyPopUp={anyPopUp}
                    onClick={() => {
                        if (anyPopUp) {
                            this.props.setPopUpWindow(mvConsts.popUps.EMPTY)
                        }
                    }}
                >

                </Wrapper>
                {this.props.children.props.name === this.props.popUpWindow ? this.props.children : null}
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
        setPopUpWindow: (screenName) => {
            return dispatch(actions.setPopUpWindow(screenName))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PopUpWrapper)

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
position: absolute;
z-index: 1;
top: 0;
transition: 0.2s;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(5px);
    opacity: ${props => +props.anyPopUp}
    visibility: ${props => props.anyPopUp ? `visible` : `hidden`};    
@media (min-width: 320px) and (max-width: 480px) {
    
}`

/*eslint-enable no-unused-vars*/