import * as React from 'react'
import { SipConfig, SipCredentials } from './models'

// Wrapper component to do any initialization of the Sip connection.

interface Props {
  sipCredentials: SipCredentials,
  sipConfig: SipConfig,
}

class SipWrapper extends React.Component<Props> {

  componentDidMount() {
    if (this.props.sipCredentials.password) {
      this.initializeSip()
    }
  }

  initializeSip() {
    
  }

  render() {
    return <div>
      { this.props.children }
    </div>
  }
}
export default SipWrapper