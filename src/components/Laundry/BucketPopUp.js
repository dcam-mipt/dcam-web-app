/*eslint-disable no-unused-vars*/
import React from 'react'
import { Flex, Image, Extra, PopUp } from '../styled-templates'
import moment from 'moment'
import Button from '../Button'
import axios from 'axios'
import mvConsts from '../../constants/mvConsts'
import styled from 'styled-components'

export default (props) => {
    let { selectedSlots, setSelectedSlots, selectSlot, days_of_week_full } = props
    return (
        <Flex>
            {
                selectedSlots.sort((a, b) => a.timestamp - b.timestamp).sort((a, b) => a.machine_id - b.machine_id).map((i, index) => {
                    return (
                        <BasketRecord key={index} >
                            <Flex row >
                                <Flex>
                                    <Flex>{moment(i.timestamp).format(`DD.MM`)}</Flex>
                                    <Flex>{days_of_week_full[moment(i.timestamp).isoWeekday() - 1]}</Flex>
                                </Flex>
                                <Flex>{moment(i.timestamp).format(`HH:mm`)}</Flex>
                            </Flex>
                            <MachineCircle>
                                {props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}
                            </MachineCircle>
                            <Flex onClick={() => { selectSlot(i) }} >
                                Удалить
                            </Flex>
                        </BasketRecord>
                    )
                })
            }
            <Flex row>
                <Button onClick={() => { setSelectedSlots([]) }} >
                    Очистить
                </Button>
                <Button onClick={() => {
                    let a = selectedSlots
                    let deal = () => new Promise((resolve, reject) => {
                        axios.get(`http://dcam.pro/api/laundry/book/${a[0].timestamp}/${a[0].machine_id}`)
                            .then((d) => {
                                a = a.filter((i, index) => index > 0)
                                setSelectedSlots(a)
                                a.length ? deal() : document.location.reload();
                            })
                            .catch((d) => { console.log(d); reject(d) })
                    })
                    a.length && deal()
                }} >
                    Купить
                        </Button>
            </Flex>
        </Flex>
    )
}

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
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
    height: 10vw;
    border-radius: 10vw;
    font-size: 4vw;
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

/*eslint-enable no-unused-vars*/