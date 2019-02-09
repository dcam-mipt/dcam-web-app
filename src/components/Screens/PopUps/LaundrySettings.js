/*eslint-disable no-unused-vars*/
import mvConsts from '../../../constants/mvConsts'
import uiActions from '../../../redux/actions/UIActions'
import laundryActions from '../../../redux/actions/LaundryActions'
import machinesActions from '../../../redux/actions/MachinesActions'
import React from 'react';
import { connect } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import Container from '../../Container'
import cross from '../../../assets/images/cros.svg'
import moment from 'moment'
import Button from '../UI/Button'
import Parse from 'parse'
import cros from '../../../assets/images/cros_white.svg'
import undo from '../../../assets/images/undo.svg'
import upload from '../../../assets/images/upload.svg'
import broken from '../../../assets/images/egg.svg'
import disabled from '../../../assets/images/no-stopping.svg'

let updateMachines = (machines) => {
    for (let i in machines) {
        let q = new Parse.Query(`Machines`)
        q.equalTo(`objectId`, machines[i].machineId)
        q.first()
            .then((d) => {
                if (machines[i].should_be_deleted) {
                    d.destroy()
                        // .then((d) => { console.log(d) })
                        .catch((d) => { console.log(d) })
                } else {
                    d.set(`isBroken`, machines[i].isBroken)
                    d.set(`isDisabled`, machines[i].isDisabled)
                    d.save()
                        // .then((d) => { console.log(d) })
                        .catch((d) => { console.log(d) })
                }
            })
            .catch((d) => { console.log(d) })
    }
}

let change_buttons = [
    {
        backgroundColor: mvConsts.colors.yellow,
        image: broken,
        supportImage: broken,
        name: `isBroken`,
    },
    {
        backgroundColor: mvConsts.colors.WARM_ORANGE,
        image: disabled,
        supportImage: disabled,
        name: `isDisabled`,
    },
    {
        backgroundColor: mvConsts.colors.text.support,
        image: cros,
        supportImage: undo,
        name: `should_be_deleted`,
    },
]

class LaundrySettings extends React.Component {
    state = {
        machines: this.props.machines,
        openedMachine: null,
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.machines !== nextProps.machines) {
            this.setState({ machines: nextProps.machines })
        }
        if (this.props.popUpWindow !== nextProps.popUpWindow) {
            this.setState({ openedMachine: null })
        }
    }
    render = () => {
        let visible = this.props.popUpWindow === mvConsts.popUps.LAUNDRY_SETTINGS
        let style = `
            border-radius: 1vw;
            padding: 1vw 1vw 1vw 1vw
            background-color: ${mvConsts.colors.background.primary};
            flex-direction: column
            position: absolute;
            top: ${visible ? 19 : 21}vh;
            right: 57vw;
            box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05);
            z-index: 2;
            opacity: ${visible ? 1 : 0};
            visibility: ${visible ? `visible` : `hidden`};
            transition: opacity 0.2s, top 0.2s, visibility 0.2s;
        `
        return (
            <Container className={mvConsts.popUps.LAUNDRY_SETTINGS} extraProps={style} >
                <Container extraProps={`flex-direction: row`} >
                    {
                        this.state.machines.map((item, index) => {
                            let active_button = null
                            if (item.isBroken) {
                                active_button = change_buttons[0]
                            }
                            if (item.isDisabled) {
                                active_button = change_buttons[1]
                            }
                            if (item.should_be_deleted) {
                                active_button = change_buttons[2]
                            }
                            return (
                                <Container
                                    key={index}
                                    extraProps={`position: relative;`}
                                >
                                    <Container
                                        extraProps={`width: 4vw; height: 4vw; background-color: ${active_button ? active_button.backgroundColor : mvConsts.colors.background.support}; border-radius: 0.5vw; margin: 0.1vw; color: white; cursor: pointer;`}
                                        onClick={() => {
                                            this.setState({ openedMachine: this.state.openedMachine === index ? null : index })
                                        }}
                                    >
                                        {active_button ? <img src={active_button.image} alt={``} style={{ width: `1.5vw` }} /> : index + 1}
                                    </Container>
                                    <Container
                                        extraProps={`visibility: ${this.state.openedMachine === index ? `visible` : `hidden`}; opacity: ${+(this.state.openedMachine === index)}; position: absolute; box-shadow: 0 0 2vw rgba(0, 0, 0, 0.05); padding: 0.5vw; border-radius: 0.5vw; top: ${3.5 + +(this.state.openedMachine === index)}vw; background-color: ${mvConsts.colors.background.primary};  transition: 0.2s;`}
                                    >
                                        {
                                            change_buttons.map((button, button_index) => {
                                                return (
                                                    <Container
                                                        key={button_index}
                                                        extraProps={`cursor: pointer; visibility: ${this.state.openedMachine === index ? `visible` : `hidden`}; opacity: ${+(this.state.openedMachine === index)}; width: 4vw; height: 4vw; background-color: ${item[button.name] ? button.backgroundColor : mvConsts.colors.background.support}; border-radius: 0.5vw; margin: 0.1vw; color: white; transition: 0.2s;`}
                                                        onClick={() => {
                                                            let machines = this.state.machines
                                                            machines[index][button.name] = !item[button.name]
                                                            if (machines[index].isDisabled) {
                                                                machines[index].isBroken = false
                                                            }
                                                            this.setState({ machines: machines })
                                                        }}
                                                    >
                                                        <img src={item[button.name] ? button.supportImage : button.image} alt={``} style={{ width: `1.5vw`, }} />
                                                    </Container>
                                                )
                                            })
                                        }
                                    </Container>
                                </Container>
                            )
                        })
                    }
                    <Container
                        extraProps={`width: 4vw; height: 4vw; border-radius: 0.5vw; margin: 0.1vw; color: ${mvConsts.colors.background.support}; font-size: 2vw; border: 0.15vw dashed ${mvConsts.colors.background.support}; cursor: pointer; `}
                        onClick={() => {
                            const Machine = Parse.Object.extend(`Machines`);
                            const machine = new Machine();
                            machine.set(`isBroken`, false);
                            machine.set(`isDisabled`, false);
                            machine.set(`comment`, ``);
                            machine.save()
                                // .then((d) => { console.log(d) })
                                .catch((d) => { console.log(d) })
                        }}
                    >
                        +
                    </Container>
                    <Container
                        extraProps={`width: 4vw; height: 4vw; border-radius: 0.5vw; margin: 0.1vw; font-size: 2vw; background-color: ${mvConsts.colors.accept}; cursor: pointer; `}
                        onClick={() => { this.setState({ openedMachine: null }); updateMachines(this.state.machines) }}
                    >
                        <img src={upload} alt={``} style={{ width: `2vw` }} />
                    </Container>
                    <Container
                        extraProps={`width: 4vw; height: 4vw; border-radius: 0.5vw; margin: 0.1vw; font-size: 2vw; background-color: ${mvConsts.colors.background.support}; cursor: pointer; `}
                        onClick={() => {
                            let q = new Parse.Query(`Machines`)
                            q.find()
                                .then((d) => { this.props.loadMachines(d) })
                                .catch((d) => { console.log(d) })
                        }}
                    >
                        <img src={undo} alt={``} style={{ width: `1.5vw` }} />
                    </Container>
                </Container>
            </Container>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        popUpWindow: state.ui.popUpWindow,
        machines: state.machines.machines,
    }
};

let mapDispatchToProps = (dispatch) => {
    return {
        setPopUpWindow: (data) => {
            return dispatch(uiActions.setPopUpWindow(data))
        },
        loadMachines: (data) => {
            return dispatch(machinesActions.loadMachines(data))
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LaundrySettings)

const MachineNumber = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: column
margin: 0.2vw;
background-color: ${mvConsts.colors.background.support};
border-radius: 0.5vw;
color: white
width: 4vw;
height: 4vw;
transition: 0.2s
cursor: pointer;
`

const Machine = styled.div`
display: flex
justify-content: center
align-items: center
flex-direction: row
transition: 0.2s
`

/*eslint-enable no-unused-vars*/