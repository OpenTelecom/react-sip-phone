import * as React from 'react'
import Dialpad from './Dialpad'
import { connect } from 'react-redux'
import { Session, SessionState } from 'sip.js'
import { endCall, holdCall, unHoldCall } from '../../actions/sipSessions'
import { UserAgent } from 'sip.js'

// import { UserAgent, Inviter, UserAgentOptions } from 'sip.js'
// import { TransportOptions } from 'sip.js/lib/platform/web'

interface Props {
  session: Session
  endCall: Function
  holdCall: Function
  unHoldCall: Function
}

class Phone extends React.Component<Props> {
  public _userAgent: any

  state = {
    dialpadOpen: true,
    ended: false,
    onHold: false,
    currentTransferDialString: ''
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
    if (this.props.session.state === SessionState.Established) {
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
      this.props.unHoldCall(this.props.session.id)
    }
  }

  sendDTMF(number: string) {
    if (this.props.session.state === SessionState.Established) {
      const options = {
        requestOptions: {
          body: {
            contentDisposition: 'render',
            contentType: 'application/dtmf-relay',
            content: `Signal=${number}\r\nDuration=1000`
          }
        }
      }
      this.props.session.info(options)
      // this.props.session.sessionDescriptionHandler?.sendDtmf('121212121')
    }
  }

  //blind tranfer call
  transferCall() {
    const target = UserAgent.makeURI(
      `sip:${this.state.currentTransferDialString}@sip.reper.io;user=phone`
    )
    this.props.session.refer(target!)
  }

  checkTransferDialstring() {
    const number = this.state.currentTransferDialString
    if (parseInt(number, 10) && number.length === 10) {
      return false
    } else {
      return true
    }
  }

  //todo call mute

  render() {
    const state = this.state
    return (
      <React.Fragment>
        <div>{this.props.session.state}</div>
        <Dialpad open={state.dialpadOpen} />
        <button disabled={this.state.ended} onClick={() => this.endCall()}>
          End Call
        </button>
        <button disabled={this.state.onHold} onClick={() => this.holdCall()}>
          Hold Call
        </button>
        <button disabled={!this.state.onHold} onClick={() => this.unHoldCall()}>
          UnHold Call
        </button>

        <input
          onChange={(e) =>
            this.setState({ currentTransferDialString: e.target.value })
          }
        />
        <button
          disabled={this.checkTransferDialstring()}
          onClick={() => this.transferCall()}
        >
          Transfer Call
        </button>
        <button onClick={() => this.sendDTMF('1')}>Send DTMF</button>
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
