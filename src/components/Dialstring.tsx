import * as React from 'react'
import { connect } from 'react-redux'
import SIPAccount from '../lib/SipAccount'
import styles from './Dialstring.scss'
import callIcon from '../assets/call-24px.svg'
import { phoneStore } from '../index'

import {
  AUDIO_OUTPUT_DEVICE_DETECTED,
  AUDIO_INPUT_DEVICE_DETECTED
} from '../actions/device'


interface Props {
  sipAccount: SIPAccount,
  devices: any

}

class Dialstring extends React.Component<Props> {
  state = {
    currentDialString: ''
  }
  handleDial() {
    if (!this.checkDialstring()) {
      this.props.sipAccount.makeCall(`${this.state.currentDialString}`)
    }
  }
  checkDialstring() {
    return this.state.currentDialString.length === 0
  }

  componentDidMount() {
    navigator.mediaDevices.enumerateDevices().then(function (devices: any) {
      devices.forEach(function (device: any) {
        console.log(device)
        console.log(device.kind)
        if (device.kind === 'audioinput') {
          phoneStore.dispatch({
            type: AUDIO_INPUT_DEVICE_DETECTED,
            payload: {
              kind: device.kind,
              label: device.label,
              id: device.deviceId
            }
          })
        } else if (device.kind === 'audiooutput') {
          phoneStore.dispatch({
            type: AUDIO_OUTPUT_DEVICE_DETECTED,
            payload: {
              kind: device.kind,
              label: device.label,
              id: device.deviceId
            }
          })
        }
      })
    })
  }

  render() {
    return (
      <div className={styles.dialstringContainer}>
        <input
          className={styles.dialInput}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.handleDial()
              e.preventDefault()
            }
          }}
          onChange={(e) => this.setState({ currentDialString: e.target.value })}
        />
        <button
          className={styles.dialButton}
          disabled={this.checkDialstring()}
          onClick={() => this.handleDial()}
        >
          <img src={callIcon}/>
        </button>
      </div>
    )
  }
}
const mapStateToProps = (state: any) => ({
  sipAccount: state.sipAccounts.sipAccount,
  devices: state.device.devices
})
const D = connect(mapStateToProps)(Dialstring)
export default D
