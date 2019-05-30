/*eslint-disable no-unused-vars*/
import React from 'react'
import {Rotor, Image} from './styled-templates'

export default (props) => <Rotor rotate={props.loading} >
    <Image src={require(`../assets/images/menu.svg`)} width={3} />
</Rotor>
/*eslint-enable no-unused-vars*/