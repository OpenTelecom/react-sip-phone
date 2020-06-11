import * as React from 'react'
import { connect } from 'react-redux'
import { phoneStore } from '../../index'

import styles from './Phone.scss'

import { Session, UserAgent } from 'sip.js'
import {
  SIPSESSION_BLIND_TRANSFER_REQUEST,
  SIPSESSION_BLIND_TRANSFER_SUCCESS,
  SIPSESSION_BLIND_TRANSFER_FAIL
} from '../../actions/sipSessions'
import { getFullNumber } from '../../util/sessions'
import blindIcon from '../../assets/arrow_forward-24px.svg'

interface Props {
  session: Session
  userAgent: UserAgent
  destination: string
}

class BlindTransfer extends React.Component<Props> {
  blindTransferCall() {
    phoneStore.dispatch({
      type: SIPSESSION_BLIND_TRANSFER_REQUEST
    })
    const target = UserAgent.makeURI(
      `sip:${getFullNumber(this.props.destination)}@sip.reper.io;user=phone`
    )
    if (target) {
      try {
        this.props.session.refer(target)
        phoneStore.dispatch({
          type: SIPSESSION_BLIND_TRANSFER_SUCCESS
        })
      } catch (err) {
        console.log(err)
      }
    } else {
      phoneStore.dispatch({
        type: SIPSESSION_BLIND_TRANSFER_FAIL
      })
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
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent
})
const actions = {}

export default connect(mapStateToProps, actions)(BlindTransfer)
