import * as React from 'react'
import { connect } from 'react-redux'
import {
  setPrimaryInput,
  setPrimaryOutput,
  getInputAudioDevices,
  getOutputAudioDevices
} from '../actions/device'
import styles from './Status.scss'
import Select from 'react-select'
import settingsIcon from '../assets/settings-24px.svg'
import micIcon from '../assets/mic-24px.svg'
import soundIcon from '../assets/volume_up-24px.svg'
import { PhoneConfig } from '../models'

interface Props {
  phoneConfig: PhoneConfig
  name: string
  inputs: any
  outputs: any
  primaryInput: string
  primaryOutput: string
  setPrimaryInput: Function
  setPrimaryOutput: Function
  getInputAudioDevices: Function
  getOutputAudioDevices: Function
  sessions: any
  sinkIdAllowed: boolean
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
      this.props.setPrimaryOutput(id, this.props.sessions)
    } else {
      this.props.setPrimaryInput(
        id,
        this.props.sessions,
        this.props.sinkIdAllowed
      )
    }
  }
  render() {
    const { props, state } = this
    const inputs = this.mapOptions(props.inputs)
    const outputs = this.mapOptions(props.outputs)
    return (
      <React.Fragment>
        <div className={styles.container}>
          {props.phoneConfig.appSize === 'large' ? (
            <div className={styles.userStringLarge}>{props.name}</div>
          ) : (
            <div className={styles.userString}>{props.name}</div>
          )}
          {props.phoneConfig.disabledFeatures.includes('settings') ? null : (
            <div
              id={styles.settingsButton}
              className={state.settingsMenu ? styles.on : ''}
              onClick={() =>
                this.setState({ settingsMenu: !state.settingsMenu })
              }
            >
              <img src={settingsIcon} />
            </div>
          )}
        </div>
        {props.phoneConfig.disabledFeatures.includes('settings') ? null : (
          <div
            id={styles.settingsMenu}
            className={state.settingsMenu ? '' : styles.closed}
          >
            <hr style={{ width: '100%' }} />
            <div className={styles.dropdownRow}>
              <img className={styles.dropdownIcon} src={soundIcon} />
              <Select
                placeholder='Select Output...'
                value={
                  outputs.find(
                    (output: any) => output.value === props.primaryOutput
                  ) || null
                }
                onChange={(option) =>
                  this.handleChangeDevice('out', option.value)
                }
                options={outputs}
                id={styles.dropdowns}
              />
            </div>
            <div className={styles.dropdownRow}>
              <img className={styles.dropdownIcon} src={micIcon} />
              <Select
                placeholder='Select Input...'
                value={inputs.find(
                  (input: any) => input.value === props.primaryInput
                )}
                onChange={(option) =>
                  this.handleChangeDevice('in', option.value)
                }
                options={inputs}
                id={styles.dropdowns}
              />
            </div>
            <hr style={{ width: '100%' }} />
          </div>
        )}
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
  sinkIdAllowed: state.device.sinkId
})

const actions = {
  setPrimaryInput,
  setPrimaryOutput,
  getInputAudioDevices,
  getOutputAudioDevices
}
export default connect(mapStateToProps, actions)(Status)
