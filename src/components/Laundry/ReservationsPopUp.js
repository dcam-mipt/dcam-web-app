/*eslint-disable no-unused-vars*/
import React from 'react'
import { Flex, Image, Extra, PopUp } from '../styled-templates'
import moment from 'moment'
import Button from '../Button'
import axios from 'axios'
import mvConsts from '../../constants/mvConsts'
import styled from 'styled-components'

export default (props) => {
    let { days_of_week_full, my_reservations, setSelectedDay } = props
    return (
        <Flex>
            {
                my_reservations.filter(i => i.timestamp >= +moment().startOf(`day`)).sort((a, b) => a.timestamp - b.timestamp).sort((a, b) => a.machine_id - b.machine_id).map((i, index) => {
                    return (
                        <BasketRecord key={index} >
                            <Flex row >
                                <Extra>
                                    <Extra>{moment(i.timestamp).format(`DD.MM`)}</Extra>
                                    <Flex>{days_of_week_full[moment(i.timestamp).isoWeekday() - 1].toLowerCase()}</Flex>
                                </Extra>
                                <Flex>{moment(i.timestamp).format(`HH:mm`)}</Flex>
                            </Flex>
                            <MachineCircle>
                                {props.machines.map(i => i.objectId).indexOf(i.machine_id) + 1}
                            </MachineCircle>
                            <Flex onClick={() => { axios.get(`http://dcam.pro/api/laundry/unbook/${i.objectId}`).then(() => { document.location.reload(); }) }} >
                                Удалить
                                    </Flex>
                            <Flex onClick={() => { setSelectedDay(+moment(i.timestamp).startOf(`day`)); }} >
                                Показать
                                    </Flex>
                        </BasketRecord>
                    )
                })
            }
        </Flex>
    )
}

const BasketRecord = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
transition: 0.2s
padding: 0.5vw;
@media (min-width: 320px) and (max-width: 480px) {
    
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
@media (min-width: 320px) and (max-width: 480px) {
    width: 10vw;
    height: 10vw;
    border-radius: 10vw;
    font-size: 4vw;
}`
/*eslint-enable no-unused-vars*/