import * as React from 'react'
import { connect } from 'react-redux'
import styles from './Phone.scss'
// eslint-disable-next-line no-unused-vars
import { Session, UserAgent } from 'sip.js'
import { holdCallRequest, unHoldCallRequest } from '../../actions/sipSessions'

const holdIcon = require('./assets/phone_paused-24px.svg')

interface Props {
  session: Session
  userAgent: UserAgent
  holdCallRequest: Function
  unHoldCallRequest: Function
  onHold: Array<Object>
  sessions: Array<Object>
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
    return (
      <button
        className={this.checkHoldState() ? styles.on : ''}
        id={styles.actionButton}
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
  onHold: state.sipSessions.onHold
})
const actions = {
  holdCallRequest,
  unHoldCallRequest
}

export default connect(mapStateToProps, actions)(Hold)
