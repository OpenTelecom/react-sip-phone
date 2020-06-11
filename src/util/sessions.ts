import { phoneStore } from '../index'
import { SessionState, Session } from 'sip.js'
import { SIPSESSION_STATECHANGE, CLOSE_SESSION } from '../actions/sipSessions'
import toneManager from './ToneManager'
export class SessionStateHandler {
  private session: Session
  constructor(session: Session) {
    this.session = session
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
      // @ts-ignore

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
          type: SIPSESSION_STATECHANGE
        })
        toneManager.stopAll()
        this.setupRemoteMedia(this.session)

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
            payload: this.session.id
          })
        }, 5000)
        break
      default:
        console.log(`Unknown session state change: ${newState}`)
        break
    }
  }
}

export const getFullNumber = (number: string) => {
  if (number.length < 10) {
    return number
  }
  // @ts-ignore
  let fullNumber = `+${phoneStore.getState().sipAccounts.sipAccount._config.defaultCountryCode
    }${number}`
  if (number.includes('+') && number.length === 10) {
    fullNumber = `${number}`
  }
  console.log(fullNumber)
  return fullNumber
}
