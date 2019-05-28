/*eslint-disable no-unused-vars*/
import React from 'react'
import { Flex, Image, Text } from '../styled-templates'
import moment from 'moment'
import Button from '../Button'
import axios from 'axios'
import mvConsts from '../../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'

let days_of_week_short = [`пн`, `вт`, `ср`, `чт`, `пт`, `сб`, `вс`]

let main = (props) => {
    let { my_reservations, setSelectedDay, setSelectedBook, setBookVisible  } = props
    // return (
    //     <Flex>
    //         {
    //             my_reservations.filter(i => i.timestamp >= +moment().startOf(`day`)).sort((a, b) => a.timestamp - b.timestamp).sort((a, b) => a.machine_id - b.machine_id).map((i, index) => {
    //                 return (
    //                     <BasketRecord key={index} >
    //                         <Flex row >
    //                             <Extra>
    //                                 <Extra>{moment(i.timestamp).format(`DD.MM`)}</Extra>
    //                                 <Flex>{days_of_week_full[moment(i.timestamp).isoWeekday() - 1].toLowerCase()}</Flex>
    //                             </Extra>
    //                             <Flex>{moment(i.timestamp).format(`HH:mm`)}</Flex>
    //                         </Flex>
    //                         <MachineCircle>
    //                             {props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}
    //                         </MachineCircle>
    //                         <Flex onClick={() => { axios.get(`http://dcam.pro/api/laundry/unbook/${i.objectId}`).then(() => { document.location.reload(); }) }} >
    //                             Удалить
    //                                 </Flex>
    //                         <Flex onClick={() => { setSelectedDay(+moment(i.timestamp).startOf(`day`)); }} >
    //                             Показать
    //                                 </Flex>
    //                     </BasketRecord>
    //                 )
    //             })
    //         }
    //     </Flex>
    // )
    return (
        <Flex extra={` > * { &:first-child { margin-top: 0; } } `} >
            <Header row >
                <Image src={require(`../../assets/images/ticket.svg`)} width={2} />
                <Text size={1.5} >Мои Стирки</Text>
            </Header>
            <Header>
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
                                }} /></MarginWrapper>
                            </BucketRow>
                        )
                    })
                }
            </Header>
        </Flex>
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

const Header = styled(Flex)`
width: 100%;
justify-content: flex-start;
border-bottom: 0.15vw dashed ${mvConsts.colors.background.secondary};
margin-bottom: 0.5vw;
padding-bottom: 1vw;
@media (min-width: 320px) and (max-width: 480px) {
    border-bottom: 0.75vw dashed ${mvConsts.colors.background.secondary};
    margin-bottom: 2.5vw;
    padding-bottom: 5vw;
}`

const BasketRecord = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
transition: 0.2s
padding: 0.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    
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