/*eslint-disable no-unused-vars*/
import React from 'react'
import { Flex, Image, Extra, Text, Bar, BarWrapper, ClosePopUp, Book } from '../UIKit/styled-templates'
import moment from 'moment'
import Button from '../UIKit/Button'
import Form from '../UIKit/Form'
import axios from 'axios'
import mvConsts from '../../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'

let days_of_week_short = [`пн`, `вт`, `ср`, `чт`, `пт`, `сб`, `вс`]

let main = (props) => {
    let { selectedSlots, setSelectedSlots, selectSlot, days_of_week_full } = props
    let cost = selectedSlots.length * 25
    return (
        <BarWrapper>
            {/* <Bar row >
                <Image src={require(`../../assets/images/shopping-bag.svg`)} width={2} />
                <Text size={1.5} >Корзина</Text>
            </Bar> */}
            <Form array={[{ type: `title`, text: `Корзина` }]} />
            <Bar extra={`display: block; max-height: 40vh; overflow-y: scroll;`} >
                {
                    selectedSlots.sort((a, b) => a.timestamp - b.timestamp).sort((a, b) => a.machine_id - b.machine_id).map((i, index) => {
                        return (
                            <Book key={index} date={i.timestamp} title={`Стирка`} image={require(`../../assets/images/laundry_selected.svg`)}>
                                <MachineCircle>{props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}</MachineCircle>
                                <Flex extra={`width: 10%;`} row pointer onClick={() => { selectSlot(i) }} >
                                    <MarginWrapper><Image src={require(`../../assets/images/cros_black.svg`)} width={1} pointer /></MarginWrapper>
                                </Flex>
                            </Book>
                            // <BucketRow key={index} >
                            //     <Flex extra={`width: 35%; align-items: flex-start;`} >
                            //         <Text color={props => props.theme.text.support} >{days_of_week_short[moment(i.timestamp).isoWeekday() - 1].toUpperCase()} {moment(i.timestamp).format(`DD.MM.YY`)}</Text>
                            //         <Text size={1.2} >{moment(i.timestamp).format(`HH:mm`)}</Text>
                            //     </Flex>
                            //     <Flex extra={`width:30%;`}><MachineCircle>{props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}</MachineCircle></Flex>
                            //     <Flex extra={`width: 35%;`} row pointer onClick={() => { selectSlot(i) }} >
                            //         <Text>удалить</Text>
                            //         <MarginWrapper><Image src={require(`../../assets/images/cros_black.svg`)} width={1} pointer /></MarginWrapper>
                            //     </Flex>
                            // </BucketRow>
                        )
                    })
                }
            </Bar>
            <Bar clear row extra={`width: 100%;`} onClick={() => { setSelectedSlots([]) }} >
                <ClearButton visible={selectedSlots.length > 0} >
                    <Image src={require(`../../assets/images/trash.svg`)} width={selectedSlots.length === 0 ? 0 : 1.5} />
                </ClearButton>
                <Button short={false} backgroundColor={props => props.theme.accept} disabled={selectedSlots.length === 0 || cost > props.balance} onClick={() => {
                    let a = selectedSlots
                    let deal = () => new Promise((resolve, reject) => {
                        axios.get(`${mvConsts.api}/laundry/book/${a[0].timestamp}/${a[0].machine_id}`)
                            .then((d) => {
                                a.shift()
                                setSelectedSlots(a)
                                a.length
                                    ? deal()
                                    // : document.location.reload();
                                    : console.log();
                            })
                            .catch((d) => { console.log(d); reject(d) })
                    })
                    a.length && deal()
                }} >
                    {selectedSlots.length > 0 ? `Купить (${cost}р)` : `Пусто`}
                </Button>
            </Bar>
            <ClosePopUp props={props} />
        </BarWrapper>
    )
}

let mapStateToProps = (state) => {
    return {
        balance: state.user.balance,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

const ClearButton = styled(Flex)`
width: ${props => props.visible ? 3 : 0}vw;
height: ${props => props.visible ? 3 : 0}vw;
border-radius: ${props => props.visible ? 0.5 : 0}vw;
background-color: ${props => props.theme.WARM_ORANGE};
cursor: pointer;
@media (min-width: 320px) and (max-width: 480px) {
    width: 12.8vw;
    height: 12.8vw;
    border-radius: 2.5vw;
}`

const MarginWrapper = styled(Flex)`
padding: 0 0.5vw 0 0.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    padding: 0 2.5vw 0 2.5vw;
}`

const BucketRow = styled(Flex)`
border-radius: 1vw;
flex-direction: row;
margin-top: 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    margin-top: 5vw;
    border-radius: 5vw;
}`

const MachineCircle = styled(Flex)`
width: 2vw;
height: 2vw;
border-radius: 2vw;
background-color: ${props => props.theme.accept};
color: white;
margin: 0 1vw 0 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
    height: 10vw;
    border-radius: 10vw;
    font-size: 4vw;
    margin: 0 5vw 0 5vw;
}`

/*eslint-enable no-unused-vars*/