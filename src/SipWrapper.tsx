import * as React from 'react'

// Wrapper component to do any initialization of the Sip connection.

interface Props {
  sipCredentials: Object,
  sipConfig: Object,
}

class SipWrapper extends React.Component<Props> {
  render() {
    return <div>
      { this.props.children }
    </div>
  }
}
export default SipWrapper