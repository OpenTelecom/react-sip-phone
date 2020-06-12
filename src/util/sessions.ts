import { phoneStore } from '../index'
import { SessionState, Session } from 'sip.js'
import { SIPSESSION_STATECHANGE, CLOSE_SESSION } from '../actions/sipSessions'
import toneManager from './ToneManager'
export class SessionStateHandler {
  private session: Session
  constructor(session: Session) {
    this.session = session
  }

  //creates new audio track then replaces audio track in getSender stream w/ new track
  public setLocalAudio(session: Session) {
    //@ts-ignore
    session.sessionDescriptionHandler.peerConnection
      .getSenders()
      .forEach(function (sender: any) {
        if (sender.track.kind === 'audio') {
          let audioDeviceId =
            // audio input device_id 
            'default'
          navigator.mediaDevices
            // @ts-ignore

            //creates a stream w track
            .getUserMedia({ audio: { deviceId: audioDeviceId } })
            .then(function (stream) {
              let audioTrack = stream.getAudioTracks()
              console.log(audioTrack)
              sender.replaceTrack(audioTrack[0])
            })
        }
      })
  }

  //takes track from getReceiver stream and adds to new track
  public setRemoteAudio(session: Session) {
    const mediaElement = document.getElementById('mediaElement')
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

        // audio output device_id 
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

    mediaElement.srcObject = null
    // @ts-ignore

    mediaElement.pause()
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
        this.setLocalAudio(this.session)
        this.setRemoteAudio(this.session)

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
  let fullNumber = `+${phoneStore.getState().sipAccounts.sipAccount._config.defaultCountryCode}${number}`
  if (number.includes('+') && number.length === 10) {
    fullNumber = `${number}`
  }
  console.log(fullNumber)
  return fullNumber
}

export const statusMask = (status: string) => {
  switch (status) {
    case 'Established':
      return 'Connected'
    case 'Establishing':
      return 'Calling...'
    case 'Initial':
      return 'Incoming'
    case 'Terminating':
    case 'Terminated':
      return 'Ended'
    default:
      return 'Unknown Status'
  }
}
