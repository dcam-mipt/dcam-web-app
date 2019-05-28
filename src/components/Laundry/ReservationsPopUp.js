/*eslint-disable no-unused-vars*/
import React from 'react'
import { Flex, Image, Text, Bar, BarWrapper } from '../styled-templates'
import moment from 'moment'
import Button from '../Button'
import axios from 'axios'
import mvConsts from '../../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'

let days_of_week_short = [`пн`, `вт`, `ср`, `чт`, `пт`, `сб`, `вс`]

let main = (props) => {
    let { my_reservations, setSelectedDay, setSelectedBook, setBookVisible, setReservationsVisible  } = props
    return (
        <BarWrapper>
            <Bar row >
                <Image src={require(`../../assets/images/ticket.svg`)} width={2} />
                <Text size={1.5} >Мои Стирки</Text>
            </Bar>
            <Bar>
                {
                    my_reservations.filter(i => i.timestamp >= +moment().startOf(`day`)).sort((a, b) => a.timestamp - b.timestamp).sort((a, b) => a.machine_id - b.machine_id).map((i, index) => {
                        return (
                            <BucketRow key={index} >
                                <Flex start extra={`width: 35%;`} >
                                    <Text color={mvConsts.colors.text.support} >{days_of_week_short[moment(i.timestamp).isoWeekday() - 1].toUpperCase()} {moment(i.timestamp).format(`DD.MM.YY`)}</Text>
                                    <Text size={1.2} >{moment(i.timestamp).format(`HH:mm`)}</Text>
                                </Flex>
                                <Flex extra={`width:30%;`}><MachineCircle>{props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}</MachineCircle></Flex>
                                <Flex extra={`width: 35%;`} row pointer onClick={() => { axios.get(`http://dcam.pro/api/laundry/unbook/${i.objectId}`).then(() => { document.location.reload(); }) }} >
                                    <Text>Продать</Text>
                                    <MarginWrapper><Image src={require(`../../assets/images/money.svg`)} width={1.5} /></MarginWrapper>
                                </Flex>
                                <MarginWrapper><Image src={require(`../../assets/images/arrow.svg`)} pointer width={1.5} onClick={() => {
                                    setSelectedDay(+moment(i.timestamp).startOf(`day`));
                                    setSelectedBook(i);
                                    setBookVisible(true)
                                    setReservationsVisible(false)
                                }} /></MarginWrapper>
                            </BucketRow>
                        )
                    })
                }
            </Bar>
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
background-color: ${mvConsts.colors.accept};
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