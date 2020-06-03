import * as React from 'react'
import Dialpad from './Dialpad'
import { connect } from 'react-redux'
import { Session, SessionState, UserAgent, Inviter } from 'sip.js'
import { endCall } from '../../actions/sipSessions'
import { phoneStore } from '../../index'

import {
  SIPSESSION_STATECHANGE,
  NEW_SESSION,
  CLOSE_SESSION,
  SIPSESSION_HOLD_REQUEST,
  SIPSESSION_HOLD_SUCCESS,
  SIPSESSION_HOLD_FAIL,
  SIPSESSION_UNHOLD_REQUEST,
  SIPSESSION_UNHOLD_SUCCESS,
  SIPSESSION_UNHOLD_FAIL,
  SIPSESSION_ATTENDED_TRANSFER_REQUEST,
  SIPSESSION_ATTENDED_TRANSFER_FAIL,
  SIPSESSION_ATTENDED_TRANSFER_SUCCESS,
  SIPSESSION_BLIND_TRANSFER_REQUEST,
  SIPSESSION_BLIND_TRANSFER_SUCCESS,
  SIPSESSION_BLIND_TRANSFER_FAIL,
  SIPSESSION_MUTE_TOGGLE_FAIL,
  SIPSESSION_MUTE_TOGGLE_SUCCESS
} from '../../actions/sipSessions'

interface Props {
  session: Session
  endCall: Function
  userAgent: UserAgent
}

class Phone extends React.Component<Props> {
  public _userAgent: any

  state = {
    dialpadOpen: true,
    ended: false,
    onHold: false,
    onMute: false,
    transferDialString: '',
    audio: null,
    attendedTransferSession: null,
    attendedTransferSessionPending: null
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
    }
    this.setState({ ended: true })
    setTimeout(() => {
      this.props.session.dispose()
      this.props.endCall(this.props.session.id)
    }, 5000)
  }

  hold() {
    if (this.state.onHold) {
      phoneStore.dispatch({
        type: SIPSESSION_UNHOLD_REQUEST
      })
      if (
        this.props.session.state === SessionState.Established ||
        this.props.session.state === SessionState.Establishing
      ) {
        this.props.session.invite()
        this.setState({ onHold: false })
        phoneStore.dispatch({
          type: SIPSESSION_UNHOLD_SUCCESS
        })
      } else {
        phoneStore.dispatch({
          type: SIPSESSION_UNHOLD_FAIL
        })
      }
    }

    if (!this.state.onHold) {
      phoneStore.dispatch({
        type: SIPSESSION_HOLD_REQUEST
      })
      if (
        this.props.session.state === SessionState.Established &&
        this.props.session.sessionDescriptionHandler
      ) {
        this.props.session.invite({
          sessionDescriptionHandlerModifiers: [
            this.props.session.sessionDescriptionHandler.holdModifier
          ]
        })
        phoneStore.dispatch({
          type: SIPSESSION_HOLD_SUCCESS
        })
        this.setState({ onHold: true })
      } else {
        phoneStore.dispatch({
          type: SIPSESSION_HOLD_FAIL
        })
      }
    }
  }

  async mute() {
    if (this.state.onMute) {
      if (
        this.props.session.state === SessionState.Established ||
        this.props.session.state === SessionState.Establishing
      ) {
        // @ts-ignore
        const pc = this.props.session.sessionDescriptionHandler!.peerConnection
        pc.getLocalStreams().forEach(function (stream: any) {
          stream.getAudioTracks().forEach(function (track: any) {
            track.enabled = true
          })
        })
        phoneStore.dispatch({
          type: SIPSESSION_MUTE_TOGGLE_SUCCESS
        })
        this.setState({ onMute: false })
      } else {
        phoneStore.dispatch({
          type: SIPSESSION_MUTE_TOGGLE_FAIL
        })
      }

      return
    }
    if (!this.state.onMute) {
      if (
        this.props.session.state === SessionState.Established ||
        this.props.session.state === SessionState.Establishing
      ) {
        // @ts-ignore
        const pc = this.props.session.sessionDescriptionHandler!.peerConnection
        pc.getLocalStreams().forEach(function (stream: any) {
          stream.getAudioTracks().forEach(function (track: any) {
            track.enabled = false
          })
        })
        phoneStore.dispatch({
          type: SIPSESSION_MUTE_TOGGLE_SUCCESS
        })
        this.setState({ onMute: true })
      } else {
        phoneStore.dispatch({
          type: SIPSESSION_MUTE_TOGGLE_FAIL
        })
      }

      return
    }
  }

  blindTransferCall() {
    phoneStore.dispatch({
      type: SIPSESSION_BLIND_TRANSFER_REQUEST
    })
    const target = UserAgent.makeURI(
      `sip:${this.state.transferDialString}@sip.reper.io;user=phone`
    )
    console.log(target)
    if (target) {
      this.props.session.refer(target)
      phoneStore.dispatch({
        type: SIPSESSION_BLIND_TRANSFER_SUCCESS
      })
    } else {
      phoneStore.dispatch({
        type: SIPSESSION_BLIND_TRANSFER_FAIL
      })
    }
  }

  attendedTransferCall() {
    if (!this.state.onHold) {
      this.hold()
    }

    console.log(this.props.userAgent)
    const target = UserAgent.makeURI(
      `sip:${this.state.transferDialString}@sip.reper.io;user=phone`
    )
    phoneStore.dispatch({
      type: SIPSESSION_ATTENDED_TRANSFER_REQUEST
    })
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
            break
          case SessionState.Established:
            this.setState({ attendedTransferSession: outgoingSession })
            //removes ability to cancel transfer
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
            phoneStore.dispatch({
              type: CLOSE_SESSION,
              payload: outgoingSession.id
            })
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
    this.props.session.refer(attendedTransferSession)
    phoneStore.dispatch({
      type: SIPSESSION_ATTENDED_TRANSFER_SUCCESS
    })
    this.setState((attendedTransferSession = null))
  }

  cancelAttendedTransfer(attendedTransferSession: any) {
    attendedTransferSession.cancel()
    this.setState({ attendedTransferSessionPending: null })
    this.setState({ attendedTransferSession: null })

    //transfer cancel success action
  }

  checkTransferDialString() {
    const number = this.state.transferDialString
    if (parseInt(number, 10) && number.length === 10) {
      return false
    } else {
      return true
    }
  }

  checkMute() {
    if (this.state.onMute) {
      const muteMarkup = 'Unmute'
      return muteMarkup
    } else {
      const muteMarkup = 'Mute'
      return muteMarkup
    }
  }

  checkHold() {
    if (this.state.onHold) {
      const holdMarkup = 'Unhold'
      return holdMarkup
    } else {
      const holdMarkup = 'Hold'
      return holdMarkup
    }
  }

  render() {
    const state = this.state

    let attendedTransferConnect = this.state.attendedTransferSession ? (
      <React.Fragment>
        <button
          onClick={() =>
            this.connectAttendedTransfer(this.state.attendedTransferSession)
          }
        >
          Connect Attended Transfer
        </button>
      </React.Fragment>
    ) : null

    let attendedTransferCancel = this.state.attendedTransferSessionPending ? (
      <React.Fragment>
        <button
          onClick={() =>
            this.cancelAttendedTransfer(
              this.state.attendedTransferSessionPending
            )
          }
        >
          Cancel Attended Transfer
        </button>
      </React.Fragment>
    ) : null

    return (
      <React.Fragment>
        <div>{this.props.session.state}</div>
        <Dialpad open={state.dialpadOpen} session={this.props.session} />
        <button disabled={this.state.ended} onClick={() => this.endCall()}>
          End Call
        </button>

        <button onClick={() => this.hold()}>{this.checkHold()}</button>

        <input
          onChange={(e) =>
            this.setState({ transferDialString: e.target.value })
          }
        />
        <button
          disabled={this.checkTransferDialString()}
          onClick={() => this.attendedTransferCall()}
        >
          Attended Transfer Call
        </button>
        {attendedTransferConnect}
        {attendedTransferCancel}
        <button
          disabled={this.checkTransferDialString()}
          onClick={() => this.blindTransferCall()}
        >
          Blind Transfer Call
        </button>
        <button onClick={() => this.mute()}>{this.checkMute()}</button>
        {/* <button onClick={() => this.getMicrophone()}>get mic</button>
        <button onClick={() => this.stopMicrophone()}>mute mic</button> */}
      </React.Fragment>
    )
  }
}
const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent,
  _sessionDescriptionHandler: state.sipSessions._sessionDescriptionHandler
})
const actions = {
  endCall
}
const P = connect(mapStateToProps, actions)(Phone)
export default P
