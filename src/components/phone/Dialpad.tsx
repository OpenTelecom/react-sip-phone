import * as React from 'react'
import { connect } from 'react-redux'

import styles from './Phone.scss'
import DialButton from './DialButton'
import { Session, SessionState } from 'sip.js'
import { getButtonLetters } from '../../util/buttons'
import { playDTMF } from '../../util/TonePlayer'
interface Props {
  open: boolean
  session: Session
  deviceId: string
}

class Dialpad extends React.Component<Props> {
  topRow: any = []
  middleRow: any = []
  bottomRow: any = []

  constructor(props: Props) {
    super(props)
    for (let x = 1; x < 4; x++) {
      this.topRow.push(this.getButton(x.toString()))
    }
    for (let x = 4; x < 7; x++) {
      this.middleRow.push(this.getButton(x.toString()))
    }
    for (let x = 7; x < 10; x++) {
      this.bottomRow.push(this.getButton(x.toString()))
    }
  }

  getButton(value: string) {
    return (
      <DialButton
        key={value}
        text={value}
        letters={getButtonLetters(value)}
        click={() => this.handleClick(value)}
      />
    )
  }

  handleClick(value: string) {
    if (this.props.session.state === SessionState.Established) {
      this.sendDTMF(value)
      playDTMF(value, this.props.deviceId)
    }
  }

  sendDTMF(value: string) {
    const options = {
      requestOptions: {
        body: {
          contentDisposition: 'render',
          contentType: 'application/dtmf-relay',
          content: `Signal=${value}\r\nDuration=1000`
        }
      }
    }
    this.props.session.info(options)
  }

  render() {
    return (
      <div className={this.props.open ? '' : styles.closed} id={styles.dialpad}>
        <div className={styles.dialpadRow}>{this.topRow}</div>
        <div className={styles.dialpadRow}>{this.middleRow}</div>
        <div className={styles.dialpadRow}>{this.bottomRow}</div>
        <div className={styles.dialpadRow}>
          {this.getButton('*')}
          {this.getButton('0')}
          {this.getButton('#')}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => ({
  deviceId: state.device.primaryAudioOutput
})
const actions = {

}
export default connect(mapStateToProps, actions)(Dialpad)
