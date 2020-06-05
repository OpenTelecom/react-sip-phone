import * as React from 'react'
import { Invitation } from 'sip.js'
import { connect } from 'react-redux'
import { acceptCall, declineCall } from '../../actions/sipSessions'
const ring = require('./assets/ring.mp3')
interface Props {
  session: Invitation,
  acceptCall: Function,
  declineCall: Function
}

class Incoming extends React.Component<Props> {

  componentDidMount() {
    console.log('this is the session')
    console.log(this.props.session)
  }

  handleAccept() {
    this.props.session.accept()
    this.props.acceptCall(this.props.session)
  }

  handleDecline() {
    this.props.session.reject()
    this.props.declineCall(this.props.session)
  }

  render() {
    return <div id="sip-incoming">
      Incoming
      <button onClick={() => this.handleDecline()} >Decline</button>
      <button onClick={() => this.handleAccept()} >Accept</button>
      <audio loop autoPlay>
        <source src={ring} type="audio/mpeg" />
      </audio>
    </div>
  }
}

const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
})
const actions = {
  acceptCall, declineCall
}
export default connect(mapStateToProps, actions)(Incoming)