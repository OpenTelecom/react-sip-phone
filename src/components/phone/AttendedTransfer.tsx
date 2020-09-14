import * as React from 'react'
import { connect } from 'react-redux'
import { phoneStore } from '../../index'
import { PhoneConfig } from '../../models'
import styles from './Phone.scss'
import { Session, SessionState, UserAgent, Inviter } from 'sip.js'
import {
  NEW_ATTENDED_TRANSFER,
  attendedTransferRequest,
  attendedTransferCancel,
  attendedTransferReady,
  attendedTransferPending,
  attendedTransferSuccess,
  attendedTransferFail,
  holdCallRequest,
  stateChange,
  closeSession
} from '../../actions/sipSessions'
import { attendedTransferLimitReached } from '../../actions/config'
import Phone from './Phone'
import { getFullNumber } from '../../util/sessions'
import attendedIcon from '../../assets/phone_in_talk-24px.svg'
import cancelIcon from '../../assets/call_end-24px.svg'
import connectIcon from '../../assets/arrow_forward-24px.svg'
import { setLocalAudio, setRemoteAudio, cleanupMedia } from '../../util/audio'
import SIPAccount from '../../lib/SipAccount'

interface Props {
  session: Session
  sipAccount: SIPAccount
  userAgent: UserAgent
  destination: string
  started: Function
  attendedTransferRequest: Function
  attendedTransferCancel: Function
  attendedTransferReady: Function
  attendedTransferPending: Function
  attendedTransferSuccess: Function
  attendedTransferFail: Function
  attendedTransferLimitReached: Function
  holdCallRequest: Function
  stateChange: Function
  closeSession: Function
  attendedTransfersList: Array<string>
  phoneConfig: PhoneConfig
}

class AttendedTransfer extends React.Component<Props> {
  state = {
    attendedTransferSessionPending: null,
    attendedTransferSessionReady: null
  }

  attendedTransferCall() {
    //check amount of attendedTranfers with phoneConfig
    if (
      this.props.attendedTransfersList.length >=
      this.props.phoneConfig.attendedTransferLimit
    ) {
      this.props.attendedTransferLimitReached()
    } else {
      this.holdAll()
      this.props.attendedTransferRequest()
      const target = UserAgent.makeURI(
        `sip:${getFullNumber(this.props.destination)}@${
          this.props.sipAccount._credentials.sipuri.split('@')[1]
        };user=phone`
      )
      if (target) {
        const inviter = new Inviter(this.props.userAgent, target)
        const outgoingSession: Session = inviter
        phoneStore.dispatch({
          type: NEW_ATTENDED_TRANSFER,
          payload: outgoingSession
        })
        this.setState({ attendedTransferSessionPending: outgoingSession })

        outgoingSession.stateChange.addListener((newState: SessionState) => {
          switch (newState) {
            case SessionState.Initial:
            case SessionState.Establishing:
              this.props.stateChange(newState, outgoingSession.id)
              //add new session to local state
              this.props.attendedTransferPending()

              break
            case SessionState.Established:
              this.setState({ attendedTransferSessionReady: outgoingSession })
              this.props.attendedTransferReady()

              this.setState({ attendedTransferSessionPending: false })
              this.props.stateChange(newState, outgoingSession.id)

              setLocalAudio(outgoingSession)
              setRemoteAudio(outgoingSession)

              break
            case SessionState.Terminating:
              this.props.stateChange(newState, outgoingSession.id)
              cleanupMedia(outgoingSession.id)
              break
            case SessionState.Terminated:
              this.props.stateChange(newState, outgoingSession.id)
              this.attendedTransferClear()
              this.props.attendedTransferCancel(outgoingSession)
              setTimeout(() => {
                this.props.closeSession(outgoingSession.id)
              }, 5000)
              break
            default:
              console.log(`Unknown session state change: ${newState}`)
              break
          }
        })
        outgoingSession.invite().catch((error: Error) => {
          this.props.attendedTransferFail(outgoingSession)
          console.log(error)
        })
      } else {
        console.log('Failed to makeURI')
      }
    }
  }

  attendedTransferClear() {
    this.setState({ attendedTransferSessionPending: null })
    this.setState({ attendedTransferSessionReady: null })
    this.props.started(false)
  }

  //refers the session in local state
  connectAttendedTransfer(attendedTransferSession: any) {
    try {
      this.props.session.refer(attendedTransferSession)
      this.props.attendedTransferSuccess()
      this.setState({ attendedTransferSessionReady: null })
    } catch (err) {
      console.log(err)
    }
  }

  cancelAttendedTransfer(attendedTransferSession: any) {
    attendedTransferSession.cancel()
    this.props.attendedTransferCancel(attendedTransferSession)
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
      const phoneConfigAttended: PhoneConfig = {
        disabledButtons: ['numpad', 'transfer'],
        disabledFeatures: [''],
        defaultDial: '',
        sessionsLimit: 0,
        attendedTransferLimit: 0,
        mode: '',
        appSize: '',
        started: false
      }
      return (
        <React.Fragment>
          {
            <Phone
              // @ts-ignore
              session={this.state.attendedTransferSessionReady}
              phoneConfig={phoneConfigAttended}
            />
          }
          <button
            className={styles.transferButtons}
            onClick={() => {
              this.props.started(false)
              this.connectAttendedTransfer(
                this.state.attendedTransferSessionReady
              )
            }}
          >
            <img src={connectIcon} />
          </button>
        </React.Fragment>
      )
    } else if (this.state.attendedTransferSessionPending) {
      return (
        <button
          className={styles.endCallButton}
          onClick={() => {
            this.props.started(false)
            this.cancelAttendedTransfer(
              this.state.attendedTransferSessionPending
            )
          }}
        >
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
          }}
        >
          <img src={attendedIcon} />
        </button>
      )
    }
  }
}

const mapStateToProps = (state: any) => ({
  sipAccount: state.sipAccounts.sipAccount,
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent,
  attendedTransfersList: state.sipSessions.attendedTransfers,
  phoneConfig: state.config.phoneConfig
})
const actions = {
  holdCallRequest,
  attendedTransferRequest,
  attendedTransferCancel,
  attendedTransferReady,
  attendedTransferPending,
  attendedTransferSuccess,
  attendedTransferFail,
  attendedTransferLimitReached,
  stateChange,
  closeSession
}

export default connect(mapStateToProps, actions)(AttendedTransfer)
