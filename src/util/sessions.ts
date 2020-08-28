import { phoneStore } from '../index'
import { SessionState, Session, UserAgent} from 'sip.js'
import { Transport as WebTransport } from "sip.js/lib/platform/Web/Transport";

import {
  SIPSESSION_STATECHANGE, CLOSE_SESSION
} from '../actions/sipSessions'
import {STRICT_MODE_SHOW_CALL_BUTTON} from '../actions/config'
import { holdAll } from '../util/hold'
import { setLocalAudio, setRemoteAudio, cleanupMedia } from './audio'
import toneManager from './ToneManager'


export class SessionStateHandler {
  private session: Session
  private ua : UserAgent
  constructor(session: Session, ua:UserAgent) {
    this.session = session
    this.ua = ua
  }

  public stateChange = (newState: SessionState) => {
    switch (newState) {
      case SessionState.Establishing:
        holdAll(this.session.id)
        toneManager.playRing('ringback')
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })

        //check if session recieves a BYE message while sessionstate is establishing
        const myTransport = (this.ua.transport as WebTransport);       
        myTransport.on('message', (message:string) => {
          if(message.includes("BYE ") && message.indexOf("BYE ") === 0){
            if(this.session.state === "Establishing"){
              console.log(message + 'session has recieved a BYE message when the session state is establishing')
              //@ts-ignore
              this.session.cancel()
              this.session.dispose()
              setTimeout(() => {
                phoneStore.dispatch({
                  type: CLOSE_SESSION,
                  payload: this.session.id
                })
                toneManager.stopAll()
                phoneStore.dispatch({
                  type:STRICT_MODE_SHOW_CALL_BUTTON
                })
              }, 5000)
              return
            }else{
              return
            }
          }
        })
        break
      case SessionState.Established:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        toneManager.stopAll()
        setLocalAudio(this.session)
        setRemoteAudio(this.session)
        break
      case SessionState.Terminating:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        toneManager.stopAll()
        cleanupMedia(this.session.id)
        break
      case SessionState.Terminated:
        phoneStore.dispatch({
          type: SIPSESSION_STATECHANGE
        })
        setTimeout(() => {
          phoneStore.dispatch({
            type: CLOSE_SESSION,
            payload: this.session.id
          })
          toneManager.stopAll()
          phoneStore.dispatch({
            type:STRICT_MODE_SHOW_CALL_BUTTON
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
