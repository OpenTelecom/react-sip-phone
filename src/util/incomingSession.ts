import { phoneStore } from '../index'
import { SessionState, Session } from 'sip.js'
import {
  SIPSESSION_STATECHANGE,
  CLOSE_SESSION,
  SIPSESSION_HOLD_REQUEST,
  holdCallRequest
} from '../actions/sipSessions'
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
          type: SIPSESSION_STATECHANGE,
          payload: { state: newState, id: this.incomingSession.id }
        })
        this.holdAll()
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

  public holdAll() {
    const state = phoneStore.getState()

    //@ts-ignore
    const onHolds = state.sipSessions.onHold

    //@ts-ignore
    const sessions = state.sipSessions.sessions

    for (let [sessionId, session] of Object.entries(sessions)) {
      if (
        sessionId in onHolds === false &&
        sessionId !== this.incomingSession.id
      ) {
        try {
          //@ts-ignore
          holdCallRequest(session)
          //dispatch here because class is not connected to redux actions
          phoneStore.dispatch({
            type: SIPSESSION_HOLD_REQUEST,
            //@ts-ignore
            payload: session.id
          })
          return
        } catch (err) {
          return
        }
      }
    }
  }
}
