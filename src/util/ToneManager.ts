import TonePlayer from './TonePlayer'

class ToneManager {
  currentTone: any
  constructor() {}

  public ringback() {
    if (this.currentTone) {
      this.currentTone.stop()
      this.currentTone = undefined
    }

    this.currentTone = new TonePlayer()
    this.currentTone.ringback()
  }

  public stopAll() {
    if (this.currentTone) {
      this.currentTone.stop()
      this.currentTone = undefined
    }
  }
}

const toneManager = new ToneManager()

export default toneManager
