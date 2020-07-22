import * as React from 'react'
import { connect } from 'react-redux'
import SIPAccount from '../lib/SipAccount'
import styles from './Dialstring.scss'
import callIcon from '../assets/call-24px.svg'
import { PhoneConfig, SipConfig } from '../models'
interface Props {
  sipAccount: SIPAccount
  phoneConfig: PhoneConfig
  sipConfig: SipConfig
  sessions: Object

}

//call-button enabled (without dialstring) by adding 'callbutton' to phoneConfig.features string 
//use sipConfig.defaultDial value to call from react-sip-phone without use of dialstring  

class Dialstring extends React.Component<Props> {
  state = {
    currentDialString: ''
  }
  handleDial() {
    if (Object.keys(this.props.sessions).length >= this.props.phoneConfig.sessionsLimit){
      console.log('Unable to create more sessions... please check your phoneConfig options')
    } else{
      if (this.props.phoneConfig.disabledFeatures.includes('callbutton')){
        this.props.sipAccount.makeCall(this.props.phoneConfig.defaultDial)
      }
      if (!this.checkDialstring()) {
        this.props.sipAccount.makeCall(`${this.state.currentDialString}`)
      }
    }
  }
  checkDialstring() {
    return this.state.currentDialString.length === 0
  }

  render() {
    const { props } = this

    return (
      <React.Fragment>
        {props.phoneConfig.disabledFeatures.includes('callbutton') ?   
        <button
          className={styles.dialButton}
          onClick={() => this.handleDial()}
        >
          <img src={callIcon} />
        </button> 
        :
      <div className={styles.dialstringContainer}>
      <input
        className={styles.dialInput}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            this.handleDial()
            e.preventDefault()
          }
        }}
        placeholder="Enter the number to dial..."
        onChange={(e) => this.setState({ currentDialString: e.target.value })}
      />
      <button
        className={styles.dialButton}
        disabled={this.checkDialstring()}
        onClick={() => this.handleDial()}
      >
        <img src={callIcon} />
      </button>
    </div>}
    </React.Fragment>

    )
  }
}

const mapStateToProps = (state: any) => ({
  sipAccount: state.sipAccounts.sipAccount,
  sessions: state.sipSessions.sessions
})

const actions = {
}

const D = connect(mapStateToProps, actions)(Dialstring)
export default D
