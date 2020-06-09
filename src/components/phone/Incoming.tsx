import * as React from 'react'
import { Invitation } from 'sip.js'
import { connect } from 'react-redux'
import styles from './Phone.scss'
import { acceptCall, declineCall } from '../../actions/sipSessions'
import acceptIcon from '../../assets/call-24px.svg'
import declineIcon from '../../assets/call_end-24px.svg'
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
    return <div id={styles.incoming}>
      Incoming
      <div className={styles.endCallButton} onClick={() => this.handleDecline()} ><img src={declineIcon} /></div>
      <div className={styles.startCallButton} onClick={() => this.handleAccept()} ><img src={acceptIcon} /></div>
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