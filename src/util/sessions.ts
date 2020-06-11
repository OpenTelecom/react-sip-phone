import { phoneStore } from '../index'
import { SessionState } from 'sip.js'
import { SIPSESSION_STATECHANGE, CLOSE_SESSION } from '../actions/sipSessions'
import toneManager from './ToneManager'
export class SessionStateHandler {
  private id: string
  constructor(id: string) {
    this.id = id
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
        break
      case SessionState.Terminating:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        break
      case SessionState.Terminated:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        setTimeout(() => {
          phoneStore.dispatch({
            type: CLOSE_SESSION,
            payload: this.id
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