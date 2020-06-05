import { phoneStore } from '../index'
import { SessionState } from 'sip.js'
import {
  SIPSESSION_STATECHANGE,
  CLOSE_SESSION
} from '../actions/sipSessions'

export class SessionStateHandler {
  private id: string
  constructor(id: string) {
    this.id = id
  }
  public stateChange = (newState: SessionState) => {
    switch (newState) {
      case SessionState.Establishing:
      case SessionState.Established:
      case SessionState.Terminating:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE,
        })
        break
      case SessionState.Terminated:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE,
        })
        setTimeout(() => {
          phoneStore.dispatch({
            type: CLOSE_SESSION,
            payload: this.id
          })
        }, 5000)
        break
      default:
        console.log(`Unknown session state change: ${newState}`)
        break
    }
  }
}