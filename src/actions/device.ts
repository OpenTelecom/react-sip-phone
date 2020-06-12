export const AUDIO_INPUT_DEVICES_DETECTED = 'AUDIO_INPUT_DEVICES_DETECTED'
export const AUDIO_OUTPUT_DEVICES_DETECTED = 'AUDIO_OUTPUT_DEVICES_DETECTED'

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
