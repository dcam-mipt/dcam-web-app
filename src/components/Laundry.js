/*eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import userActions from '../redux/actions/UserActions'
import axios from 'axios'
import styled from 'styled-components'
import moment from 'moment'

let Laundry = (props) => {
    let [selectedDay, setSelectedDay] = useState(+moment().startOf(`day`))
    return (
        <Wrapper>
            <Calendar>
                
            </Calendar>
            <Schedule>
                {
                    Array.from({ length: 12 }, (v, i) => i).map((i, index) => {
                        return (
                            <TwoHourRow key={index} >
                                <div>
                                    {moment().startOf(`day`).add(index * 2, `hour`).format(`HH:mm`)}
                                </div>
                                {
                                    [0, 1, 2, 3].map((machine, machine_index) => {
                                        return (
                                            <Machine width={21 / 4} >
                                                {machine_index}
                                            </Machine>
                                        )
                                    })
                                }
                            </TwoHourRow>
                        )
                    })
                }
            </Schedule>
        </Wrapper>
    )
}

let mapStateToProps = (state) => {
    return {

    }
}
let mapDispatchToProps = (dispatch) => {
    return {
        setToken: (data) => {
            return dispatch(userActions.setToken(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Laundry)

const Wrapper = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row;
transition: 0.2s;
width: 94vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
}`

const Calendar = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 72vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    display: none;
}`

const Schedule = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: 30vw;
height: 92vh;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    justify-content: flex-start;
}`

const TwoHourRow = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
transition: 0.2s
width: 30vw;
height: 4vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: 100vw;
    height: 15vw;
}`

const Machine = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
transition: 0.2s
width: ${props => props.width}vw;
@media (min-width: 320px) and (max-width: 480px) {
    width: ${props => props.width * 5}vw;
    height: 15vw;
}`
/*eslint-enable no-unused-vars*/