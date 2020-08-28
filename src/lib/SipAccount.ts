import {
  Inviter,
  Invitation,
  Referral,
  Registerer,
  RegistererState,
  RegistererOptions,
  Session,
  UserAgent,
  UserAgentOptions
} from 'sip.js'

import { TransportOptions } from 'sip.js/lib/platform/web'
import { phoneStore } from '../index'
import { NEW_USERAGENT } from '../actions/sipAccounts'
import { SessionStateHandler, getFullNumber } from '../util/sessions'
import { IncomingSessionStateHandler } from '../util/incomingSession'

import {STRICT_MODE_HIDE_CALL_BUTTON, SESSIONS_LIMIT_REACHED} from '../actions/config'
import { NEW_SESSION, INCOMING_CALL } from '../actions/sipSessions'
import { SipConfig, SipCredentials } from '../models'

export default class SIPAccount {
  public _config: SipConfig
  public _credentials: SipCredentials
  public _userAgent: any
  public _registerer: any

  constructor(sipConfig: SipConfig, sipCredentials: SipCredentials) {
    this._config = sipConfig
    this._credentials = sipCredentials
    const uri = UserAgent.makeURI('sip:' + sipCredentials.sipuri)
    if (!uri) {
      throw new Error('Failed to create URI')
    }
    const transportOptions: TransportOptions = {
      server: sipConfig.websocket
    }
    const userAgentOptions: UserAgentOptions = {
      autoStart: false,
      autoStop: true,
      noAnswerTimeout: sipConfig.noAnswerTimeout || 30,
      logBuiltinEnabled: process.env.NODE_ENV !== 'production',
      logConfiguration: process.env.NODE_ENV !== 'production',
      logLevel: process.env.NODE_ENV !== 'production' ? 'debug' : 'error',
      authorizationPassword: sipCredentials.password,
      userAgentString: 'OTF-react-sip-phone',
      hackWssInTransport: true,
      transportOptions,
      uri,
      sessionDescriptionHandlerFactoryOptions: {
        constraints: {
          audio: {
            deviceId:
              'default'
          },
          video: false
        },
        alwaysAcquireMediaFirst: true,
        iceCheckingTimeout: 500
      }
    }
    const registererOptions: RegistererOptions = {
      expires: 300,
      logConfiguration: process.env.NODE_ENV !== 'production'
    }

    //check here for register
    this._userAgent = new UserAgent(userAgentOptions)
    this._registerer = new Registerer(this._userAgent, registererOptions)
    this.setupDelegate() // Delegate is what handles incoming calls
    this._userAgent.start().then(() => {
      this._registerer.register()
      this.setupRegistererListener()
      // Push ua to store
      phoneStore.dispatch({ type: NEW_USERAGENT, payload: this._userAgent })
    })
  }
  

  setupDelegate() {
    this._userAgent.delegate = {
      onInvite(invitation: Invitation): void {
        // An Invitation is a Session
        const incomingSession: Session = invitation

        // Setup incoming session delegate
        incomingSession.delegate = {
          // Handle incoming REFER request.
          onRefer(referral: Referral): void {
            console.log(referral)
          }
        }

        phoneStore.dispatch({ type: INCOMING_CALL, payload: incomingSession })

        const stateHandler = new IncomingSessionStateHandler(incomingSession)
        // Handle incoming session state changes.
        incomingSession.stateChange.addListener(stateHandler.stateChange)
      }
    }
  }

  setupRegistererListener() {
    this._registerer.stateChange.addListener((newState: RegistererState) => {
      switch (newState) {
        case RegistererState.Initial:
          console.log('The user registration has initialized  ')
          break
        case RegistererState.Registered:
          console.log('The user is registered ')
          break
        case RegistererState.Unregistered:
          console.log('The user is unregistered ')
          break
        case RegistererState.Terminated:
          console.log('The user is terminated ')
          break
      }
    })
  }

  makeCall(number: string) {
    let state = phoneStore.getState()
    //@ts-ignore
    let sessionsLimit: number = state.config.phoneConfig.sessionsLimit
    //@ts-ignore
    let sessionsActiveObject: Object = state.sipSessions.sessions
    //@ts-ignore
    let strictMode: string = state.config.appConfig.mode
    //@ts-ignore
    let attendedTransfersActive: number  = state.sipSessions.attendedTransfers.length

    //added sessionsLimit check if outside Application makes call using sipaccount w/o using dialstring 
    let sessionsActive: number = Object.keys(sessionsActiveObject).length
    let sessionDiff: number = sessionsActive - attendedTransfersActive
    if (sessionDiff >= sessionsLimit){
      phoneStore.dispatch({ type: SESSIONS_LIMIT_REACHED })
    } else{
    // Make a call
    const target = UserAgent.makeURI(
      `sip:${getFullNumber(number)}@${this._credentials.sipuri.split('@')[1]};user=phone`
    )
    //strict mode will remove dialstring call button on session initialization
    if (strictMode === ('strict')){
      phoneStore.dispatch({type:STRICT_MODE_HIDE_CALL_BUTTON})
    }

    if (target) {
      console.log(`Calling ${number}`)
      const inviter = new Inviter(this._userAgent, target)
      // An Inviter is a Session
      const outgoingSession: Session = inviter
      // Setup outgoing session delegate
      outgoingSession.delegate = {
        // Handle incoming REFER request.
        onRefer(referral: Referral): void {
          // TODO
          console.log('Referred: ' + referral)
        }
      }
      phoneStore.dispatch({ type: NEW_SESSION, payload: outgoingSession })
      // Handle outgoing session state changes.
      const stateHandler = new SessionStateHandler(outgoingSession,this._userAgent )
      outgoingSession.stateChange.addListener(stateHandler.stateChange)
      outgoingSession
        .invite()
        .then(() => {
          console.log('Invite sent!')
        })
        .catch((error: Error) => {
          console.log(error)
        })
    } else {
      console.log(`Failed to establish session for outgoing call to ${number}`)
      }
    }

    
    // toneManager.playRing('ringback')

  }
  listener(){
        
  }
}
