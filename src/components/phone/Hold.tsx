import * as React from 'react'
import { connect } from 'react-redux'

import { Session, SessionState, UserAgent } from 'sip.js'
import {
  holdCallRequest,
  holdCallSuccess,
  holdCallFail,
  unHoldCallRequest,
  unHoldCallSuccess,
  unHoldCallFail
} from '../../actions/sipSessions'

interface Props {
  session: Session
  userAgent: UserAgent
  holdCallRequest: Function
  holdCallSuccess: Function
  holdCallFail: Function
  unHoldCallRequest: Function
  unHoldCallSuccess: Function
  unHoldCallFail: Function
  onHold: Array<Object>
}

class Hold extends React.Component<Props> {
  hold() {
    if (this.props.session.id in this.props.onHold) {
      this.props.unHoldCallRequest(this.props.session.id)
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
          resolve()
        } catch (err) {
          this.props.unHoldCallFail()
          reject(err)
          return
        }
      })
    }

    if (!(this.props.session.id in this.props.onHold)) {
      this.props.holdCallRequest(this.props.session.id)
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

  checkHold() {
    if (this.props.session.id in this.props.onHold === true) {
      const holdMarkup = 'Unhold'
      return holdMarkup
    } else {
      const holdMarkup = 'Hold'
      return holdMarkup
    }
  }

  render() {
    return (
      <React.Fragment>
        <button onClick={() => this.hold()}>{this.checkHold()}</button>
        {/* <button onClick={() => this.hold()}>hold</button> */}
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
  holdCallRequest,
  holdCallSuccess,
  holdCallFail,
  unHoldCallRequest,
  unHoldCallSuccess,
  unHoldCallFail
}

export default connect(mapStateToProps, actions)(Hold)
