import { phoneStore } from '../index'
import { Session } from 'sip.js'

import {
  REMOTE_AUDIO_CONNECTED,
  REMOTE_AUDIO_FAIL,
  LOCAL_AUDIO_CONNECTED,
  AUDIO_SINKID_NOT_ALLOWED
} from '../actions/device'

type MediaElementWithSinkId = HTMLMediaElement & {
  setSinkId?: (sinkId: string) => Promise<void>
}

// adds track from getReceiver stream to <audio id={sessionId}> in Phone.tsx
export const setRemoteAudio = (session: Session) => {
  console.log('setRemoteAudio')
  const state = phoneStore.getState()
  // @ts-ignore
  const deviceId = state.device.primaryAudioOutput
  const mediaElement = document.getElementById(session.id) as MediaElementWithSinkId | null
  const remoteStream = new MediaStream()

  // @ts-ignore
  session.sessionDescriptionHandler.peerConnection
    .getReceivers()
    .forEach((receiver: any) => {
      if (receiver.track.kind === 'audio') {
        remoteStream.addTrack(receiver.track)
      }
    })

  const attachAndPlay = () => {
    if (!mediaElement) {
      phoneStore.dispatch({ type: REMOTE_AUDIO_FAIL })
      return
    }

    mediaElement.srcObject = remoteStream
    
    const playResult = mediaElement.play()

    if (playResult && typeof playResult.catch === 'function') {
      playResult.catch((e) => {
        console.warn('Autoplay blocked or play interrupted:', e)
      })
    }

    // dispatch connected after attempting to attach audio.
    phoneStore.dispatch({ type: REMOTE_AUDIO_CONNECTED })
  }

  // checks for browser compatibility
  // 1) If setSinkId isn't supported (common in Safari/iOS), skip routing and just attach/play
  // 2) If setSinkId exists but fails (e.g., iOS 26+ NotAllowedError requires user gesture),
  //    swallow the error so the rest of the chain still executes.
  if (mediaElement && typeof mediaElement.setSinkId !== 'function') {
    console.log('safari or setSinkId not supported')
    phoneStore.dispatch({
      type: AUDIO_SINKID_NOT_ALLOWED
    })

    attachAndPlay()
  } else if (mediaElement && typeof mediaElement.setSinkId === 'function') {
    mediaElement
      .setSinkId(deviceId)
      .catch((err) => {
        // Any failure => fall back to default output, but never block audio attach/play
        phoneStore.dispatch({ type: AUDIO_SINKID_NOT_ALLOWED })
        console.warn('setSinkId failed, falling back to default output:', err)
        // swallow error so the rest runs
      })
      .finally(() => {
        attachAndPlay()
      })
  } else {
    phoneStore.dispatch({
      type: REMOTE_AUDIO_FAIL
    })
  }
  // dispatch connected after attempting to attach audio.
  phoneStore.dispatch({
    type: REMOTE_AUDIO_CONNECTED
  })
}

// creates new audio track then replaces audio track in getSender stream w/ new track
export const setLocalAudio = (session: Session) => {
  const state = phoneStore.getState()
  // @ts-ignore
  const deviceId = state.device.primaryAudioInput
  // @ts-ignore
  session.sessionDescriptionHandler.peerConnection
    .getSenders()
    .forEach(function (sender: any) {
      if (sender.track && sender.track.kind === 'audio') {
        const audioDeviceId = deviceId
        navigator.mediaDevices
          .getUserMedia({ audio: { deviceId: audioDeviceId } })
          .then(function (stream) {
            const audioTrack = stream.getAudioTracks()
            if (audioTrack) {
              sender.replaceTrack(audioTrack[0])
            }
          })
      }
    })
  phoneStore.dispatch({
    type: LOCAL_AUDIO_CONNECTED
  })
}

export const cleanupMedia = (sessionId: string) => {
  const mediaElement = document.getElementById(sessionId)
  if (mediaElement) {
    // @ts-ignore
    mediaElement.srcObject = null
    // @ts-ignore
    mediaElement.pause()
  }
}
