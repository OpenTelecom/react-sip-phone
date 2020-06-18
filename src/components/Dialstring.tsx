import * as React from 'react'
import { connect } from 'react-redux'
import SIPAccount from '../lib/SipAccount'
import styles from './Dialstring.scss'
import callIcon from '../assets/call-24px.svg'

interface Props {
  sipAccount: SIPAccount
}

class Dialstring extends React.Component<Props> {
  state = {
    currentDialString: ''
  }
  handleDial() {
    if (!this.checkDialstring()) {
      this.props.sipAccount.makeCall(`${this.state.currentDialString}`)
    }
  }
  checkDialstring() {
    return this.state.currentDialString.length === 0
  }

  render() {
    return (
      <div className={styles.dialstringContainer}>
        <input
          className={styles.dialInput}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              this.handleDial()
              e.preventDefault()
            }
          }}
          placeholder="Enter the number to dial..."
          onChange={(e) => this.setState({ currentDialString: e.target.value })}
        />
        <button
          className={styles.dialButton}
          disabled={this.checkDialstring()}
          onClick={() => this.handleDial()}
        >
          <img src={callIcon} />
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  sipAccount: state.sipAccounts.sipAccount
})

const actions = {
}

const D = connect(mapStateToProps, actions)(Dialstring)
export default D
