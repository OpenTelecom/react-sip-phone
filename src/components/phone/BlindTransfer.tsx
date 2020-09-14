import * as React from 'react'
import { connect } from 'react-redux'

import styles from './Phone.scss'

import { Session, UserAgent } from 'sip.js'
import {
  blindTransferRequest,
  blindTransferSuccess,
  blindTransferFail
} from '../../actions/sipSessions'
import { getFullNumber } from '../../util/sessions'
import blindIcon from '../../assets/arrow_forward-24px.svg'
import SIPAccount from '../../lib/SipAccount'

interface Props {
  session: Session
  sipAccount: SIPAccount
  userAgent: UserAgent
  destination: string
  blindTransferRequest: Function
  blindTransferSuccess: Function
  blindTransferFail: Function
}

class BlindTransfer extends React.Component<Props> {
  blindTransferCall() {
    this.props.blindTransferRequest()
    const target = UserAgent.makeURI(
      `sip:${getFullNumber(this.props.destination)}@${
        this.props.sipAccount._credentials.sipuri.split('@')[1]
      };user=phone`
    )
    if (target) {
      try {
        this.props.session.refer(target)
        this.props.blindTransferSuccess()
      } catch (err) {
        console.log(err)
      }
    } else {
      this.props.blindTransferFail()
    }
  }

  render() {
    return (
      <React.Fragment>
        <button
          className={styles.transferButtons}
          onClick={() => this.blindTransferCall()}
        >
          <img src={blindIcon} />
        </button>
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: any) => ({
  sipAccount: state.sipAccounts.sipAccount,
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent
})
const actions = {
  blindTransferRequest,
  blindTransferSuccess,
  blindTransferFail
}

export default connect(mapStateToProps, actions)(BlindTransfer)
