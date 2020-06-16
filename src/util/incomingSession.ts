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
    const state = phoneStore.getState()

    //@ts-ignore
    const deviceId = state.device.primaryAudioInput

    //@ts-ignore
    this.incomingSession.sessionDescriptionHandler.peerConnection
      .getSenders()
      .forEach(function (sender: any) {
        console.log(sender)
        if (sender.track && sender.track.kind === 'audio') {
          let audioDeviceId =
            // audio input device_id
            // 'default'
            deviceId
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

  //adds track from getReceiver stream to <audio id={sessionId}> in Incoming.tsx
  public setRemoteAudio() {
    const state = phoneStore.getState()
    //@ts-ignore
    const deviceId = state.device.primaryAudioOutput

    //@ts-ignore

    const mediaElement = document.getElementById(this.incomingSession.id)

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

      console.log(mediaElement.sinkId)
      // @ts-ignore

      mediaElement.setSinkId(
        // audio output device_id
        // 'default'
        deviceId
      ).then(() => {
        // @ts-ignore
        mediaElement.srcObject = remoteStream
        //@ts-ignore
        mediaElement.play()
      })


    } else {
      console.log('no media Element')
    }
    phoneStore.dispatch({
      type: REMOTE_AUDIO_CONNECTED
    })
  }

  public cleanupMedia() {
    //@ts-ignore
    const mediaElement: HTMLMediaElement = document.getElementById(this.incomingSession.id)
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
