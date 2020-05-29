import * as React from 'react'
import Dialpad from './Dialpad'
import { connect } from 'react-redux'
import { Session, SessionState } from 'sip.js'
import { endCall, holdCall, unHoldCall } from '../../actions/sipSessions'

interface Props {
  session: Session
  endCall: Function
  holdCall: Function
  unHoldCall: Function
}

class Phone extends React.Component<Props> {
  state = {
    dialpadOpen: true,
    ended: false,
    onHold: false
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

  holdCall() {
    if (
      this.props.session.state === SessionState.Established ||
      this.props.session.state === SessionState.Establishing
    ) {
      this.props.session.sessionDescriptionHandler?.holdModifier
      this.props.session.invite({
        sessionDescriptionHandlerModifiers: [
          this.props.session.sessionDescriptionHandler!.holdModifier
        ]
      })
      this.setState({ onHold: true })
      this.props.holdCall(this.props.session.id)
    }
  }

  unHoldCall() {
    if (
      this.props.session.state === SessionState.Established ||
      this.props.session.state === SessionState.Establishing
    ) {
      this.props.session.invite()
      this.setState({ onHold: false })
    }
  }

  //call mute

  render() {
    const state = this.state
    return (
      <React.Fragment>
        <div>{this.props.session.state}</div>
        <Dialpad {...this.props.session} open={state.dialpadOpen} />
        <button disabled={this.state.ended} onClick={() => this.endCall()}>
          End Call
        </button>
        <button disabled={this.state.onHold} onClick={() => this.holdCall()}>
          Hold Call
        </button>
        <button disabled={!this.state.onHold} onClick={() => this.unHoldCall()}>
          UnHold Call
        </button>
      </React.Fragment>
    )
  }
}
const mapStateToProps = (state: any) => ({
  stateChanged: state.sipSessions.stateChanged
})
const actions = {
  endCall,
  holdCall,
  unHoldCall
}
const P = connect(mapStateToProps, actions)(Phone)
export default P
