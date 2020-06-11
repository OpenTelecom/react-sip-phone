import * as React from 'react'
import { connect } from 'react-redux'
import { phoneStore } from '../../index'
import styles from './Phone.scss'
import { Session, SessionState, UserAgent, Inviter } from 'sip.js'
import {
  SIPSESSION_ATTENDED_TRANSFER_REQUEST,
  SIPSESSION_ATTENDED_TRANSFER_CANCEL,
  SIPSESSION_ATTENDED_TRANSFER_READY,
  SIPSESSION_ATTENDED_TRANSFER_PENDING,
  SIPSESSION_ATTENDED_TRANSFER_SUCCESS,
  SIPSESSION_ATTENDED_TRANSFER_FAIL,
  SIPSESSION_STATECHANGE,
  NEW_SESSION,
  CLOSE_SESSION,
  holdCallRequest
} from '../../actions/sipSessions'
import { getFullNumber } from '../../util/sessions'
import attendedIcon from '../../assets/phone_in_talk-24px.svg'
import cancelIcon from '../../assets/call_end-24px.svg'
import connectIcon from '../../assets/arrow_forward-24px.svg'

interface Props {
  session: Session
  userAgent: UserAgent
  destination: string
  holdCallRequest: Function
  started: Function
}

class AttendedTransfer extends React.Component<Props> {
  state = {
    attendedTransferSessionPending: null,
    attendedTransferSessionReady: null
  }

  attendedTransferCall() {
    this.holdAll()

    phoneStore.dispatch({
      type: SIPSESSION_ATTENDED_TRANSFER_REQUEST
    })
    const target = UserAgent.makeURI(
      `sip:${getFullNumber(this.props.destination)}@sip.reper.io;user=phone`
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
            phoneStore.dispatch({
              type: SIPSESSION_ATTENDED_TRANSFER_PENDING
            })
            break
          case SessionState.Established:
            this.setState({ attendedTransferSessionReady: outgoingSession })
            phoneStore.dispatch({
              type: SIPSESSION_ATTENDED_TRANSFER_READY
            })
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
        phoneStore.dispatch({
          type: SIPSESSION_ATTENDED_TRANSFER_FAIL
        })
        console.log(error)
      })
    } else {
      phoneStore.dispatch({
        type: SIPSESSION_ATTENDED_TRANSFER_FAIL
      })
    }
  }

  //refers the session in local state
  connectAttendedTransfer(attendedTransferSession: any) {
    try {
      this.props.session.refer(attendedTransferSession)
      phoneStore.dispatch({
        type: SIPSESSION_ATTENDED_TRANSFER_SUCCESS
      })
      this.setState({ attendedTransferSessionReady: null })
    } catch (err) {
      console.log(err)
    }
  }

  cancelAttendedTransfer(attendedTransferSession: any) {
    attendedTransferSession.cancel()
    phoneStore.dispatch({
      type: SIPSESSION_ATTENDED_TRANSFER_CANCEL
    })
    this.setState({ attendedTransferSessionPending: null })
    this.setState({ attendedTransferSession: null })
  }

  holdAll() {
    const state = phoneStore.getState()

    //@ts-ignore
    const onHolds = state.sipSessions.onHold

    //@ts-ignore
    const sessions = state.sipSessions.sessions

    if (this.props.session.id in onHolds === false) {
      try {
        //@ts-ignore
        this.props.holdCallRequest(this.props.session)

        return
      } catch (err) {
        return
      }
    }
  }

  render() {
    if (this.state.attendedTransferSessionReady) {
      return (
        <button
          className={styles.transferButtons}
          onClick={() =>{
            this.props.started(false)
            this.connectAttendedTransfer(this.state.attendedTransferSessionReady)
          }}>
          <img src={connectIcon} />
        </button>
      )
    } else if (this.state.attendedTransferSessionPending) {
      return (
        <button
          className={styles.endCallButton}
          onClick={() =>{
            this.props.started(false)
            this.cancelAttendedTransfer(this.state.attendedTransferSessionPending)
          }}>
          <img src={cancelIcon} />
        </button>
      )
    } else {
      return (
        <button
          className={styles.transferButtons}
          onClick={() => {
            this.props.started(true)
            this.attendedTransferCall()
          }}>
          <img src={attendedIcon} />
        </button>
      )
    }
  }
}

const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent
})
const actions = {
  holdCallRequest
}

export default connect(mapStateToProps, actions)(AttendedTransfer)
