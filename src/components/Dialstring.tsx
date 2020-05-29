import * as React from 'react'
import { connect } from 'react-redux'
import SIPAccount from '../lib/SipAccount'

interface Props {
  sipAccount: SIPAccount
}

class Dialstring extends React.Component<Props> {
  state = {
    currentDialString: ''
  }
  handleDial() {
    this.props.sipAccount.makeCall(`+1${this.state.currentDialString}`)
  }
  checkDialstring() {
    const number = this.state.currentDialString
    if (parseInt(number, 10) && (number.length === 10)) {
      return true
    } else {
      return false
    }
  }
  render() {
    return <div>
      <input onChange={(e) => this.setState({currentDialString: e.target.value})}/>
      <button disabled={this.checkDialstring()} onClick={() => this.handleDial()}>Dial</button>
    </div>
  }
}
const mapStateToProps = (state: any) => ({ 
  sipAccount: state.sipAccounts.sipAccount 
})
const D = connect(mapStateToProps)(Dialstring)
export default D