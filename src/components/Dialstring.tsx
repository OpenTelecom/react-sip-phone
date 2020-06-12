import * as React from 'react'
import { connect } from 'react-redux'
import SIPAccount from '../lib/SipAccount'
import styles from './Dialstring.scss'
import callIcon from '../assets/call-24px.svg'
import { getInputAudioDevices, getOutputAudioDevices } from '../actions/device'

interface Props {
  sipAccount: SIPAccount
  getInputAudioDevices: Function
  getOutputAudioDevices: Function
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
    this.props.getInputAudioDevices()
    this.props.getOutputAudioDevices()
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
          <img src={callIcon} />
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  sipAccount: state.sipAccounts.sipAccount
})

const actions = {
  getInputAudioDevices,
  getOutputAudioDevices
}

const D = connect(mapStateToProps, actions)(Dialstring)
export default D
