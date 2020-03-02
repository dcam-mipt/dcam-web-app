/*eslint-disable no-unused-vars*/
import React, { useState, useEffect } from 'react'
import { Flex, Image, Text, Bar, BarWrapper, ClosePopUp, Book } from '../UIKit/styled-templates'
import moment from 'moment'
import Button from '../UIKit/Button'
import axios from 'axios'
import mvConsts from '../../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'
import laundryActions from '../../redux/actions/LaundryActions'

let get_laundry = () => new Promise((resolve, reject) => { axios.get(`${mvConsts.api}/laundry/get`).then((d) => { resolve(d) }).catch(e => console.log(e)) })

let main = (props) => {
    let { my_reservations, set_selected_day, set_selected_book, set_book_visible, set_purchases_visible } = props
    let { selected_slots, set_selected_slots, select_slot, days_of_week_full } = props
    let cost = selected_slots.length * 25
    return (
        <Wrapper>
            <Bar row onClick={() => { props.close && props.close() }} >
                <Flex only_mobile >
                    <Arrow only_mobile width={1.5} extra={`transform: rotate(180deg); margin-right: 1vw;`} />
                </Flex>
                <Text size={1.5} bold >Мои Стирки</Text>
            </Bar>
            {
                my_reservations.length < 1 && <Bar row><Text>Стирок не запланированно</Text></Bar>
            }
            <Bar>
                {
                    my_reservations.filter(i => i.timestamp >= +moment().startOf(`day`)).sort((a, b) => a.timestamp - b.timestamp).sort((a, b) => a.machine_id - b.machine_id).map((i, index) => {
                        return (
                            <Book key={index} date={i.timestamp} title={`Стирка`} image={require(`../../assets/images/laundry_selected.svg`)} >
                                <MachineCircle onClick={() => {
                                    set_selected_day(+moment(i.timestamp).startOf(`day`));
                                    set_selected_book(i);
                                    set_book_visible(true)
                                    set_purchases_visible(false)
                                }} >{props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}</MachineCircle>
                                <Flex extra={`width: 10%;`} row pointer>
                                    <MarginWrapper><Cros width={1} pointer onClick={async () => {
                                        await axios.get(`https://dcam.pro/api/laundry/unbook/${i.objectId}`)
                                        get_laundry().then((d) => { props.set_laundry(d.data) })
                                    }} /></MarginWrapper>
                                </Flex>
                            </Book>
                        )
                    })
                }
            </Bar>
            <Bar row>
                <Text size={1.5} bold >Корзина</Text>
            </Bar>
            {
                selected_slots.length < 1 && <Bar row><Text>Корзина пуста</Text></Bar>
            }
            {
                selected_slots.length > 0 && <Bar>
                    {
                        selected_slots.sort((a, b) => a.timestamp - b.timestamp).sort((a, b) => a.machine_id - b.machine_id).map((i, index) => {
                            return (
                                <Book key={index} date={i.timestamp} title={`Стирка`} image={require(`../../assets/images/laundry_selected.svg`)}>
                                    <MachineCircle>{props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}</MachineCircle>
                                    <Flex extra={`width: 10%;`} row pointer onClick={() => { select_slot(i) }} >
                                        <MarginWrapper><Cros width={1} pointer /></MarginWrapper>
                                    </Flex>
                                </Book>
                            )
                        })
                    }
                </Bar>
            }
            <Bar row onClick={() => { set_selected_slots([]) }} >
                <ClearButton visible={selected_slots.length > 0} >
                    <Image src={require(`../../assets/images/trash.svg`)} width={selected_slots.length === 0 ? 0 : 1.5} />
                </ClearButton>
                <Button short={false} background={props => props.theme.accept} visible={selected_slots.length > 0} disabled={selected_slots.length === 0 || cost > props.balance} onClick={() => {
                    let a = selected_slots
                    let deal = () => new Promise((resolve, reject) => {
                        axios.get(`${mvConsts.api}/laundry/book/${a[0].timestamp}/${a[0].machine_id}`)
                            .then((d) => {
                                a.shift()
                                set_selected_slots(a)
                                a.length
                                    ? deal()
                                    // : document.location.reload();
                                    : get_laundry().then((d) => { props.set_laundry(d.data) })
                            })
                            .catch((d) => { console.log(d); reject(d) })
                    })
                    a.length && deal()
                }} >
                    {selected_slots.length > 0 ? `Купить (${cost}р)` : `Пусто`}
                </Button>
                <Flex only_mobile extra={`height: 30vh;`} />
            </Bar>
        </Wrapper>
    )
}

let mapStateToProps = (state) => {
    return {
        balance: state.user.balance,
        user_id: state.user.user.objectId,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        set_laundry: (data) => {
            return dispatch(laundryActions.set_laundry(data))
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

const Arrow = (props) => <Image {...props} src={require(localStorage.getItem(`theme`) === `light` ? `../../assets/images/arrow.svg` : `../../assets/images/arrow_white.svg`)} />


const Cros = (props) => <Image {...props} src={require(localStorage.getItem(`theme`) === `light` ? `../../assets/images/cros_black.svg` : `../../assets/images/cros.svg`)} />

const Wrapper = styled(BarWrapper)`
width: 21vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100%;
}`

const MarginWrapper = styled(Flex)`
padding: 0 0.5vw 0 0.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    padding: 0 2.5vw 0 2.5vw;
}`

const MachineCircle = styled(Flex)`
width: 2vw;
height: 2vw;
border-radius: 2vw;
background: ${props => props.theme.accept};
color: white;
margin: 0 1vw 0 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
    height: 10vw;
    border-radius: 10vw;
    font-size: 4vw;
    margin: 0 5vw 0 5vw;
}`


const ClearButton = styled(Flex)`
width: ${props => props.visible ? 3 : 0}vw;
height: ${props => props.visible ? 3 : 0}vw;
border-radius: ${props => props.visible ? 0.5 : 0}vw;
background: ${props => props.theme.WARM_ORANGE};
cursor: pointer;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.visible ? 12.8 : 0}vw;
    height: ${props => props.visible ? 12.8 : 0}vw;
    border-radius: ${props => props.visible ? 2.5 : 0}vw;
}`
/*eslint-enable no-unused-vars*/