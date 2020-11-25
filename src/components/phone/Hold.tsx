import * as React from 'react'
import { connect } from 'react-redux'
import styles from './Phone.scss'
// eslint-disable-next-line no-unused-vars
import { Session, UserAgent } from 'sip.js'
import { holdCallRequest, unHoldCallRequest } from '../../actions/sipSessions'
import { GetStyleSize } from '../../util/getstyle'

const holdIcon = require('./assets/phone_paused-24px.svg')

interface Props {
  session: Session
  userAgent: UserAgent
  holdCallRequest: Function
  unHoldCallRequest: Function
  onHold: Array<Object>
  sessions: Array<Object>
  appSize: string
}

class Hold extends React.Component<Props> {
  hold() {
    if (this.checkHoldState()) {
      this.props.unHoldCallRequest(
        this.props.session,
        this.props.onHold,
        this.props.sessions
      )
    } else {
      this.props.holdCallRequest(this.props.session)
    }
  }

  checkHoldState() {
    return this.props.onHold.includes(this.props.session.id)
  }

  render() {
    const props = this.props
    const styleActionButton = GetStyleSize(props.appSize, 'actionButton', styles)
    return (
      <button
        className={this.checkHoldState() ? styles.on : ''}
        id={styleActionButton}
        onClick={() => this.hold()}
      >
        <img src={holdIcon} />
      </button>
    )
  }
}

const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent,
  onHold: state.sipSessions.onHold,
  appSize: state.config.appConfig.appSize
})
const actions = {
  holdCallRequest,
  unHoldCallRequest
}

export default connect(mapStateToProps, actions)(Hold)
