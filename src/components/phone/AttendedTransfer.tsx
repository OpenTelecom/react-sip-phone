import * as React from 'react'
import { connect } from 'react-redux'
import { phoneStore } from '../../index'
import styles from './Phone.scss'
import { Session, SessionState, UserAgent, Inviter } from 'sip.js'
import {
  attendedTransferRequest,
  attendedTransferPending,
  attendedTransferReady,
  attendedTransferCancel,
  attendedTransferSuccess,
  attendedTransferFail,
  SIPSESSION_STATECHANGE,
  NEW_SESSION,
  CLOSE_SESSION
} from '../../actions/sipSessions'

interface Props {
  session: Session
  userAgent: UserAgent
  destination: string
  attendedTransferRequest: Function
  attendedTransferPending: Function
  attendedTransferReady: Function
  attendedTransferCancel: Function
  attendedTransferSuccess: Function
  attendedTransferFail: Function
}

class AttendedTransfer extends React.Component<Props> {
  state = {
    attendedTransferSessionPending: null,
    attendedTransferSessionReady: null
  }

  attendedTransferCall() {
    // if (!this.state.onHold) {
    //   this.hold()
    // }
    this.props.attendedTransferRequest()
    const target = UserAgent.makeURI(
      `sip:${this.props.destination}@sip.reper.io;user=phone`
    )
    if (target) {
      const inviter = new Inviter(this.props.userAgent, target)
      const outgoingSession: Session = inviter
      phoneStore.dispatch({ type: NEW_SESSION, payload: outgoingSession })
      outgoingSession.stateChange.addListener((newState: SessionState) => {
        switch (newState) {
          case SessionState.Initial:
          case SessionState.Establishing:
            phoneStore.dispatch({
              type: SIPSESSION_STATECHANGE,
              payload: { state: newState, id: outgoingSession.id }
            })

            //add new session to local state
            this.setState({ attendedTransferSessionPending: outgoingSession })
            this.props.attendedTransferPending()
            break
          case SessionState.Established:
            this.setState({ attendedTransferSessionReady: outgoingSession })
            this.props.attendedTransferReady()
            this.setState({ attendedTransferSessionPending: false })
            phoneStore.dispatch({
              type: SIPSESSION_STATECHANGE,
              payload: { state: newState, id: outgoingSession.id }
            })
            break
          case SessionState.Terminating:
            phoneStore.dispatch({
              type: SIPSESSION_STATECHANGE,
              payload: { state: newState, id: outgoingSession.id }
            })
            break
          case SessionState.Terminated:
            phoneStore.dispatch({
              type: SIPSESSION_STATECHANGE,
              payload: { state: newState, id: outgoingSession.id }
            })
            setTimeout(() => {
              phoneStore.dispatch({
                type: CLOSE_SESSION,
                payload: outgoingSession.id
              })
            }, 5000)
            break
          default:
            console.log(`Unknown session state change: ${newState}`)
            break
        }
      })
      outgoingSession.invite().catch((error: Error) => {
        this.props.attendedTransferFail()
        console.log(error)
      })
    } else {
      this.props.attendedTransferFail()
    }
  }

  //refers the session in local state
  connectAttendedTransfer(attendedTransferSession: any) {
    this.props.session.refer(attendedTransferSession)
    this.props.attendedTransferSuccess()
    this.setState({ attendedTransferSessionReady: null })
  }

  cancelAttendedTransfer(attendedTransferSession: any) {
    attendedTransferSession.cancel()
    this.props.attendedTransferCancel()
    this.setState({ attendedTransferSessionPending: null })
    this.setState({ attendedTransferSession: null })
  }

  render() {
    if (this.state.attendedTransferSessionReady) {
      return (
        <button
          className={styles.transferButtons}
          onClick={() =>
            this.connectAttendedTransfer(
              this.state.attendedTransferSessionReady
            )
          }
        >
          Connect
        </button>
      )
    } else if (this.state.attendedTransferSessionPending) {
      return (
        <button
          className={styles.transferButtons}
          onClick={() =>
            this.cancelAttendedTransfer(
              this.state.attendedTransferSessionPending
            )
          }
        >
          Cancel
        </button>
      )
    } else {
      return (
        <button
          className={styles.transferButtons}
          onClick={() => this.attendedTransferCall()}>
          Attended
        </button>
      )
    }
  }
}

const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent,
  attendedTransferReady: state.sipSessions.attendedTransferReady,
  attendedTransferPending: state.sipSessions.attendedTransferPending
})
const actions = {
  attendedTransferRequest,
  attendedTransferPending,
  attendedTransferReady,
  attendedTransferCancel,
  attendedTransferSuccess,
  attendedTransferFail
}

export default connect(mapStateToProps, actions)(AttendedTransfer)
