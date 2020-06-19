import { Dispatch } from 'redux';

export const AUDIO_INPUT_DEVICES_DETECTED = 'AUDIO_INPUT_DEVICES_DETECTED'
export const AUDIO_OUTPUT_DEVICES_DETECTED = 'AUDIO_OUTPUT_DEVICES_DETECTED'

export const REMOTE_AUDIO_CONNECTED = 'REMOTE_AUDIO_CONNECTED'
export const LOCAL_AUDIO_CONNECTED = 'LOCAL_AUDIO_CONNECTED'

export const SET_PRIMARY_OUTPUT = 'SET_PRIMARY_OUTPUT'
export const SET_PRIMARY_INPUT = 'SET_PRIMARY_INPUT'

export const SET_LOCAL_AUDIO_SESSIONS_PENDING = 'LOCAL_AUDIO_SESSIONS_PENDING'
export const SET_LOCAL_AUDIO_SESSIONS_SUCCESS = 'LOCAL_AUDIO_SESSIONS_SUCCESS'
export const SET_LOCAL_AUDIO_SESSIONS_FAIL = 'LOCAL_AUDIO_SESSIONS_FAIL'

export const SET_REMOTE_AUDIO_SESSIONS_PENDING = 'SET_REMOTE_AUDIO_SESSIONS_PENDING'
export const SET_REMOTE_AUDIO_SESSIONS_SUCCESS = 'SET_REMOTE_AUDIO_SESSIONS_SUCCESS'
export const SET_REMOTE_AUDIO_SESSIONS_FAIL = 'SET_REMOTE_AUDIO_SESSIONS_FAIL'


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

export const setPrimaryOutput = (id: string) => {
  //if amount of objects in sessions object is greater than 0 
  //call setDeviceRemoteActiveSessions 
  return {
    type: SET_PRIMARY_OUTPUT,
    payload: id
  }
}

export const setPrimaryInput = (id: string) => {
  //if amount of objects in sessions object is greater than 0 
  //call setDeviceLocalActiveSessions 
  return {
    type: SET_PRIMARY_INPUT,
    payload: id
  }
}

export const setDeviceRemoteActiveSessions = () => (dispatch: Dispatch) => {
  //map thru session and get each stream.. 
  //get audio html w/ sessionid 
  //set new deviceId
  dispatch({
    type: SET_REMOTE_AUDIO_SESSIONS_PENDING
  })
}

export const setDeviceLocalActiveSessions = () => (dispatch: Dispatch) => {
  //map thru sessions
  //create new stream with new track
  //get senders stream and replace sender track with newly created track
  //set new deviceId for track and play
  dispatch({
    type: SET_LOCAL_AUDIO_SESSIONS_PENDING
  })
}
