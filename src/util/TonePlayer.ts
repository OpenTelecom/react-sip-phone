const Tone = require('tone');

const DTMF_MATRIX = {
  1: [697, 1209],
  2: [697, 1336],
  3: [697, 1477],
  A: [697, 1633],
  4: [770, 1209],
  5: [770, 1336],
  6: [770, 1477],
  B: [770, 1633],
  7: [852, 1209],
  8: [852, 1336],
  9: [852, 1477],
  C: [852, 1633],
  0: [941, 1209],
  '*': [941, 1336],
  '#': [941, 1477],
  D: [941, 1633]
}

const Synth = Tone.PolySynth && new Tone.PolySynth(2, Tone.Synth)
const FMSynth = Tone.PolySynth && new Tone.PolySynth(2, Tone.FMSynth)

export const playDTMF = (key: any, deviceId: string) => {
  const obj = DTMF_MATRIX[key]
  if (!obj) {
    console.log('invalid DTMF tone input')
  }
  Synth.volume.value = -10
  Synth.set({
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.02,
      decay: 0.1,
      sustain: 0.2,
      release: 0.02
    }
  })

  if (deviceId !== 'default') {
    const mediaElement = document.getElementById('tone')
    if (mediaElement) {
      const dest = Tone.context.createMediaStreamDestination()
      Synth.connect(dest)
      // @ts-ignore
      mediaElement.setSinkId(deviceId).then(() => {
        // @ts-ignore
        mediaElement.srcObject = dest.stream
        // @ts-ignore
        mediaElement.play()
      })
    }
  } else {
    Synth.toMaster()
  }

  Synth.triggerAttackRelease(obj, 0.3)
}

export const callDisconnect = (deviceId: string) => {
  FMSynth.triggerAttack(['C4', 'E4'], '+0.1')
  FMSynth.triggerRelease(['C4', 'E4'], '+0.14')
  FMSynth.triggerAttack(['D4', 'G4'], '+0.14')
  FMSynth.triggerRelease(['D4', 'G4'], '+0.18')
  if (deviceId !== 'default') {
    const mediaElement = document.getElementById('tone')

    if (mediaElement) {
      const dest = Tone.context.createMediaStreamDestination()
      Synth.connect(dest)
      // @ts-ignore
      mediaElement.setSinkId(deviceId).then(() => {
        // @ts-ignore
        mediaElement.srcObject = dest.stream
        // @ts-ignore
        mediaElement.play()
      })
    }
  } else {
    FMSynth.toMaster()
  }
}

class TonePlayer {
  private loop: any

  // get audio element, set srcObj to device, and play the track
  ringtone = (deviceId: string) => {
    const mediaElement = document.getElementById('ringtone')
    if (deviceId !== 'default') {
      if (mediaElement) {
        // @ts-ignore
        mediaElement.setSinkId(deviceId).then(() => {
          // @ts-ignore
          mediaElement.play()
        })
      } else {
        console.log('no media Element')
      }
    } else {
      // @ts-ignore
      mediaElement.play()
    }
  }

  ringback = (deviceId: string) => {
    const dest = Tone.context.createMediaStreamDestination()
    console.log(dest)
    Synth.set({
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.2,
        release: 0.02
      }
    }).connect(dest)
    if (deviceId !== 'default') {
      const mediaElement = document.getElementById('tone')
      if (mediaElement) {
        const dest = Tone.context.createMediaStreamDestination()
        Synth.connect(dest)
        // @ts-ignore
        mediaElement.setSinkId(deviceId).then(() => {
          // @ts-ignore
          mediaElement.srcObject = dest.stream
          // @ts-ignore
          mediaElement.play()
        })
      }
    } else {
      Synth.toMaster()
    }

    this.loop = new Tone.Loop((time: any) => {
      Synth.triggerAttack([440, 480])
      Synth.triggerRelease([440, 480], time + 2)
    }, 6)
    this.loop.start(0)
    Tone.Transport.start()
  }

  stop() {
    if (this.loop) {
      try {
        this.loop.stop(0)
      } catch {
        console.log('no loop to stop')
      }
    }

    if (Tone.Transport) {
      try {
        Tone.Transport.stop()
        Synth.triggerRelease([440, 480])
      } catch {
        console.log('no tone to stop')
      }
    }

    const mediaElement = document.getElementById('ringtone')
    if (mediaElement) {
      // @ts-ignore
      const promise = mediaElement.pause()
      if (promise !== undefined) {
        promise
          .catch((error: any) => {
            console.log(error)
          })
          .then(() => {
            console.log('ringtone stopped')
          })
      }
    }
  }
}

export default TonePlayer
