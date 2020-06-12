import { phoneStore } from '../index'
import { SessionState, Session } from 'sip.js'
import {
  SIPSESSION_STATECHANGE,
  CLOSE_SESSION,
  SIPSESSION_HOLD_REQUEST,
  holdCallRequest
} from '../actions/sipSessions'

import {
  REMOTE_AUDIO_CONNECTED,
  LOCAL_AUDIO_CONNECTED
} from '../actions/device'

export class IncomingSessionStateHandler {
  private incomingSession: Session
  constructor(incomingSession: Session) {
    this.incomingSession = incomingSession
  }

  //creates new audio track then replaces audio track in getSender stream w/ new track
  public setLocalAudioIncoming() {
    //@ts-ignore
    this.incomingSession.sessionDescriptionHandler.peerConnection
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
    this.incomingSession.sessionDescriptionHandler.peerConnection
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
          type: SIPSESSION_STATECHANGE,
          payload: { state: newState, id: this.incomingSession.id }
        })

        //hold all sessions
        this.holdAll()
        this.setLocalAudioIncoming()

        this.setRemoteAudio()

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