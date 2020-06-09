import * as React from 'react'
import { connect } from 'react-redux'
import { phoneStore } from '../../index'

import styles from './Phone.scss'
import { Session, SessionState, UserAgent } from 'sip.js'

import micOffIcon from '../../assets/mic_off-24px.svg'

import {
  SIPSESSION_MUTE_REQUEST,
  SIPSESSION_MUTE_SUCCESS,
  SIPSESSION_MUTE_FAIL,
  SIPSESSION_UNMUTE_REQUEST,
  SIPSESSION_UNMUTE_SUCCESS,
  SIPSESSION_UNMUTE_FAIL
} from '../../actions/sipSessions'

interface Props {
  session: Session
  userAgent: UserAgent
}

class Mute extends React.Component<Props> {
  state = {
    onMute: false
  }

  mute() {
    if (this.state.onMute) {
      phoneStore.dispatch({
        type: SIPSESSION_UNMUTE_REQUEST
      })
      return new Promise((resolve, reject) => {
        if (
          !this.props.session.sessionDescriptionHandler ||
          this.props.session.state !== SessionState.Established
        ) {
          phoneStore.dispatch({
            type: SIPSESSION_UNMUTE_FAIL
          })
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
          phoneStore.dispatch({
            type: SIPSESSION_UNMUTE_SUCCESS
          })
          this.setState({ onMute: false })
          resolve()
          return
        } catch (err) {
          phoneStore.dispatch({
            type: SIPSESSION_UNMUTE_FAIL
          })
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
          phoneStore.dispatch({
            type: SIPSESSION_MUTE_FAIL
          })
          reject('No session to mute')
          return
        }
        try {
          phoneStore.dispatch({
            type: SIPSESSION_MUTE_REQUEST
          })
          const pc =
            // @ts-ignore
            this.props.session.sessionDescriptionHandler!.peerConnection
          pc.getLocalStreams().forEach(function (stream: any) {
            stream.getAudioTracks().forEach(function (track: any) {
              track.enabled = false
            })
          })
          phoneStore.dispatch({
            type: SIPSESSION_MUTE_SUCCESS
          })
          this.setState({ onMute: true })

          resolve()
          return
        } catch (err) {
          phoneStore.dispatch({
            type: SIPSESSION_MUTE_FAIL
          })
          reject(err)
          return
        }
      })
    }
    phoneStore.dispatch({
      type: SIPSESSION_MUTE_FAIL
    })
    return
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

  render() {
    return (
      <button id={styles.actionButton} onClick={() => this.mute()}>
        <img src={micOffIcon} />
      </button>
    )
  }
}

const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent
})
const actions = {}

export default connect(mapStateToProps, actions)(Mute)
