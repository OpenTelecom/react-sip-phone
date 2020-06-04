import * as React from 'react'
import Dialpad from './Dialpad'
import { connect } from 'react-redux'
import { Session, SessionState, UserAgent, Inviter } from 'sip.js'
import {
  endCall,
  holdCallRequest,
  holdCallSuccess,
  holdCallFail,
  unHoldCallRequest,
  unHoldCallSuccess,
  unHoldCallFail,
  muteCallToggleSuccess,
  muteCallToggleFail
} from '../../actions/sipSessions'
import { phoneStore } from '../../index'

import {
  SIPSESSION_STATECHANGE,
  NEW_SESSION,
  CLOSE_SESSION,
  SIPSESSION_ATTENDED_TRANSFER_REQUEST,
  SIPSESSION_ATTENDED_TRANSFER_FAIL,
  SIPSESSION_ATTENDED_TRANSFER_SUCCESS,
  SIPSESSION_BLIND_TRANSFER_REQUEST,
  SIPSESSION_BLIND_TRANSFER_SUCCESS,
  SIPSESSION_BLIND_TRANSFER_FAIL
} from '../../actions/sipSessions'

interface Props {
  session: Session
  userAgent: UserAgent
  endCall: Function
  holdCallRequest: Function
  holdCallSuccess: Function
  holdCallFail: Function
  unHoldCallRequest: Function
  unHoldCallSuccess: Function
  unHoldCallFail: Function
  muteCallToggleSuccess: Function
  muteCallToggleFail: Function
}

class Phone extends React.Component<Props> {
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

  componentDidUpdate(newProps: Props) {
    if (newProps.session.state === SessionState.Terminated) {
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
    }
    this.setState({ ended: true })
    setTimeout(() => {
      this.props.session.dispose()
      this.props.endCall(this.props.session.id)
    }, 5000)
  }

  hold() {
    if (this.state.onHold) {
      this.props.unHoldCallRequest()
      return new Promise((resolve, reject) => {
        if (
          !this.props.session.sessionDescriptionHandler ||
          this.props.session.state !== SessionState.Established
        ) {
          this.props.unHoldCallFail()
          reject('No session')
          return
        }
        try {
          this.props.session.invite()
          this.props.unHoldCallSuccess()
          this.setState({ onHold: false })
          resolve()
        } catch (err) {
          this.props.unHoldCallFail()
          reject(err)
          return
        }
      })
    }

    if (!this.state.onHold) {
      this.props.holdCallRequest()
      return new Promise((resolve, reject) => {
        if (
          !this.props.session.sessionDescriptionHandler ||
          this.props.session.state !== SessionState.Established
        ) {
          this.props.holdCallFail()
          reject('No session to hold')
          return
        }
        try {
          this.props.session.invite({
            sessionDescriptionHandlerModifiers: [
              this.props.session.sessionDescriptionHandler!.holdModifier
            ]
          })
          this.props.holdCallSuccess()
          this.setState({ onHold: true })
          resolve()
        } catch (err) {
          this.props.holdCallFail()
          reject(err)
          return
        }
      })
    }
    return
  }

  mute() {
    if (this.state.onMute) {
      return new Promise((resolve, reject) => {
        if (
          !this.props.session.sessionDescriptionHandler ||
          this.props.session.state !== SessionState.Established
        ) {
          this.props.muteCallToggleFail()
          reject('No session to mute')
          return
        }
        try {
          const pc =
            // @ts-ignore
            this.props.session.sessionDescriptionHandler!.peerConnection
          pc.getLocalStreams().forEach(function (stream: any) {
            stream.getAudioTracks().forEach(function (track: any) {
              track.enabled = true
            })
          })
          this.setState({ onMute: false })
          this.props.muteCallToggleSuccess()
          resolve()
          return
        } catch (err) {
          this.props.muteCallToggleFail()
          reject(err)
          return
        }
      })
    }

    if (!this.state.onMute) {
      return new Promise((resolve, reject) => {
        if (
          !this.props.session.sessionDescriptionHandler ||
          this.props.session.state !== SessionState.Established
        ) {
          this.props.muteCallToggleFail()
          reject('No session to mute')
          return
        }
        try {
          const pc =
            // @ts-ignore
            this.props.session.sessionDescriptionHandler!.peerConnection
          pc.getLocalStreams().forEach(function (stream: any) {
            stream.getAudioTracks().forEach(function (track: any) {
              track.enabled = false
            })
          })
          this.setState({ onMute: true })
          this.props.muteCallToggleSuccess()
          resolve()
          return
        } catch (err) {
          this.props.muteCallToggleFail()
          reject(err)
          return
        }
      })
    }
    this.props.muteCallToggleFail()
    return
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
      this.setState({ transferDialString: '' })
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
            this.setState({ transferDialString: '' })
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
    return (
      <React.Fragment>
        <div>{this.props.session.state}</div>
        <Dialpad open={state.dialpadOpen} session={this.props.session} />
        <button disabled={state.ended} onClick={() => this.endCall()}>
          End Call
        </button>
        <button disabled={state.ended} onClick={() => this.hold()}>
          {this.checkHold()}
        </button>
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
        {this.state.attendedTransferSession ? (
          <React.Fragment>
            <button
              onClick={() =>
                this.connectAttendedTransfer(state.attendedTransferSession)
              }
            >
              Connect Attended Transfer
            </button>
          </React.Fragment>
        ) : null}
        {state.attendedTransferSessionPending ? (
          <React.Fragment>
            <button
              onClick={() =>
                this.cancelAttendedTransfer(
                  state.attendedTransferSessionPending
                )
              }
            >
              Cancel Attended Transfer
            </button>
          </React.Fragment>
        ) : null}
        <button
          disabled={this.checkTransferDialString() || state.ended}
          onClick={() => this.blindTransferCall()}
        >
          Blind Transfer Call
        </button>
        <button disabled={state.ended} onClick={() => this.mute()}>
          {this.checkMute()}
        </button>
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
  endCall,
  holdCallRequest,
  holdCallSuccess,
  holdCallFail,
  unHoldCallRequest,
  unHoldCallSuccess,
  unHoldCallFail,
  muteCallToggleSuccess,
  muteCallToggleFail
}
export default connect(mapStateToProps, actions)(Phone)
