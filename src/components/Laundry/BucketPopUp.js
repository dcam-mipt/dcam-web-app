/*eslint-disable no-unused-vars*/
import React from 'react'
import { Flex, Image, Extra, Text } from '../styled-templates'
import moment from 'moment'
import Button from '../Button'
import axios from 'axios'
import mvConsts from '../../constants/mvConsts'
import styled from 'styled-components'
import { connect } from 'react-redux'

let days_of_week_short = [`пн`, `вт`, `ср`, `чт`, `пт`, `сб`, `вс`]

let main = (props) => {
    let { selectedSlots, setSelectedSlots, selectSlot, days_of_week_full } = props
    let cost = selectedSlots.length * 25
    return (
        <Flex extra={` > * { &:first-child { margin-top: 0; } } `} >
            <Header row >
                <Image src={require(`../../assets/images/shopping-bag.svg`)} width={1.5} />
                <Text size={1.5} >Корзина</Text>
            </Header>
            <Header>
                {
                    selectedSlots.sort((a, b) => a.timestamp - b.timestamp).sort((a, b) => a.machine_id - b.machine_id).map((i, index) => {
                        return (
                            <BucketRow key={index} >
                                <Flex start extra={`width: 40%;`} >
                                    <Text color={mvConsts.colors.text.support} >{days_of_week_short[moment(i.timestamp).isoWeekday() - 1].toUpperCase()} {moment(i.timestamp).format(`DD.MM.YY`)}</Text>
                                    <Text size={1.2} >{moment(i.timestamp).format(`HH:mm`)}</Text>
                                </Flex>
                                <Flex extra={`width:20%;`}><MachineCircle>{props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}</MachineCircle></Flex>
                                <Flex extra={`width: 40%;`} row pointer onClick={() => { selectSlot(i) }} >
                                    <MarginWrapper><Image src={require(`../../assets/images/cros_black.svg`)} width={1} pointer /></MarginWrapper>
                                    <Text>удалить</Text>
                                </Flex>
                            </BucketRow>
                        )
                    })
                }
            </Header>
            <Flex pointer row start extra={`width: 100%;`} onClick={() => { setSelectedSlots([]) }} >
                <ClearButton>
                    <Image src={require(`../../assets/images/trash.svg`)} width={1.5} />
                </ClearButton>
                <Button backgroundColor={mvConsts.colors.accept} disabled={cost > props.balance} onClick={() => {
                    let a = selectedSlots
                    let deal = () => new Promise((resolve, reject) => {
                        axios.get(`http://dcam.pro/api/laundry/book/${a[0].timestamp}/${a[0].machine_id}`)
                            .then((d) => {
                                a.shift()
                                setSelectedSlots(a)
                                a.length ? deal() : document.location.reload();
                            })
                            .catch((d) => { console.log(d); reject(d) })
                    })
                    a.length && deal()
                }} >
                    Купить ({cost}р)
                </Button>
            </Flex>
        </Flex>
    )
}

let mapStateToProps = (state) => {
    return {
        is_admin: state.user.is_admin,
        balance: state.user.balance,
    }
}
let mapDispatchToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapDispatchToProps)(main)

const ClearButton = styled(Flex)`
width: 3vw;
height: 3vw;
border-radius: 0.5vw;
background-color: ${mvConsts.colors.WARM_ORANGE};
@media (min-width: 320px) and (max-width: 480px) {
    
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

const MachineCircle = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 2vw;
height: 2vw;
border-radius: 2vw;
font-size: 0.8vw;
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