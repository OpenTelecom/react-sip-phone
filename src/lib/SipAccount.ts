import {
  Inviter,
  Invitation,
  Referral,
  Registerer,
  RegistererOptions,
  Session,
  SessionState,
  UserAgent,
  UserAgentOptions
} from "sip.js";
import { TransportOptions } from "sip.js/lib/platform/web";
import { phoneStore } from '../index'
import { INCOMING_CALL } from '../actions/sipAccounts'
interface config {
  websocket: string
  sipuri: string
  password: string
}

export default class SIPAccount {
  _config: config
  _sessions: any
  _userAgent: any
  _registerer: any

  constructor(config: config) {
    this._config = config
    this._sessions = {}
    const uri = UserAgent.makeURI("sip:" + config.sipuri)
    if (!uri) {
      throw new Error("Failed to create URI");
    }
    const transportOptions: TransportOptions = {
      server: config.websocket
    };
    const userAgentOptions: UserAgentOptions = {
      autoStart: true,
      logBuiltinEnabled: process.env.NODE_ENV !== 'production',
      logConfiguration: process.env.NODE_ENV !== 'production',
      logLevel: process.env.NODE_ENV !== 'production' ? "debug" : "error",
      authorizationPassword: config.password,
      userAgentString: 'OTF-react-sip-phone',
      hackWssInTransport: true,
      transportOptions,
      uri
    }
    const registererOptions: RegistererOptions = {
      expires: 60,
      logConfiguration: process.env.NODE_ENV !== 'production'
    }
    this._userAgent = new UserAgent(userAgentOptions);
    this._registerer = new Registerer(this._userAgent, registererOptions);
    this.setupDelegate() // Delegate is what handles incoming calls
    this._userAgent.start().then(() => {
      this._registerer.register();
      // const target = UserAgent.makeURI("sip:+16043551695@sip.reper.io;user=phone");
      // if (target) {
      //   console.log('calling me')
      //   const inviter = new Inviter(this._userAgent, target);
      //   inviter.invite();
      // }
    });
  }

  setupDelegate() {
    this._userAgent.delegate = {
      onInvite(invitation: Invitation): void {

        // An Invitation is a Session
        const incomingSession: Session = invitation;

        // Setup incoming session delegate
        incomingSession.delegate = {
          // Handle incoming REFER request.
          onRefer(referral: Referral): void {
            phoneStore.dispatch({ type: INCOMING_CALL, payload: referral })
          }
        };

        // Handle incoming session state changes.
        incomingSession.stateChange.addListener((newState: SessionState) => {
          switch (newState) {
            case SessionState.Establishing:
              // Session is establishing.
              break;
            case SessionState.Established:
              // Session has been established.
              break;
            case SessionState.Terminated:
              // Session has terminated.
              break;
            default:
              break;
          }
        });
      }
    };
  }


}