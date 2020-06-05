import * as React from 'react'
import Dialpad from './Dialpad'
import { connect } from 'react-redux'
import { Session, SessionState, UserAgent } from 'sip.js'
import { endCall } from '../../actions/sipSessions'
import Hold from './Hold'
import Mute from './Mute'
import BlindTranfer from './BlindTransfer'
import AttendedTransfer from './AttendedTransfer'

interface Props {
  session: Session
  userAgent: UserAgent
  endCall: Function
}

class Phone extends React.Component<Props> {
  state = {
    dialpadOpen: true,
    ended: false,
    transferDialString: ''
  }

  componentDidUpdate(newProps: Props) {
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
      SessionState.Establishing
    ) {
      // @ts-ignore
      this.props.session.cancel()
    }
    this.setState({ ended: true })
    setTimeout(() => {
      this.props.session.dispose()
      this.props.endCall(this.props.session.id)
    }, 5000)
  }

  render() {
    const state = this.state
    return (
      <React.Fragment>
        <div>{this.props.session.state}</div>
        <Dialpad open={state.dialpadOpen} session={this.props.session} />
        <button disabled={state.ended} onClick={() => this.endCall()}>
          End Call
        </button>

        <Mute session={this.props.session} />
        <Hold session={this.props.session} />
        <input
          onChange={(e) =>
            this.setState({ transferDialString: e.target.value })
          }
        />
        <AttendedTransfer
          destination={state.transferDialString}
          session={this.props.session}
        />
        <BlindTranfer
          destination={state.transferDialString}
          session={this.props.session}
        />
      </React.Fragment>
    )
  }
}
const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged,
  sessions: state.sipSessions.sessions,
  userAgent: state.sipAccounts.userAgent
})
const actions = {
  endCall
}
export default connect(mapStateToProps, actions)(Phone)
