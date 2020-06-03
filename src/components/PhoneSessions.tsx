import * as React from 'react'
import { connect } from 'react-redux'
import Phone from './phone/Phone'

const getSessions = (sessions: any) => {
  const elements = []
  for (const session in sessions) {
    elements.push(<Phone session={sessions[session]} key={session} />)
  }
  return elements
}

interface Props {
  sessions: any
}

class PhoneSessions extends React.Component<Props> {
  render() {
    return <React.Fragment>
      {<Phone 
        // @ts-ignore
        session={{}} key={0} />}
      {getSessions(this.props.sessions)}
    </React.Fragment>
  }
}
const mapStateToProps = (state: any) => ({ 
  sessions: state.sipSessions.sessions 
})
const PS = connect(mapStateToProps)(PhoneSessions)
export default PS