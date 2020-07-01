import * as React from 'react'
import { Invitation } from 'sip.js'
import { connect } from 'react-redux'
import styles from './Phone.scss'
import { acceptCall, declineCall } from '../../actions/sipSessions'
import acceptIcon from '../../assets/call-24px.svg'
import declineIcon from '../../assets/call_end-24px.svg'
import toneManager from '../../util/ToneManager'

const ring = require('./assets/ring.mp3')
interface Props {
  session: Invitation,
  acceptCall: Function,
  declineCall: Function
}

class Incoming extends React.Component<Props> {

  componentDidMount() {
    toneManager.stopAll()
    toneManager.playRing('ringtone')
  }

  handleAccept() {
    toneManager.stopAll()
    this.props.session.accept({
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false
        },
      },
    })
    this.props.acceptCall(this.props.session)
  }

  handleDecline() {
    toneManager.stopAll()
    this.props.session.reject()
    this.props.declineCall(this.props.session)
  }

  render() {
    const props = this.props
    return <div id={styles.incoming}>
      {
        // @ts-ignore
        `Incoming: ${props.session.remoteIdentity.uri.normal.user} - ${props.session.remoteIdentity._displayName}`
      }
      <div className={styles.endCallButton} onClick={() => this.handleDecline()} ><img src={declineIcon} /></div>
      <div className={styles.startCallButton} onClick={() => this.handleAccept()} ><img src={acceptIcon} /></div>
      <audio id='ringtone' loop >
        <source src={ring} type="audio/mpeg" />
      </audio>
      <audio id={this.props.session.id} />
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