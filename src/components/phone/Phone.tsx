import * as React from 'react'
import Dialpad from './Dialpad'
import { connect } from 'react-redux'
import { Session, SessionState } from 'sip.js'
import { endCall } from '../../actions/sipSessions'

interface Props {
  session: Session
  endCall: Function
}

class Phone extends React.Component<Props> {
  state = {
    dialpadOpen: false,
    ended: false
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
        <Dialpad open={state.dialpadOpen} />
        <button disabled={this.state.ended} onClick={() => this.endCall()}>
          End Call
        </button>
      </React.Fragment>
    )
  }
}
const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged
})
const actions = {
  endCall
}
const P = connect(mapStateToProps, actions)(Phone)
export default P
