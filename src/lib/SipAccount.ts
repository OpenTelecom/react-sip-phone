import {
  Inviter,
  Invitation,
  Referral,
  Registerer,
  RegistererState,
  RegistererOptions,
  Session,
  SessionState,
  UserAgent,
  UserAgentOptions
} from 'sip.js'
import { TransportOptions } from 'sip.js/lib/platform/web'
import { phoneStore } from '../index'
import { INCOMING_CALL, NEW_USERAGENT } from '../actions/sipAccounts'
import {
  SIPSESSION_STATECHANGE,
  NEW_SESSION,
  CLOSE_SESSION
} from '../actions/sipSessions'

interface config {
  websocket: string
  sipuri: string
  password: string
}

export default class SIPAccount {
  public _config: config
  public _sessions: any
  public _userAgent: any
  public _registerer: any

  constructor(config: config) {
    this._config = config
    this._sessions = {}
    const uri = UserAgent.makeURI('sip:' + config.sipuri)
    if (!uri) {
      throw new Error('Failed to create URI')
    }
    const transportOptions: TransportOptions = {
      server: config.websocket
    }
    const userAgentOptions: UserAgentOptions = {
      autoStart: false,
      autoStop: true,
      noAnswerTimeout: 30, // TODO: pass this value in from the config
      logBuiltinEnabled: process.env.NODE_ENV !== 'production',
      logConfiguration: process.env.NODE_ENV !== 'production',
      logLevel: process.env.NODE_ENV !== 'production' ? 'debug' : 'error',
      authorizationPassword: config.password,
      userAgentString: 'OTF-react-sip-phone',
      hackWssInTransport: true,
      transportOptions,
      uri
      // sessionDescriptionHandlerFactoryOptions: {
      //   constraints: {
      //     audio: true,
      //     video: false
      //   },
      //   iceCheckingTimeout: 500,
      //   rtcConfiguration: {
      //     iceServers: [
      //       {
      //         urls: 'stun:stun.l.google.com:19302'
      //       }
      //     ],
      //     iceCandidatePoolSize: 5,
      //     iceTransportPolicy: 'all' // or relay for TURN only
      //   }
      // }
    }
    const registererOptions: RegistererOptions = {
      expires: 60,
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
            phoneStore.dispatch({ type: INCOMING_CALL, payload: referral })
          }
        }

        // Handle incoming session state changes.
        incomingSession.stateChange.addListener((newState: SessionState) => {
          switch (newState) {
            case SessionState.Establishing:
              // Session is establishing.
              break
            case SessionState.Established:
              // Session has been established.
              break
            case SessionState.Terminated:
              // Session has terminated.
              break
            default:
              break
          }
        })
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
    // Make a call
    const target = UserAgent.makeURI(`sip:${number}@sip.reper.io;user=phone`)
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
      outgoingSession.stateChange.addListener((newState: SessionState) => {
        switch (newState) {
          case SessionState.Establishing:
          case SessionState.Established:
          case SessionState.Terminating:
            phoneStore.dispatch({
              type: SIPSESSION_STATECHANGE,
              payload: { state: newState, id: outgoingSession.id }
            })
            break
          case SessionState.Terminated:
            phoneStore.dispatch({
              type: SIPSESSION_STATECHANGE,
              payload: { state: newState, id: outgoingSession.id }
            })
            phoneStore.dispatch({
              type: CLOSE_SESSION,
              payload: outgoingSession.id
            })
            break
          default:
            console.log(`Unknown session state change: ${newState}`)
            break
        }
      })
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
}
