import { phoneStore } from '../index'
import { SessionState, Session } from 'sip.js'
import { SIPSESSION_STATECHANGE, CLOSE_SESSION } from '../actions/sipSessions'
import {
  REMOTE_AUDIO_CONNECTED,
  LOCAL_AUDIO_CONNECTED
} from '../actions/device'

import toneManager from './ToneManager'
export class SessionStateHandler {
  private session: Session
  constructor(session: Session) {
    this.session = session
  }

  //creates new audio track then replaces audio track in getSender stream w/ new track
  public setLocalAudioOutgoing() {
    //@ts-ignore
    this.session.sessionDescriptionHandler.peerConnection
      .getSenders()
      .forEach(function (sender: any) {
        console.log(sender)

        if (sender.track && sender.track.kind === 'audio') {
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
    phoneStore.dispatch({
      type: LOCAL_AUDIO_CONNECTED
    })
  }

  //takes track from getReceiver stream and adds to new track
  public setRemoteAudio() {
    const mediaElement = document.getElementById('mediaElement')
    const remoteStream = new MediaStream()
    //@ts-ignore
    this.session.sessionDescriptionHandler.peerConnection
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
    phoneStore.dispatch({
      type: REMOTE_AUDIO_CONNECTED
    })
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

        this.setLocalAudioOutgoing()

        this.setRemoteAudio()

        break
      case SessionState.Terminating:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        toneManager.stopAll()

        this.cleanupMedia()
        break
      case SessionState.Terminated:

        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        toneManager.stopAll()

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
      return 'Initial'
    case 'Terminating':
    case 'Terminated':
      return 'Ended'
    default:
      return 'Unknown Status'
  }
}

export const getDurationDisplay = (duration: number) => {
  let minutes = Math.floor(duration / 60)
  let hours = Math.floor(minutes / 60)
  minutes = minutes % 60
  let seconds = duration % 60
  let dh, dm, ds
  if (hours && hours < 10) {
    dh = `0${hours}:`
  } else if (hours) {
    dh = `${hours}:`
  } else {
    dh = '00:'
  }
  if (minutes && minutes < 10) {
    dm = `0${minutes}:`
  } else if (minutes) {
    dm = `${minutes}:`
  } else {
    dm = '00:'
  }
  if (seconds && seconds < 10) {
    ds = `0${seconds}`
  } else if (seconds) {
    ds = `${seconds}`
  } else {
    ds = '00'
  }
  return `${hours ? dh : ''}${dm}${ds}`
}