import * as React from 'react'
import Dialpad from './Dialpad'
import { connect } from 'react-redux'
import { Session, SessionState, UserAgent } from 'sip.js'
import { endCall } from '../../actions/sipSessions'
import { setAppConfigStarted } from '../../actions/config'
import Hold from './Hold'
import Mute from './Mute'
import BlindTranfer from './BlindTransfer'
import AttendedTransfer from './AttendedTransfer'
import styles from './Phone.scss'
import { callDisconnect } from '../../util/TonePlayer'
import toneManager from '../../util/ToneManager'
import { statusMask, getDurationDisplay } from '../../util/sessions'
import { PhoneConfig } from '../../models'

const endCallIcon = require('./assets/call_end-24px.svg')
const dialpadIcon = require('./assets/dialpad-24px.svg')
const transferIcon = require('./assets/arrow_forward-24px.svg')

interface Props {
  session: Session
  userAgent: UserAgent
  endCall: Function
  setAppConfigStarted: Function
  phoneConfig: PhoneConfig
  deviceId: string
  strictMode: string
  appSize: string
}

class Phone extends React.Component<Props> {
  state = {
    dialpadOpen: false,
    transferMenu: false,
    ended: false,
    transferDialString: '',
    attendedTransferStarted: false,
    duration: 0,
    counterStarted: false
  }

  constructor(props: any) {
    super(props)
    this.attendedProcess = this.attendedProcess.bind(this);
  }

  componentDidMount() {
    if (this.props.phoneConfig.disabledButtons.includes('dialpadopen')) {
      this.setState({ dialpadOpen: true })
    }
  }

  componentDidUpdate(newProps: Props) {
    if (newProps.session.state === SessionState.Established && !this.state.counterStarted) {
      this.handleCounter()
    }
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
      this.props.session.state === SessionState.Establishing
    ) {
      toneManager.stopAll()
      callDisconnect(this.props.deviceId)
      // @ts-ignore
      this.props.session.cancel()
    }
    this.setState({ ended: true })
    setTimeout(() => {
      this.props.session.dispose()
      this.props.endCall(this.props.session.id)
      if (this.props.strictMode === 'strict') {
        this.props.setAppConfigStarted()
      }
    }, 5000)
  }

  attendedProcess(bool: boolean) {
    this.setState({ attendedTransferStarted: bool })
  }

  handleCounter() {
    if (
      this.props.session &&
      this.props.session.state !== SessionState.Terminated
    ) {
      if (this.state.counterStarted === false) {
        this.setState({ counterStarted: true })
      }
      setTimeout(() => {
        this.setState({ duration: this.state.duration + 1 })
        this.handleCounter()
      }, 1000)
    }
  }

  render() {
    const { state, props } = this
    let durationDisplay
    if (props.appSize === 'large') {
      if (
        this.props.session.state === SessionState.Initial ||
        this.props.session.state === SessionState.Establishing
      ) {
        durationDisplay = null
      } else {
        durationDisplay = (
          <div className={styles.statusLarge}>
            {getDurationDisplay(this.state.duration)}
          </div>
        )
      }
    } else {
      if (
        this.props.session.state === SessionState.Initial ||
        this.props.session.state === SessionState.Establishing
      ) {
        durationDisplay = null
      } else {
        durationDisplay = <div>{getDurationDisplay(this.state.duration)}</div>
      }
    }
    return (
      <React.Fragment>
        <hr style={{ width: '100%' }} />
        {props.phoneConfig.disabledFeatures.includes('remoteid') ? null : (
          <div>
            {
              // @ts-ignore
              `${props.session.remoteIdentity.uri.normal.user} - ${props.session.remoteIdentity._displayName}`
            }
            <br />
          </div>
        )}
        {props.appSize === 'large' ? (
          <div className={styles.statusLarge}>
            {statusMask(props.session.state)}
          </div>
        ) : (
          <div>{statusMask(props.session.state)}</div>
        )}
        <br />
        {durationDisplay}
        {state.ended ? null : (
          <React.Fragment>
            <Dialpad open={state.dialpadOpen} session={props.session} />
            <div className={styles.actionsContainer}>
              {props.phoneConfig.disabledButtons.includes('mute') ? null : (
                <Mute session={props.session} />
              )}
              <button
                className={styles.endCallButton}
                disabled={state.ended}
                onClick={() => this.endCall()}
              >
                <img src={endCallIcon} />
              </button>
              {props.phoneConfig.disabledButtons.includes('hold') ? null : (
                <Hold session={props.session} />
              )}
              {props.phoneConfig.disabledButtons.includes('numpad') ? null : (
                <div
                  id={styles.actionButton}
                  className={state.dialpadOpen ? styles.on : ''}
                  onClick={() =>
                    this.setState({ dialpadOpen: !state.dialpadOpen })
                  }
                >
                  <img src={dialpadIcon} />
                </div>
              )}
              {props.phoneConfig.disabledButtons.includes('transfer') ? null : (
                <div
                  id={styles.actionButton}
                  className={state.transferMenu ? styles.on : ''}
                  onClick={() =>
                    this.setState({ transferMenu: !state.transferMenu })
                  }
                >
                  <img src={transferIcon} />
                </div>
              )}
              <div
                id={styles.transferMenu}
                className={state.transferMenu ? '' : styles.closed}
              >
                <input
                  id={styles.transferInput}
                  onChange={(e) =>
                    this.setState({ transferDialString: e.target.value })
                  }
                  placeholder='Enter the transfer destination...'
                />
                {this.state.attendedTransferStarted ? null : (
                  <BlindTranfer
                    destination={state.transferDialString}
                    session={props.session}
                  />
                )}
                <AttendedTransfer
                  started={this.attendedProcess}
                  destination={state.transferDialString}
                  session={props.session}
                />
              </div>
            </div>
            <audio id={this.props.session.id} autoPlay />
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }
}
const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent,
  deviceId: state.device.primaryAudioOutput,
  strictMode: state.config.appConfig.mode,
  appSize: state.config.appConfig.appSize
})
const actions = {
  endCall,
  setAppConfigStarted
}
export default connect(mapStateToProps, actions)(Phone)
