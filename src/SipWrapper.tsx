import * as React from 'react'
import { SipConfig, SipCredentials } from './models'
import SIPAccount from './lib/SipAccount'

// Wrapper component to do any initialization of the Sip connection.

interface Props {
  sipCredentials: SipCredentials,
  sipConfig: SipConfig,
}

class SipWrapper extends React.Component<Props> {

  componentDidMount() {
    console.log('moun')
    if (this.props.sipCredentials.password) {
      this.initializeSip()
    }
  }

  initializeSip() {
    const x = new SIPAccount({
      websocket: this.props.sipConfig.websocket,
      sipuri: this.props.sipCredentials.sipuri,
      password: this.props.sipCredentials.password
    })
    console.log(x)
  }

  render() {
    return <div>
      { this.props.children }
    </div>
  }
}
export default SipWrapper