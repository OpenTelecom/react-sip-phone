import * as React from 'react'
import { SipConfig, SipCredentials } from './models'
import SIPAccount from './lib/SipAccount'
import { connect } from 'react-redux'
import { setNewAccount } from './actions/sipAccounts'

// Wrapper component to do any initialization of the Sip connection.

interface Props {
  sipCredentials: SipCredentials
  sipConfig: SipConfig
  setNewAccount: Function
  children: any
}

class SipWrapper extends React.Component<Props> {

  componentDidMount() {
    console.log('mounted')
    if (this.props.sipCredentials.password) {
      this.initializeSip()
    }
  }

  initializeSip() {
    const account = new SIPAccount({
      websocket: this.props.sipConfig.websocket,
      sipuri: this.props.sipCredentials.sipuri,
      password: this.props.sipCredentials.password
    })
    this.props.setNewAccount(account)
  }

  render() {
    return <React.Fragment>
      { this.props.children }
    </React.Fragment>
  }
}
const mapStateToProps = () => ({})
const actions = {
  setNewAccount
}
export default connect(mapStateToProps, actions)(SipWrapper)