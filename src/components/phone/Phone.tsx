import * as React from 'react'
import Dialpad from './Dialpad'
import { connect } from 'react-redux'
import { Session, SessionState, UserAgent } from 'sip.js'
import { endCall } from '../../actions/sipSessions'
import Hold from './Hold'
import Mute from './Mute'
import BlindTranfer from './BlindTransfer'
import AttendedTransfer from './AttendedTransfer'
import styles from './Phone.scss'
import endCallIcon from '../../assets/call_end-24px.svg'
import dialpadIcon from '../../assets/dialpad-24px.svg'
import transferIcon from '../../assets/phone_forwarded-24px.svg'
import { callDisconnect } from '../../util/TonePlayer'
import toneManager from '../../util/ToneManager'
interface Props {
  session: Session
  userAgent: UserAgent
  endCall: Function
}

class Phone extends React.Component<Props> {
  state = {
    dialpadOpen: false,
    transferMenu: false,
    ended: false,
    transferDialString: ''
  }

  componentDidUpdate(newProps: Props) {
    if (
      newProps.session.state === SessionState.Terminated &&
      this.state.ended === false
    ) {
      this.setState({ ended: true })
    }
  }

  endCall() {
    if (this.props.session.state === SessionState.Established) {
      this.props.session.bye()
    } else if (
      this.props.session.state === SessionState.Initial ||
      SessionState.Establishing
    ) {
      // @ts-ignore

      this.props.session.cancel()
      toneManager.stopAll()
      callDisconnect()
    }
    this.setState({ ended: true })
    setTimeout(() => {
      this.props.session.dispose()
      this.props.endCall(this.props.session.id)
    }, 5000)
  }

  render() {
    const state = this.state
    return (
      <React.Fragment>
        <div>{this.props.session.state}</div>
        <Dialpad open={state.dialpadOpen} session={this.props.session} />
        <div className={styles.actionsContainer}>
          <Mute session={this.props.session} />
          <button
            className={styles.endCallButton}
            disabled={state.ended}
            onClick={() => this.endCall()}
          >
            <img src={endCallIcon} />
          </button>
          <Hold session={this.props.session} />
          <div
            id={styles.actionButton}
            className={state.dialpadOpen ? styles.on : ''}
            onClick={() => this.setState({ dialpadOpen: !state.dialpadOpen })}
          >
            <img src={dialpadIcon} />
          </div>
          <div
            id={styles.actionButton}
            className={state.transferMenu ? styles.on : ''}
            onClick={() => this.setState({ transferMenu: !state.transferMenu })}
          >
            <img src={transferIcon} />
          </div>
          <div
            id={styles.transferMenu}
            className={state.transferMenu ? '' : styles.closed}
          >
            <input
              id={styles.transferInput}
              onChange={(e) =>
                this.setState({ transferDialString: e.target.value })
              }
            />
            <AttendedTransfer
              destination={state.transferDialString}
              session={this.props.session}
            />
            <BlindTranfer
              destination={state.transferDialString}
              session={this.props.session}
            />
          </div>
        </div>
        <hr style={{ width: '100%' }} />
      </React.Fragment>
    )
  }
}
const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent
})
const actions = {
  endCall
}
export default connect(mapStateToProps, actions)(Phone)
