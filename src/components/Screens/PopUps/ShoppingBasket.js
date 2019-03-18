/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import uiActions from '../../../redux/actions/UIActions'
import laundryActions from '../../../redux/actions/LaundryActions'
import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Container from '../../Container'
import cross from '../../../assets/images/cros.svg'
import moment from 'moment'
import Button from '../UI/Button'
import Parse from 'parse'

class ShoppingBasket extends React.Component {
    clearSelections = () => {
        for (let i in this.props.selected_slots) {
            this.props.selectSlot(this.props.selected_slots[i])
        }
        this.props.setPopUpWindow(mvConsts.popUps.EMPTY)
    }
    render = () => {
        let visible = this.props.popUpWindow === mvConsts.popUps.SHOPPING_BASKET
        let style = `
            border-radius: 1vw;
            padding: 1vw 1vw 1vw 1vw
            background-color: ${mvConsts.colors.background.primary};
            flex-direction: column
            position: absolute;
            top: ${visible ? 19 : 21}vh;
            right: 30.75vw;
            box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
            z-index: 2;
            opacity: ${visible ? 1 : 0};
            visibility: ${visible ? `visible` : `hidden`};
            display: block;
            max-height: 70vh;
            overflow-y: scroll;
            transition: 0.2s;
        `
        return (
            <Container className={mvConsts.popUps.SHOPPING_BASKET} extraProps={style} >
                {
                    this.props.selected_slots.map((item, index) => {
                        return (
                            <Slot key={index} >
                                <Container width={5} alignItems={`flex-start; margin: 0.5vw;`} >
                                    <Container extraProps={` color: ${mvConsts.colors.text.support}; font-size: 0.8vw; `} >
                                        {mvConsts.weekDays.full[moment(item.timestamp).day()]}
                                    </Container>
                                    <Container extraProps={` font-size: 0.8vw; color: ${mvConsts.colors.text.primary}; `} >
                                        {moment(item.timestamp).format('DD.MM.YY')}
                                    </Container>
                                </Container>
                                <Container>
                                    <Container extraProps={` font-size: 1.5vw; color: ${mvConsts.colors.text.primary}; `} >
                                        {moment(item.timestamp).format('HH:mm')}
                                    </Container>
                                </Container>
                                <Container fontSize={1} extraProps={` margin: 0.5vw; width: 2vw; height: 2vw; border-radius: 2vw; background-color: ${mvConsts.colors.purple}; color: white; `} >
                                    {this.props.machines.map(i => i.machineId).indexOf(item.machineId) + 1}
                                </Container>
                                <Container width={2.5} extraProps={`color: ${mvConsts.colors.text.primary};`} >
                                    {this.props.laundry_cost} ₽
                                    </Container>
                                <Container extraProps={` border-left: 1px solid ${mvConsts.colors.background.support}; margin-left: 0.5vw; width: 1.5vw; height: 2vw; cursor: pointer; `} >
                                    <img src={cross} alt={``} style={{ width: (1.2) + `vw`, marginLeft: `0.5vw` }} onClick={() => { this.props.selectSlot(item) }} />
                                </Container>
                            </Slot>
                        )
                    })
                }
                <Container flexDirection={`row`} >
                    <Button visible={visible} onClick={() => {
                        this.clearSelections();
                    }} >
                        Очистить
                    </Button>
                    <Button
                        visible={visible}
                        disabled={this.props.selected_slots.length * this.props.laundry_cost > this.props.money}
                        backgroundColor={mvConsts.colors.accept}
                        onClick={() => {
                            if (!this.props.is_nfc_owner) {
                                this.props.setPopUpWindow(mvConsts.popUps.GET_NFC)
                                return
                            }
                            let array = this.props.selected_slots
                            let book = () => {
                                let data = {
                                    timestamp: array[0].timestamp,
                                    machineId: array[0].machineId
                                }
                                Parse.Cloud.run(`setLaundry`, data)
                                    .then((d) => {
                                        array.shift()
                                        if (array.length) {
                                            book()
                                        }
                                    })
                                // .catch((d) => { mvConsts.error(d) })
                            }
                            if (this.props.selected_slots.length * this.props.laundry_cost <= this.props.money) {
                                book()
                                this.clearSelections();
                            }
                        }}
                    >
                        Купить
                    </Button>
                </Container>
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        popUpWindow: state.ui.popUpWindow,
        selected_slots: state.laundry.selected_slots,
        is_nfc_owner: state.constants.is_nfc_owner,
        machines: state.machines.machines,
        money: state.constants.money,
        laundry_cost: state.constants.laundry_cost,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
        selectSlot: (data) => {
            return dispatch(laundryActions.selectSlot(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingBasket)

const Slot = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
height: 3vw
transition: 0.2s
`

/*eslint-enable no-unused-vars*/