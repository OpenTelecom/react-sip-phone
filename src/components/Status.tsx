import * as React from 'react'
import { connect } from 'react-redux'
import {
  setPrimaryInput, setPrimaryOutput, getInputAudioDevices, getOutputAudioDevices, getNewInputAudioDevices, getNewOutputAudioDevices, audioSwap

} from '../actions/device'
import styles from './Status.scss'
import Select from 'react-select';
import settingsIcon from '../assets/settings-24px.svg'
import micIcon from '../assets/mic-24px.svg'
import soundIcon from '../assets/volume_up-24px.svg'

interface Props {
  name: string
  inputs: Array<Object>
  outputs: any
  primaryInput: string
  primaryOutput: string
  setPrimaryInput: Function
  setPrimaryOutput: Function
  getInputAudioDevices: Function
  getOutputAudioDevices: Function
  getNewInputAudioDevices: Function
  getNewOutputAudioDevices: Function
  audioSwap: Function
  newInputs: any
  newOutputs: any
  sessions: any
}



class Status extends React.Component<Props> {
  state = {
    settingsMenu: false,
    // audioInputs: Array<{ deviceId: string, groupId: string, kind: string, label: string }>()
    // audioInputs: new Array() as Array<any>,

  }

  componentDidMount() {
    this.props.getInputAudioDevices()
    this.props.getOutputAudioDevices()
  }

  mapOptions(options: any) {
    const list: any = []
    options.map((option: any) => {
      list.push({ value: option.deviceId, label: option.label })
    })
    return list
  }
  handleChangeDevice(type: string, id: string) {
    if (type === 'out') {
      this.props.setPrimaryOutput(id, this.props.sessions)
    } else {
      this.props.setPrimaryInput(id, this.props.sessions)
    }
  }

  getAllAudioDevices = () => {
    this.props.getInputAudioDevices()
    this.props.getOutputAudioDevices()
  }


  // newPrimaryOutput = () => {
  //   setTimeout(() => {
  //     console.log(JSON.parse(JSON.stringify(this.props.newOutputs)))
  //     console.log(JSON.parse(JSON.stringify(this.props.outputs)))
  //     console.log(JSON.stringify(this.props.newOutputs))
  //     console.log(JSON.stringify(this.props.outputs))
  //     console.log(this.props.newOutputs)
  //     console.log(this.props.newOutputs[1].deviceId)
  //     this.props.setPrimaryOutput(this.props.newOutputs[1].deviceId, this.props.sessions)
  //   }, 2000)
  // }

  newDevice = () => {
    console.log('device changed')
    setTimeout(() => {
      console.log(JSON.parse(JSON.stringify(this.props.newInputs)))
      console.log(JSON.parse(JSON.stringify(this.props.inputs)))
      console.log(JSON.stringify(this.props.newInputs))
      console.log(JSON.stringify(this.props.inputs))
      console.log(this.props.newInputs)
      console.log(this.props.newInputs[1].deviceId)
      this.props.setPrimaryInput(this.props.newInputs[1].deviceId, this.props.sessions)
      // this.props.setPrimaryOutput(this.props.newInputs[1].deviceId, this.props.sessions)
      setTimeout(() => {
        this.props.audioSwap()
        this.props.getInputAudioDevices()
      }, 2000)
    }, 4000)
  }

  mediaDevicesListener = () => {
    navigator.mediaDevices.ondevicechange = (e) => {
      this.props.getNewInputAudioDevices()
      // this.props.getNewOutputAudioDevices()
      console.log(e)
      this.newDevice()
    }
  }


  render() {
    const { props, state } = this
    const inputs = this.mapOptions(props.inputs)
    const outputs = this.mapOptions(props.outputs)
    return (
      <React.Fragment>
        <div className={styles.container}>
          <div className={styles.userString} >{props.name}</div>
          <div
            id={styles.settingsButton}
            className={state.settingsMenu ? styles.on : ''}
            onClick={() => this.setState({ settingsMenu: !state.settingsMenu })}
          >
            <img src={settingsIcon} />
          </div>
        </div>
        {this.mediaDevicesListener()}
        <div
          id={styles.settingsMenu}
          className={state.settingsMenu ? '' : styles.closed}
        >
          <hr style={{ width: '100%' }} />
          <div className={styles.dropdownRow}>
            <img className={styles.dropdownIcon} src={soundIcon} />
            <Select
              placeholder="Select Output..."
              value={outputs.find((output: any) => output.value === props.primaryOutput) || null}
              onChange={option => this.handleChangeDevice('out', option.value)}
              options={outputs}
              id={styles.dropdowns}
            />
          </div>
          <div className={styles.dropdownRow}>
            <img className={styles.dropdownIcon} src={micIcon} />
            <Select
              placeholder="Select Input..."
              value={inputs.find((input: any) => input.value === props.primaryInput)}
              onChange={option => this.handleChangeDevice('in', option.value)}
              options={inputs}
              id={styles.dropdowns}
            />
          </div>
          <hr style={{ width: '100%' }} />
        </div>
      </React.Fragment>
    )
  }
}
const mapStateToProps = (state: any) => ({
  inputs: state.device.audioInput,
  outputs: state.device.audioOutput,
  primaryInput: state.device.primaryAudioInput,
  primaryOutput: state.device.primaryAudioOutput,
  sessions: state.sipSessions.sessions,
  newInputs: state.device.newAudioInput,
  newOutputs: state.device.newAudioOutput

})

const actions = {
  setPrimaryInput,
  setPrimaryOutput,
  getInputAudioDevices,
  getOutputAudioDevices,
  getNewInputAudioDevices,
  getNewOutputAudioDevices,
  audioSwap
}
export default connect(mapStateToProps, actions)(Status)