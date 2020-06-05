import * as React from 'react'
import { connect } from 'react-redux'

import { Session, SessionState, UserAgent } from 'sip.js'
import {
  muteCallRequest,
  muteCallSuccess,
  muteCallFail,
  unMuteCallRequest,
  unMuteCallSuccess,
  unMuteCallFail
} from '../../actions/sipSessions'

interface Props {
  session: Session
  userAgent: UserAgent
  muteCallRequest: Function
  muteCallSuccess: Function
  muteCallFail: Function
  unMuteCallRequest: Function
  unMuteCallSuccess: Function
  unMuteCallFail: Function

  onMute: Array<Object>
  //   onHold: any
}

class Mute extends React.Component<Props> {
  mute() {
    if (this.props.session.id in this.props.onMute) {
      this.props.unMuteCallRequest(this.props.session.id)
      return new Promise((resolve, reject) => {
        if (
          !this.props.session.sessionDescriptionHandler ||
          this.props.session.state !== SessionState.Established
        ) {
          this.props.unMuteCallFail()
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
          this.props.unMuteCallSuccess()
          resolve()
          return
        } catch (err) {
          this.props.unMuteCallFail()
          reject(err)
          return
        }
      })
    }

    if (!(this.props.session.id in this.props.onMute)) {
      return new Promise((resolve, reject) => {
        if (
          !this.props.session.sessionDescriptionHandler ||
          this.props.session.state !== SessionState.Established
        ) {
          this.props.muteCallFail()
          reject('No session to mute')
          return
        }
        try {
          this.props.muteCallRequest(this.props.session.id)

          const pc =
            // @ts-ignore
            this.props.session.sessionDescriptionHandler!.peerConnection
          pc.getLocalStreams().forEach(function (stream: any) {
            stream.getAudioTracks().forEach(function (track: any) {
              track.enabled = false
            })
          })
          this.props.muteCallSuccess()
          resolve()
          return
        } catch (err) {
          this.props.muteCallFail()
          reject(err)
          return
        }
      })
    }
    this.props.muteCallFail()
    return
  }
  checkMute() {
    if (this.props.session.id in this.props.onMute === true) {
      const muteMarkup = 'Unmute'
      return muteMarkup
    } else {
      const muteMarkup = 'Mute'
      return muteMarkup
    }
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={() => this.mute()}>{this.checkMute()}</button>{' '}
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent,
  onMute: state.sipSessions.onMute
})
const actions = {
  muteCallRequest,
  muteCallSuccess,
  muteCallFail,
  unMuteCallRequest,
  unMuteCallSuccess,
  unMuteCallFail
}

export default connect(mapStateToProps, actions)(Mute)
