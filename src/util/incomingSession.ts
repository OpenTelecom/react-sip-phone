import { phoneStore } from '../index'
import { SessionState, Session } from 'sip.js'
import {
  SIPSESSION_STATECHANGE,
  CLOSE_SESSION,
  holdCallRequest,
  SIPSESSION_HOLD_REQUEST
} from '../actions/sipSessions'

export class IncomingSessionStateHandler {
  private incomingSession: Session
  constructor(incomingSession: Session) {
    this.incomingSession = incomingSession
  }

  public setupRemoteMedia(session: Session) {
    const mediaElement = document.getElementById('mediaElement')
    console.log(mediaElement)
    const remoteStream = new MediaStream()
    //@ts-ignore
    session.sessionDescriptionHandler.peerConnection
      .getReceivers()
      .forEach((receiver: any) => {
        if (receiver.track) {
          remoteStream.addTrack(receiver.track)
        }
      })
    if (mediaElement) {
      //@ts-ignore
      mediaElement.setSinkId(
        // '9fd92da2563c9c2168af72a2cae2850e8a7959c800eeed8b3f09c0d52eff2bfe'
        'default'
      )
      // @ts-ignore
      mediaElement.srcObject = remoteStream
      //@ts-ignore

      mediaElement.play()
    } else {
      console.log('no media Element')
    }
  }


  public cleanupMedia() {
    const mediaElement = document.getElementById('mediaElement')
    // @ts-ignore

    mediaElement.srcObject = null;
    // @ts-ignore

    mediaElement.pause();
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

        //hold all sessions
        this.holdAll()

        this.setupRemoteMedia(this.incomingSession)

        break
      case SessionState.Terminating:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        this.cleanupMedia()
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
