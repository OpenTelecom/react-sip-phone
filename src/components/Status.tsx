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
// eslint-disable-next-line no-unused-vars
import { PhoneConfig, AppConfig } from '../models'
import UserString from './UserString'

const settingsIcon = require('./assets/settings-24px.svg')
const micIcon = require('./assets/mic-24px.svg')
const soundIcon = require('./assets/volume_up-24px.svg')

interface Props {
  phoneConfig: PhoneConfig
  appConfig: AppConfig
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

export const getcustomStyles = (appSize: string) => {
  // Default Large
  let HeightSelect = '40px'
  let FontSizeSelect = '1em'
  if (appSize === 'large') {
    HeightSelect = '30px'
    FontSizeSelect = '1em'
  } else if (appSize === 'medium') {
    HeightSelect = '25px'
    FontSizeSelect = '0.9em'
  } else if (appSize === 'small') {
    HeightSelect = '20px'
    FontSizeSelect = '0.8em'
  }

  const customStyles = {
    container: (provided: any) => ({
      ...provided,
      display: 'inline-block',
      minHeight: '1px',
      textAlign: 'left',
      width: '100%',
      border: 'none',
      height: HeightSelect,
      fontSize: FontSizeSelect,
      color: '#9d9d9d'
    }),
    control: (provided: any) => ({
      ...provided,
      minHeight: '10px',
      fontSize: '0.8em'
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: HeightSelect,
      minHeight: HeightSelect
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      padding: '5px'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: '5px'
    }),
    input: (provided: any) => ({
      ...provided,
      minHeight: '1px'
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      // minHeight: '1px',
      minHeight: HeightSelect,
      height: '18px',
      paddingTop: '0',
      paddingBottom: '0'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      minHeight: '1px',
      paddingBottom: '2px'
    })
  }
  return customStyles
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
          <UserString appSize={props.appConfig.appSize} name={props.name} />

          {props.phoneConfig.disabledFeatures.includes('settings') ? null :(
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
        {props.phoneConfig.disabledFeatures.includes('settings') ? null :
          <div
            id={styles.settingsMenu}
            className={state.settingsMenu ? '' : styles.closed}
          >
            <hr style={{ width: '100%' }} />
            <div className={styles.dropdownRow}>
              <img className={styles.dropdownIcon} src={soundIcon} />
              <Select
                styles={getcustomStyles(props.appConfig.appSize)}
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
              />
            </div>
            <div className={styles.dropdownRow}>
              <img className={styles.dropdownIcon} src={micIcon} />
              <Select
                styles={getcustomStyles(props.appConfig.appSize)}
                placeholder='Select Input...'
                value={inputs.find(
                  (input: any) => input.value === props.primaryInput
                )}
                onChange={(option) =>
                  this.handleChangeDevice('in', option.value)
                }
                options={inputs}
              />
            </div>
            <hr style={{ width: '100%' }} />
          </div>
        }

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
