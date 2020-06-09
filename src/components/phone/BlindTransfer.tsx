import * as React from 'react'
import { connect } from 'react-redux'
import styles from './Phone.scss'
import { Session, UserAgent } from 'sip.js'
import {
  blindTransferRequest,
  blindTransferSuccess,
  blindTransferFail
} from '../../actions/sipSessions'

interface Props {
  session: Session
  userAgent: UserAgent
  destination: string
  blindTransferRequest: Function
  blindTransferSuccess: Function
  blindTransferFail: Function
}

class BlindTransfer extends React.Component<Props> {
  blindTransferCall() {
    this.props.blindTransferRequest
    const target = UserAgent.makeURI(
      `sip:${this.props.destination}@sip.reper.io;user=phone`
    )
    console.log(target)
    if (target) {
      this.props.session.refer(target)
      this.props.blindTransferSuccess
    } else {
      this.props.blindTransferFail
    }
  }

  render() {
    return (
      <React.Fragment>
        <button
          className={styles.transferButtons}
          onClick={() => this.blindTransferCall()}>
          Blind
        </button>
      </React.Fragment>
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
  blindTransferRequest,
  blindTransferSuccess,
  blindTransferFail
}

export default connect(mapStateToProps, actions)(BlindTransfer)
