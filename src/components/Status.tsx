import * as React from 'react'
import { connect } from 'react-redux'
import { setPrimaryInput, setPrimaryOutput, getInputAudioDevices, getOutputAudioDevices } from '../actions/device'
import styles from './Status.scss'
import Select from 'react-select';
import settingsIcon from '../assets/settings-24px.svg'
//import micIcon from '../assets/mic-24px.svg'
//import soundIcon from '../assets/volume_up-24px.svg'

interface Props {
  name: string
  inputs: any
  outputs: any
  primaryInput: string
  primaryOutput: string
  setPrimaryInput: Function
  setPrimaryOutput: Function
  getInputAudioDevices: Function
  getOutputAudioDevices: Function
}

class Status extends React.Component<Props> {
  state = { settingsMenu: false }

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
      this.props.setPrimaryOutput(id)
    } else {
      this.props.setPrimaryInput(id)
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
        <div
          id={styles.settingsMenu}
          className={state.settingsMenu ? '' : styles.closed}
        >
          <hr style={{ width: '100%' }} />
          Devices:
          <Select
            placeholder="Select Output..."
            value={outputs.find((output: any) => output.value === props.primaryOutput) || null}
            onChange={option => this.handleChangeDevice('out', option.value)}
            options={outputs}
            id={styles.dropdowns}
          />
          <Select
            placeholder="Select Input..."
            value={inputs.find((input: any) => input.value === props.primaryInput)}
            onChange={option => this.handleChangeDevice('in', option.value)}
            options={inputs}
            id={styles.dropdowns}
          />
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
  primaryOutput: state.device.primaryAudioOutput
})

const actions = {
  setPrimaryInput,
  setPrimaryOutput,
  getInputAudioDevices,
  getOutputAudioDevices
}
export default connect(mapStateToProps, actions)(Status)