import * as React from 'react'
import { connect } from 'react-redux'
import styles from './Phone.scss'
import { Session, SessionState, UserAgent } from 'sip.js'
import { GetStyleSize } from '../../util/getstyle'
import {
  muteRequest,
  muteSuccess,
  muteFail,
  unMuteRequest,
  unMuteSuccess,
  unMuteFail
} from '../../actions/sipSessions'

const micOffIcon = require('./assets/mic_off-24px.svg')

interface Props {
  session: Session
  userAgent: UserAgent
  muteRequest: Function
  muteSuccess: Function
  muteFail: Function
  unMuteRequest: Function
  unMuteSuccess: Function
  unMuteFail: Function
  appSize: string
}

class Mute extends React.Component<Props> {
  state = {
    onMute: false
  }

  mute() {
    if (this.state.onMute) {
      this.props.unMuteRequest()
      return new Promise((resolve, reject) => {
        if (
          !this.props.session.sessionDescriptionHandler ||
          this.props.session.state !== SessionState.Established
        ) {
          this.props.unMuteFail()
          reject('No session to mute')
          return
        }
        try {
          const pc =
            // @ts-ignore
            this.props.session.sessionDescriptionHandler!.peerConnection
          pc.getSenders().forEach(function (stream: any) {
            if (stream.track && stream.track.kind === 'audio') {
              stream.track.enabled = true
            }
          })
          this.props.unMuteSuccess()
          this.setState({ onMute: false })
          resolve()
          return
        } catch (err) {
          this.props.unMuteFail()
          reject(err)
        }
      })
    }

    if (!this.state.onMute) {
      return new Promise((resolve, reject) => {
        if (
          !this.props.session.sessionDescriptionHandler ||
          this.props.session.state !== SessionState.Established
        ) {
          this.props.muteFail()
          reject('No session to mute')
          return
        }
        try {
          this.props.muteRequest()
          const pc =
            // @ts-ignore
            this.props.session.sessionDescriptionHandler!.peerConnection
          console.log(pc.getSenders())
          pc.getSenders().forEach(function (stream: any) {
            if (stream.track && stream.track.kind === 'audio') {
              stream.track.enabled = false
            }
          })
          this.props.muteSuccess()
          this.setState({ onMute: true })
          resolve()
          return
        } catch (err) {
          this.props.muteFail()
          reject(err)
          return
        }
      })
    }
    this.props.muteFail()
    return
  }

  render() {
    const props = this.props
    const styleActionButton = GetStyleSize(props.appSize, 'actionButton', styles)
    return (
      <div
        className={this.state.onMute ? styles.on : ''}
        id={styleActionButton}
        onClick={() => this.mute()}
      >
        <img src={micOffIcon} />
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent,
  appSize: state.config.appConfig.appSize
})
const actions = {
  muteRequest,
  muteSuccess,
  muteFail,
  unMuteRequest,
  unMuteSuccess,
  unMuteFail
}

export default connect(mapStateToProps, actions)(Mute)
