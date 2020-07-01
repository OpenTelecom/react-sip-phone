import { Dispatch } from 'redux';

export const AUDIO_INPUT_DEVICES_DETECTED = 'AUDIO_INPUT_DEVICES_DETECTED'
export const AUDIO_OUTPUT_DEVICES_DETECTED = 'AUDIO_OUTPUT_DEVICES_DETECTED'

export const REMOTE_AUDIO_CONNECTED = 'REMOTE_AUDIO_CONNECTED'
export const REMOTE_AUDIO_FAIL = 'REMOTE_AUDIO_FAIL'

export const LOCAL_AUDIO_CONNECTED = 'LOCAL_AUDIO_CONNECTED'
export const LOCAL_AUDIO_FAIL = 'REMOTE_AUDIO_FAIL'

export const SET_PRIMARY_OUTPUT = 'SET_PRIMARY_OUTPUT'
export const SET_PRIMARY_INPUT = 'SET_PRIMARY_INPUT'

export const SET_LOCAL_AUDIO_SESSIONS_PENDING = 'SET_LOCAL_AUDIO_SESSIONS_PENDING'
export const SET_LOCAL_AUDIO_SESSION_SUCCESS = 'SET_LOCAL_AUDIO_SESSION_SUCCESS'
export const SET_LOCAL_AUDIO_SESSION_FAIL = 'SET_LOCAL_AUDIO_SESSION_FAIL'

export const SET_REMOTE_AUDIO_SESSIONS_PENDING = 'SET_REMOTE_AUDIO_SESSIONS_PENDING'
export const SET_REMOTE_AUDIO_SESSION_SUCCESS = 'SET_REMOTE_AUDIO_SESSION_SUCCESS'
export const SET_REMOTE_AUDIO_SESSION_FAIL = 'SET_REMOTE_AUDIO_SESSION_FAIL'

export const AUDIO_SINKID_NOT_ALLOWED = 'AUDIO_SINKID_NOT_ALLOWED'

export const getInputAudioDevices = () => {
  let inputArray: Array<Object> = []
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices: Array<Object>) {
      devices.forEach(function (device: any) {
        if (device.kind === 'audioinput') {
          inputArray.push(device)
        }
      })
    })
  return {
    type: AUDIO_INPUT_DEVICES_DETECTED,
    payload: inputArray
  }
}

export const getOutputAudioDevices = () => {
  let outputArray: Array<Object> = []
  navigator.mediaDevices
    .enumerateDevices()
    .then(function (devices: Array<Object>) {
      devices.forEach(function (device: any) {
        if (device.kind === 'audiooutput') {
          outputArray.push(device)
        }
      })
    })
  return {
    type: AUDIO_OUTPUT_DEVICES_DETECTED,
    payload: outputArray
  }
}

export const setPrimaryOutput = (deviceId: string, sessions: any) => (dispatch: Dispatch) => {
  if (sessions) {
    if (Object.keys(sessions).length > 0) {
      dispatch({
        type: SET_REMOTE_AUDIO_SESSIONS_PENDING
      })
      for (let [sessionId, _session] of Object.entries(sessions)) {
        //@ts-ignore
        if (_session.state === 'Established') {
          try {
            const mediaElement = document.getElementById(sessionId)
            const remoteStream = new MediaStream()
            //@ts-ignore
            _session.sessionDescriptionHandler.peerConnection
              //check if session is established?
              .getReceivers()
              .forEach((receiver: any) => {
                if (receiver.track) {
                  remoteStream.addTrack(receiver.track)
                }
              })
            if (mediaElement) {
              // @ts-ignore
              mediaElement.setSinkId(
                deviceId
              )
                .then(() => {
                  // @ts-ignore
                  mediaElement.srcObject = remoteStream
                  //@ts-ignore
                  mediaElement.play()
                })
            } else {
              console.log('no media Element')
            }
          } catch (err) {
            console.log(err)
            dispatch({
              type: SET_REMOTE_AUDIO_SESSION_FAIL
            })
            return
          }
        }
        dispatch({
          type: SET_REMOTE_AUDIO_SESSION_SUCCESS
        })
      }
    }
  }
  dispatch({
    type: SET_PRIMARY_OUTPUT,
    payload: deviceId
  })
}

export const setPrimaryInput = (deviceId: string, sessions: any, sinkIdAllowed: boolean) => (dispatch: Dispatch) => {
  if (sessions) {
    if (Object.keys(sessions).length > 0) {
      dispatch({
        type: SET_LOCAL_AUDIO_SESSIONS_PENDING
      })
      for (let [sessionId, _session] of Object.entries(sessions)) {
        //@ts-ignore
        if (_session.state === 'Established') {
          try {
            //@ts-ignore
            _session.sessionDescriptionHandler.peerConnection
              .getSenders()
              .forEach(function (sender: any) {
                console.log(sessionId)
                if (sender.track && sender.track.kind === 'audio') {
                  let audioDeviceId =
                    deviceId
                  navigator.mediaDevices
                    // @ts-ignore

                    //creates a stream w track
                    .getUserMedia({ audio: { deviceId: audioDeviceId } })
                    .then(function (stream) {
                      let audioTrack = stream.getAudioTracks()
                      sender.replaceTrack(audioTrack[0])
                    })
                }
              })
          } catch (err) {
            console.log(err)
            dispatch({
              type: SET_LOCAL_AUDIO_SESSION_FAIL
            })
            return
          }
        }
        dispatch({
          type: SET_LOCAL_AUDIO_SESSION_SUCCESS
        })
      }
    }
  }
  dispatch({
    type: SET_PRIMARY_INPUT,
    payload: deviceId
  })

  //change remote audio for safari sessions  
  if (sinkIdAllowed === false) {
    if (sessions) {
      if (Object.keys(sessions).length > 0) {
        for (let [sessionId, _session] of Object.entries(sessions)) {
          //@ts-ignore
          if (_session.state === 'Established') {
            try {
              const mediaElement = document.getElementById(sessionId)
              const remoteStream = new MediaStream()
              //@ts-ignore
              _session.sessionDescriptionHandler.peerConnection
                .getReceivers()
                .forEach((receiver: any) => {
                  if (receiver.track) {
                    remoteStream.addTrack(receiver.track)
                  }
                })
              if (mediaElement) {
                // @ts-ignore
                mediaElement.srcObject = remoteStream
                //@ts-ignore
                mediaElement.play()
              } else {
                console.log('no media Element')
              }
            } catch (err) {
              console.log(err)
              dispatch({
                type: SET_REMOTE_AUDIO_SESSION_FAIL
              })
              return
            }
          }
          dispatch({
            type: SET_REMOTE_AUDIO_SESSION_SUCCESS
          })
        }
      }
    }
  }
}

export const sinkIdAllowed = () => (dispatch: Dispatch) => {
  dispatch({
    type: AUDIO_SINKID_NOT_ALLOWED
  })
}
