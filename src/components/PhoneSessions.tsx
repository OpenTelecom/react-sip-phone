import * as React from 'react'
import { connect } from 'react-redux'
import Phone from './phone/Phone'
import Incoming from './phone/Incoming'
import { Referral } from 'sip.js'

const getSessions = (sessions: any) => {
  const elements = []
  for (const session in sessions) {
    elements.push(<Phone session={sessions[session]} key={session} />)
  }
  return elements
}

const getIncomingCallReferrals = (sessions: any) => {
  const elements = []
  for (const session in sessions) {
    elements.push(<Incoming session={sessions[session]} key={session}/>)
  }
  return elements
}

interface Props {
  sessions: any,
  incomingCalls: Array<Referral>
}

class PhoneSessions extends React.Component<Props> {
  render() {
    return <React.Fragment>
      {/* {<Incoming 
        // @ts-ignore
        session={{}} key={0} />} */}
      {getIncomingCallReferrals(this.props.incomingCalls)}
      {getSessions(this.props.sessions)}
    </React.Fragment>
  }
}
const mapStateToProps = (state: any) => ({ 
  sessions: state.sipSessions.sessions,
  incomingCalls: state.sipSessions.incomingCalls
})
const PS = connect(mapStateToProps)(PhoneSessions)
export default PS