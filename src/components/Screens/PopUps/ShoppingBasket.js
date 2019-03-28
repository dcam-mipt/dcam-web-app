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
        let visible = this.props.popUpWindow === this.props.name
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
            @media (min-width: 320px) and (max-width: 480px) {
                border-radius: 4vw;
                top: ${visible ? 10 : 14}vh;
                right: 2vw;
                width: 96vw;
                padding: 2vw 2vw 2vw 2vw;
            }   
        `
        return (
            <Container className={mvConsts.popUps.SHOPPING_BASKET} extraProps={style} >
                <Container extraProps={`font-family: Lato-Bold; color: ${mvConsts.colors.text.primary}; font-size: 1.2vw; margin: 0 0 0.5vw 0.5vw; align-items: flex-start; ${mvConsts.mobile_media_query(`font-size: 6vw; margin: 2.5vw 0 2.5vw 5vw;`)}`} >
                    Корзина
                </Container>
                {
                    this.props.selected_slots.map((item, index) => {
                        return (
                            <Slot key={index} >
                                <Container extraProps={`width: 5vw; align-items: flex-start; margin: 0.5vw; ${mvConsts.mobile_media_query(`width: 30vw`)}`} >
                                    <Container extraProps={` color: ${mvConsts.colors.text.support}; font-size: 0.8vw; ${mvConsts.mobile_media_query(`font-size: 4vw;`)} `} >
                                        {mvConsts.weekDays.full[moment(item.timestamp).day()]}
                                    </Container>
                                    <Container extraProps={` font-size: 0.8vw; color: ${mvConsts.colors.text.primary}; ${mvConsts.mobile_media_query(`font-size: 4vw;`)} `} >
                                        {moment(item.timestamp).format('DD.MM.YY')}
                                    </Container>
                                </Container>
                                <Container>
                                    <Container extraProps={` font-size: 1.5vw; color: ${mvConsts.colors.text.primary}; ${mvConsts.mobile_media_query(`font-size: 7vw;`)} `} >
                                        {moment(item.timestamp).format('HH:mm')}
                                    </Container>
                                </Container>
                                <Container extraProps={`font-size: 1vw; margin: 0.5vw; width: 2vw; height: 2vw; border-radius: 2vw; background-color: ${mvConsts.colors.purple}; color: white; ${mvConsts.mobile_media_query(`font-size: 4vw; width: 8vw; height: 8vw; border-radius: 8vw; margin: 2.5vw;`)} `} >
                                    {this.props.machines.map(i => i.objectId).indexOf(item.machineId) + 1}
                                </Container>
                                <Container extraProps={`width: 2.5vw; color: ${mvConsts.colors.text.primary}; ${mvConsts.mobile_media_query(`width: 12.5vw; font-size: 4vw;`)}`} >
                                    {this.props.laundry_cost} ₽
                                </Container>
                                <Container extraProps={` border-left: 1px solid ${mvConsts.colors.background.support}; margin-left: 0.5vw; width: 1.5vw; height: 2vw; cursor: pointer; ${mvConsts.mobile_media_query(`width: 7.5vw; height: 8vw;`)} `} >
                                    <Cross
                                        src={cross}
                                        alt={``}
                                        onClick={() => { this.props.selectSlot(item) }}
                                    />
                                </Container>
                            </Slot>
                        )
                    })
                }
                <Container extraProps={`flex-direction: row; ${mvConsts.mobile_media_query(`margin-top: 1vw;`)}`} >
                    <Button visible={visible} shaped={true} onClick={() => {
                        this.clearSelections();
                    }} >
                        Очистить
                    </Button>
                    <Button
                        visible={visible}
                        disabled={this.props.selected_slots.length * this.props.laundry_cost > this.props.money}
                        backgroundColor={mvConsts.colors.accept}
                        onClick={() => {
                            // if (!this.props.is_nfc_owner) {
                            //     this.props.setPopUpWindow(mvConsts.popUps.GET_NFC)
                            //     return
                            // }
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

const Cross = styled.img`
width: 1.2vw;
margin-left: 0.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 6vw;
    margin-left: 2.5vw;
}`

const Slot = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
height: 3vw
transition: 0.2s
${mvConsts.mobile_media_query(`
    height: 10vw;
`)}
`

/*eslint-enable no-unused-vars*/