import { phoneStore } from '../index'
import { SessionState, Session } from 'sip.js'
import { SIPSESSION_STATECHANGE, CLOSE_SESSION } from '../actions/sipSessions'
import { holdAll } from '../util/hold'
import { setLocalAudio, setRemoteAudio, cleanupMedia } from './audio'

export class IncomingSessionStateHandler {
  private incomingSession: Session
  constructor(incomingSession: Session) {
    this.incomingSession = incomingSession
  }

  public stateChange = (newState: SessionState) => {
    switch (newState) {
      case SessionState.Establishing:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        break
      case SessionState.Established:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        holdAll(this.incomingSession.id)
        setLocalAudio(this.incomingSession)
        setRemoteAudio(this.incomingSession)
        break
      case SessionState.Terminating:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        cleanupMedia(this.incomingSession.id)
        break
      case SessionState.Terminated:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        setTimeout(() => {
          phoneStore.dispatch({
            type: CLOSE_SESSION,
            payload: this.incomingSession.id
          })
        }, 5000)
        break
      default:
        console.log(`Unknown session state change: ${newState}`)
        break
    }
  }
}
